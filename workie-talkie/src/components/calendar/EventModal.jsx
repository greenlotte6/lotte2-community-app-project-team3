import React from "react";
import ReactDOM from "react-dom";

export const EventModal = ({
  isOpen,
  onClose,
  onSubmit,
  eventData,
  onDelete,
  onChange,
}) => {
  if (!isOpen) return null; // isOpen이 false면 아무것도 렌더링 X

  // Portal을 사용하여 모달을 body 외부의 'modal-root'에 렌더링합니다.
  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      id="calendar-modal-container"
      onClick={onClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          ×
        </button>
        <h3>{eventData.id ? "일정 수정" : "일정 등록"}</h3>
        <label htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          name="title"
          value={eventData.title || ""} // 기본값 설정하여 undefined 에러 방지
          onChange={onChange}
        />
        <div className="allday-field">
          <label htmlFor="allDay">종일 여부</label>
          <input
            id="allDay"
            type="checkbox"
            name="allDay"
            checked={!!eventData.allDay} // boolean 값으로 명확히 변환
            onChange={onChange}
          />
        </div>
        <div className="date-time-fields">
          <div className="date-time-field-group">
            <label htmlFor="start">시작 날짜</label>
            <input
              id="start"
              type="datetime-local"
              name="start"
              value={eventData.start ? eventData.start.substring(0, 16) : ""}
              onChange={onChange}
            />
          </div>
          <div className="date-time-field-group">
            <label htmlFor="end">종료 날짜</label>
            <input
              id="end"
              type="datetime-local"
              name="end"
              value={eventData.end ? eventData.end.substring(0, 16) : ""}
              onChange={onChange}
            />
          </div>
        </div>
        <label htmlFor="description">설명</label>
        <textarea
          id="description"
          name="description"
          value={eventData.description || ""}
          onChange={onChange}
        />

        <label htmlFor="backgroundColor">색상</label>
        <input
          id="backgroundColor"
          type="color"
          name="backgroundColor"
          value={eventData.backgroundColor || "#3788d8"} // 기본 색상
          onChange={onChange}
        />
        <div className="modal-buttons">
          {eventData.id && ( // eventData.id가 있을 때만 삭제 버튼 표시
            <button className="delete-btn" type="button" onClick={onDelete}>
              삭제
            </button>
          )}
          <button className="cancel-btn" type="button" onClick={onClose}>
            취소
          </button>
          <button className="submit-btn" type="button" onClick={onSubmit}>
            저장
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") // 이 모달을 렌더링할 DOM 엘리먼트 (public/index.html에 추가)
  );
};
