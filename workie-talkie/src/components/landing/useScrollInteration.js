import { useEffect, useRef, useState } from "react";
import { ScrollInteraction } from "../utils/scrollInteraction";

/**
 * 스크롤 인터랙션 커스텀 훅
 */
export const useScrollInteraction = (options = {}) => {
  const [activeStep, setActiveStep] = useState(1);
  const scrollInteractionRef = useRef(null);

  useEffect(() => {
    // 스크롤 인터랙션 인스턴스 생성
    scrollInteractionRef.current = new ScrollInteraction({
      ...options,
      onStepChange: (step) => {
        setActiveStep(step);
        // 사용자 정의 콜백이 있으면 호출
        if (options.onStepChange) {
          options.onStepChange(step);
        }
      },
    });

    // cleanup 함수
    return () => {
      if (scrollInteractionRef.current) {
        scrollInteractionRef.current.destroy();
      }
    };
  }, []);

  // 수동으로 스텝 변경하는 함수
  const goToStep = (step) => {
    if (scrollInteractionRef.current) {
      scrollInteractionRef.current.goToStep(step);
    }
  };

  return { activeStep, goToStep };
};
