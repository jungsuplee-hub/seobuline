import type { Notice } from "@/types";

export const notices: Notice[] = [
  {
    id: "n1",
    title: "서부선 정상화 주민설명회 안내",
    content: "4월 30일 주민설명회를 개최합니다.",
    is_pinned: true,
    created_at: "2026-04-01",
  },
  {
    id: "n2",
    title: "제보 게시판 운영 가이드",
    content: "사실 확인 가능한 제보만 등록",
    is_pinned: false,
    created_at: "2026-03-28",
  },
  {
    id: "n3",
    title: "개인정보 처리방침 개정",
    content: "정책 문서 개정",
    is_pinned: false,
    created_at: "2026-03-22",
  },
];

export const timeline = [
  {
    id: "t1",
    title: "사업 재검토 착수",
    description: "기초 타당성 재정비",
    timeline_date: "2025-12-01",
    status: "완료",
  },
  {
    id: "t2",
    title: "관계기관 협의",
    description: "예산 및 일정 조율",
    timeline_date: "2026-02-15",
    status: "협의중",
  },
  {
    id: "t3",
    title: "주민 공청회",
    description: "지역 의견 수렴",
    timeline_date: "2026-04-30",
    status: "추진중",
  },
  {
    id: "t4",
    title: "최종 실행계획 확정",
    description: "실행 로드맵 공표",
    timeline_date: "2026-07-20",
    status: "검토중",
  },
];

export const posts = Array.from({ length: 5 }).map((_, i) => ({
  id: `p${i + 1}`,
  title: `주민 의견 공유 ${i + 1}`,
  author: "시민",
  created_at: `2026-04-0${i + 4}`,
  category: i % 2 ? "자유게시판" : "지역별 게시판",
}));

export const faqItems = [
  { q: "서부선 사업은 언제 착공되나요?", a: "공식 확정 이후 공지됩니다." },
  { q: "뉴스는 누가 등록하나요?", a: "관리자 권한으로 등록/검수합니다." },
  { q: "정치인 정보 등록 기준은?", a: "공개 출처 기반 자료만 허용합니다." },
  {
    q: "비회원도 게시판을 볼 수 있나요?",
    a: "열람은 가능, 작성은 회원만 가능합니다.",
  },
];
