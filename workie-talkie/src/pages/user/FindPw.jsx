import React, { useState } from "react";
import { LandingLayout } from "../../layouts/LandingLayout";
import { useNavigate } from "react-router-dom";

export const FindPw = () => {
  const [activeTab, setActiveTab] = useState("email");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const navigate = useNavigate();

  const handleConfirm = () => {
    // ... 아이디/비밀번호 찾기 로직 수행
    const foundId = "someUser123"; // 찾은 아이디 (실제로는 API 결과)
    // 만약 아이디를 찾았다면
    navigate("/user/findResult", {
      state: { foundId: foundId, activeTab: "id" },
    });
    // 만약 비밀번호 재설정 대상 이메일을 찾았다면
    // navigate('/find/result', { state: { targetEmail: 'user@example.com', activeTab: 'password' } });
  };

  return (
    <LandingLayout>
      <div id="findPw">
        <div class="container">
          <h2>비밀번호를 찾기 위한 수단을 선택해주세요.</h2>

          <div class="tab-buttons">
            <div
              className={`tab-button ${activeTab === "hp" ? "active" : ""}`}
              onClick={() => handleTabChange("hp")}
            >
              휴대폰 번호로 찾기
            </div>

            <div
              className={`tab-button ${activeTab === "email" ? "active" : ""}`}
              onClick={() => handleTabChange("email")}
            >
              개인 이메일로 찾기
            </div>
          </div>

          <div class="tab-content active" id="emailContent">
            <div class="input-group">
              <label for="accountInput">계정</label>
              <div class="input-field">
                <input
                  type="text"
                  id="accountInput"
                  placeholder="아이디 입력"
                />
              </div>
            </div>

            <div className="tab-content">
              {activeTab === "email" && (
                <>
                  <div className="input-group">
                    <label htmlFor="emailInput">이메일</label>
                    <div className="input-field">
                      <input
                        type="email"
                        id="emailInput"
                        placeholder="등록한 개인 이메일"
                      />
                      <button>인증</button>
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="verificationCode">인증 번호</label>
                    <div className="input-field">
                      <input type="text" id="verificationCode" placeholder="" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === "hp" && (
                <div className="tab-content">
                  <p>휴대폰 번호로 찾는 기능은 준비 중입니다.</p>
                </div>
              )}

              <div class="actions">
                <button class="btn-cancel">취소</button>
                <button class="btn-confirm" onClick={handleConfirm}>
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};
