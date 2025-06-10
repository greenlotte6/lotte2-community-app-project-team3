import React from "react";

export const Aside = ({ activeTab, setActiveTab }) => {
  const tabs = ["⭐ 내 드라이브", "공유 드라이브", "최근 사용", "🗑️ 휴지통"];

  return (
    <aside className="sidebar">
      <h2>📂 드라이브</h2>
      <ul>
        {tabs.map((tab) => (
          <li
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </aside>
  );
};
