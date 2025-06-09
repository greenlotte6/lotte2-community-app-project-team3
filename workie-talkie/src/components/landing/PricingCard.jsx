import React from "react";
// import "./PricingCard.scss";

const PricingCard = ({ planName, price, subtitle, iconSrc, description }) => {
  return (
    <div className="pricing-card">
      <div className="plan-header">
        {" "}
        {/* pricing-card__header → plan-header */}
        <h2 className="pricing-card__name">{planName}</h2> {/* 이건 그대로 */}
        <div className="price">{price}</div> {/* pricing-card__price → price */}
        <p className="plan-subtitle">{subtitle}</p>{" "}
        {/* pricing-card__subtitle → plan-subtitle */}
      </div>
      <div className="plan-icon">
        {" "}
        {/* pricing-card__icon → plan-icon */}
        <img src={iconSrc} alt={`${planName} Plan`} />
      </div>
      <div className="plan-description">{description}</div>{" "}
      {/* pricing-card__description → plan-description */}
    </div>
  );
};

export { PricingCard };
