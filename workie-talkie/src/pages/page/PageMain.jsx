import React, { useEffect, useState } from "react"; // useEffect 훅을 임포트
import { MainLayout } from "../../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { Aside } from "../../components/page/Aside";
import { getPage } from "../../api/userAPI";
import { useLoginStore } from "../../stores/useLoginStore";
import { PAGE_FAVORITE } from "../../api/http";
//사이드바 타이틀 누르면 숨겨지는거도 해보기!

export const PageMain = () => {
  const user = useLoginStore((state) => state.user);
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // 2자리
    const day = ("0" + date.getDate()).slice(-2);
    let hour = date.getHours();
    const minute = ("0" + date.getMinutes()).slice(-2);
    const second = ("0" + date.getSeconds()).slice(-2);
    const period = hour < 12 ? "오전" : "오후";
    hour = hour % 12 || 12; // 12시간제로 변환

    return `${year}-${month}-${day} ${period} ${hour}:${minute}:${second}`;
  };

  useEffect(() => {
    if (!user) {
      navigate("/user/login");
      return;
    }

    getPage()
      .then((data) => {
        console.log(data);
        setPages(data);
      })
      .catch((err) => {
        console.log(err);
        console.error("페이지 불러오기 실패", err);
      });
  }, [user, navigate]);

  const toggleFavorite = async (pno) => {
    // 페이지 복사 후 업데이트
    const updatedPages = pages.map((page) =>
      page.pno === pno ? { ...page, favorite: !page.favorite } : page
    );
    setPages(updatedPages);

    try {
      await fetch(`${PAGE_FAVORITE}/${pno}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          favorite: updatedPages.find((p) => p.pno === pno).favorite,
        }),
      });
    } catch (error) {
      console.error("서버에 즐겨찾기 상태 반영 실패", error);
      // 실패 시 롤백 (옵션)
    }
  };

  return user ? (
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
              {pages.map((page) => (
                <div className="page-card tooltip-wrapper" key={page.pno}>
                  <div className="card-header">
                    <div className="status-bar">
                      {/* 콘솔에 실제로 찍히는 명? 이름으로 조건 걸어야 함! */}
                      {page.shared && (
                        <span className="tag shared">
                          <img src="/images/share.png" alt="공유됨" />
                        </span>
                      )}
                      <button
                        className="favorite-btn"
                        onClick={() => toggleFavorite(page.pno)}
                      >
                        {page.favorite ? (
                          <img
                            src="/images/favoriteActive.png"
                            alt="즐겨찾기"
                          />
                        ) : (
                          <img
                            src="/images/favoriteBtn.png"
                            alt="즐겨찾기버튼"
                          />
                        )}
                      </button>
                    </div>
                    <h3>{page.title}</h3>
                  </div>

                  {/* 툴팁용 숨겨진 정보 */}
                  <div className="tooltip-content">
                    <p>작성자: {page.writer}</p>
                    <p>수정일: {formatDateTime(page.modDate)}</p>
                    <div className="tag-list">
                      {page.tags?.map((tag, idx) => (
                        <span className="tag" key={idx}>
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
              {pages.map((page) =>
                page.favorite ? (
                  <div className="page-card tooltip-wrapper" key={page.pno}>
                    <div className="card-header">
                      <div className="status-bar">
                        {/* 콘솔에 실제로 찍히는 명? 이름으로 조건 걸어야 함! */}
                        {page.shared && (
                          <span className="tag shared">
                            <img src="/images/share.png" alt="공유됨" />
                          </span>
                        )}
                        <button
                          className="favorite-btn"
                          onClick={() => toggleFavorite(page.pno)}
                        >
                          {page.favorite ? (
                            <img
                              src="/images/favoriteActive.png"
                              alt="즐겨찾기"
                            />
                          ) : (
                            <img
                              src="/images/favoriteBtn.png"
                              alt="즐겨찾기버튼"
                            />
                          )}
                        </button>
                      </div>
                      <h3>{page.title}</h3>
                    </div>

                    {/* 툴팁용 숨겨진 정보 */}
                    <div className="tooltip-content">
                      <p>작성자: {page.writer}</p>
                      <p>수정일: {formatDateTime(page.modDate)}</p>
                      <div className="tag-list">
                        {page.tags?.map((tag, idx) => (
                          <span className="tag" key={idx}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  ) : null;
};
