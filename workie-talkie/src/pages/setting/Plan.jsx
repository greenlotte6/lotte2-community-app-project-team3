import React from "react";
import { SettingLayout } from "../../layouts/SettingLayout";

export const Plan = () => {
  return (
    <SettingLayout>
      <main className="main-content" id="plan-container">
        <article className="main-content">
          <section className="pricing-section">
            <div className="pricing-container">
              <div className="pricing-header">
                <h1>회사를 위한 더 좋은 선택✔️</h1>
              </div>

              <div className="pricing-cards">
                <div className="pricing-card">
                  <div className="plan-header">
                    <h2>FREE</h2>
                    <div className="price">0원</div>
                    <p className="plan-subtitle">무료</p>
                  </div>

                  <div className="plan-icon">
                    <img
                      src="/images/main/aAF5devxEdbNPNiF_Gold.png"
                      alt="FREE Plan"
                    />
                  </div>

                  <div className="plan-description">
                    무료 플랜: 기본 기능 체험
                  </div>
                  <button className="choice">
                    <p>요금제 변경하기</p>
                  </button>
                </div>

                <div className="pricing-card">
                  <div className="plan-header">
                    <h2>PLUS</h2>
                    <div className="price">9,900원/달</div>
                    <p className="plan-subtitle">연간 결제 시 20% 할인</p>
                  </div>

                  <div className="plan-icon">
                    <img
                      src="/images/main/aAF5sOvxEdbNPNiH_Platinum.png"
                      alt="PLUS Plan"
                    />
                  </div>

                  <div className="plan-description">
                    소규모 팀을 위한 협업 도구와 확장된 기능
                  </div>
                  <button className="choice">
                    <p>요금제 변경하기</p>
                  </button>
                </div>

                <div className="pricing-card">
                  <div className="plan-header">
                    <h2>PRO</h2>
                    <div className="price">29,000원/달</div>
                    <p className="plan-subtitle">연간 결제 시 20% 할인</p>
                  </div>

                  <div className="plan-icon">
                    <img
                      src="/images/main/aAF5yOvxEdbNPNiJ_Diamond.png"
                      alt="PRO Plan"
                    />
                  </div>

                  <div className="plan-description">
                    대규모 조직을 위한 프리미엄 지원과 고급 기능
                  </div>
                  <button className="choice">
                    <p>요금제 변경하기</p>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
    </SettingLayout>
  );
};
