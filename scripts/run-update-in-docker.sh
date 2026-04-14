#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

if ! command -v docker >/dev/null 2>&1; then
  echo "[ERROR] docker 명령을 찾을 수 없습니다. Docker 설치/권한을 확인하세요." >&2
  exit 127
fi

ENV_FILE_DEFAULT="${PROJECT_ROOT}/.env.local"
SERVICE_NAME="${SEOBULINE_COMPOSE_SERVICE:-app}"
CONTAINER_NAME="${SEOBULINE_CONTAINER_NAME:-seobuline-app}"
DOCKER_IMAGE="${SEOBULINE_DOCKER_IMAGE:-node:20-bookworm-slim}"
LOCK_FILE="${SEOBULINE_UPDATE_LOCK_FILE:-/tmp/seobuline-update.lock}"
MODE="${SEOBULINE_UPDATE_MODE:-auto}"
UPDATE_COMMAND="npm run update:all"
LOCKED="${SEOBULINE_DISABLE_LOCK:-0}"

declare -a COMPOSE_FILES=(
  "compose.yaml"
  "compose.yml"
  "docker-compose.yml"
  "docker-compose.yaml"
)

usage() {
  cat <<USAGE
Usage: $(basename "$0") [--mode auto|compose|docker-exec|docker-run] [--no-lock]

환경변수:
  SEOBULINE_UPDATE_MODE          실행 방식(auto|compose|docker-exec|docker-run)
  SEOBULINE_COMPOSE_SERVICE      compose 서비스명 (기본: app)
  SEOBULINE_CONTAINER_NAME       docker exec 대상 컨테이너명 (기본: seobuline-app)
  SEOBULINE_DOCKER_IMAGE         docker run 모드에서 사용할 이미지 (기본: node:20-bookworm-slim)
  SEOBULINE_UPDATE_LOCK_FILE     flock 잠금 파일 경로 (기본: /tmp/seobuline-update.lock)
  SEOBULINE_DISABLE_LOCK         1이면 잠금 비활성화
USAGE
}

log_command() {
  local rendered=""
  local arg
  for arg in "$@"; do
    rendered+="$(printf '%q ' "${arg}")"
  done
  echo "[INFO] 실행 명령: ${rendered% }"
}

detect_compose_command() {
  if docker compose version >/dev/null 2>&1; then
    echo "docker compose"
    return 0
  fi

  if command -v docker-compose >/dev/null 2>&1; then
    echo "docker-compose"
    return 0
  fi

  return 1
}

detect_compose_file() {
  local candidate=""
  for candidate in "${COMPOSE_FILES[@]}"; do
    if [[ -f "${PROJECT_ROOT}/${candidate}" ]]; then
      echo "${candidate}"
      return 0
    fi
  done
  return 1
}

has_running_container() {
  docker ps --format '{{.Names}}' | grep -Fxq "${CONTAINER_NAME}"
}

show_running_containers() {
  docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}'
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)
      MODE="${2:-}"
      shift 2
      ;;
    --no-lock)
      LOCKED="1"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "[ERROR] 알 수 없는 옵션: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ ! -f "${PROJECT_ROOT}/package.json" ]]; then
  echo "[ERROR] package.json을 찾을 수 없습니다. 프로젝트 루트를 확인하세요: ${PROJECT_ROOT}" >&2
  exit 2
fi

run_update() {
  local compose_cmd=""
  local compose_file=""

  compose_cmd="$(detect_compose_command || true)"
  compose_file="$(detect_compose_file || true)"

  local selected_mode="${MODE}"
  if [[ "${MODE}" == "auto" ]]; then
    if [[ -n "${compose_cmd}" && -n "${compose_file}" ]]; then
      selected_mode="compose"
    elif has_running_container; then
      selected_mode="docker-exec"
    else
      selected_mode="docker-run"
    fi
  fi

  case "${selected_mode}" in
    compose)
      if [[ -z "${compose_cmd}" ]]; then
        echo "[ERROR] compose 모드가 지정됐지만 compose 명령(docker compose / docker-compose)을 찾지 못했습니다." >&2
        exit 3
      fi
      if [[ -z "${compose_file}" ]]; then
        echo "[ERROR] compose 모드가 지정됐지만 compose 파일을 찾지 못했습니다. 확인 순서: ${COMPOSE_FILES[*]}" >&2
        exit 3
      fi

      read -r -a compose_cmd_arr <<<"${compose_cmd}"
      if (cd "${PROJECT_ROOT}" && "${compose_cmd_arr[@]}" -f "${compose_file}" ps --status running --services 2>/dev/null | grep -Fxq "${SERVICE_NAME}"); then
        echo "[INFO] compose exec 모드로 업데이트 실행: service=${SERVICE_NAME}, file=${compose_file}"
        local -a cmd=("${compose_cmd_arr[@]}" -f "${compose_file}" exec -T "${SERVICE_NAME}" bash -lc "${UPDATE_COMMAND}")
        log_command "${cmd[@]}"
        (
          cd "${PROJECT_ROOT}"
          "${cmd[@]}"
        )
        return
      fi

      echo "[INFO] compose run 모드로 업데이트 실행: service=${SERVICE_NAME}, file=${compose_file}"
      local -a cmd=("${compose_cmd_arr[@]}" -f "${compose_file}" run --rm -T "${SERVICE_NAME}" bash -lc "${UPDATE_COMMAND}")
      log_command "${cmd[@]}"
      (
        cd "${PROJECT_ROOT}"
        "${cmd[@]}"
      )
      return
      ;;

    docker-exec)
      if has_running_container; then
        echo "[INFO] docker exec 모드로 업데이트 실행: container=${CONTAINER_NAME}"
        local -a cmd=(docker exec "${CONTAINER_NAME}" bash -lc "cd /app && ${UPDATE_COMMAND}")
        log_command "${cmd[@]}"
        "${cmd[@]}"
        return
      fi

      echo "[ERROR] docker-exec 모드가 지정됐지만 실행 중인 컨테이너를 찾지 못했습니다: ${CONTAINER_NAME}" >&2
      echo "[INFO] 현재 실행 중인 컨테이너 목록:" >&2
      show_running_containers >&2 || true
      exit 4
      ;;

    docker-run)
      echo "[INFO] docker run 모드로 업데이트 실행: image=${DOCKER_IMAGE}"
      declare -a env_args=()
      declare -a volume_args=()
      declare -a workdir_args=()

      if [[ -f "${ENV_FILE_DEFAULT}" ]]; then
        env_args+=(--env-file "${ENV_FILE_DEFAULT}")
      fi
      volume_args+=(-v "${PROJECT_ROOT}:/app")
      workdir_args+=(-w "/app")

      local -a cmd=(
        docker run --rm
        "${volume_args[@]}"
        "${workdir_args[@]}"
        "${env_args[@]}"
        "${DOCKER_IMAGE}"
        bash -lc "npm ci --ignore-scripts --no-audit --no-fund && ${UPDATE_COMMAND}"
      )
      log_command "${cmd[@]}"
      "${cmd[@]}"
      return
      ;;

    *)
      echo "[ERROR] 지원되지 않는 mode 값입니다: ${selected_mode}" >&2
      exit 2
      ;;
  esac
}

main() {
  echo "[INFO] seobuline update 시작: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
  run_update
  echo "[INFO] seobuline update 완료: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
}

if [[ "${LOCKED}" == "1" ]]; then
  main
  exit $?
fi

if command -v flock >/dev/null 2>&1; then
  exec 9>"${LOCK_FILE}"
  if ! flock -n 9; then
    echo "[WARN] 이미 update 작업이 실행 중입니다. lock=${LOCK_FILE}" >&2
    exit 75
  fi
  main
else
  echo "[WARN] flock 미설치: 잠금 없이 진행합니다." >&2
  main
fi
