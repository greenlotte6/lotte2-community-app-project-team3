import React from "react";
// import "./StepItem.scss";

const StepItem = ({ stepNumber, title, description, isActive, onClick }) => {
  return (
    <div
      className={`step-item ${isActive ? "active" : ""}`}
      data-step={stepNumber}
      onClick={() => onClick(stepNumber)}
    >
      <div className="step-number">{stepNumber}</div>
      <div className="step-content">
        <div className="step-title">{title}</div>
        <div className="step-description">{description}</div>
      </div>
    </div>
  );
};

export { StepItem };
