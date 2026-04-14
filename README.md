# 서부선 추진위원회 홈페이지

Next.js(App Router) + TypeScript + SQLite 기반의 로컬 실행형 웹사이트입니다.
Supabase 의존성 없이 회원가입/로그인/세션 인증/게시판 권한을 자체 구현했습니다.

## 핵심 변경 사항
- Supabase Auth/DB/Storage 제거
- SQLite(`data/seobuline.db`) 기반 로컬 DB 도입
- `bcryptjs` 비밀번호 해시 저장
- `httpOnly` 쿠키 + `sessions` 테이블 기반 로그인 세션
- 비회원 게시판 읽기 가능, 로그인 사용자만 글쓰기/본인 글 수정·삭제 가능

## 요구사항
- Node.js 20+

## 설치
```bash
npm install
```

## 환경변수
```bash
cp .env.example .env.local
```

필수값:
- `SESSION_SECRET`: 세션 관련 내부 키(임의 긴 문자열)

선택값:
- `APP_BASE_URL` (운영 권장: `https://seobuline.kro.kr`)
- `NEXT_PUBLIC_SITE_URL` (기본 `http://localhost:5050`, 클라이언트 표시용)
- 뉴스 수집 관련
  - `NEWS_RSS_URL`
  - `NEWS_MAX_ITEMS`

## DB 초기화
아래 명령은 SQLite 파일과 테이블을 자동 준비합니다.

```bash
npm run db:init
```

> 앱 구동 시에도 DB 초기화가 자동 수행됩니다.

### 관리자 이메일(role) 강제 보정
- 관리자 이메일 목록은 `lib/auth-config.ts`의 `ADMIN_EMAILS`로 관리합니다.
- 앱 시작(DB 초기화) 시 `ADMIN_EMAILS`와 일치하는 `users.email` 계정은 `role='admin'`으로 자동 보정됩니다.
- 로그인 시에도 해당 이메일 계정이 `admin`이 아니면 즉시 `admin`으로 동기화됩니다.

운영 중 수동 보정이 필요하면 아래 SQL을 실행하세요.

```sql
UPDATE users
SET role = 'admin'
WHERE lower(trim(email)) = '4728740@hanmail.net';
```

## 로컬 실행
```bash
npm run dev
```
- 포트: `5050`

## 테스트/검증 포인트
1. `/signup`에서 회원가입
2. `/login`에서 로그인
3. 헤더에서 로그인/로그아웃/마이페이지 노출 확인
4. `/board` 비로그인 읽기 가능 확인
5. 로그인 후 `/board/new` 글쓰기 가능 확인
6. 본인 글만 수정/삭제 가능 확인

## Docker (선택)
예시:
```bash
docker build -t seobuline .
docker run --rm -p 5050:5050 -e SESSION_SECRET=change-me seobuline
```

## 콘텐츠 정기 업데이트 (cron)
> ⚠️ 중요: 호스트 OS에서 `npm run update:all`을 직접 실행하면 GLIBC/GLIBCXX/libstdc++ 버전 차이로 Node 실행이 실패할 수 있습니다.
> 업데이트 작업은 반드시 **Docker 컨테이너 내부**에서 실행하세요.

### 실행 스크립트
```bash
chmod +x scripts/run-update-in-docker.sh
```

`scripts/run-update-in-docker.sh`의 auto 모드는 아래 우선순위로 실행 방식을 선택합니다.
1. compose 명령/파일을 찾을 수 있으면 `compose`
2. 실행 중 컨테이너(`SEOBULINE_CONTAINER_NAME`)가 있으면 `docker-exec`
3. 그 외에는 `docker-run`

`compose` 모드에서는 다음 순서로 탐지합니다.
- compose 명령: `docker compose` → `docker-compose`
- compose 파일: `compose.yaml` → `compose.yml` → `docker-compose.yml` → `docker-compose.yaml`

기본값은 환경변수로 변경할 수 있습니다.
- `SEOBULINE_UPDATE_MODE=auto|compose|docker-exec|docker-run`
- `SEOBULINE_COMPOSE_SERVICE` (기본: `app`)
- `SEOBULINE_CONTAINER_NAME` (기본: `seobuline-app`)
- `SEOBULINE_DOCKER_IMAGE` (기본: `node:20-bookworm-slim`)

### 수동 실행
```bash
cd /opt/seobuline
./scripts/run-update-in-docker.sh
```

컨테이너 이름 확인(단일 Docker 환경):
```bash
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}'
```

환경 점검 스크립트:
```bash
./scripts/diagnose-update-env.sh
```

### cron 등록 (Docker compose)
```cron
0 6 * * * cd /opt/seobuline && ./scripts/run-update-in-docker.sh --mode compose >> /var/log/seobuline-cron.log 2>&1
```

### cron 등록 (단일 Docker 컨테이너)
```cron
0 6 * * * cd /opt/seobuline && SEOBULINE_UPDATE_MODE=docker-exec SEOBULINE_CONTAINER_NAME=seobuline-app ./scripts/run-update-in-docker.sh >> /var/log/seobuline-cron.log 2>&1
```

### 로그 확인
```bash
tail -f /var/log/seobuline-cron.log
```

### 장애 점검 체크리스트
- 컨테이너/compose 서비스가 실행 중인지 (`docker ps`, `docker compose ps`)
- compose 서비스명이 `app`이 맞는지
- 환경변수 파일(`.env.local`)이 컨테이너에서 읽히는지
- `data/` 볼륨(DB/콘텐츠 JSON) 마운트가 유지되는지

상세 문서: `docs/content-update.md`, 예시 crontab: `deploy/example-crontab.txt`

## 참고
- 로컬 DB 파일: `data/seobuline.db`
- 세션 쿠키 이름: `seobuline_session`

## 지역 입력 정책
회원가입/프로필 수정의 지역은 아래 값만 허용됩니다.
- 은평구
- 마포구
- 서대문구
- 동작구
- 관악구
- 영등포구
- 안양시
- 기타지역

클라이언트 select와 서버 검증이 동일한 상수(`lib/regions.ts`)를 사용합니다.

## 조회수/회원수 집계
- 홈 접속 시 `site_stats.home_view_count` 누적
- 홈 화면에 가입 회원 수/홈페이지 조회수 카드 노출
- 게시글 상세 진입 시 `posts.view_count` 증가

## 비밀번호 초기화
- 로그인 화면의 `비밀번호 초기화` 링크를 통해 `/forgot-password` 접근
- 이메일 입력 시 `password_reset_tokens`에 토큰 생성(만료 30분)
- 재설정 URL은 `APP_BASE_URL` 우선, 없으면 `x-forwarded-proto`/`x-forwarded-host`/`host` 헤더로 절대 URL 생성
- 운영 환경 권장값: `APP_BASE_URL=https://seobuline.kro.kr`
- `/reset-password?token=...` 에서 새 비밀번호 저장 후 토큰 무효화
- 비밀번호 변경 시 기존 세션 만료 처리

## Apache Reverse Proxy 권장
- 예시 파일: `docs/apache-example.conf`
- 필수 권장 헤더
  - `ProxyPreserveHost On`
  - `RequestHeader set X-Forwarded-Proto "https"`
  - `RequestHeader set X-Forwarded-Port "443"`
  - `RequestHeader set X-Forwarded-Host "%{HTTP_HOST}s"`
- 참고: HTTPS 종단이 Apache인 경우, 앱은 전달받은 `X-Forwarded-Proto`로 secure cookie/redirect origin을 판단합니다.
