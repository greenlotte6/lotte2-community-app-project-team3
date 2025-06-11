import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLoginStore } from "../../stores/useLoginStore"; // 실제 경로에 맞게 수정 필요

export const Header = () => {
  const user = useLoginStore((state) => state.user);
  const isLoggedIn = !!user;

  const handleLogout = () => {
    useLoginStore.getState().logout();
  };

  return (
    <>
      {/* prettier-ignore */}
      <div className="header-wrapper" id="landing">
        <header className="header">
            <div className="header-left">
              <Link to="/pricing">가격</Link>
              <Link to="/faq">도움 센터</Link>
            </div>

            <div className="header-center">
              <Link to="/" className="logo">
                <img src="/images/logo_title.png" alt="Logo" />
              </Link>
            </div>

            <div className="header-right">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard/main" className="register-btn">MY</Link>
                  <Link to="/user/login" className="register-btn" onClick={handleLogout}>로그아웃</Link>
                </>
              ) : (
                <>
                  <Link to="/user/policies" className="login-btn">회원가입</Link>
                  <Link to="/user/login" className="register-btn">로그인</Link>
                </>
              )}

            </div>
        </header>
      </div>
    </>
  );
};
