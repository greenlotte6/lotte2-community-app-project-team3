import React from "react";
import StepItem from "./StepItem";
import DemoContent from "./DemoContent";
import { STEPS_DATA } from "./InteractiveSection.constants";
import { useScrollInteraction } from "../../hooks/useScrollInteraction";
// import "./InteractiveSection.scss";

const InteractiveSection = () => {
  // 커스텀 훅 사용
  const { activeStep, goToStep } = useScrollInteraction({
    sectionSelector: ".interactive-section",
    contentSelector: ".demo-content",
    stepSelector: ".step-item",
    totalSteps: 4,
    onStepChange: (step) => {
      console.log("Step changed to:", step);
    },
  });

  const handleStepClick = (stepNumber) => {
    goToStep(stepNumber);
  };

  return (
    <section className="interactive-section">
      <div className="sticky-container">
        <div className="content-wrapper">
          <div className="demo-box">
            {STEPS_DATA.map((step) => (
              <DemoContent
                key={step.number}
                stepNumber={step.number}
                imageSrc={step.image}
                isActive={activeStep === step.number}
              />
            ))}
          </div>

          <div className="steps-container">
            {STEPS_DATA.map((step) => (
              <StepItem
                key={step.number}
                stepNumber={step.number}
                title={step.title}
                description={step.description}
                isActive={activeStep === step.number}
                onClick={handleStepClick}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveSection;
