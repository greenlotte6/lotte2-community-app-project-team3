import React, { useState, useEffect } from "react";
import { StepItem } from "./StepItem";
import { DemoContent } from "./DemoContent";
import { STEPS_DATA } from "./InteractiveSection.constants";
// import "./InteractiveSection.scss";

const InteractiveSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    // JavaScript 코드를 useEffect 안에 넣기
    const interactiveSection = document.querySelector(".interactive-section");
    const demoContents = document.querySelectorAll(".demo-content");
    const stepItems = document.querySelectorAll(".step-item");

    function updateActiveStep() {
      if (!interactiveSection) return; // 안전 체크

      const sectionTop = interactiveSection.offsetTop;
      const sectionHeight = interactiveSection.offsetHeight;
      const scrolled = window.pageYOffset - sectionTop;
      const windowHeight = window.innerHeight;

      // 스크롤이 섹션에 진입했는지 확인
      if (scrolled < -windowHeight || scrolled > sectionHeight) {
        return; // 섹션 범위를 벗어나면 아무것도 하지 않음
      }

      // 진행률 계산을 더 부드럽게 조정
      const progress = Math.max(
        0,
        Math.min(1, scrolled / (sectionHeight * 0.8))
      );

      // 4단계로 나누기 (더 정확한 계산)
      let currentStep;
      if (progress < 0.25) currentStep = 1;
      else if (progress < 0.5) currentStep = 2;
      else if (progress < 0.75) currentStep = 3;
      else currentStep = 4;

      console.log("Progress:", progress, "Current Step:", currentStep); // 디버깅용

      // React state도 업데이트
      setActiveStep(currentStep);

      // 모든 요소에서 active 클래스 제거
      demoContents.forEach((content) => content.classList.remove("active"));
      stepItems.forEach((item) => item.classList.remove("active"));

      // 현재 단계에 active 클래스 추가
      const activeContent = document.querySelector(
        `[data-step="${currentStep}"]`
      );
      const activeStep = document.querySelector(
        `.step-item[data-step="${currentStep}"]`
      );

      if (activeContent) activeContent.classList.add("active");
      if (activeStep) activeStep.classList.add("active");
    }

    // 스크롤 이벤트 리스너 (throttle 추가로 성능 개선)
    let isScrolling = false;
    function handleScroll() {
      if (!isScrolling) {
        window.requestAnimationFrame(function () {
          updateActiveStep();
          isScrolling = false;
        });
        isScrolling = true;
      }
    }

    // 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);

    // 초기 상태 설정
    updateActiveStep();

    // cleanup function (컴포넌트 언마운트 시 이벤트 리스너 제거)
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // 빈 dependency array = 컴포넌트 마운트 시 한 번만 실행

  // 스텝 클릭했을 때 실행되는 함수 (기존 기능 유지)
  const handleStepClick = (stepNumber) => {
    setActiveStep(stepNumber);
    console.log("Step clicked:", stepNumber);
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

export { InteractiveSection };
