import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <>
      {/* prettier-ignore */}
      <div className="header-wrapper" id="landing">
        <header className="header">
            <div className="header-left">
              <Link to="/main/pricing">가격</Link>
              <Link to="/main/faq">도움 센터</Link>
            </div>

            <div className="header-center">
              <Link to="/index" className="logo">
                <img src="/images/logo_title.png" alt="Logo" />
              </Link>
            </div>

            <div className="header-right">
              <Link to="/user/policies" className="login-btn">회원가입</Link>
              <Link to="/user/login" className="register-btn">로그인</Link>
            </div>
        </header>
      </div>
    </>
  );
};
