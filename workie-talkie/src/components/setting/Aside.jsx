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
          <div className="section-title">SETTINGS</div>
          <ul>
            <li>
              <Link to="/setting/profile">👤프로필</Link>
            </li>
            <li>
              <Link to="/setting/message">💬메시지</Link>
            </li>
            <li>
              <Link to="/setting/calendar">📅캘린더</Link>
            </li>
            <li>
              <Link to="/setting/page">📄페이지</Link>
            </li>
            <li>
              <Link to="/setting/drive">🗂️드라이브</Link>
            </li>

            {/* 관리자 전용 메뉴 */}
            {user?.role === "ROLE_ADMIN" && (
              <>
                <li>
                  <Link to="/setting/member">📋회원관리</Link>
                </li>
                <li>
                  <Link to="/setting/project">📁프로젝트</Link>
                </li>
                <li>
                  <Link to="/setting/board">📝게시판</Link>
                </li>
                <li>
                  <Link to="/setting/plan">💳요금제</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};
