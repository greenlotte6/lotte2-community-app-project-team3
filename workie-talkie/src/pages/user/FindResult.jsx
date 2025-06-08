import React, { useState } from "react";
import { LandingLayout } from "../../layouts/LandingLayout";
import { Link } from "react-router-dom";

export const FindResult = () => {
  const [activeTab, setActiveTab] = useState("id"); // 기본 탭은 아이디 결과
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  // 여기서는 실제 찾은 아이디나 재설정할 아이디/이메일 데이터를 받아온다고 가정합니다.
  // 실제 애플리케이션에서는 API 호출을 통해 이 데이터를 받아와야 합니다.
  const foundId = "user123"; // 예시 아이디
  const targetEmail = "example@email.com"; // 예시 이메일 (비밀번호 찾기 시 사용)

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const togglePasswordVisibility = (type) => {
    if (type === "newPassword") setShowNewPassword((prev) => !prev);
    if (type === "newPasswordConfirm")
      setShowNewPasswordConfirm((prev) => !prev);
  };

  const handlePasswordReset = () => {
    if (newPassword.length < 8 || newPassword !== newPasswordConfirm) {
      alert(
        "새 비밀번호는 최소 8자 이상이어야 하며, 비밀번호 확인과 일치해야 합니다."
      );
      return;
    }
    // 여기에 새 비밀번호 설정 API 호출 로직을 추가합니다.
    // 성공 시 알림 후 로그인 페이지로 이동
    alert("비밀번호가 성공적으로 변경되었습니다! 로그인 페이지로 이동합니다.");
    window.location.href = "/login"; // React Router의 navigate를 사용하는 것이 더 좋습니다.
  };

  return (
    <LandingLayout>
      <div id="findResult">
        <div className="container">
          <h2>아이디/비밀번호 찾기 결과</h2>

          <div className="tab-buttons">
            <div
              className={`tab-button ${activeTab === "id" ? "active" : ""}`}
              onClick={() => handleTabChange("id")}
            >
              아이디 찾기 결과
            </div>
            <div
              className={`tab-button ${
                activeTab === "password" ? "active" : ""
              }`}
              onClick={() => handleTabChange("password")}
            >
              비밀번호 재설정
            </div>
          </div>

          <div className="tab-content-area">
            {" "}
            {/* 탭 콘텐츠를 감싸는 영역 */}
            {activeTab === "id" && (
              <div className="id-result-content">
                <p>회원님의 아이디는 아래와 같습니다.</p>
                <div className="result-box">
                  <strong>{foundId}</strong>
                </div>
                <p className="note">위 아이디로 로그인해주세요.</p>
                <Link to="/login">
                  <button className="go-login-btn">로그인 페이지로</button>
                </Link>
              </div>
            )}
            {activeTab === "password" && (
              <div className="password-reset-content">
                <p>{targetEmail} 계정의 새 비밀번호를 설정해주세요.</p>

                <div className="input-group">
                  <label htmlFor="newPassword">새 비밀번호</label>
                  <div className="input-field">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="새 비밀번호 (8자 이상)"
                    />
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() => togglePasswordVisibility("newPassword")}
                    >
                      {showNewPassword ? "숨기기" : "보기"}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="newPasswordConfirm">새 비밀번호 확인</label>
                  <div className="input-field">
                    <input
                      type={showNewPasswordConfirm ? "text" : "password"}
                      id="newPasswordConfirm"
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      placeholder="새 비밀번호 다시 입력"
                    />
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() =>
                        togglePasswordVisibility("newPasswordConfirm")
                      }
                    >
                      {showNewPasswordConfirm ? "숨기기" : "보기"}
                    </button>
                  </div>
                </div>

                <div className="actions">
                  <button
                    className="btn-reset-password"
                    onClick={handlePasswordReset}
                  >
                    비밀번호 재설정
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};
