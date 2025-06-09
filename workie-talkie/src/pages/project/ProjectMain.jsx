import React, { useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { Link } from "react-router-dom";
import { AddModal } from "../../components/project/addModal";
import { ModifyModal } from "../../components/project/modifyModal";

export const ProjectMain = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

  return (
    <MainLayout>
      <div id="wrapper" className="project-main-container">
        <aside>
          <h2 className="sidebar-title">My Project</h2>
          <button
            className="new-project-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <span>➕</span>
            NEW PROJECT
          </button>
        </aside>

        <main>
          <div className="main-header">
            <h1 className="main-title">My Project</h1>

            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="프로젝트 검색..."
                id="searchInput"
              />
            </div>
          </div>

          <div className="projects-container" id="projectsContainer">
            <Link to="/project/details">
              <div className="project-item">
                <div className="project-icon type-web">W</div>
                <div className="project-info">
                  <div className="project-name">웹사이트 리뉴얼</div>
                  <div className="project-details">
                    <span className="project-type">웹 개발</span>
                    <span className="project-date">2024.11.15</span>
                  </div>
                  <div className="project-description">
                    반응형 웹사이트 리뉴얼 프로젝트입니다. 모던한 디자인과
                    사용자 경험을 개선합니다.
                  </div>
                </div>
                <div className="project-actions">
                  <button
                    className="action-btn edit-btn"
                    title="편집"
                    onClick={() => setIsModifyModalOpen(true)}
                  >
                    ✏️
                  </button>
                  <button className="action-btn delete-btn" title="삭제">
                    🗑️
                  </button>
                </div>
              </div>
            </Link>

            <div className="project-item">
              <div className="project-icon type-mobile">M</div>
              <div className="project-info">
                <div className="project-name">모바일 앱 개발</div>
                <div className="project-details">
                  <span className="project-type">모바일</span>
                  <span className="project-date">2024.11.10</span>
                </div>
                <div className="project-description">
                  크로스 플랫폼 모바일 애플리케이션 개발 프로젝트입니다.
                </div>
              </div>
              <div className="project-actions">
                <button className="action-btn edit-btn" title="편집">
                  ✏️
                </button>
                <button className="action-btn delete-btn" title="삭제">
                  🗑️
                </button>
              </div>
            </div>

            <div className="project-item">
              <div className="project-icon type-design">D</div>
              <div className="project-info">
                <div className="project-name">브랜드 디자인</div>
                <div className="project-details">
                  <span className="project-type">디자인</span>
                  <span className="project-date">2024.11.05</span>
                </div>
                <div className="project-description">
                  새로운 브랜드 아이덴티티 및 로고 디자인 프로젝트입니다.
                </div>
              </div>
              <div className="project-actions">
                <button className="action-btn edit-btn" title="편집">
                  ✏️
                </button>
                <button className="action-btn delete-btn" title="삭제">
                  🗑️
                </button>
              </div>
            </div>

            <div className="project-item">
              <div className="project-icon">E</div>
              <div className="project-info">
                <div className="project-name">이커머스 플랫폼</div>
                <div className="project-details">
                  <span className="project-type">풀스택</span>
                  <span className="project-date">2024.10.28</span>
                </div>
                <div className="project-description">
                  온라인 쇼핑몰 개발 프로젝트입니다. 결제 시스템과 관리자
                  페이지를 포함합니다.
                </div>
              </div>
              <div className="project-actions">
                <button className="action-btn edit-btn" title="편집">
                  ✏️
                </button>
                <button className="action-btn delete-btn" title="삭제">
                  🗑️
                </button>
              </div>
            </div>

            <div className="project-item">
              <div className="project-icon type-web">C</div>
              <div className="project-info">
                <div className="project-name">채팅 시스템</div>
                <div className="project-details">
                  <span className="project-type">웹 개발</span>
                  <span className="project-date">2024.10.20</span>
                </div>
                <div className="project-description">
                  실시간 채팅 시스템 개발 프로젝트입니다. WebSocket을 사용한
                  실시간 통신을 구현합니다.
                </div>
              </div>
              <div className="project-actions">
                <button className="action-btn edit-btn" title="편집">
                  ✏️
                </button>
                <button className="action-btn delete-btn" title="삭제">
                  🗑️
                </button>
              </div>
            </div>
          </div>
          {isAddModalOpen && (
            <AddModal onClose={() => setIsAddModalOpen(false)} />
          )}
          {isModifyModalOpen && (
            <ModifyModal onClose={() => setIsModifyModalOpen(false)} />
          )}
        </main>
      </div>
    </MainLayout>
  );
};
