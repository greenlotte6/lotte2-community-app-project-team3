import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <>
      {/* prettier-ignore */}
      <div className="header-wrapper" id="landing">
        <header className="header">
            <div className="header-left">
              <Link to="/main/pricing.html">가격</Link>
              <Link to="/main/faq.html">도움 센터</Link>
            </div>

            <div className="header-center">
              <Link to="/index.html" className="logo">
                <img src="/images/logo_title.png" alt="Logo" />
              </Link>
            </div>

            <div className="header-right">
              <Link to="#login" className="login-btn">로그인</Link>
            </div>
        </header>
      </div>
    </>
  );
};
