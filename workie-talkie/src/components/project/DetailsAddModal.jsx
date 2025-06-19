import React, { useState } from "react";

export const DetailsAddModal = ({
  onClose,
  onTaskAdded,
  defaultColumn = "todo",
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    status: defaultColumn,
    assignee: "",
    dueDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력 처리
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 폼 제출
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("작업 제목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 새 작업 객체 생성
      const newTask = {
        id: Date.now(), // 임시 ID
        title: formData.title.trim(),
        description: formData.content.trim(),
        priority: formData.priority,
        tags: [], // 기본 빈 배열
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
          : new Date().toLocaleDateString("ko-KR", {
              month: "numeric",
              day: "numeric",
            }),
        createdAt: new Date().toISOString(),
      };

      console.log("✅ 새 작업 생성:", newTask);

      // 부모 컴포넌트에 새 작업 전달
      if (onTaskAdded) {
        onTaskAdded(newTask, formData.status);
      }

      alert("새 작업이 추가되었습니다!");
      onClose();
    } catch (error) {
      console.error("❌ 작업 생성 실패:", error);
      alert("작업 생성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 버튼 활성화 조건
  const isSaveEnabled = formData.title.trim() && !isSubmitting;

  return (
    <div className="modal-overlay" id="taskModal" onClick={onClose}>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px 12px 0 0;
            text-align: center;
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

          .modal-actions {
            display: flex;
            gap: 12px;
            padding: 20px 24px;
            border-top: 1px solid #dee2e6;
            background: #f8f9fa;
            border-radius: 0 0 12px 12px;
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
            background: #007bff;
            color: white;
          }

          .modal-btn-save:hover:not(:disabled) {
            background: #0056b3;
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
        `}</style>

        <div className="modal-header">
          <div className="modal-title">📝 새 작업 추가</div>
          <div className="modal-subtitle">새로운 작업을 생성해보세요</div>
        </div>

        <div className="modal-form">
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

          {/* 작업 내용 */}
          <div className="form-group">
            <label className="form-label" htmlFor="taskContent">
              작업 내용
            </label>
            <textarea
              id="taskContent"
              className="form-input form-textarea"
              placeholder="작업에 대한 자세한 설명을 입력하세요 (선택사항)"
              maxLength="500"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
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
                  onClick={() => handleInputChange("priority", priority.value)}
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
                onChange={(e) => handleInputChange("status", e.target.value)}
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
                onChange={(e) => handleInputChange("assignee", e.target.value)}
                disabled={isSubmitting}
              />
              <div className="form-help">비워두면 '미배정'으로 표시됩니다</div>
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
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="modal-btn modal-btn-cancel"
            id="cancelTaskBtn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            className="modal-btn modal-btn-save"
            id="saveTaskBtn"
            onClick={handleSubmit}
            disabled={!isSaveEnabled}
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
};
