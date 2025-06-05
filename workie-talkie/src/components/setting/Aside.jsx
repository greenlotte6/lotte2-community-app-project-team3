import React from "react";
import { Link } from "react-router-dom";

export const Aside = () => {
  return (
    <>
      <aside className="sidebar">
        <div>
          <div className="section-title">SETTINGS</div>
          <ul>
            <li>
              <Link to="/setting/profile">👤프로필</Link>
            </li>
            <li>
              <Link to="/setting/page">📄페이지</Link>
            </li>
            <li>
              <Link to="/setting/message">💬메시지</Link>
            </li>
            <li>
              <Link to="/setting/calendar">📅캘린더</Link>
            </li>
            <li>
              <Link to="/setting/project">📁프로젝트</Link>
            </li>
            <li>
              <Link to="/setting/drive">🗂️드라이브</Link>
            </li>
            <li>
              <Link to="/setting/board">📝게시판</Link>
            </li>
            <li>
              <Link to="/setting/plan">💳요금제</Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
