export const PRICING_PLANS = [
  {
    id: 1,
    name: "FREE",
    price: "0원",

    icon: "/images/main/aAF5devxEdbNPNiF_Gold.png",
    description: "개인 사용자를 위한 기본 플랜",
    features: [
      "기본 기능 이용",
      "월 10개 프로젝트",
      "이메일 지원",
      "1GB 저장공간",
    ],
    buttonText: "무료로 시작하기",
    isPopular: false,
  },
  {
    id: 2,
    name: "PLUS",
    price: "9,900원/월",

    icon: "/images/main/aAF5sOvxEdbNPNiH_Platinum.png",
    description: "소규모 팀을 위한 전문 플랜",
    features: [
      "모든 기능 이용",
      "무제한 프로젝트",
      "우선 지원",
      "10GB 저장공간",
      "팀 협업 기능",
    ],
    buttonText: "프로 시작하기",
    isPopular: true, // 추천 플랜 표시
  },
  {
    id: 3,
    name: "PRO",
    price: "29,900원/월",

    icon: "/images/main/aAF5yOvxEdbNPNiJ_Diamond.png",
    description: "대기업을 위한 맞춤 솔루션",
    features: [
      "프로 플랜의 모든 기능",
      "무제한 저장공간",
      "전담 지원",
      "고급 보안",
      "사용자 정의 통합",
    ],
    buttonText: "영업팀 문의",
    isPopular: false,
  },
];

// 추가 상수들
export const CURRENCY = "원";
export const DISCOUNT_TEXT = "연간 결제 시 20% 할인!";
