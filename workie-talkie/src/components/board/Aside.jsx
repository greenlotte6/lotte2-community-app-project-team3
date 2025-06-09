import React from "react";
import { Link } from "react-router-dom";

export const Aside = () => {
  return (
    <>
      <aside className="sidebar">
        <div>
          <div className="section-title">BOARDS</div>
          <ul>
            <li>
              <Link to="/board/main">🏠메인</Link>
            </li>
            <li>
              <Link to="/board/list">📢공지사항</Link>
            </li>
            <li>
              <Link to="/board/list">💬자유게시판</Link>
            </li>
            <li>
              <Link to="/board/list">🍱식단표</Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
