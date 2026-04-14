# 콘텐츠 정기 업데이트 (cron)

이 프로젝트는 AI 생성 없이 **로컬 JSON + RSS + 수동 검수 파일** 방식으로 콘텐츠를 갱신합니다.

## 왜 Docker 내부 실행이 필요한가
운영 서버 호스트에서 `npm run update:all`을 직접 실행하면, 호스트 glibc/libstdc++ 버전이 오래된 경우 아래와 같은 에러로 Node 실행이 실패할 수 있습니다.
- `GLIBCXX_3.4.21 not found`
- `GLIBC_2.27 not found`
- `GLIBC_2.28 not found`
- `CXXABI_1.3.9 not found`

따라서 update 작업은 **호스트에서 직접 Node를 실행하지 말고**, 반드시 **Docker 컨테이너 내부에서 실행**해야 합니다.

## 데이터 파일 구조
- `data/about-seobuline.json`: 서부선 소개/FAQ 원본
- `data/site-content.json`: 앱이 읽는 소개/FAQ 반영본
- `data/timeline-source.json`: 진행현황 원본
- `data/timeline.json`: 앱 반영본
- `data/politicians-manual.json`: 정치인 정보 수동 원본
- `data/politicians.json`: 앱 반영본
- `data/news-sources.json`: RSS 소스 목록
- `data/news-manual.json`: 운영자 수동 뉴스 항목
- `data/news.json`: 앱 반영 뉴스 목록
- `data/seobuline.db`: SQLite DB

## 권장 실행 스크립트
`scripts/run-update-in-docker.sh`를 사용하세요.

```bash
chmod +x scripts/run-update-in-docker.sh
cd /opt/seobuline
./scripts/run-update-in-docker.sh
```

특징:
- cron처럼 TTY가 없는 환경을 고려해 compose는 `-T` 옵션으로 실행
- 실행 순서 자동 감지 (`auto`)
  1. `docker compose exec -T app ...`
  2. `docker compose run --rm -T app ...`
  3. `docker exec seobuline-app ...`
  4. `docker run --rm -v /opt/seobuline:/app ... node:20-bookworm-slim ...`
- 작업 중복 실행 방지를 위한 `flock` 잠금 기본 적용 (`/tmp/seobuline-update.lock`)
- 실패 시 명확한 종료코드와 에러 메시지 출력

## 실행 모드/환경변수
- `SEOBULINE_UPDATE_MODE=auto|compose|docker-exec|docker-run`
- `SEOBULINE_COMPOSE_SERVICE=app`
- `SEOBULINE_CONTAINER_NAME=seobuline-app`
- `SEOBULINE_DOCKER_IMAGE=node:20-bookworm-slim`
- `SEOBULINE_UPDATE_LOCK_FILE=/tmp/seobuline-update.lock`
- `SEOBULINE_DISABLE_LOCK=1` (잠금 비활성화)

## update 명령 (컨테이너 내부)
컨테이너 내부 기준으로 아래 스크립트가 실행됩니다.

```bash
npm run update:site-content
npm run update:timeline
npm run update:politicians
npm run update:news
npm run update:all
```

## cron 등록 예시

### 1) Docker Compose 사용
```cron
0 6 * * * cd /opt/seobuline && ./scripts/run-update-in-docker.sh --mode compose >> /var/log/seobuline-cron.log 2>&1
```

### 2) 단일 Docker 컨테이너 사용
```cron
0 6 * * * cd /opt/seobuline && SEOBULINE_UPDATE_MODE=docker-exec SEOBULINE_CONTAINER_NAME=seobuline-app ./scripts/run-update-in-docker.sh >> /var/log/seobuline-cron.log 2>&1
```

### 3) flock를 cron에서 직접 쓰는 예시
```cron
0 6 * * * flock -n /tmp/seobuline-update.lock -c 'cd /opt/seobuline && ./scripts/run-update-in-docker.sh --no-lock' >> /var/log/seobuline-cron.log 2>&1
```

## 수동 실행 예시

```bash
cd /opt/seobuline
./scripts/run-update-in-docker.sh --mode compose
./scripts/run-update-in-docker.sh --mode docker-exec
./scripts/run-update-in-docker.sh --mode docker-run
```

## 로그 확인
```bash
tail -f /var/log/seobuline-cron.log
```

## 실패 시 점검 항목
1. 컨테이너 실행 여부 확인
   - `docker ps`
   - `docker compose ps`
2. compose 서비스명 확인 (`app`인지 여부)
3. 환경변수 파일 확인 (`.env.local` 또는 compose env_file)
   - `APP_BASE_URL`
   - `SESSION_SECRET`
4. DB/data 마운트 확인 (`/app/data`가 영속 볼륨인지)
5. 권한/경로 확인 (`/opt/seobuline`, 로그 파일 쓰기 권한)
