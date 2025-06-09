import React, { useState } from "react";
import { Header } from "../../components/landing/Header";
import { Footer } from "../../components/common/Footer";
//import "../../styles/landing/pricing.scss";

const PricingPage = () => {
  // 월간/연간 토글 상태 관리
  const [billingType, setBillingType] = useState("monthly");

  // 토글 클릭 핸들러
  const handleBillingToggle = (type) => {
    setBillingType(type);
  };

  // 가격 데이터
  const pricingPlans = [
    {
      name: "FREE",
      monthlyPrice: "0원",
      annuallyPrice: "0원",
      monthlySubtitle: "무료입니다",
      annuallySubtitle: "무료입니다",
      icon: "/images/main/aAF5devxEdbNPNiF_Gold.png",
      description: "기본 플랜을 이용하실 수 있습니다",
      features: ["5 개의 제품 사용 가능", "3명의 인원 제한"],
    },
    {
      name: "PLUS",
      monthlyPrice: "9,900/월",
      annuallyPrice: "7,900/년",
      monthlySubtitle: "또는 년 20% 할인받을 수 있습니다",
      annuallySubtitle: "이 요금제는 연간 결제 방식입니다",
      icon: "/images/main/aAF5sOvxEdbNPNiH_Platinum.png",
      description:
        "PLUS 등급 상품을 스토어에서 확인해보세요. 또는 년 20% 할인받을 수 있습니다",
      features: ["10개의 제품 사용 가능", "10GB 이상의 용량 사용 가능"],
    },
    {
      name: "PRO",
      monthlyPrice: "29,000/월",
      annuallyPrice: "23,000/년",
      monthlySubtitle: "or save 20% annually",
      annuallySubtitle: "이 요금제는 연간 결제 방식입니다",
      icon: "/images/main/aAF5yOvxEdbNPNiJ_Diamond.png",
      description: "최고 등급 상품은 스토어에서 확인하세요",
      features: ["50개의 이상의 제품 사용 가능", "100GB 이상 용량 사용 가능"],
    },
  ];

  // 비교 테이블 데이터
  const comparisonPlans = [
    { name: "FREE", price: "0원", desc: "무료" },
    { name: "PLUS", price: "9,900원/월", desc: "연간 결제 시 20% 할인" },
    { name: "PRO", price: "29,000원/월", desc: "연간 결제 시 20% 할인" },
  ];

  const features = [
    {
      section: "기본 기능",
      items: [
        { name: "페이지 생성", free: true, plus: true, pro: true },
        { name: "기본 게시판", free: true, plus: true, pro: true },
        { name: "개인 캘린더", free: true, plus: true, pro: true },
      ],
    },
    {
      section: "협업 & 팀 기능",
      items: [
        { name: "팀 협업 도구", free: false, plus: true, pro: true },
        { name: "프로젝트 관리", free: false, plus: true, pro: true },
      ],
    },
    {
      section: "저장공간 & 고급기능",
      items: [
        { name: "저장공간", free: "5GB", plus: "100GB", pro: "무제한" },
        { name: "고급 보안 설정", free: false, plus: false, pro: true },
        { name: "관리자 대시보드", free: false, plus: false, pro: true },
      ],
    },
    {
      section: "고객 지원",
      items: [
        {
          name: "고객지원",
          free: "이메일",
          plus: "우선 지원",
          pro: "24/7 전담",
        },
      ],
    },
  ];

  return (
    <div id="wrapper">
      <Header />
      <div className="empty-box" />

      <main>
        {/* 프라이싱 히어로 섹션 */}
        <section className="pricing-hero">
          <div className="pricing-hero-container">
            <h1>
              여러분들을 위한
              <br />
              플랜을 선택하세요
            </h1>

            {/* 월간/연간 토글 */}
            <div className="billing-toggle">
              <span
                className={`toggle-label ${
                  billingType === "monthly" ? "active" : ""
                }`}
                onClick={() => handleBillingToggle("monthly")}
              >
                월
              </span>
              <span
                className={`toggle-label ${
                  billingType === "annually" ? "active" : ""
                }`}
                onClick={() => handleBillingToggle("annually")}
              >
                년
              </span>
            </div>
          </div>
        </section>

        {/* 요금제 카드 섹션 */}
        <section className="pricing-plans">
          <div className="pricing-container">
            <div className="plans-grid">
              {pricingPlans.map((plan, index) => (
                <div key={index} className="plan-card">
                  <div className="plan-content">
                    <h2 className="plan-name">{plan.name}</h2>

                    <div className="plan-price">
                      <span className="price-amount">
                        {billingType === "monthly"
                          ? plan.monthlyPrice
                          : plan.annuallyPrice}
                      </span>
                    </div>

                    <p className="plan-subtitle">
                      {billingType === "monthly"
                        ? plan.monthlySubtitle
                        : plan.annuallySubtitle}
                    </p>

                    <div className="plan-icon">
                      <img src={plan.icon} alt={`${plan.name} Plan`} />
                    </div>

                    <button className="select-plan-btn">
                      플랜을 선택해주세요
                    </button>

                    <div className="plan-description">{plan.description}</div>
                  </div>

                  <div className="plan-features">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="feature-item">
                        <svg
                          className="check-icon"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="#10B981"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 요금제 비교 섹션 */}
        <section className="pricing-comparison">
          <div className="comparison-container">
            <div className="comparison-header">
              <h1>모든 플랜을 자세히 비교해보세요</h1>
              <p>
                각 플랜별 제공되는 기능을 한눈에 확인하고 최적의 선택을 하세요
              </p>
            </div>

            <div className="comparison-table">
              {/* 테이블 헤더 */}
              <div className="table-header">
                <div className="empty-column"></div>
                {comparisonPlans.map((plan, index) => (
                  <div key={index} className="plan-column">
                    <h3>{plan.name}</h3>
                    <div className="plan-price">{plan.price}</div>
                    <p className="plan-desc">{plan.desc}</p>
                    <button
                      className={`comparison-btn ${plan.name.toLowerCase()}-btn`}
                    >
                      시작하기
                    </button>
                  </div>
                ))}
              </div>

              {/* 테이블 바디 */}
              <div className="table-body">
                {features.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <div className="feature-section">
                      <div className="section-title">{section.section}</div>
                    </div>

                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="feature-row">
                        <div className="feature-name">{item.name}</div>

                        {/* FREE 컬럼 */}
                        <div className="feature-check">
                          {typeof item.free === "boolean" ? (
                            item.free ? (
                              <svg
                                className="check-icon active"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M20 6L9 17L4 12"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="check-icon inactive"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M18 6L6 18M6 6L18 18"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            )
                          ) : (
                            item.free
                          )}
                        </div>

                        {/* PLUS 컬럼 */}
                        <div className="feature-check">
                          {typeof item.plus === "boolean" ? (
                            item.plus ? (
                              <svg
                                className="check-icon active"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M20 6L9 17L4 12"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="check-icon inactive"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M18 6L6 18M6 6L18 18"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            )
                          ) : (
                            item.plus
                          )}
                        </div>

                        {/* PRO 컬럼 */}
                        <div className="feature-check">
                          {typeof item.pro === "boolean" ? (
                            item.pro ? (
                              <svg
                                className="check-icon active"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M20 6L9 17L4 12"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="check-icon inactive"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M18 6L6 18M6 6L18 18"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            )
                          ) : (
                            item.pro
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export { PricingPage };
