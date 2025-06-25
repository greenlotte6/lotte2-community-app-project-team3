import React from "react";
import { Link } from "react-router-dom";
import { useLoginStore } from "../../stores/useLoginStore";

export const Aside = () => {
  const user = useLoginStore((state) => state.user);
  const hasHydrated = useLoginStore((state) => state._hasHydrated);

  if (!hasHydrated) return null; // 또는 로딩 UI

  console.log("ROLE : " + user?.role);
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
              <Link to="/board/notice">📢공지사항</Link>
            </li>
            <li>
              <Link to="/board/free">💬자유게시판</Link>
            </li>
            <li>
              <Link to="/board/menu">🍱식단표</Link>
            </li>
            <li>
              <Link to="/board/write">📋글 작성</Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
