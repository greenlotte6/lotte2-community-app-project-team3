import React from "react";
// import "./DemoContent.scss";

const DemoContent = ({ stepNumber, imageSrc, isActive }) => {
  return (
    <div
      className={`demo-content ${isActive ? "active" : ""}`}
      data-step={stepNumber}
    >
      <div className="demo-visual">
        <img className="demo-img" src={imageSrc} alt={`Demo ${stepNumber}`} />
      </div>
    </div>
  );
};

export { DemoContent };
