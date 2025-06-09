export function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// 📁 src/utils/scrollUtils.js
/**
 * 스크롤 관련 유틸리티 함수들
 */

/**
 * 요소가 뷰포트에 보이는지 확인
 */
export function isElementInViewport(element, offset = 0) {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return rect.top >= -offset && rect.bottom <= windowHeight + offset;
}

/**
 * 스크롤 진행률 계산
 */
export function calculateScrollProgress(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementHeight = element.offsetHeight;

  // 요소의 상단이 화면 하단에 도달했을 때부터 시작
  const startPoint = windowHeight;
  // 요소의 하단이 화면 상단에 도달했을 때 끝
  const endPoint = -elementHeight;

  const scrolled = startPoint - rect.top;
  const total = startPoint - endPoint;

  return Math.max(0, Math.min(1, scrolled / total));
}

/**
 * 부드러운 스크롤
 */
export function smoothScrollTo(targetPosition, duration = 1000) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  // easeInOutQuad 이징 함수
  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}
