import React from "react";
import { Link } from "react-router-dom";

export const Aside = () => {
  return (
    <>
      <aside className="sidebar">
        <div>
          <div class="section-title">BOARDS</div>
          <ul>
            <li>
              <Link to="/board/main">🏠메인</Link>
            </li>
            <li>
              <Link to="/board/board">📢공지사항</Link>
            </li>
            <li>
              <Link to="/board/board">💬자유게시판</Link>
            </li>
            <li>
              <Link to="/board/board">🍱식단표</Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
