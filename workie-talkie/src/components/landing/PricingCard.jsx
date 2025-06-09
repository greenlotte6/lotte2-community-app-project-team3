import React from "react";
// import "./PricingCard.scss";

const PricingCard = ({ planName, price, subtitle, iconSrc, description }) => {
  return (
    <div className="pricing-card">
      <div className="pricing-card__header">
        <h2 className="pricing-card__name">{planName}</h2>
        <div className="pricing-card__price">{price}</div>
        <p className="pricing-card__subtitle">{subtitle}</p>
      </div>

      <div className="pricing-card__icon">
        <img src={iconSrc} alt={`${planName} Plan`} />
      </div>

      <div className="pricing-card__description">{description}</div>
    </div>
  );
};

export default PricingCard;
