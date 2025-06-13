import React from "react";
import { Link } from "react-router-dom";

export const Aside = () => {
  return (
    <>
      <div className="notion-style-sidebar-header">
        <h2>
          내 페이지 <span>(5)</span>
        </h2>
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="검색하기" />
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-title" data-target="recentPages">
          <span>최근 페이지 (1)</span>
          <i className="fa-solid fa-angle-down"></i>
        </div>
        <ul className="page-list collapsible-content" id="recentPages">
          <li>
            <i className="fa-solid fa-file icon"></i> 새 페이지 1
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="section-title" data-target="pageList">
          <span>페이지 목록 (5)</span>
          <i className="fa-solid fa-angle-down"></i>
        </div>
        <ul className="page-list collapsible-content" id="pageList">
          <li>
            <i className="fa-solid fa-file icon"></i> 새 페이지 1
          </li>
          <li>
            <i className="fa-solid fa-file icon"></i> 새 페이지 5
          </li>
          <li>
            <i className="fa-solid fa-file icon"></i> 새 페이지 2
          </li>
          <li className="active">
            <i className="fa-solid fa-file icon"></i> 새 페이지 4
          </li>
          <li>
            <i className="fa-solid fa-file icon"></i> 새 페이지 3
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="section-title" data-target="sharedPages">
          <span>공유 페이지 (1)</span>
          <i className="fa-solid fa-angle-down"></i>
        </div>
        <ul className="page-list collapsible-content" id="sharedPages">
          <li>
            <i className="fa-solid fa-file icon"></i> 공유 페이지 1
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="section-title" data-target="sharedPages">
          <span>즐겨찾는 페이지 (1)</span>
          <i className="fa-solid fa-angle-down"></i>
        </div>
        <ul className="page-list collapsible-content" id="sharedPages">
          <li>
            <i className="fa-solid fa-file icon"></i> 페이지 1
          </li>
          <li>
            <i className="fa-solid fa-file icon"></i> 페이지 1
          </li>
          <li>
            <i className="fa-solid fa-file icon"></i> 페이지 1
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <ul className="page-list">
          <li>
            <i className="fa-solid fa-trash-can icon"></i> 휴지통
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
