import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <>
      <div className="header">
        {/* prettier-ignore */}
        <div className="header-logo">
        <Link to="/dashboard/dashboard">
          <img src="/images/logo_noback(withoutLettter).png" alt="로고이미지" />
          <img src="/images/logo_title.png" className="logo-title" alt="로고타이틀" />
        </Link>
      </div>

        {/* prettier-ignore */}
        <div className="memu">
        <Link to="/board/main"><img src="/images/header/board.png" alt="게시판" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
        <Link to="/chat/main"><img src="/images/header/chat.png" alt="메세지" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
        <Link to="/calender/calender"><img src="/images/header/calendar.png" alt="캘린더" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
        <Link to="/project/main"><img src="/images/header/project.png" alt="프로젝트" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
        <Link to="/page/pageMain"><img src="/images/header/page.png" alt="페이지" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
        <Link to="/drive/drive"><img src="/images/header/drive.png" alt="드라이브" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
        <Link to="/setting/profile"><img src="/images/header/settings.png" alt="설정" className="memu-icon" /></Link>
        <div className="vertical-divider"></div>
        <img src="/images/off.png" alt="로그아웃" className="logout" />
        <div className="vertical-divider"></div>
      </div>

        {/* prettier-ignore */}
        <>
        <span className="status">ONLINE <span>●</span></span>
        <img src="/images/profile1.png" alt="프로필이미지" />
        <span className="admin">김팀장<br />Admin</span>
        </>
      </div>
    </>
  );
};
