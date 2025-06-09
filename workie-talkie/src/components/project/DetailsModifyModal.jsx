import React from "react";

export const DetailsModifyModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" id="editTaskModal" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">작업 편집</div>
          <div className="modal-subtitle">작업 정보를 수정하세요</div>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label className="form-label" for="editTaskTitle">
              작업 제목 *
            </label>
            <input
              type="text"
              id="editTaskTitle"
              className="form-input"
              placeholder="작업 제목을 입력하세요"
              maxlength="100"
            />
          </div>

          <div className="form-group">
            <label className="form-label" for="editTaskDescription">
              작업 설명
            </label>
            <textarea
              id="editTaskDescription"
              className="form-input form-textarea"
              placeholder="작업에 대한 자세한 설명을 입력하세요"
              maxlength="500"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" for="editTaskPriority">
                우선순위
              </label>
              <select id="editTaskPriority" className="form-select">
                <option value="low">낮음</option>
                <option value="medium">중간</option>
                <option value="high">높음</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" for="editTaskAssignee">
                담당자
              </label>
              <select id="editTaskAssignee" className="form-select">
                <option value="김">김</option>
                <option value="이">이</option>
                <option value="박">박</option>
                <option value="최">최</option>
                <option value="정">정</option>
                <option value="한">한</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" for="editTaskTag">
                태그
              </label>
              <select id="editTaskTag" className="form-select">
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="design">Design</option>
                <option value="testing">Testing</option>
                <option value="documentation">Documentation</option>
                <option value="bugfix">Bug Fix</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" for="editTaskDate">
                마감일
              </label>
              <input
                type="text"
                id="editTaskDate"
                className="form-input"
                placeholder="MM/DD"
                maxlength="5"
              />
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-btn modal-btn-delete" id="deleteTaskBtn">
            삭제
          </button>
          <button
            className="modal-btn modal-btn-cancel"
            id="cancelEditBtn"
            onClick={onClose}
          >
            취소
          </button>
          <button className="modal-btn modal-btn-save" id="saveEditBtn">
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
