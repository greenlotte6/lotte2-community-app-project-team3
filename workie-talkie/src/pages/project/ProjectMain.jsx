import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🔥 추가
import { MainLayout } from "../../layouts/MainLayout";
import { AddModal } from "../../components/project/AddModal";
import { ModifyModal } from "../../components/project/ModifyModal";

export const ProjectMain = () => {
  const navigate = useNavigate(); // 🔥 추가
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  // 프로젝트 목록 조회
  const fetchProjects = async () => {
    try {
      console.log("📡 프로젝트 목록 조회 시작...");

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 응답 상태:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data);
      console.log("✅ 프로젝트 조회 성공:", data);
    } catch (error) {
      console.error("❌ 프로젝트 조회 실패:", error);
      console.log("🔄 샘플 데이터 사용");
      // 샘플 데이터
      const sampleProjects = [
        {
          id: 1,
          name: "워키 톡이 프로젝트",
          description: "실시간 채팅과 협업 도구를 제공하는 워크플레이스 플랫폼",
          type: "web",
          createdAt: "2024-12-01T00:00:00",
          memberCount: 5,
        },
        {
          id: 2,
          name: "모바일 앱 개발",
          description: "iOS/Android 하이브리드 앱 개발 프로젝트",
          type: "mobile",
          createdAt: "2024-12-05T00:00:00",
          memberCount: 3,
        },
        {
          id: 3,
          name: "AI 챗봇 시스템",
          description: "고객 서비스용 AI 챗봇 개발 및 구축",
          type: "ai",
          createdAt: "2024-12-10T00:00:00",
          memberCount: 4,
        },
      ];
      setProjects(sampleProjects);
    } finally {
      setLoading(false); // 🔥 로딩 완료 처리
    }
  };

  // 컴포넌트 마운트 시 프로젝트 목록 조회
  useEffect(() => {
    fetchProjects();
  }, []);

  // 🔥 프로젝트 클릭 시 칸반보드로 이동
  const handleProjectClick = (project) => {
    console.log("🎯 프로젝트 클릭:", project);

    // 프로젝트 정보를 localStorage에 저장 (칸반보드에서 사용)
    localStorage.setItem("currentProject", JSON.stringify(project));

    // 칸반보드 페이지로 이동
    navigate(`/project/kanban/${project.id}`, {
      state: { project }, // 추가 데이터 전달
    });
  };

  // 프로젝트 추가 후 콜백
  const handleProjectAdded = (newProject) => {
    console.log("✅ 새 프로젝트 추가됨:", newProject);
    setProjects((prev) => [newProject, ...prev]);
  };

  // 프로젝트 수정 후 콜백
  const handleProjectUpdated = (updatedProject) => {
    console.log("✅ 프로젝트 수정됨:", updatedProject);
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setSelectedProject(null);
  };

  // 프로젝트 삭제
  const handleDelete = async (projectId, index) => {
    const project = projects.find((p) => p.id === projectId);
    const confirmDelete = window.confirm(
      `"${project?.name || "이 프로젝트"}"를 정말 삭제하시겠습니까?`
    );
    if (!confirmDelete) return;

    try {
      console.log("🗑️ 프로젝트 삭제 시작:", projectId);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("✅ 프로젝트 삭제 성공");
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        alert("프로젝트가 삭제되었습니다.");
      } else {
        console.error("❌ 프로젝트 삭제 실패:", response.status);
        alert("프로젝트 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 삭제 에러:", error);
      alert("삭제 중 오류가 발생했습니다. 백엔드 서버를 확인해주세요.");
    }
  };

  // 검색 기능
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // 로딩 상태
  if (loading) {
    return (
      <MainLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            fontSize: "18px",
          }}
        >
          📁 프로젝트 목록을 불러오는 중...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div id="wrapper" className="project-main-container">
        <aside>
          <h2 className="sidebar-title">My Project</h2>
          <button
            className="new-project-btn"
            onClick={() => {
              console.log("🆕 NEW PROJECT 버튼 클릭!");
              setIsAddModalOpen(true);
            }}
          >
            <span>➕</span>
            NEW PROJECT
          </button>

          {/* 디버깅 정보 */}
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
              fontSize: "12px",
            }}
          >
            <strong>🔍 디버깅 정보:</strong>
            <br />
            전체 프로젝트: {projects.length}개<br />
            표시 프로젝트: {filteredProjects.length}개<br />
            검색어: "{searchTerm || "없음"}"<br />
            모달 상태: {isAddModalOpen ? "열림" : "닫힘"}
          </div>
        </aside>

        <main>
          <div className="main-header">
            <h1 className="main-title">
              My Project ({filteredProjects.length})
            </h1>
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="프로젝트 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="projects-container">
            {filteredProjects.length === 0 ? (
              <div className="no-projects">
                <div className="no-projects-icon">📁</div>
                <div className="no-projects-text">
                  {searchTerm
                    ? "검색 결과가 없습니다."
                    : "아직 프로젝트가 없습니다."}
                </div>
                <div className="no-projects-subtext">
                  {searchTerm
                    ? "다른 키워드로 검색해보세요."
                    : '"NEW PROJECT" 버튼을 눌러 첫 번째 프로젝트를 만들어보세요!'}
                </div>
              </div>
            ) : (
              filteredProjects.map((project, index) => (
                <div key={project.id || index} className="project-item">
                  {/* 🔥 클릭 이벤트 수정 */}
                  <div
                    className="project-link"
                    onClick={() => handleProjectClick(project)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className={`project-icon ${
                        typeClassMap[project.type] || ""
                      }`}
                    >
                      {typeIconMap[project.type] || "P"}
                    </div>
                    <div className="project-info">
                      <div className="project-name">{project.name}</div>
                      <div className="project-details">
                        <span className="project-type">
                          {typeNameMap[project.type] || "기타"}
                        </span>
                        <span className="project-date">
                          {formatDate(project.createdAt) || project.date}
                        </span>
                      </div>
                      <div className="project-description">
                        {project.description || "설명이 없습니다."}
                      </div>
                      {/* 🔥 멤버 수 표시 */}
                      <div className="project-members">
                        👥 {project.memberCount || 1}명
                      </div>
                    </div>
                  </div>
                  <div className="project-actions">
                    <button
                      className="action-btn edit-btn"
                      title="편집"
                      onClick={(e) => {
                        e.stopPropagation(); // 🔥 버블링 방지
                        console.log("✏️ 프로젝트 편집:", project);
                        setSelectedProject(project);
                        setIsModifyModalOpen(true);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn delete-btn"
                      title="삭제"
                      onClick={(e) => {
                        e.stopPropagation(); // 🔥 버블링 방지
                        handleDelete(project.id, index);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 프로젝트 추가 모달 */}
          {isAddModalOpen && (
            <AddModal
              onClose={() => {
                console.log("❌ 추가 모달 닫기");
                setIsAddModalOpen(false);
              }}
              onProjectAdded={handleProjectAdded}
            />
          )}

          {/* 프로젝트 수정 모달 */}
          {isModifyModalOpen && selectedProject && (
            <ModifyModal
              onClose={() => {
                console.log("❌ 수정 모달 닫기");
                setIsModifyModalOpen(false);
                setSelectedProject(null);
              }}
              project={selectedProject}
              onProjectUpdated={handleProjectUpdated}
            />
          )}
        </main>
      </div>
    </MainLayout>
  );
};
