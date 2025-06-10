import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/header.scss";
import { useLoginStore } from "../../stores/useLoginStore";

export const Header = () => {
  const user = useLoginStore((state) => state.user);
  const navigate = useNavigate();
  const logout = useLoginStore((state) => state.logout);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout(); // 상태에서 user 제거
    navigate("/user/login");
  };

  const handleStatusChange = () => {
    alert("상태 변경 처리 로직 실행"); // 예: ONLINE/OFFLINE 상태 변경
  };
  return (
    <>
      <div className="header">
        {/* prettier-ignore */}
        <div className="header-logo">
        <Link to="/dashboard/main">
          <img src="/images/logo_noback(withoutLettter).png" alt="로고이미지" />
          <img src="/images/logo_title.png" className="logo-title" alt="로고타이틀" />
        </Link>
      </div>

        {/* prettier-ignore */}
        <div className="memu">
        <Link to="/board/main"><img src="/images/header/board.png" alt="게시판" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
        <Link to="/chat"><img src="/images/header/chat.png" alt="메세지" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
        <Link to="/calendar"><img src="/images/header/calendar.png" alt="캘린더" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
        <Link to="/project"><img src="/images/header/project.png" alt="프로젝트" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
        <Link to="/page/pageMain"><img src="/images/header/page.png" alt="페이지" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
        <Link to="/drive"><img src="/images/header/drive.png" alt="드라이브" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
        <Link to="/setting/profile"><img src="/images/header/settings.png" alt="설정" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
      </div>

        <>
          <span className="status">
            ONLINE <span>●</span>
          </span>
          <div className="dropdown-container">
            <img
              src="/images/profile1.png"
              alt="프로필이미지"
              className="logout-icon"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={handleStatusChange}>
                  상태 변경
                </div>
                <div className="dropdown-item" onClick={handleLogout}>
                  로그아웃
                </div>
              </div>
            )}
          </div>
          <span className="admin">
            {user?.name}
            <br />
            {user?.position}
          </span>
        </>
      </div>
    </>
  );
};
