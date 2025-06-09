import React from "react";
// import "./DemoContent.scss";

const DemoContent = ({ stepNumber, imageSrc, isActive }) => {
  return (
    <div
      className={`demo-content ${isActive ? "demo-content--active" : ""}`}
      data-step={stepNumber}
    >
      <div className="demo-content__visual">
        <img
          className="demo-content__img"
          src={imageSrc}
          alt={`Demo ${stepNumber}`}
        />
      </div>
    </div>
  );
};

export default DemoContent;
