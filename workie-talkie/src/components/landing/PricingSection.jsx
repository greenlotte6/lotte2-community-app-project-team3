import React from "react";
import PricingCard from "./PricingCard";
import { PRICING_PLANS } from "./PricingSection.constants";
// import "./PricingSection.scss";

const PricingSection = () => {
  return (
    <section className="pricing-section">
      <div className="pricing-section__container">
        <div className="pricing-section__header">
          <h1>요금은 0원부터, 지금 시작하세요!</h1>
          <a href="/main/pricing.html" className="pricing-section__compare-btn">
            가격 비교하러 가기 →
          </a>
        </div>

        <div className="pricing-section__cards">
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

export default PricingSection;
