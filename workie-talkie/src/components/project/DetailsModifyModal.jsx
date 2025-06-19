import React, { useState, useEffect } from "react";

export const DetailsModifyModal = ({ onClose, task, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    assignee: "",
    dueDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // 모달 열릴 때 기존 작업 데이터로 폼 초기화
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: getCurrentStatus(task), // 현재 컬럼에서 상태 추론
        assignee: task.assignee?.name || "",
        dueDate: convertDateToInput(task.date), // 날짜 형식 변환
      });
    }
  }, [task]);

  // 현재 작업이 어느 컬럼에 있는지 추론 (임시)
  const getCurrentStatus = (task) => {
    // 실제로는 부모 컴포넌트에서 현재 컬럼 정보를 전달받아야 함
    // 우선 우선순위나 다른 정보로 추론
    return "todo"; // 기본값
  };

  // 날짜 형식 변환 (12/15 → 2024-12-15)
  const convertDateToInput = (dateStr) => {
    if (!dateStr || !dateStr.includes("/")) return "";

    try {
      const [month, day] = dateStr.split("/");
      const year = new Date().getFullYear();
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } catch (error) {
      return "";
    }
  };

  // 입력 처리
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 폼 제출 (수정)
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("작업 제목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 수정된 작업 객체 생성
      const updatedTask = {
        ...task, // 기존 데이터 유지
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        assignee: {
          name: formData.assignee || "미배정",
          avatar: formData.assignee
            ? formData.assignee.charAt(0).toUpperCase()
            : "?",
        },
        date: formData.dueDate
          ? new Date(formData.dueDate).toLocaleDateString("ko-KR", {
              month: "numeric",
              day: "numeric",
            })
          : task.date, // 날짜가 없으면 기존 날짜 유지
        updatedAt: new Date().toISOString(),
      };

      console.log("✅ 작업 수정:", updatedTask);

      // 부모 컴포넌트에 수정된 작업 전달
      if (onTaskUpdated) {
        onTaskUpdated(updatedTask, formData.status);
      }

      // TODO: 백엔드 API 호출
      // await updateTask(task.id, updatedTask);

      alert("작업이 수정되었습니다!");
      onClose();
    } catch (error) {
      console.error("❌ 작업 수정 실패:", error);
      alert("작업 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 작업 삭제
  const handleDelete = async () => {
    if (!window.confirm(`"${task.title}" 작업을 정말 삭제하시겠습니까?`)) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🗑️ 작업 삭제:", task.id);

      // 부모 컴포넌트에 삭제 요청
      if (onTaskUpdated) {
        onTaskUpdated(null, null, "delete"); // 삭제 신호
      }

      // TODO: 백엔드 API 호출
      // await deleteTask(task.id);

      alert("작업이 삭제되었습니다.");
      onClose();
    } catch (error) {
      console.error("❌ 작업 삭제 실패:", error);
      alert("작업 삭제에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 버튼 활성화 조건
  const isSaveEnabled = formData.title.trim() && !isSubmitting;

  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .task-modal {
            background: white;
            border-radius: 12px;
            padding: 0;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          }

          .modal-header {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 20px;
            border-radius: 12px 12px 0 0;
            text-align: center;
            position: relative;
          }

          .modal-header.delete-mode {
            background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
          }

          .modal-title {
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 8px 0;
          }

          .modal-subtitle {
            opacity: 0.9;
            font-size: 14px;
            margin: 0;
          }

          .delete-toggle {
            position: absolute;
            top: 15px;
            right: 20px;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s;
          }

          .delete-toggle:hover {
            background: rgba(255,255,255,0.3);
          }

          .modal-form {
            padding: 24px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-label {
            display: block;
            font-weight: 600;
            color: #343a40;
            margin-bottom: 8px;
            font-size: 14px;
          }

          .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s;
            box-sizing: border-box;
            font-family: inherit;
          }

          .form-input:focus {
            outline: none;
            border-color: #007bff;
          }

          .form-textarea {
            min-height: 80px;
            resize: vertical;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .form-select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            cursor: pointer;
            box-sizing: border-box;
          }

          .form-select:focus {
            outline: none;
            border-color: #007bff;
          }

          .priority-options {
            display: flex;
            gap: 8px;
            margin-top: 8px;
          }

          .priority-option {
            flex: 1;
            padding: 10px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 13px;
            font-weight: 500;
          }

          .priority-option.selected {
            border-color: #007bff;
            background: #e3f2fd;
            color: #0d47a1;
          }

          .priority-option.high.selected {
            border-color: #dc3545;
            background: #f8d7da;
            color: #721c24;
          }

          .priority-option.medium.selected {
            border-color: #ffc107;
            background: #fff3cd;
            color: #856404;
          }

          .priority-option.low.selected {
            border-color: #28a745;
            background: #d4edda;
            color: #155724;
          }

          .task-info {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #007bff;
          }

          .task-info-label {
            font-size: 12px;
            color: #6c757d;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .task-info-value {
            font-size: 14px;
            color: #495057;
          }

          .modal-actions {
            display: flex;
            gap: 12px;
            padding: 20px 24px;
            border-top: 1px solid #dee2e6;
            background: #f8f9fa;
            border-radius: 0 0 12px 12px;
          }

          .modal-actions.delete-mode {
            background: #fff5f5;
          }

          .modal-btn {
            flex: 1;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .modal-btn-cancel {
            background: #6c757d;
            color: white;
          }

          .modal-btn-cancel:hover {
            background: #545b62;
          }

          .modal-btn-save {
            background: #28a745;
            color: white;
          }

          .modal-btn-save:hover:not(:disabled) {
            background: #218838;
          }

          .modal-btn-delete {
            background: #dc3545;
            color: white;
          }

          .modal-btn-delete:hover:not(:disabled) {
            background: #c82333;
          }

          .modal-btn:disabled {
            background: #adb5bd;
            cursor: not-allowed;
          }

          .form-help {
            font-size: 12px;
            color: #6c757d;
            margin-top: 4px;
          }

          .delete-warning {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 14px;
            text-align: center;
          }
        `}</style>

        <div className={`modal-header ${isDeleteMode ? "delete-mode" : ""}`}>
          <button
            className="delete-toggle"
            onClick={() => setIsDeleteMode(!isDeleteMode)}
            title={isDeleteMode ? "수정 모드로 전환" : "삭제 모드로 전환"}
          >
            {isDeleteMode ? "✏️" : "🗑️"}
          </button>
          <div className="modal-title">
            {isDeleteMode ? "🗑️ 작업 삭제" : "✏️ 작업 수정"}
          </div>
          <div className="modal-subtitle">
            {isDeleteMode
              ? "작업을 삭제하시겠습니까?"
              : "작업 정보를 수정하세요"}
          </div>
        </div>

        <div className="modal-form">
          {/* 작업 정보 (읽기 전용) */}
          <div className="task-info">
            <div className="task-info-label">작업 ID</div>
            <div className="task-info-value">#{task.id}</div>
          </div>

          {isDeleteMode ? (
            <div className="delete-warning">
              ⚠️ 이 작업을 삭제하면 복구할 수 없습니다.
              <br />
              정말 "{task.title}" 작업을 삭제하시겠습니까?
            </div>
          ) : (
            <>
              {/* 작업 제목 */}
              <div className="form-group">
                <label className="form-label" htmlFor="taskTitle">
                  작업 제목 *
                </label>
                <input
                  type="text"
                  id="taskTitle"
                  className="form-input"
                  placeholder="작업 제목을 입력하세요"
                  maxLength="100"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              {/* 작업 설명 */}
              <div className="form-group">
                <label className="form-label" htmlFor="taskContent">
                  작업 설명
                </label>
                <textarea
                  id="taskContent"
                  className="form-input form-textarea"
                  placeholder="작업에 대한 자세한 설명을 입력하세요"
                  maxLength="500"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>

              {/* 우선순위 */}
              <div className="form-group">
                <label className="form-label">우선순위</label>
                <div className="priority-options">
                  {[
                    { value: "high", label: "🔴 높음" },
                    { value: "medium", label: "🟡 보통" },
                    { value: "low", label: "🟢 낮음" },
                  ].map((priority) => (
                    <div
                      key={priority.value}
                      className={`priority-option ${priority.value} ${
                        formData.priority === priority.value ? "selected" : ""
                      }`}
                      onClick={() =>
                        handleInputChange("priority", priority.value)
                      }
                    >
                      {priority.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* 상태 및 담당자 */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="taskStatus">
                    상태
                  </label>
                  <select
                    id="taskStatus"
                    className="form-select"
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    disabled={isSubmitting}
                  >
                    <option value="todo">📝 To Do</option>
                    <option value="progress">⚡ In Progress</option>
                    <option value="review">👀 Review</option>
                    <option value="done">✅ Done</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="taskAssignee">
                    담당자
                  </label>
                  <input
                    type="text"
                    id="taskAssignee"
                    className="form-input"
                    placeholder="담당자 이름"
                    maxLength="20"
                    value={formData.assignee}
                    onChange={(e) =>
                      handleInputChange("assignee", e.target.value)
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* 마감일 */}
              <div className="form-group">
                <label className="form-label" htmlFor="taskDueDate">
                  마감일
                </label>
                <input
                  type="date"
                  id="taskDueDate"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}
        </div>

        <div className={`modal-actions ${isDeleteMode ? "delete-mode" : ""}`}>
          <button
            className="modal-btn modal-btn-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </button>

          {isDeleteMode ? (
            <button
              className="modal-btn modal-btn-delete"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "삭제 중..." : "삭제하기"}
            </button>
          ) : (
            <button
              className="modal-btn modal-btn-save"
              onClick={handleSubmit}
              disabled={!isSaveEnabled}
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
