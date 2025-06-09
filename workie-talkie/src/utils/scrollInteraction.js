export class ScrollInteraction {
  constructor(options = {}) {
    this.sectionSelector = options.sectionSelector || ".interactive-section";
    this.contentSelector = options.contentSelector || ".demo-content";
    this.stepSelector = options.stepSelector || ".step-item";
    this.totalSteps = options.totalSteps || 4;
    this.onStepChange = options.onStepChange || null;

    this.isScrolling = false;
    this.currentStep = 1;

    this.init();
  }

  init() {
    this.interactiveSection = document.querySelector(this.sectionSelector);
    this.demoContents = document.querySelectorAll(this.contentSelector);
    this.stepItems = document.querySelectorAll(this.stepSelector);

    if (!this.interactiveSection) {
      console.warn("Interactive section not found");
      return;
    }

    this.bindEvents();
    this.updateActiveStep();
  }

  bindEvents() {
    // 스크롤 이벤트 리스너 (throttle 추가로 성능 개선)
    window.addEventListener("scroll", () => {
      if (!this.isScrolling) {
        window.requestAnimationFrame(() => {
          this.updateActiveStep();
          this.isScrolling = false;
        });
        this.isScrolling = true;
      }
    });
  }

  updateActiveStep() {
    const sectionTop = this.interactiveSection.offsetTop;
    const sectionHeight = this.interactiveSection.offsetHeight;
    const scrolled = window.pageYOffset - sectionTop;
    const windowHeight = window.innerHeight;

    // 스크롤이 섹션에 진입했는지 확인
    if (scrolled < -windowHeight || scrolled > sectionHeight) {
      return; // 섹션 범위를 벗어나면 아무것도 하지 않음
    }

    // 진행률 계산을 더 부드럽게 조정
    const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight * 0.8)));

    // 4단계로 나누기 (더 정확한 계산)
    let newStep;
    if (progress < 0.25) newStep = 1;
    else if (progress < 0.5) newStep = 2;
    else if (progress < 0.75) newStep = 3;
    else newStep = 4;

    // 스텝이 변경된 경우에만 업데이트
    if (newStep !== this.currentStep) {
      this.currentStep = newStep;
      this.setActiveElements(newStep);

      // 콜백 함수가 있으면 호출
      if (this.onStepChange) {
        this.onStepChange(newStep);
      }
    }
  }

  setActiveElements(step) {
    // 모든 요소에서 active 클래스 제거
    this.demoContents.forEach((content) => content.classList.remove("active"));
    this.stepItems.forEach((item) => item.classList.remove("active"));

    // 현재 단계에 active 클래스 추가
    const activeContent = document.querySelector(`[data-step="${step}"]`);
    const activeStep = document.querySelector(
      `.step-item[data-step="${step}"]`
    );

    if (activeContent) activeContent.classList.add("active");
    if (activeStep) activeStep.classList.add("active");
  }

  // 수동으로 스텝 변경
  goToStep(step) {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
      this.setActiveElements(step);

      if (this.onStepChange) {
        this.onStepChange(step);
      }
    }
  }

  // 인스턴스 정리
  destroy() {
    // 이벤트 리스너 제거는 React useEffect cleanup에서 처리
  }
}
