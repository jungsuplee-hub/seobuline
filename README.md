# 서부선 추진위원회 홈페이지

서부선 관련 정보를 주민에게 체계적으로 제공하기 위한 Next.js + Supabase 기반 웹사이트입니다.

## 주요 기능
- 홈, 소개, 진행현황, 뉴스/공지, 게시판, 정치인 정보공유, 자료실, 일정, 참여하기, 위원회 소개, 마이페이지, 관리자 페이지
- 이메일 인증 구조(Supabase Auth), role(user/moderator/admin) 구조
- API Route Handler CRUD 골격 + Zod 검증 + sanitize
- Supabase SQL 스키마(요청 테이블/인덱스/RLS) 및 seed 스크립트
- 반응형 UI, 404/권한없음/로딩/에러 페이지

## 설치
```bash
npm install
```

## 환경변수
```bash
cp .env.example .env.local
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
