import React from "react";

export const Aside = () => {
  return (
    <>
      <aside className="sidebar">
        <h2>📂 드라이브</h2>
        <ul>
          <li className="active">⭐ 내 드라이브</li>
          <li>공유 드라이브</li>
          <li>최근 사용</li>
          <li>🗑️ 휴지통</li>
        </ul>
      </aside>
    </>
  );
};
