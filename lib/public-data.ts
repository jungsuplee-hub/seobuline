export const DATA_REFERENCE_DATE = "2026-04-14";

export const projectOverview = {
  title: "서울 경전철 서부선(민간투자사업)",
  business_summary:
    "서부선은 은평구 새절역(6호선)부터 관악구 서울대입구역(2호선)까지 서울 서북·서남권을 잇는 도시철도 사업으로 공개자료에서 정거장 16개소, 차량기지 1개소로 안내됩니다.",
  추진_background: [
    "서북·서남권은 환승 우회와 버스 혼잡 부담이 크다는 지적이 반복되어 왔습니다.",
    "서울시는 민간투자방식으로 협상을 진행해 왔으나 총사업비·실시협약 조정 과정에서 일정 변동이 있었습니다.",
  ],
  route_overview:
    "새절·명지대·신촌·여의도·장승배기·서울대입구권을 잇는 서부권 횡축 노선으로 소개되며 1·2·6·7·9호선 연계가 핵심 포인트입니다.",
  major_stations_or_sections: [
    "새절역(6호선) – 명지대권 – 신촌권 – 여의도권 – 장승배기권 – 서울대입구역(2호선)",
    "공개 문서 기준 정거장 16개소, 차량기지 1개소",
  ],
  expected_effects: [
    "서부권 통행시간 단축과 혼잡 완화",
    "YBD·CBD·GBD 접근성 개선을 위한 환승 선택지 확대",
    "지역 생활권·상권 연결성 향상 기대",
  ],
  resident_perspective_summary:
    "주민 관점 핵심은 착공 시점, 사업 재원 안정성, 공사 단계 불편 최소화, 환승 동선 실효성입니다.",
  sources: [
    { source_name: "서울시보(2022-09-08) 서부선 도시철도 민간투자사업 지정", source_url: "https://event.seoul.go.kr/snews/data/CN_MST/seoulsibo_20220907175540_11344.pdf", reference_date: DATA_REFERENCE_DATE },
    { source_name: "서울시 오픈거버넌스 보도자료(2024-12-18)", source_url: "https://opengov.seoul.go.kr/press/32463683", reference_date: DATA_REFERENCE_DATE },
    { source_name: "아시아경제(2026-04-01)", source_url: "https://www.asiae.co.kr/article/economic-general/2026033117250171909", reference_date: DATA_REFERENCE_DATE },
  ],
};

export const notices = [
  { id: "notice-1", title: "서울시, 서부선 우선협상대상자 지위 취소 절차 착수 발표", content: "2026년 4월 1일 보도 기준으로 서울시는 기존 우선협상대상자 협상 중단 및 지위 취소 절차 착수를 알렸습니다.", is_pinned: true, created_at: "2026-04-01", source_url: "https://www.asiae.co.kr/article/economic-general/2026033117250171909", source_name: "아시아경제", reference_date: DATA_REFERENCE_DATE },
  { id: "notice-2", title: "서울시, 2024년 12월 서부선 실시협약(안) 민투심 통과 발표", content: "서울시 오픈거버넌스 보도자료를 기준으로 실시협약안 심의 통과 발표 내용을 반영했습니다.", is_pinned: false, created_at: "2024-12-18", source_url: "https://opengov.seoul.go.kr/press/32463683", source_name: "서울시", reference_date: DATA_REFERENCE_DATE },
  { id: "notice-3", title: "서대문구, 서부선 조속 추진 촉구 주민서명 전달", content: "서대문구청 보도자료 및 언론보도를 기준으로 주민서명 전달 사례를 공지에 반영했습니다.", is_pinned: false, created_at: "2025-06-19", source_url: "https://www.sdm.go.kr/news/board.do?mode=view&sdmBoardSeq=290241", source_name: "서대문구청", reference_date: DATA_REFERENCE_DATE },
];

export const timelineItems = [
  { title: "서울시, 서부선 도시철도 민간투자사업 지정 고시", description: "서울시보 고시문에 사업위치(새절역~서울대입구역), 규모(정거장 16개소) 등이 기재됐습니다.", timeline_date: "2022-09-08", status: "사업 지정", sort_order: 1, source_url: "https://event.seoul.go.kr/snews/data/CN_MST/seoulsibo_20220907175540_11344.pdf", source_name: "서울시보", reference_date: DATA_REFERENCE_DATE },
  { title: "민투심 통과 불발 보도", description: "2023년 9월 보도에서 총사업비 반영기준 보완 후 재상정 예정이 공개됐습니다.", timeline_date: "2023-09-19", status: "재검토", sort_order: 2, source_url: "https://www.yna.co.kr/view/AKR20230919102151002", source_name: "연합뉴스", reference_date: DATA_REFERENCE_DATE },
  { title: "서부선 실시협약(안) 민투심 통과 발표", description: "2024년 12월 서울시 보도자료에서 실시협약(안) 심의 통과를 발표했습니다.", timeline_date: "2024-12-18", status: "심의 통과", sort_order: 3, source_url: "https://opengov.seoul.go.kr/press/32463683", source_name: "서울시", reference_date: DATA_REFERENCE_DATE },
  { title: "서대문구, 조속 추진 촉구 서명 전달", description: "지자체 차원에서 서부선 관련 촉구 활동이 진행됐다는 공개 자료를 반영했습니다.", timeline_date: "2025-06-19", status: "지역 촉구", sort_order: 4, source_url: "https://www.sdm.go.kr/news/board.do?mode=view&sdmBoardSeq=290241", source_name: "서대문구청", reference_date: DATA_REFERENCE_DATE },
  { title: "서울시, 우선협상대상자 지위 취소 절차 착수", description: "2026년 4월 보도 기준 협상 중단 및 향후 사업방식 재검토 단계가 확인됩니다.", timeline_date: "2026-04-01", status: "절차 전환", sort_order: 5, source_url: "https://www.asiae.co.kr/article/economic-general/2026033117250171909", source_name: "아시아경제", reference_date: DATA_REFERENCE_DATE },
];

export const faqItems = [
  { question: "서부선은 어디에서 어디까지 연결되나요?", answer: "서울시보 고시 기준 은평구 새절역(6호선)부터 관악구 서울대입구역(2호선)까지입니다.", sort_order: 1, is_visible: true, source_url: "https://event.seoul.go.kr/snews/data/CN_MST/seoulsibo_20220907175540_11344.pdf", source_name: "서울시보", reference_date: DATA_REFERENCE_DATE },
  { question: "정거장 수는 몇 개인가요?", answer: "공개 고시자료에는 정거장 16개소, 차량기지 1개소로 표기됩니다.", sort_order: 2, is_visible: true, source_url: "https://event.seoul.go.kr/snews/data/CN_MST/seoulsibo_20220907175540_11344.pdf", source_name: "서울시보", reference_date: DATA_REFERENCE_DATE },
  { question: "최근 사업 단계는 어떤 상태인가요?", answer: "2026년 4월 1일 보도 기준 우선협상대상자 지위 취소 절차 착수 단계입니다.", sort_order: 3, is_visible: true, source_url: "https://www.asiae.co.kr/article/economic-general/2026033117250171909", source_name: "아시아경제", reference_date: DATA_REFERENCE_DATE },
  { question: "왜 서부선이 필요하다고 하나요?", answer: "서북·서남권의 환승 우회 부담 완화와 서부권 횡축 연결 보완이 주요 근거로 제시됩니다.", sort_order: 4, is_visible: true, source_url: "https://opengov.seoul.go.kr/press/32463683", source_name: "서울시", reference_date: DATA_REFERENCE_DATE },
  { question: "주민은 어떻게 참여할 수 있나요?", answer: "오픈채팅 참여, 주민설명회, 공개의견 수렴 절차 등 합법적 참여 채널을 이용할 수 있습니다.", sort_order: 5, is_visible: true, source_url: "https://open.kakao.com/o/g9w5KIpi", source_name: "서부선 정상화 추진위원회", reference_date: DATA_REFERENCE_DATE },
  { question: "정치인 정보는 어떤 기준으로 올리나요?", answer: "공식홈페이지·의정활동·언론보도 등 공개 출처로 확인된 정보만 올립니다.", sort_order: 6, is_visible: true, source_url: "https://www.assembly.go.kr", source_name: "대한민국 국회", reference_date: DATA_REFERENCE_DATE },
];

export const politicianItems = [
  { name: "정원오", party: "더불어민주당", district: "서울 성동구", office_type: "구청장", region_tags: ["은평구", "마포구", "서대문구", "동작구", "관악구", "영등포구"], summary: "서울시 구청장협의회장으로 활동하며 서울시정 현안 관련 공개 발언이 확인되는 인물입니다.", stance_or_relevance: "서울시정·광역교통 공론장 참여 이력 기준으로 참조", election_2026_status: "공개 확인 자료 없음", speech_date: null, source_name: "성동구청", source_url: "https://www.sd.go.kr/mayor", official_website: "https://www.sd.go.kr", x_url: null, blog_url: null, office_phone: "02-2286-5000", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
  { name: "박주민", party: "더불어민주당", district: "서울 은평구 갑", office_type: "국회의원", region_tags: ["은평구", "서울시장"], summary: "국회 공식 인명정보 기준 은평구 갑 현역 국회의원입니다.", stance_or_relevance: "서부선 및 서울시 교통현안 관련 질의 가능성이 높은 지역구", election_2026_status: "현직", speech_date: null, source_name: "대한민국 국회", source_url: "https://www.assembly.go.kr/members/22nd/PARKJUMIN", official_website: "https://www.assembly.go.kr/members/22nd/PARKJUMIN", x_url: "https://x.com/yozm", blog_url: null, office_phone: null, review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
  { name: "전현희", party: "더불어민주당", district: "비례", office_type: "국회의원", region_tags: ["서울시장"], summary: "국회 공식 인명정보 기반 현역 국회의원으로 수록했습니다.", stance_or_relevance: "서울시정 관련 공개 발언 확인 시 갱신", election_2026_status: "현직", speech_date: null, source_name: "대한민국 국회", source_url: "https://www.assembly.go.kr/members/22nd/JEONHYUNHEE", official_website: "https://www.assembly.go.kr/members/22nd/JEONHYUNHEE", x_url: null, blog_url: null, office_phone: null, review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },

  { name: "김미경", party: "더불어민주당", district: "서울 은평구", office_type: "구청장", region_tags: ["은평구"], summary: "은평구청장 공식 페이지 기반 공직자 정보를 반영했습니다.", stance_or_relevance: "서부선 연선 생활권 주민 행정 총괄", election_2026_status: "현직", speech_date: null, source_name: "은평구청", source_url: "https://www.ep.go.kr", official_website: "https://www.ep.go.kr", x_url: null, blog_url: null, office_phone: "02-351-6114", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
  { name: "김우영", party: "더불어민주당", district: "서울 은평구 을", office_type: "국회의원", region_tags: ["은평구"], summary: "국회 공식 인명정보 기준 은평구 을 현역 국회의원입니다.", stance_or_relevance: "은평권 철도·교통현안 관련 의정활동 추적 대상", election_2026_status: "현직", speech_date: null, source_name: "대한민국 국회", source_url: "https://www.assembly.go.kr/members/22nd/KIMWOOYOUNG", official_website: "https://www.assembly.go.kr/members/22nd/KIMWOOYOUNG", x_url: null, blog_url: null, office_phone: null, review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },

  { name: "박강수", party: "국민의힘", district: "서울 마포구", office_type: "구청장", region_tags: ["마포구"], summary: "마포구청장 공식 페이지 기반 공직자 정보를 반영했습니다.", stance_or_relevance: "마포구 연선 교통정책 행정 주체", election_2026_status: "현직", speech_date: null, source_name: "마포구청", source_url: "https://www.mapo.go.kr", official_website: "https://www.mapo.go.kr", x_url: null, blog_url: null, office_phone: "02-3153-8100", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
  { name: "정청래", party: "더불어민주당", district: "서울 마포구 을", office_type: "국회의원", region_tags: ["마포구"], summary: "국회 공식 인명정보 기준 마포구 을 현역 국회의원입니다.", stance_or_relevance: "서부권 교통 관련 국회 질의 이슈 추적 대상", election_2026_status: "현직", speech_date: null, source_name: "대한민국 국회", source_url: "https://www.assembly.go.kr/members/22nd/CHUNGCHUNGRAE", official_website: "https://www.assembly.go.kr/members/22nd/CHUNGCHUNGRAE", x_url: "https://x.com/ssaribi", blog_url: null, office_phone: null, review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
  { name: "유동균", party: "더불어민주당", district: "서울 마포구", office_type: "전 구청장", region_tags: ["마포구"], summary: "마포구 전직 구청장으로 공개 이력 기반 인물 카드에 포함했습니다.", stance_or_relevance: "지역 교통 공약 비교를 위한 참조 인물", election_2026_status: "공개 확인 자료 없음", speech_date: null, source_name: "마포구청", source_url: "https://www.mapo.go.kr", official_website: null, x_url: null, blog_url: null, office_phone: null, review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },

  { name: "이성헌", party: "국민의힘", district: "서울 서대문구", office_type: "구청장", region_tags: ["서대문구"], summary: "서대문구청 공개자료 기준 서부선 조속 추진 촉구 활동이 확인됩니다.", stance_or_relevance: "구청 보도자료에 주민서명 전달 내용 공개", election_2026_status: "현직", speech_date: "2025-06-19", source_name: "서대문구청", source_url: "https://www.sdm.go.kr/news/board.do?mode=view&sdmBoardSeq=290241", official_website: "https://www.sdm.go.kr", x_url: null, blog_url: null, office_phone: "02-330-1114", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
  { name: "박운기", party: "더불어민주당", district: "서울 서대문구", office_type: "서울시의원", region_tags: ["서대문구"], summary: "서울시의회 공개 의원정보 기준으로 수록했습니다.", stance_or_relevance: "서부권 교통정책 관련 시의회 활동 추적 대상", election_2026_status: "공개 확인 자료 없음", speech_date: null, source_name: "서울시의회", source_url: "https://www.smc.seoul.kr", official_website: "https://www.smc.seoul.kr", x_url: null, blog_url: null, office_phone: "02-2180-7946", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },

  { name: "박일하", party: "국민의힘", district: "서울 동작구", office_type: "구청장", region_tags: ["동작구"], summary: "동작구청장 공식 페이지 기반 공직자 정보를 반영했습니다.", stance_or_relevance: "동작구 연선 교통정책 행정 주체", election_2026_status: "현직", speech_date: null, source_name: "동작구청", source_url: "https://www.dongjak.go.kr", official_website: "https://www.dongjak.go.kr", x_url: null, blog_url: null, office_phone: "02-820-1114", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
  { name: "나경원", party: "국민의힘", district: "서울 동작구 을", office_type: "국회의원", region_tags: ["동작구"], summary: "국회 공식 인명정보 기준 동작구 을 현역 국회의원입니다.", stance_or_relevance: "동작권 교통현안 관련 의정활동 추적 대상", election_2026_status: "현직", speech_date: null, source_name: "대한민국 국회", source_url: "https://www.assembly.go.kr/members/22nd/NAKYUNGWON", official_website: "https://www.assembly.go.kr/members/22nd/NAKYUNGWON", x_url: null, blog_url: null, office_phone: null, review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },

  { name: "박준희", party: "더불어민주당", district: "서울 관악구", office_type: "구청장", region_tags: ["관악구"], summary: "관악구청장 공식 페이지 기반 공직자 정보를 반영했습니다.", stance_or_relevance: "관악구 연선 생활권 교통행정 주체", election_2026_status: "현직", speech_date: null, source_name: "관악구청", source_url: "https://www.gwanak.go.kr", official_website: "https://www.gwanak.go.kr", x_url: null, blog_url: null, office_phone: "02-879-5000", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
  { name: "정태호", party: "더불어민주당", district: "서울 관악구 을", office_type: "국회의원", region_tags: ["관악구"], summary: "국회 공식 인명정보 기준 관악구 을 현역 국회의원입니다.", stance_or_relevance: "관악권 교통현안 관련 의정활동 추적 대상", election_2026_status: "현직", speech_date: null, source_name: "대한민국 국회", source_url: "https://www.assembly.go.kr/members/22nd/JUNGTAEHO", official_website: "https://www.assembly.go.kr/members/22nd/JUNGTAEHO", x_url: null, blog_url: null, office_phone: null, review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },

  { name: "최호권", party: "국민의힘", district: "서울 영등포구", office_type: "구청장", region_tags: ["영등포구"], summary: "영등포구청장 공식 페이지 기반 공직자 정보를 반영했습니다.", stance_or_relevance: "여의도권 교통정책·생활권 현안 행정 주체", election_2026_status: "현직", speech_date: null, source_name: "영등포구청", source_url: "https://www.ydp.go.kr", official_website: "https://www.ydp.go.kr", x_url: null, blog_url: null, office_phone: "02-2670-3114", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
  { name: "최웅식", party: "더불어민주당", district: "서울 영등포구", office_type: "서울시의원", region_tags: ["영등포구"], summary: "서울시의회 공개 의원정보 기준으로 수록했습니다.", stance_or_relevance: "영등포권 교통정책 시의회 논의 추적 대상", election_2026_status: "공개 확인 자료 없음", speech_date: null, source_name: "서울시의회", source_url: "https://www.smc.seoul.kr", official_website: "https://www.smc.seoul.kr", x_url: null, blog_url: null, office_phone: "02-2180-7946", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
  { name: "채현일", party: "더불어민주당", district: "서울 영등포구 갑", office_type: "국회의원", region_tags: ["영등포구"], summary: "국회 공식 인명정보 기준 영등포구 갑 현역 국회의원입니다.", stance_or_relevance: "여의도권 교통·도시 인프라 이슈 추적 대상", election_2026_status: "현직", speech_date: null, source_name: "대한민국 국회", source_url: "https://www.assembly.go.kr/members/22nd/CHAEHYUNIL", official_website: "https://www.assembly.go.kr/members/22nd/CHAEHYUNIL", x_url: null, blog_url: null, office_phone: null, review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },

  { name: "최대호", party: "더불어민주당", district: "경기 안양시", office_type: "시장", region_tags: ["안양시"], summary: "안양시장 공식 프로필 기반으로 수록했습니다.", stance_or_relevance: "안양시 대중교통 연계 정책 확인 대상", election_2026_status: "현직", speech_date: null, source_name: "안양시청", source_url: "https://www.anyang.go.kr/mayor", official_website: "https://www.anyang.go.kr", x_url: null, blog_url: null, office_phone: "031-8045-2114", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
  { name: "임채호", party: "더불어민주당", district: "경기 안양시", office_type: "경기도의원", region_tags: ["안양시"], summary: "경기도의회 공개 의원현황 기준으로 수록했습니다.", stance_or_relevance: "안양시 교통인프라 관련 도의회 논의 추적 대상", election_2026_status: "공개 확인 자료 없음", speech_date: null, source_name: "경기도의회", source_url: "https://www.ggc.go.kr", official_website: "https://www.ggc.go.kr", x_url: null, blog_url: null, office_phone: "031-8008-7000", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
  { name: "김대영", party: "국민의힘", district: "경기 안양시", office_type: "시의원", region_tags: ["안양시"], summary: "안양시의회 공개 의원정보 기준으로 수록했습니다.", stance_or_relevance: "안양시 도시교통 현안 관련 시의회 활동 추적 대상", election_2026_status: "공개 확인 자료 없음", speech_date: null, source_name: "안양시의회", source_url: "https://www.aycouncil.go.kr", official_website: "https://www.aycouncil.go.kr", x_url: null, blog_url: null, office_phone: "031-8045-2527", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
  { name: "김철현", party: "국민의힘", district: "경기 안양시", office_type: "도의원", region_tags: ["안양시"], summary: "경기도의회 공개 의원현황 기준으로 수록했습니다.", stance_or_relevance: "안양시 광역교통 연계 정책 논의 추적 대상", election_2026_status: "공개 확인 자료 없음", speech_date: null, source_name: "경기도의회", source_url: "https://www.ggc.go.kr", official_website: "https://www.ggc.go.kr", x_url: null, blog_url: null, office_phone: "031-8008-7000", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },

  { name: "2026 지방선거 공개자료 안내", party: "-", district: "전국", office_type: "선거정보", region_tags: ["은평구", "마포구", "서대문구", "동작구", "관악구", "영등포구", "안양시"], summary: "2026년 6월 3일 지방선거 관련 정보는 선관위·정당 공천·본인 공식발표 등 공개 확인 자료만 반영합니다.", stance_or_relevance: "루머·비공식 출처는 반영하지 않음", election_2026_status: "공개 확인 자료 없음", speech_date: null, source_name: "중앙선거관리위원회", source_url: "https://www.nec.go.kr", official_website: "https://www.nec.go.kr", x_url: null, blog_url: null, office_phone: "1390", review_status: "approved", is_visible: true, updated_at: DATA_REFERENCE_DATE },
];


export const resourceItems = [
  { title: "서울시보 고시문(서부선 도시철도 민간투자사업 지정)", description: "사업위치·규모·시행자 정보가 기재된 공식 고시문", category: "공식고시", file_url: "https://event.seoul.go.kr/snews/data/CN_MST/seoulsibo_20220907175540_11344.pdf", source_url: "https://event.seoul.go.kr/snews/data/CN_MST/seoulsibo_20220907175540_11344.pdf", file_type: "pdf", published_date: "2022-09-08" },
  { title: "서울시 보도자료(서부선 실시협약(안) 민투심 통과)", description: "서울시 오픈거버넌스 공개 보도자료", category: "보도자료", file_url: "https://opengov.seoul.go.kr/press/32463683", source_url: "https://opengov.seoul.go.kr/press/32463683", file_type: "url", published_date: "2024-12-18" },
  { title: "연합뉴스 보도(민투심 통과 불발 보완 요구)", description: "총사업비 반영 기준 쟁점을 다룬 기사", category: "기사", file_url: "https://www.yna.co.kr/view/AKR20230919102151002", source_url: "https://www.yna.co.kr/view/AKR20230919102151002", file_type: "url", published_date: "2023-09-19" },
  { title: "아시아경제 보도(우선협상대상자 지위 취소 절차 착수)", description: "2026년 4월 절차 전환 보도", category: "기사", file_url: "https://www.asiae.co.kr/article/economic-general/2026033117250171909", source_url: "https://www.asiae.co.kr/article/economic-general/2026033117250171909", file_type: "url", published_date: "2026-04-01" },
];
