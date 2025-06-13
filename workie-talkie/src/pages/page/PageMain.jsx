import React, { useEffect } from "react"; // useEffect 훅을 임포트
import { MainLayout } from "../../layouts/MainLayout";
import { Link } from "react-router-dom";
import { Aside } from "../../components/page/Aside";

export const PageMain = () => {
  // useEffect 훅을 사용하여 DOMContentLoaded와 유사한 기능 구현
  useEffect(() => {
    // Collapsible Sidebar Sections (for Notion-style sidebar)
    // QuerySelectorAll은 NodeList를 반환하므로 forEach를 사용
    document
      .querySelectorAll(".notion-style-sidebar .section-title")
      .forEach((title) => {
        const handleClick = () => {
          // 이벤트 리스너 함수를 분리하여 메모리 누수 방지
          const targetId = title.dataset.target;
          const content = document.getElementById(targetId);
          if (content) {
            content.classList.toggle("collapsed");
            title.classList.toggle("collapsed");
          }
        };

        title.addEventListener("click", handleClick);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거 (클린업 함수)
        return () => {
          title.removeEventListener("click", handleClick);
        };
      });
  }, []); // 빈 의존성 배열은 컴포넌트가 처음 마운트될 때 한 번만 실행됨을 의미

  const samplePages = [
    {
      id: 1,
      title: "팀 회의록",
      updatedAt: "2025-06-11",
      tags: ["회의", "업무"],
      shared: true,
      owner: "혜수",
    },
    {
      id: 2,
      title: "기획안 초안",
      updatedAt: "2025-06-10",
      tags: ["기획", "초안"],
      shared: false,
      owner: "혜수",
    },
    {
      id: 3,
      title: "고객 응대 매뉴얼",
      updatedAt: "2025-06-09",
      tags: ["고객", "매뉴얼"],
      shared: true,
      owner: "혜수",
    },
  ];

  const favoritePages = [
    {
      id: 1,
      title: "팀 회의록",
      updatedAt: "2025-06-11",
      tags: ["회의", "업무"],
      shared: true,
      owner: "혜수",
    },
    {
      id: 2,
      title: "기획안 초안",
      updatedAt: "2025-06-10",
      tags: ["기획", "초안"],
      shared: false,
      owner: "혜수",
    },
    {
      id: 3,
      title: "고객 응대 매뉴얼",
      updatedAt: "2025-06-09",
      tags: ["고객", "매뉴얼"],
      shared: true,
      owner: "혜수",
    },
  ];

  return (
    <MainLayout>
      <main className="main-content" id="page">
        <div className="main-content-wrapper">
          <div className="notion-style-sidebar">
            <Aside />
          </div>

          <div className="main-editor-area">
            <div className="page-header">
              <h1>페이지 목록</h1>
              <Link to="/page/new">
                <button className="btn">새 페이지 생성</button>
              </Link>
            </div>
            <h3>최근 방문</h3>
            <div className="page-grid">
              {samplePages.map((page) => (
                <div className="page-card" key={page.id}>
                  <div className="card-header">
                    <h3>{page.title}</h3>
                    {page.shared && <span className="tag shared">공유됨</span>}
                  </div>
                  <div className="card-body">
                    <p>작성자: {page.owner}</p>
                    <p>수정일: {page.updatedAt}</p>
                    <div className="tag-list">
                      {page.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <h3> 즐겨찾는 페이지</h3>
            <div className="page-grid">
              {favoritePages.map((page) => (
                <div className="page-card" key={page.id}>
                  <div className="card-header">
                    <h3>{page.title}</h3>
                    <span className="tag favorite">★ 즐겨찾기</span>
                  </div>
                  <div className="card-body">
                    <p>작성자: {page.owner}</p>
                    <p>수정일: {page.updatedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};
