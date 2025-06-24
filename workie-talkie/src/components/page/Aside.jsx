import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPage, getParent, getRecent, getTotal } from "../../api/pageAPI";

export const Aside = () => {
  const [total, setTotal] = useState(0);
  const [recentPages, setRecentPages] = useState([]);
  const [parentPages, setParentPages] = useState([]);
  const [sharedPages, setSharedPages] = useState([]);
  const [favoritePages, setFavoritePages] = useState([]);
  const [trashCount, setTrashCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  const goToPage = (pno) => {
    navigate(`/page/${pno}`);
  };

  useEffect(() => {
    // 총 페이지 수
    getTotal().then(setTotal);

    // 최근 페이지
    getRecent().then(setRecentPages);

    // 루트 페이지
    getParent().then(setParentPages);

    // 전체 페이지에서 공유/즐겨찾기/삭제 필터링
    getPage().then((allPages) => {
      setSharedPages(allPages.filter((p) => p.shared));
      setFavoritePages(allPages.filter((p) => p.favorite));
      setTrashCount(allPages.filter((p) => p.deleted).length);
    });
  }, []);

  return (
    <>
      <div className="notion-style-sidebar-header">
        <Link to={"/page"}>
          <h2>
            내 페이지 <span>({total})</span>
          </h2>
        </Link>
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="검색하기" />
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-title" data-target="recentPages">
          <span>최근 페이지</span>
          <i className="fa-solid fa-angle-down"></i>
        </div>
        <ul className="page-list collapsible-content" id="recentPages">
          {recentPages.map((p) => (
            <li key={p.pno} onClick={() => goToPage(p.pno)}>
              {p.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="section-title" data-target="pageList">
          <span>페이지 목록</span>
          <i className="fa-solid fa-angle-down"></i>
        </div>
        <ul className="page-list collapsible-content" id="pageList">
          {(showAll ? parentPages : parentPages.slice(0, 3)).map((p) => (
            <li key={p.pno} onClick={() => goToPage(p.pno)}>
              {p.title}
            </li>
          ))}

          {parentPages.length > 3 && (
            <li>
              <button className="more-btn" onClick={toggleShowAll}>
                {showAll ? "접기" : "더보기"}
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="section-title" data-target="sharedPages">
          <span>공유 페이지</span>
          <i className="fa-solid fa-angle-down"></i>
        </div>
        <ul className="page-list collapsible-content" id="sharedPages">
          {sharedPages.slice(0, 3).map((p) => (
            <li key={p.pno} onClick={() => goToPage(p.pno)}>
              {p.title}
            </li>
          ))}

          {sharedPages.length > 3 && (
            <li>
              <button className="more-btn">더보기</button>
            </li>
          )}
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="section-title" data-target="sharedPages">
          <span>즐겨찾는 페이지</span>
          <i className="fa-solid fa-angle-down"></i>
        </div>
        <ul className="page-list collapsible-content" id="sharedPages">
          {favoritePages.slice(0, 3).map((p) => (
            <li key={p.pno} onClick={() => goToPage(p.pno)}>
              {p.title}
            </li>
          ))}

          {favoritePages.length > 3 && (
            <li>
              <button className="more-btn">더보기</button>
            </li>
          )}
        </ul>
      </div>

      {/* 휴지통을 하단으로 이동 */}
      <div className="sidebar-section trash-section">
        <ul className="page-list">
          <li onClick={() => navigate("/page/trash")} className="trash-btn">
            <img src="/images/trashcan.png" alt="휴지통" />
            <span>({trashCount})</span>
          </li>
        </ul>
      </div>

      <div className="create-page-btn-wrapper">
        <button className="create-page-btn">
          <Link to="/page/new">
            <i className="fa-solid fa-plus"></i> 새 페이지 생성
          </Link>
        </button>
      </div>
    </>
  );
};
