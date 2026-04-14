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
### 수동 실행
```bash
npm run update:site-content
npm run update:timeline
npm run update:politicians
npm run update:news
npm run update:all
```

### cron 등록 (서버)
```cron
0 6 * * * cd /path/to/seobuline && npm run update:all >> /var/log/seobuline-cron.log 2>&1
```

또는 쉘 래퍼 사용:
```bash
chmod +x scripts/run-cron-updates.sh
```
```cron
0 6 * * * cd /path/to/seobuline && ./scripts/run-cron-updates.sh >> /var/log/seobuline-cron.log 2>&1
```

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
