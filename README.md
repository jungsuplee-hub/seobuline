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
- `NEXT_PUBLIC_SITE_URL` (기본 `http://localhost:5050`)
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

## 뉴스 자동 업데이트
### 수동 실행
```bash
npm run news:sync
```

### cron 등록 (서버)
`deploy/cron/news-sync.cron` 참고

## 참고
- 로컬 DB 파일: `data/seobuline.db`
- 세션 쿠키 이름: `seobuline_session`
