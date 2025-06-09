import React from "react";
// import "./StepItem.scss";

const StepItem = ({ stepNumber, title, description, isActive, onClick }) => {
  return (
    <div
      className={`step-item ${isActive ? "step-item--active" : ""}`}
      data-step={stepNumber}
      onClick={() => onClick(stepNumber)}
    >
      <div className="step-item__number">{stepNumber}</div>
      <div className="step-item__content">
        <div className="step-item__title">{title}</div>
        <div className="step-item__description">{description}</div>
      </div>
    </div>
  );
};

export default StepItem;
