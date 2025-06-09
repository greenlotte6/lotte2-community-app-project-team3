import React from "react";
import { PricingCard } from "./PricingCard";
import { PRICING_PLANS } from "./PricingSection.constants";
// import "./PricingSection.scss";

const PricingSection = () => {
  return (
    <section className="pricing-section">
      <div className="pricing-container">
        {" "}
        {/* __container 제거 */}
        <div className="pricing-header">
          {" "}
          {/* __header 제거 */}
          <h1>요금은 0원부터, 지금 시작하세요!</h1>
          <a href="/main/pricing.html" className="compare-button">
            {" "}
            {/* 클래스명 변경 */}
            가격 비교하러 가기 →
          </a>
        </div>
        <div className="pricing-cards">
          {" "}
          {/* __cards 제거 */}
          {PRICING_PLANS.map((plan, index) => (
            <PricingCard
              key={index}
              planName={plan.name}
              price={plan.price}
              subtitle={plan.subtitle}
              iconSrc={plan.icon}
              description={plan.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { PricingSection };
