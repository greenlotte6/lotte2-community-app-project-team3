import React, { useState, useRef } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { DetailsAddModal } from "../../components/project/DetailsAddModal";
import { DetailsModifyModal } from "../../components/project/DetailsModifyModal";

export const ProjectDetails = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState("todo"); // 🔥 누락된 상태 추가!
  const [currentProject, setCurrentProject] = useState(null); // 🔥 현재 프로젝트 상태 추가
  const [allProjects, setAllProjects] = useState([]);

  // 드래그 상태 관리
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // 칸반보드 데이터 상태
  const [kanbanData, setKanbanData] = useState({
    todo: [
      {
        id: 1,
        title: "로그인 페이지 디자인 수정",
        description:
          "사용자 피드백을 반영하여 로그인 페이지의 UI/UX를 개선합니다.",
        priority: "high",
        tags: ["Frontend", "Design"],
        assignee: { name: "김개발", avatar: "김" },
        date: "12/15",
      },
      {
        id: 2,
        title: "데이터베이스 스키마 설계",
        description:
          "새로운 기능을 위한 데이터베이스 테이블 구조를 설계합니다.",
        priority: "medium",
        tags: ["Backend"],
        assignee: { name: "이백엔드", avatar: "이" },
        date: "12/20",
      },
      {
        id: 3,
        title: "문서 업데이트",
        description: "API 문서를 최신 버전으로 업데이트합니다.",
        priority: "low",
        tags: ["Documentation"],
        assignee: { name: "박문서", avatar: "박" },
        date: "12/25",
      },
    ],
    progress: [
      {
        id: 4,
        title: "결제 시스템 구현",
        description: "PG사 연동을 통한 결제 기능을 개발 중입니다.",
        priority: "high",
        tags: ["Backend", "Frontend"],
        assignee: { name: "최결제", avatar: "최" },
        date: "12/18",
      },
      {
        id: 5,
        title: "모바일 반응형 작업",
        description: "메인 페이지의 모바일 반응형을 구현하고 있습니다.",
        priority: "medium",
        tags: ["Frontend"],
        assignee: { name: "정모바일", avatar: "정" },
        date: "12/22",
      },
    ],
    review: [
      {
        id: 6,
        title: "사용자 권한 관리 기능",
        description: "관리자 패널에서 사용자 권한을 관리할 수 있는 기능입니다.",
        priority: "medium",
        tags: ["Backend"],
        assignee: { name: "김권한", avatar: "김" },
        date: "12/16",
      },
    ],
    done: [
      {
        id: 7,
        title: "회원가입 기능 완성",
        description: "이메일 인증을 포함한 회원가입 시스템이 완료되었습니다.",
        priority: "high",
        tags: ["Backend", "Frontend"],
        assignee: { name: "이회원", avatar: "이" },
        date: "12/10",
      },
      {
        id: 8,
        title: "프로젝트 초기 설정",
        description: "개발 환경 설정과 기본 프로젝트 구조가 완성되었습니다.",
        priority: "medium",
        tags: ["Setup"],
        assignee: { name: "박설정", avatar: "박" },
        date: "12/05",
      },
    ],
  });

  // 🔥 새 작업 추가 처리
  const handleTaskAdded = (newTask, targetColumn) => {
    console.log("✅ 새 작업 추가:", newTask, "to", targetColumn);

    setKanbanData((prevData) => ({
      ...prevData,
      [targetColumn]: [...prevData[targetColumn], newTask],
    }));
  };

  // 🔥 컬럼별 새 작업 추가 버튼
  const handleAddTaskToColumn = (columnId) => {
    console.log("📝 컬럼에 새 작업 추가:", columnId);
    setSelectedColumn(columnId);
    setIsAddModalOpen(true);
  };

  // 🔥 헤더의 새 작업 추가 버튼
  const handleAddTaskFromHeader = () => {
    console.log("📝 헤더에서 새 작업 추가");
    setSelectedColumn("todo"); // 기본값으로 Todo 선택
    setIsAddModalOpen(true);
  };

  // 드래그 시작
  const handleDragStart = (e, task, sourceColumn) => {
    console.log("🎯 드래그 시작:", task.title, "from", sourceColumn);
    setDraggedTask({ ...task, sourceColumn });
    e.dataTransfer.effectAllowed = "move";

    // 드래그 중인 카드 스타일링
    e.target.style.opacity = "0.5";
  };

  // 드래그 끝
  const handleDragEnd = (e) => {
    console.log("🏁 드래그 끝");
    e.target.style.opacity = "1";
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  // 드래그 오버 (컬럼 위로)
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // 컬럼 드래그 엔터
  const handleDragEnter = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
    console.log("📍 드래그 엔터:", columnId);
  };

  // 컬럼 드래그 리브
  const handleDragLeave = (e) => {
    // 컬럼을 완전히 벗어날 때만 처리
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  // 드롭 처리
  const handleDrop = (e, targetColumn) => {
    e.preventDefault();

    if (!draggedTask) {
      console.log("❌ 드래그된 작업이 없습니다");
      return;
    }

    const { sourceColumn } = draggedTask;

    if (sourceColumn === targetColumn) {
      console.log("⚠️ 같은 컬럼으로 이동");
      setDragOverColumn(null);
      return;
    }

    console.log("✅ 드롭 성공:", draggedTask.title, "to", targetColumn);

    // 상태 업데이트
    setKanbanData((prevData) => {
      const newData = { ...prevData };

      // 소스 컬럼에서 제거
      newData[sourceColumn] = newData[sourceColumn].filter(
        (task) => task.id !== draggedTask.id
      );

      // 타겟 컬럼에 추가
      const taskToMove = { ...draggedTask };
      delete taskToMove.sourceColumn;
      newData[targetColumn] = [...newData[targetColumn], taskToMove];

      return newData;
    });

    setDragOverColumn(null);

    // TODO: 백엔드 API 호출로 상태 업데이트
    // updateTaskStatus(draggedTask.id, targetColumn);
  };

  // 🔥 작업 수정/삭제 처리
  const handleTaskUpdated = (updatedTask, newStatus, action = "update") => {
    if (action === "delete") {
      // 작업 삭제
      console.log("🗑️ 작업 삭제:", selectedTask.id);

      setKanbanData((prevData) => {
        const newData = { ...prevData };

        // 모든 컬럼에서 해당 작업 찾아서 삭제
        Object.keys(newData).forEach((columnId) => {
          newData[columnId] = newData[columnId].filter(
            (task) => task.id !== selectedTask.id
          );
        });

        return newData;
      });

      return;
    }

    // 작업 수정
    console.log("✅ 작업 수정:", updatedTask, "새 상태:", newStatus);

    setKanbanData((prevData) => {
      const newData = { ...prevData };
      let currentColumn = null;

      // 현재 작업이 어느 컬럼에 있는지 찾기
      Object.keys(newData).forEach((columnId) => {
        const taskIndex = newData[columnId].findIndex(
          (task) => task.id === updatedTask.id
        );
        if (taskIndex !== -1) {
          currentColumn = columnId;
        }
      });

      if (currentColumn) {
        // 기존 컬럼에서 제거
        newData[currentColumn] = newData[currentColumn].filter(
          (task) => task.id !== updatedTask.id
        );

        // 새 상태의 컬럼에 추가 (상태가 변경된 경우)
        const targetColumn = newStatus || currentColumn;
        newData[targetColumn] = [...newData[targetColumn], updatedTask];
      }

      return newData;
    });
  };

  // 작업 카드 클릭 (현재 컬럼 정보 포함)
  // 작업 카드 클릭 (현재 컬럼 정보 포함)
  const handleTaskClick = (task, currentColumn) => {
    console.log("🔍 작업 카드 클릭:", task, "현재 컬럼:", currentColumn);

    // 작업에 현재 컬럼 정보 추가
    const taskWithColumn = { ...task, currentColumn };
    setSelectedTask(taskWithColumn);
    setIsModifyModalOpen(true);
  };

  // 컬럼 정보
  const columns = {
    todo: { name: "To Do", className: "todo", icon: "📝" },
    progress: { name: "In Progress", className: "progress", icon: "⚡" },
    review: { name: "Review", className: "review", icon: "👀" },
    done: { name: "Done", className: "done", icon: "✅" },
  };

  // 우선순위 클래스 매핑
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  return (
    <MainLayout>
      <style>{`
        .kanban-board {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          padding: 20px;
          height: calc(100vh - 180px);
          overflow-x: auto;
        }

        .kanban-column {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 16px;
          min-height: 500px;
          transition: all 0.3s ease;
          position: relative;
        }

        .kanban-column.drag-over {
          background: #e3f2fd;
          border: 2px dashed #2196f3;
          transform: scale(1.02);
        }

        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e9ecef;
        }

        .column-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #495057;
        }

        .task-count {
          background: #6c757d;
          color: white;
          border-radius: 12px;
          padding: 2px 8px;
          font-size: 12px;
          font-weight: 500;
        }

        .task-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 400px;
        }

        .task-card {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          cursor: grab;
          transition: all 0.2s ease;
          border-left: 4px solid;
        }

        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .task-card:active {
          cursor: grabbing;
        }

        .task-card.dragging {
          opacity: 0.5;
          transform: rotate(5deg);
        }

        .priority-high {
          border-left-color: #dc3545;
        }

        .priority-medium {
          border-left-color: #ffc107;
        }

        .priority-low {
          border-left-color: #28a745;
        }

        .task-title {
          font-weight: 600;
          color: #212529;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .task-description {
          color: #6c757d;
          font-size: 12px;
          line-height: 1.4;
          margin-bottom: 12px;
        }

        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .task-tags {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .task-tag {
          background: #e9ecef;
          color: #495057;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
        }

        .task-tag.frontend {
          background: #cfe2ff;
          color: #0d6efd;
        }

        .task-tag.backend {
          background: #d1ecf1;
          color: #0c5460;
        }

        .task-tag.design {
          background: #f8d7da;
          color: #721c24;
        }

        .task-assignee {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .assignee-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          font-weight: bold;
        }

        .task-date {
          font-size: 11px;
          color: #6c757d;
        }

        .add-task-btn {
          width: 100%;
          padding: 12px;
          border: 2px dashed #dee2e6;
          background: transparent;
          border-radius: 8px;
          color: #6c757d;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 12px;
        }

        .add-task-btn:hover {
          border-color: #007bff;
          color: #007bff;
          background: #f8f9fa;
        }

        .kanban-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: white;
          border-bottom: 1px solid #dee2e6;
        }

        .kanban-title {
          font-size: 24px;
          font-weight: 600;
          color: #212529;
          margin: 0;
        }

        .kanban-actions {
          display: flex;
          gap: 8px;
        }

        .search-btn, .add-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 8px;
          background: #007bff;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-btn:hover, .add-btn:hover {
          background: #0056b3;
          transform: scale(1.05);
        }

        .project-details-container {
          display: flex;
          height: 100vh;
        }

        .project-details-container aside {
          width: 250px;
          background: #f8f9fa;
          padding: 20px;
          border-right: 1px solid #dee2e6;
        }

        .project-details-container main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .sidebar-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #495057;
        }

        .project-list {
          background: white;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
          border: 1px solid #dee2e6;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .project-list:hover {
          background: #e3f2fd;
          border-color: #2196f3;
        }
      `}</style>

      <div id="wrapper" className="project-details-container">
        <aside>
          <h2 className="sidebar-title">My Project</h2>
          <div className="project-list">
            <p>
              <strong>워키 톡이 프로젝트</strong>
            </p>
            <p>실시간 채팅과 협업 도구</p>
          </div>
          <div className="project-list">
            <p>
              <strong>모바일 앱 개발</strong>
            </p>
            <p>iOS/Android 하이브리드 앱</p>
          </div>
          <div className="project-list">
            <p>
              <strong>AI 챗봇 시스템</strong>
            </p>
            <p>고객 서비스용 AI 챗봇</p>
          </div>
        </aside>

        <main>
          <div className="kanban-header">
            <h1 className="kanban-title">🎯 Kanban Dashboard</h1>
            <div className="kanban-actions">
              <button className="search-btn" title="검색">
                🔍
              </button>
              <button
                className="add-btn"
                title="새 작업 추가"
                onClick={handleAddTaskFromHeader} // 🔥 수정된 함수 사용
              >
                ➕
              </button>
            </div>
          </div>

          <div className="kanban-board">
            {Object.entries(columns).map(([columnId, columnInfo]) => (
              <div
                key={columnId}
                className={`kanban-column ${columnInfo.className} ${
                  dragOverColumn === columnId ? "drag-over" : ""
                }`}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, columnId)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, columnId)}
              >
                <div className="column-header">
                  <div className="column-title">
                    <span>{columnInfo.icon}</span>
                    <span className="column-name">{columnInfo.name}</span>
                    <span className="task-count">
                      {kanbanData[columnId].length}
                    </span>
                  </div>
                  <button className="column-menu">⋯</button>
                </div>

                <div className="task-list">
                  {kanbanData[columnId].map((task) => (
                    <div
                      key={task.id}
                      className={`task-card ${getPriorityClass(task.priority)}`}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, task, columnId)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleTaskClick(task, columnId)} // 🔥 컬럼 ID 전달
                    >
                      <div className="task-title">{task.title}</div>
                      <div className="task-description">{task.description}</div>
                      <div className="task-meta">
                        <div className="task-tags">
                          {task.tags.map((tag, index) => (
                            <span
                              key={index}
                              className={`task-tag ${tag.toLowerCase()}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="task-assignee">
                          <div className="assignee-avatar">
                            {task.assignee.avatar}
                          </div>
                          <span className="task-date">{task.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="add-task-btn"
                  onClick={() => handleAddTaskToColumn(columnId)} // 🔥 컬럼별 추가
                >
                  + 새 작업 추가
                </button>
              </div>
            ))}
          </div>

          {/* 모달들 */}
          {isAddModalOpen && (
            <DetailsAddModal
              onClose={() => setIsAddModalOpen(false)}
              onTaskAdded={handleTaskAdded}
              defaultColumn={selectedColumn} // 🔥 이제 오류 없음!
            />
          )}
          {isModifyModalOpen && selectedTask && (
            <DetailsModifyModal
              onClose={() => {
                setIsModifyModalOpen(false);
                setSelectedTask(null);
              }}
              task={selectedTask}
              onTaskUpdated={handleTaskUpdated} // 🔥 수정/삭제 핸들러 추가
            />
          )}
        </main>
      </div>
    </MainLayout>
  );
};
