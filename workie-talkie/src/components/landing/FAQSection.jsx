import React from "react";
// import "./FAQSection.scss";

const FAQSection = () => {
  return (
    <section className="faq-section">
      <div className="faq-section__container">
        <div className="faq-section__content">
          <div className="faq-section__text">
            <h1>비즈니스 고객 제보</h1>
            <p>
              워키토키를 이용하는 중 불편함을 느끼셨나요? <br />
              지금 바로 알려주세요
            </p>
            <a href="/main/faq.html" className="faq-section__button">
              고객센터
            </a>
          </div>
          <div className="faq-section__image">
            <img src="/images/main/faq-icon.png" alt="고객 지원" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
