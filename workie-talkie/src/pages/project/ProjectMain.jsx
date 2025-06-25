import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🔥 추가
import { MainLayout } from "../../layouts/MainLayout";
import { AddModal } from "../../components/project/AddModal";
import { ModifyModal } from "../../components/project/ModifyModal";
import { useLoginStore } from "../../stores/useLoginStore";
import { getProject } from "../../api/projectAPI";

export const ProjectMain = () => {
  const user = useLoginStore((state) => state.user);
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  //프로젝트 목록 불러오기
  useEffect(() => {
    if (!user) {
      navigate("/user/login");
      return;
    }

    getProject()
      .then((data) => {
        console.log(data);
        setProjects(data);
      })
      .catch((err) => {
        console.log(err);
        console.error("프로젝트 불러오기 실패", err);
      })
      .finally(() => {
        setLoading(false); // 🔥 이거 필수!
      });
  }, [user, navigate]);

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

  return user ? (
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
        </aside>

        <main>
          <div className="main-header">
            <h1 className="main-title">My Project ()</h1>
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
            {projects.length === 0 ? (
              <div className="no-projects">
                <div className="no-projects-icon">📁</div>
                <div className="no-projects-text">
                  {projects
                    ? "아직 프로젝트가 없습니다."
                    : "검색 결과가 없습니다."}
                </div>
                <div className="no-projects-subtext">
                  {projects
                    ? '"NEW PROJECT" 버튼을 눌러 첫 번째 프로젝트를 만들어보세요!'
                    : "다른 키워드로 검색해보세요."}
                </div>
              </div>
            ) : (
              projects.map((project, index) => (
                <div key={project.id} className="project-item">
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
                          {formatDate(project.createdAt)}
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
  ) : null;
};
