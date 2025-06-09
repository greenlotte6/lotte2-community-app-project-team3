import React, { useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { AddModal } from "../../components/project/AddModal";
import { ModifyModal } from "../../components/project/ModifyModal";
import { Link } from "react-router-dom";

export const ProjectMain = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [projects, setProjects] = useState([
    {
      name: "웹사이트 리뉴얼",
      type: "web",
      date: "2024.11.15",
      description:
        "반응형 웹사이트 리뉴얼 프로젝트입니다. 모던한 디자인과 사용자 경험을 개선합니다.",
    },
    {
      name: "모바일 앱 개발",
      type: "mobile",
      date: "2024.11.10",
      description: "크로스 플랫폼 모바일 애플리케이션 개발 프로젝트입니다.",
    },
    {
      name: "브랜드 디자인",
      type: "design",
      date: "2024.11.05",
      description: "새로운 브랜드 아이덴티티 및 로고 디자인 프로젝트입니다.",
    },
    {
      name: "이커머스 플랫폼",
      type: "other",
      date: "2024.10.28",
      description:
        "온라인 쇼핑몰 개발 프로젝트입니다. 결제 시스템과 관리자 페이지를 포함합니다.",
    },
    {
      name: "채팅 시스템",
      type: "web",
      date: "2024.10.20",
      description:
        "실시간 채팅 시스템 개발 프로젝트입니다. WebSocket을 사용한 실시간 통신을 구현합니다.",
    },
  ]);

  const typeIconMap = {
    web: "W",
    mobile: "M",
    design: "D",
    data: "D",
    ai: "A",
    other: "E",
  };

  const typeClassMap = {
    web: "type-web",
    mobile: "type-mobile",
    design: "type-design",
    data: "type-data",
    ai: "type-ai",
    other: "",
  };

  const typeNameMap = {
    web: "웹 개발",
    mobile: "모바일",
    design: "디자인",
    data: "데이터",
    ai: "AI/ML",
    other: "풀스택",
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (confirmDelete) {
      setProjects((prev) => prev.filter((_, i) => i !== index));
    }
  };

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
              />
            </div>
          </div>
          <div className="projects-container">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <Link to="/project/details">
                  <div className={`project-icon ${typeClassMap[project.type]}`}>
                    {typeIconMap[project.type]}
                  </div>
                  <div className="project-info">
                    <div className="project-name">{project.name}</div>
                    <div className="project-details">
                      <span className="project-type">
                        {typeNameMap[project.type]}
                      </span>
                      <span className="project-date">{project.date}</span>
                    </div>
                    <div className="project-description">
                      {project.description}
                    </div>
                  </div>
                </Link>
                <div className="project-actions">
                  <button
                    className="action-btn edit-btn"
                    title="편집"
                    onClick={() => setIsModifyModalOpen(true)}
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete-btn"
                    title="삭제"
                    onClick={() => handleDelete(index)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
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
