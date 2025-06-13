import React, { useEffect } from "react"; // useEffect 훅을 임포트
import { MainLayout } from "../../layouts/MainLayout";
import { Link } from "react-router-dom";
import { Aside } from "../../components/page/Aside";
import { getPage } from "../../api/userAPI";
//사이드바 타이틀 누르면 숨겨지는거도 해보기!

export const PageMain = (pages, setPages) => {
  useEffect(() => {
    const loadPages = async () => {
      try {
        const data = await getPage();
        console.log(data);

        const converted = data.map((item) => ({
          id: item.pno,
          title: item.title,
          content: item.content,
        }));

        setPages(converted);
      } catch (err) {
        console.error("페이지 불러오기 실패", err);
      }
    };

    loadPages();
  }, []);

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
