# 서부선 추진위원회 홈페이지

서부선 관련 정보를 주민에게 체계적으로 제공하기 위한 Next.js + Supabase 기반 웹사이트입니다.

## 주요 기능
- 홈, 소개, 진행현황, 뉴스/공지, 게시판, 정치인 정보공유, 자료실, 일정, 참여하기, 위원회 소개, 마이페이지, 관리자 페이지
- 이메일 인증 구조(Supabase Auth), role(user/moderator/admin) 구조
- API Route Handler CRUD 골격 + Zod 검증 + sanitize
- Supabase SQL 스키마(요청 테이블/인덱스/RLS) 및 seed 스크립트
- 반응형 UI, 404/권한없음/로딩/에러 페이지
- 뉴스 초기 데이터(`data/news.json`) + RSS 기반 자동 수집 스크립트

## 설치
```bash
npm install
```

## 환경변수
```bash
cp .env.example .env.local
```

### 뉴스 수집 관련(선택)
```bash
# 기본값: Google News "서부선 지하철" RSS
NEWS_RSS_URL=https://news.google.com/rss/search?q=서부선+지하철&hl=ko&gl=KR&ceid=KR:ko
NEWS_MAX_ITEMS=50
```

## Supabase 설정
1. Supabase 프로젝트 생성
2. `supabase/migrations/001_init.sql` 실행
3. Storage bucket 생성(`public-files`)
4. 허용 확장자 `pdf,jpg,jpeg,png,webp,docx`, 최대 10MB

## 마이그레이션/시드
```bash
npm run db:migrate
npm run db:seed
```

## 로컬 실행
```bash
npm run dev
```
- 포트: `5050`

## 뉴스 자동 업데이트
### 수동 실행
```bash
npm run news:sync
```

### cron 등록 (서버)
`deploy/cron/news-sync.cron` 예시를 crontab에 등록하면 30분마다 뉴스를 업데이트합니다.

```bash
crontab -e
# 아래 1줄 추가
*/30 * * * * cd /opt/seobuline && /usr/bin/npm run news:sync >> /var/log/seobuline-news-sync.log 2>&1
```

## systemctl 실행
아래 파일을 `/etc/systemd/system`으로 복사해서 사용하세요.

- `deploy/systemd/seobuline.service`: Next.js 앱 구동
- `deploy/systemd/seobuline-news-sync.service`: 뉴스 수집 작업
- `deploy/systemd/seobuline-news-sync.timer`: 30분 주기 실행

```bash
sudo cp deploy/systemd/seobuline.service /etc/systemd/system/
sudo cp deploy/systemd/seobuline-news-sync.service /etc/systemd/system/
sudo cp deploy/systemd/seobuline-news-sync.timer /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable --now seobuline.service
sudo systemctl enable --now seobuline-news-sync.timer

# 상태 확인
systemctl status seobuline.service
systemctl status seobuline-news-sync.timer
```

> 서비스 파일의 `WorkingDirectory`, `User`, `Group`, `ExecStart`는 실제 서버 환경에 맞춰 수정하세요.

## 관리자 계정 시나리오
1. 일반 사용자 가입
2. `profiles.role`을 `admin`으로 변경
3. `/admin` 접근

## 운영 정책 문구(초안)
- 허위정보 금지 / 비방·욕설 금지 / 개인정보 노출 금지 / 저작권 침해 금지
- 정치인 정보는 공개 출처 기반 자료만 등록
- 신고 접수 및 삭제 요청 절차 운영

## 확장 포인트
- Supabase 실데이터 연동 완성
- 통합 검색
- 파일 미리보기 강화
- 감사로그 관리자 UI


## 실제 데이터 반영 범위
- 서부선 소개(사업개요/배경/노선/기대효과/주민 관점)와 FAQ를 공개 출처 기반 텍스트로 반영
- 진행현황 타임라인, 뉴스/기사, 정치인 정보공유, 자료실을 실제 URL/발행일 기준 데이터로 교체
- 홈 화면에 최신 뉴스/최근 공지/진행현황/FAQ 일부가 실제 데이터로 노출되도록 연결

## 출처 관리 방식
- 모든 핵심 데이터 항목에 `source_url`, `source_name`, `reference_date`(기준일) 또는 `published_date`를 함께 저장
- DB 스키마는 `supabase/migrations/002_source_fields.sql`에서 출처 필드 확장을 수행
- 수집/검수 기준일은 기본적으로 `2026-04-14`로 통일하여 기록
