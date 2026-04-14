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
  if docker compose version >/dev/null 2>&1; then
    compose_cmd="docker compose"
  elif command -v docker-compose >/dev/null 2>&1; then
    compose_cmd="docker-compose"
  fi

  if [[ "${MODE}" == "compose" || "${MODE}" == "auto" ]]; then
    if [[ -n "${compose_cmd}" && ( -f "${PROJECT_ROOT}/docker-compose.yml" || -f "${PROJECT_ROOT}/compose.yml" || -f "${PROJECT_ROOT}/compose.yaml" ) ]]; then
      if (cd "${PROJECT_ROOT}" && ${compose_cmd} ps --status running --services 2>/dev/null | grep -Fxq "${SERVICE_NAME}"); then
        echo "[INFO] compose exec 모드로 업데이트 실행: service=${SERVICE_NAME}"
        cd "${PROJECT_ROOT}"
        ${compose_cmd} exec -T "${SERVICE_NAME}" bash -lc "${UPDATE_COMMAND}"
        return
      fi

      echo "[INFO] compose run 모드로 업데이트 실행: service=${SERVICE_NAME}"
      cd "${PROJECT_ROOT}"
      ${compose_cmd} run --rm -T "${SERVICE_NAME}" bash -lc "${UPDATE_COMMAND}"
      return
    elif [[ "${MODE}" == "compose" ]]; then
      echo "[ERROR] compose 모드가 지정됐지만 compose 파일 또는 명령을 찾지 못했습니다." >&2
      exit 3
    fi
  fi

  if [[ "${MODE}" == "docker-exec" || "${MODE}" == "auto" ]]; then
    if docker ps --format '{{.Names}}' | grep -Fxq "${CONTAINER_NAME}"; then
      echo "[INFO] docker exec 모드로 업데이트 실행: container=${CONTAINER_NAME}"
      docker exec "${CONTAINER_NAME}" bash -lc "cd /app && ${UPDATE_COMMAND}"
      return
    elif [[ "${MODE}" == "docker-exec" ]]; then
      echo "[ERROR] docker-exec 모드가 지정됐지만 실행 중인 컨테이너를 찾지 못했습니다: ${CONTAINER_NAME}" >&2
      exit 4
    fi
  fi

  if [[ "${MODE}" == "docker-run" || "${MODE}" == "auto" ]]; then
    echo "[INFO] docker run 모드로 업데이트 실행: image=${DOCKER_IMAGE}"
    local env_args=()
    if [[ -f "${ENV_FILE_DEFAULT}" ]]; then
      env_args+=(--env-file "${ENV_FILE_DEFAULT}")
    fi

    docker run --rm \
      -v "${PROJECT_ROOT}:/app" \
      -w /app \
      "${env_args[@]}" \
      "${DOCKER_IMAGE}" \
      bash -lc "npm ci --ignore-scripts --no-audit --no-fund && ${UPDATE_COMMAND}"
    return
  fi

  echo "[ERROR] 지원되지 않는 mode 값입니다: ${MODE}" >&2
  exit 2
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
