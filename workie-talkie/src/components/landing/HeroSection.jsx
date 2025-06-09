import React from "react";
// import "./HeroSection.scss";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <h1>
        즐거운 일터
        <br />
        소통은 빠르게
        <br />
        기록은 확실하게
      </h1>

      <p>
        워키토키를 처음 사용하시는 고객에게는 PRO 버전 3개월 무료 이용권을
        드립니다.
      </p>

      <a href="#project" className="hero-section__cta">
        프로젝트 시작하기
      </a>
    </section>
  );
};

export default HeroSection;
