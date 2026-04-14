# 콘텐츠 정기 업데이트 (cron)

이 프로젝트는 AI 생성 없이 **로컬 JSON + RSS + 수동 검수 파일** 방식으로 콘텐츠를 갱신합니다.

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

## 실행 명령
```bash
npm run update:site-content
npm run update:timeline
npm run update:politicians
npm run update:news
npm run update:all
```

## cron 등록 예시
```cron
0 6 * * * cd /path/to/seobuline && npm run update:all >> /var/log/seobuline-cron.log 2>&1
```

쉘 래퍼를 사용하는 경우:
```cron
0 6 * * * cd /path/to/seobuline && ./scripts/run-cron-updates.sh >> /var/log/seobuline-cron.log 2>&1
```

권한 설정:
```bash
chmod +x scripts/run-cron-updates.sh
```
