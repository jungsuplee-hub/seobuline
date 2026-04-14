export const DATA_REFERENCE_DATE = "2026-04-14";

export const projectOverview = {
  title: "서울 경전철 서부선(민간투자사업)",
  business_summary:
    "서부선은 은평구 새절역(6호선)에서 관악구 서울대입구역(2호선)까지 연결하는 서울 서북·서남권 횡축 도시철도 사업으로, 공개 자료에서 연장 약 16.15~16.2km, 정거장 16개소로 안내됩니다.",
  추진_background: [
    "서울 서북권·서남권은 간선도로 혼잡과 환승 우회 부담이 큰 지역으로, 서부선은 기존 방사형 철도망의 단절 구간을 잇는 보완축으로 논의돼 왔습니다.",
    "서울시와 정부는 민간투자사업(BTO-rs) 방식으로 추진해 왔고, 총사업비·공사비 반영 방식 조정과 민투심 재심의 과정을 거쳤습니다.",
  ],
  route_overview:
    "주요 경유권역은 새절·명지대권·신촌·여의도·장승배기·서울대입구권으로 소개되며, 1·2·6·7·9호선과의 환승 연계가 핵심 효과로 제시됩니다.",
  major_stations_or_sections: [
    "새절역(6호선) – 신촌권 – 여의도권 – 장승배기권 – 서울대입구역(2호선)",
    "공개 문서에서는 정거장 16개소, 차량기지 1개소로 안내",
  ],
  expected_effects: [
    "서울 서부권 혼잡 완화 및 이동시간 단축",
    "기존 지하철 노선 환승 선택지 확대(1·2·6·7·9호선 연계)",
    "서북·서남권 생활권 접근성 개선과 지역 균형발전 기대",
  ],
  resident_perspective_summary:
    "주민 관점의 핵심 쟁점은 '착공·개통 시점의 확실성', '사업비/재원 구조의 안정성', '공사 단계 생활불편 최소화', '환승 동선과 운영계획의 실효성'입니다.",
  sources: [
    {
      source_name: "서울시의회 회의부록(제316회 임시회, 사업개요 자료)",
      source_url: "https://ms.smc.seoul.kr/attach/record/SEOUL/appendix/a11/A0058774.pdf",
      reference_date: DATA_REFERENCE_DATE,
    },
    {
      source_name: "연합뉴스TV(2020-06-22)",
      source_url: "https://www.yonhapnewstv.co.kr/news/MYH20200622019200038",
      reference_date: DATA_REFERENCE_DATE,
    },
    {
      source_name: "동아일보(2024-12-12)",
      source_url: "https://www.donga.com/news/amp/all/20241212/130626634/1",
      reference_date: DATA_REFERENCE_DATE,
    },
  ],
};

export const notices = [
  {
    id: "notice-1",
    title: "서울시, 서부선 우선협상대상자 지위 취소 절차 착수 발표(2026-04-01)",
    content:
      "서울시는 2026년 4월 1일 서부선 민간투자사업 우선협상대상자와의 협상 중단 및 지위 취소 절차 착수를 발표했습니다. 재정사업 전환 가능성도 함께 검토한다고 밝혔습니다.",
    is_pinned: true,
    created_at: "2026-04-01",
    source_url: "https://www.asiae.co.kr/article/economic-general/2026033117250171909",
    source_name: "아시아경제",
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    id: "notice-2",
    title: "서울시 서남권 대개조 2.0 발표에 서부선 신속 추진 포함(2026-03-05)",
    content:
      "서울시는 2026년 3월 발표한 '서남권 대개조 2.0'에서 서부선·강북횡단선·목동선·난곡선의 신속 추진 방침을 포함했습니다.",
    is_pinned: false,
    created_at: "2026-03-05",
    source_url: "https://www.yna.co.kr/amp/view/AKR20260305014551004",
    source_name: "연합뉴스",
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    id: "notice-3",
    title: "기재부 민투심, 서부선 실시협약(안) 통과 보도(2024-12)",
    content:
      "2024년 12월 보도 기준으로 서부선 실시협약(안)이 민간투자사업심의위원회에서 의결됐다는 내용이 공개됐습니다.",
    is_pinned: false,
    created_at: "2024-12-12",
    source_url: "https://www.donga.com/news/amp/all/20241212/130626634/1",
    source_name: "동아일보",
    reference_date: DATA_REFERENCE_DATE,
  },
];

export const timelineItems = [
  {
    title: "서울시, 9개 경전철 단계 추진 계획 발표",
    description:
      "연합뉴스 2013년 7월 보도에서 서울시의 9개 경전철 노선 단계 추진 계획이 소개됐고, 서부선도 장기 추진 노선군에 포함돼 논의됐습니다.",
    timeline_date: "2013-07-24",
    status: "계획 발표",
    sort_order: 1,
    source_url: "https://www.yna.co.kr/view/AKR20130724064600004",
    source_name: "연합뉴스",
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    title: "서부선 민간적격성 조사 통과 보도",
    description:
      "2020년 6월 연합뉴스TV 보도에서 서부선이 민간적격성 조사 통과 후 본격 추진 단계에 들어갔다고 전했습니다.",
    timeline_date: "2020-06-22",
    status: "적격성 통과",
    sort_order: 2,
    source_url: "https://www.yonhapnewstv.co.kr/news/MYH20200622019200038",
    source_name: "연합뉴스TV",
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    title: "우선협상대상자 선정(서울시의회 자료 기준)",
    description:
      "서울시의회 공개 회의자료에는 2021년 5월 3일 서부선 우선협상대상자 선정 일정이 추진경위로 기재돼 있습니다.",
    timeline_date: "2021-05-03",
    status: "협상 단계",
    sort_order: 3,
    source_url: "https://ms.smc.seoul.kr/attach/record/SEOUL/appendix/a11/A0058774.pdf",
    source_name: "서울시의회 회의부록",
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    title: "민투심 통과 불발 및 총사업비 반영방식 보완 요구",
    description:
      "2023년 9월 연합뉴스 보도에서 서부선 실시협약안이 총사업비 산정 문제로 민투심을 통과하지 못했고, 보완 후 재상정하기로 했다고 전했습니다.",
    timeline_date: "2023-09-19",
    status: "재검토",
    sort_order: 4,
    source_url: "https://www.yna.co.kr/view/AKR20230919102151002",
    source_name: "연합뉴스",
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    title: "민투심에서 서부선 실시협약(안) 통과 보도",
    description:
      "2024년 12월 기사에서 기재부 민간투자사업심의위원회가 서부선 실시협약(안)을 의결했다고 전했습니다.",
    timeline_date: "2024-12-12",
    status: "심의 통과",
    sort_order: 5,
    source_url: "https://www.donga.com/news/amp/all/20241212/130626634/1",
    source_name: "동아일보",
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    title: "서울시, 우선협상대상자 지위 취소 절차 착수 발표",
    description:
      "2026년 4월 1일 보도에서 서울시는 우선협상대상자와의 협상 중단 및 지위 취소 절차 착수를 공식화했습니다.",
    timeline_date: "2026-04-01",
    status: "절차 전환",
    sort_order: 6,
    source_url: "https://www.asiae.co.kr/article/economic-general/2026033117250171909",
    source_name: "아시아경제",
    reference_date: DATA_REFERENCE_DATE,
  },
];

export const faqItems = [
  {
    question: "서부선은 어디에서 어디까지 연결되나요?",
    answer:
      "공개 자료 기준으로 은평구 새절역(6호선)에서 관악구 서울대입구역(2호선)까지 연결하는 노선으로 안내됩니다. 길이는 약 16.15~16.2km, 정거장 16개소로 소개돼 있습니다.",
    sort_order: 1,
    is_visible: true,
    source_url: "https://ms.smc.seoul.kr/attach/record/SEOUL/appendix/a11/A0058774.pdf",
    source_name: "서울시의회 회의부록",
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    question: "왜 서부선이 필요한가요?",
    answer:
      "서울 서북·서남권의 이동 동선은 도로 혼잡과 우회 환승 부담이 크다는 지적이 지속됐습니다. 서부선은 신촌·여의도 등 통행 수요가 많은 축을 지나 환승 대안을 늘리는 목적이 있습니다.",
    sort_order: 2,
    is_visible: true,
    source_url: "https://www.yonhapnewstv.co.kr/news/MYH20200622019200038",
    source_name: "연합뉴스TV",
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    question: "서부선 진행은 현재 어느 단계인가요?",
    answer:
      "2024년 12월 민투심 통과 보도 이후, 2026년 4월에는 서울시가 기존 우선협상대상자와 협상을 중단하고 지위 취소 절차에 착수했다고 발표했습니다. 따라서 사업 방식·추진 경로가 다시 조정되는 단계로 보는 것이 공개 보도 기준에 부합합니다.",
    sort_order: 3,
    is_visible: true,
    source_url: "https://www.asiae.co.kr/article/economic-general/2026033117250171909",
    source_name: "아시아경제",
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    question: "민투심에서 한 번에 통과된 사업인가요?",
    answer:
      "아닙니다. 2023년 9월에는 총사업비 산정 문제로 통과하지 못했고 보완 후 재상정하기로 했다는 보도가 있었습니다.",
    sort_order: 4,
    is_visible: true,
    source_url: "https://www.yna.co.kr/view/AKR20230919102151002",
    source_name: "연합뉴스",
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    question: "완공 시 기대되는 교통효과는 무엇인가요?",
    answer:
      "연합뉴스TV 보도에는 새절역~서울대입구역 이동시간이 단축되고, 노량진·장승배기권과의 이동도 개선될 것으로 제시됐습니다. 환승 연결 확대가 핵심 효과로 언급됩니다.",
    sort_order: 5,
    is_visible: true,
    source_url: "https://www.yonhapnewstv.co.kr/news/MYH20200622019200038",
    source_name: "연합뉴스TV",
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    question: "서부선 관련 자료는 어떤 기준으로 확인하나요?",
    answer:
      "이 사이트는 기사·보도자료·의회 회의자료처럼 공개 URL로 검증 가능한 자료만 반영하고, 각 항목에 출처와 기준일을 함께 표기합니다.",
    sort_order: 6,
    is_visible: true,
    source_url: "https://github.com/jungsuplee-hub/seobuline",
    source_name: "프로젝트 운영원칙",
    reference_date: DATA_REFERENCE_DATE,
  },
];

export const politicianItems = [
  {
    name: "오세훈",
    party: "무소속(서울특별시장)",
    district: "서울특별시",
    summary:
      "2026년 4월 보도에서 오세훈 서울시장은 서부선 관련 철도 건설을 차질 없이 추진하겠다는 취지의 입장을 밝혔습니다.",
    speech_date: "2026-04-01",
    source_url: "https://www.asiae.co.kr/article/economic-general/2026033117250171909",
    source_name: "아시아경제",
    review_status: "approved",
    is_visible: true,
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    name: "박원순",
    party: "더불어민주당(당시 서울특별시장)",
    district: "서울특별시",
    summary:
      "2020년 6월 연합뉴스TV 인터뷰 인용에서 박원순 당시 서울시장은 서부선이 서울 내 교통격차 해소와 삶의 질 개선에 기여할 것이라고 발언했습니다.",
    speech_date: "2020-06-22",
    source_url: "https://www.yonhapnewstv.co.kr/news/MYH20200622019200038",
    source_name: "연합뉴스TV",
    review_status: "approved",
    is_visible: true,
    reference_date: DATA_REFERENCE_DATE,
  },
  {
    name: "이성헌",
    party: "국민의힘(서대문구청장)",
    district: "서울 서대문구",
    summary:
      "서대문구청 발행물과 관련 보도에서 이성헌 구청장은 서부선 조속 착공 및 강북횡단선 재추진 필요성을 주민 서명과 함께 서울시에 전달하는 입장을 공개했습니다.",
    speech_date: "2025-06-19",
    source_url: "https://mobile.newsis.com/view/NISX20250619_0003219468",
    source_name: "뉴시스",
    review_status: "approved",
    is_visible: true,
    reference_date: DATA_REFERENCE_DATE,
  },
];

export const resourceItems = [
  {
    title: "서울시의회 제316회 임시회 부록(서부선 사업개요 포함)",
    description: "사업구간, 정거장 수, 사업방식(BTO-rs), 추진일정 등이 정리된 공개 회의 부록 자료입니다.",
    category: "공식회의자료",
    file_url: "https://ms.smc.seoul.kr/attach/record/SEOUL/appendix/a11/A0058774.pdf",
    source_url: "https://ms.smc.seoul.kr/attach/record/SEOUL/appendix/a11/A0058774.pdf",
    file_type: "pdf",
    published_date: "2022-11-01",
  },
  {
    title: "서울시 보도자료(서부선 실시협약안 민투심 통과)",
    description: "서울시 명의로 배포된 서부선 관련 보도자료 PDF(오픈거버먼트 공개 링크)입니다.",
    category: "보도자료",
    file_url:
      "https://opengov.seoul.go.kr/og/com/download.php?dname=%EC%84%9C%EC%9A%B8%EC%8B%9C+%EC%84%9C%EB%B6%80%EC%84%A0+%EC%8B%A4%EC%8B%9C%ED%98%91%EC%95%BD%28%EC%95%88%29+%EB%AF%BC%ED%88%AC%EC%8B%AC+%ED%86%B5%EA%B3%BC%E2%80%A6+%EC%84%9C%EB%B6%80%EA%B6%8C+%EB%8F%84%EC%8B%9C%EC%B2%A0%EB%8F%84+%EC%82%AC%EC%97%85+%EB%B3%B8%EA%B2%A9+%EC%B6%94%EC%A7%84.pdf&dtype=basic&fid=&nid=32463683&rid=F0000109106932&uri=%2Ffiles%2Fdcdata%2F100006%2F20241218%2FF0000109106932.pdf",
    source_url: "https://opengov.seoul.go.kr/press/32463683",
    file_type: "pdf",
    published_date: "2024-12-18",
  },
  {
    title: "전략환경영향평가서(초안 요약문) - 서부선 도시철도 민간투자사업",
    description: "사업 시·종점, 정거장 수 등 환경영향평가 초안 요약이 포함된 공개 PDF입니다.",
    category: "환경영향자료",
    file_url:
      "https://sdm.go.kr/downloadFile.do?oriFileNm=%EC%A0%84%EB%9E%B5%ED%99%98%EA%B2%BD%EC%98%81%ED%96%A5%ED%8F%89%EA%B0%80_%EC%B4%88%EC%95%88_%EC%9A%94%EC%95%BD%EB%AC%B8%28%EC%84%9C%EB%B6%80%EC%84%A0%29.pdf&path=%2Fboard%2F82&saveFileNm=9342F5F6-8DFF-935A-B407-7144BF604B05.pdf",
    source_url: "https://sdm.go.kr/downloadFile.do?oriFileNm=%EC%A0%84%EB%9E%B5%ED%99%98%EA%B2%BD%EC%98%81%ED%96%A5%ED%8F%89%EA%B0%80_%EC%B4%88%EC%95%88_%EC%9A%94%EC%95%BD%EB%AC%B8%28%EC%84%9C%EB%B6%80%EC%84%A0%29.pdf&path=%2Fboard%2F82&saveFileNm=9342F5F6-8DFF-935A-B407-7144BF604B05.pdf",
    file_type: "pdf",
    published_date: "2025-06-01",
  },
  {
    title: "연합뉴스 보도(민투심 통과 불발, 재상정 안내)",
    description: "2023년 9월 민투심 심의 결과와 보완 요구사항을 다룬 기사입니다.",
    category: "기사",
    file_url: "https://www.yna.co.kr/view/AKR20230919102151002",
    source_url: "https://www.yna.co.kr/view/AKR20230919102151002",
    file_type: "url",
    published_date: "2023-09-19",
  },
];
