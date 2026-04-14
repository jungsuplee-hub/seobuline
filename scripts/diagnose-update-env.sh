#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

CONTAINER_NAME="${SEOBULINE_CONTAINER_NAME:-seobuline-app}"

declare -a COMPOSE_FILES=(
  "compose.yaml"
  "compose.yml"
  "docker-compose.yml"
  "docker-compose.yaml"
)

has_docker="no"
has_docker_compose="no"
has_docker_compose_v1="no"
compose_file=""
recommended_mode="docker-run"

if command -v docker >/dev/null 2>&1; then
  has_docker="yes"
  if docker compose version >/dev/null 2>&1; then
    has_docker_compose="yes"
  fi
fi

if command -v docker-compose >/dev/null 2>&1; then
  has_docker_compose_v1="yes"
fi

for candidate in "${COMPOSE_FILES[@]}"; do
  if [[ -f "${PROJECT_ROOT}/${candidate}" ]]; then
    compose_file="${candidate}"
    break
  fi
done

running_containers="(docker unavailable)"
if [[ "${has_docker}" == "yes" ]]; then
  running_containers="$(docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}' || true)"
fi

if [[ "${has_docker}" != "yes" ]]; then
  recommended_mode="docker unavailable"
elif [[ ( "${has_docker_compose}" == "yes" || "${has_docker_compose_v1}" == "yes" ) && -n "${compose_file}" ]]; then
  recommended_mode="compose"
elif docker ps --format '{{.Names}}' 2>/dev/null | grep -Fxq "${CONTAINER_NAME}"; then
  recommended_mode="docker-exec"
else
  recommended_mode="docker-run"
fi

cat <<REPORT
[DIAGNOSE] 프로젝트 루트: ${PROJECT_ROOT}
[DIAGNOSE] docker 설치 여부: ${has_docker}
[DIAGNOSE] docker compose(v2) 사용 가능: ${has_docker_compose}
[DIAGNOSE] docker-compose(v1) 사용 가능: ${has_docker_compose_v1}
[DIAGNOSE] compose 파일: ${compose_file:-없음}
[DIAGNOSE] 실행 중 컨테이너 목록:
${running_containers}
[DIAGNOSE] 추천 실행 모드: ${recommended_mode}
REPORT
