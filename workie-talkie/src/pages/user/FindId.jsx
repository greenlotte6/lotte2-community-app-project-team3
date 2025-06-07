import React, { useState } from "react";
import { LandingLayout } from "../../layouts/LandingLayout";
import { useNavigate } from "react-router-dom";

export const FindId = () => {
  const [activeTab, setActiveTab] = useState("email");
  const [emailInput, setEmailInput] = useState(""); // 이메일 입력 상태
  const [verificationCode, setVerificationCode] = useState(""); // 인증 번호 입력 상태

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const navigate = useNavigate();

  const handleConfirm = () => {
    if (emailInput.trim() === "") {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (verificationCode.trim() === "") {
      alert("인증 번호를 입력해주세요.");
      return;
    }

    if (verificationCode !== "123456") {
      alert("인증 번호가 올바르지 않습니다.");
      return;
    }

    const foundId = "user_" + emailInput.split("@")[0];

    navigate("/user/findResult", {
      state: { foundId: foundId, activeTab: "id" },
    });
  };

  const handleVerifyEmail = () => {
    if (emailInput.trim() === "") {
      alert("이메일을 입력해주세요.");
      return;
    }
    // TODO: 여기에 이메일로 인증 번호를 보내는 API 호출 로직을 추가하세요.
    alert(`${emailInput}으로 인증 번호가 발송되었습니다.`);
    // 실제로는 서버 응답에 따라 성공/실패 처리
  };

  return (
    <LandingLayout>
      <div id="findId">
        {/* 'class' 대신 'className' 사용 */}
        <div className="container">
          <h2>ID를 찾기 위한 수단을 선택해주세요.</h2>
          <div className="tab-buttons">
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
          <div className="tab-area">
            {activeTab === "email" && (
              <div className="email-content">
                <div className="input-group">
                  <label htmlFor="emailInput">이메일</label>
                  <div className="input-field">
                    <input
                      type="email"
                      id="emailInput"
                      placeholder="등록한 개인 이메일"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                    <button onClick={handleVerifyEmail}>인증</button>
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="verificationCode">인증 번호</label>
                  <div className="input-field">
                    <input
                      type="text"
                      id="verificationCode"
                      placeholder="인증 번호 입력" // placeholder 변경
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "hp" && (
              <div className="hp-content">
                {" "}
                {/* hp 탭 전용 컨테이너 */}
                <p>휴대폰 번호로 찾는 기능은 준비 중입니다.</p>
              </div>
            )}
          </div>{" "}
          {/* End of .tab-area */}
          {/* .actions 버튼들을 tab-area 밖으로 빼냅니다. */}
          <div className="actions">
            <button className="btn-cancel">취소</button>
            <button className="btn-confirm" onClick={handleConfirm}>
              확인
            </button>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};
