import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { postCalendar } from "../../api/userAPI";
import { useNavigate } from "react-router-dom";

const initState = {
  writer: "",
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  backgroundColor: "#4b6986",
};

export const EventModal = ({ isOpen, onClose, onDelete }) => {
  const [calendar, setCalendar] = useState({ ...initState });
  const navigate = useNavigate();

  if (!isOpen) return null; // isOpen이 false면 아무것도 렌더링 X

  //핸들러
  const changeHandler = (e) => {
    e.preventDefault();
    setCalendar({ ...calendar, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(calendar);

    //필드 검사(1차)
    if (
      !calendar.title ||
      !calendar.startDate ||
      !calendar.endDate ||
      !calendar.backgroundColor
    ) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    //전송
    const fetchData = async () => {
      try {
        const data = await postCalendar(calendar);
        console.log(data);

        alert("일정 등록 완료!");
      } catch (err) {
        alert("입력하신 정보를 다시 한 번 확인 해주세요");
        console.error(err);
      }
    };
    fetchData();
  };

  const allDayHandler = (e) => {
    const checked = e.target.checked;
    const startDate = calendar.startDate?.substring(0, 10);
    const endDate = calendar.endDate?.substring(0, 10);

    setCalendar({
      ...calendar,
      allDay: checked,
      start: checked && startDate ? `${startDate}T00:00` : calendar.startDate,
      end: checked && endDate ? `${endDate}T23:59` : calendar.endDate,
    });
  };

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
        <h3>{calendar.id ? "일정 수정" : "일정 등록"}</h3>
        <form onSubmit={submitHandler}>
          <label>제목</label>
          <input
            id="title"
            type="text"
            name="title"
            value={calendar.title || ""} // 기본값 설정하여 undefined 에러 방지
            onChange={changeHandler}
          />
          <div className="date-time-fields">
            <div className="date-time-field-group">
              <label>시작 날짜</label>
              <input
                id="start"
                type="datetime-local"
                name="startDate"
                value={calendar.startDate}
                onChange={changeHandler}
              />
            </div>
            <div className="date-time-field-group">
              <label>종료 날짜</label>
              <input
                id="end"
                type="datetime-local"
                name="endDate"
                value={calendar.endDate}
                onChange={changeHandler}
              />
            </div>
          </div>

          <div className="allday-field">
            <label>종일 여부</label>
            <input
              id="allDay"
              type="checkbox"
              name="allDay"
              checked={!!calendar.allDay} // boolean 값으로 명확히 변환
              onChange={allDayHandler}
            />
          </div>

          <label>설명</label>
          <textarea
            id="description"
            name="description"
            value={calendar.description || ""}
            onChange={changeHandler}
          />

          <label>색상</label>
          <input
            id="backgroundColor"
            type="color"
            name="backgroundColor"
            value={calendar.backgroundColor || "#3788d8"} // 기본 색상
            onChange={changeHandler}
          />
          <div className="modal-buttons">
            {calendar.cno && ( // eventData.id가 있을 때만 삭제 버튼 표시
              <button className="delete-btn" type="button" onClick={onDelete}>
                삭제
              </button>
            )}
            <button className="cancel-btn" type="button" onClick={onClose}>
              취소
            </button>
            <button className="submit-btn" type="submit">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root") // 이 모달을 렌더링할 DOM 엘리먼트 (public/index.html에 추가)
  );
};
