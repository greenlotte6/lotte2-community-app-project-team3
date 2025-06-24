import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { postCalendar, putCalendar } from "../../api/calendarAPI";

const initState = {
  writer: "",
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  backgroundColor: "#4b6986",
};

export const EventModal = ({
  isOpen,
  onClose,
  onDelete,
  calendarRef,
  mode,
  eventData,
}) => {
  const [calendar, setCalendar] = useState({ ...initState });
  const isEdit = mode === "edit";

  const formatDateForInput = (datetimeStr) => {
    if (!datetimeStr) return "";
    return datetimeStr.slice(0, 16); // "2025-06-12T14:30" 형식
  };

  useEffect(() => {
    if (eventData) {
      setCalendar({
        ...eventData,
        cno: eventData.id, // FullCalendar의 id를 cno로 사용
      });
    }
  }, [eventData]);

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
        const calendarApi = calendarRef?.current?.getApi();

        if (isEdit) {
          // 일정 수정
          const updatedData = {
            ...calendar,
            cno: calendar.cno || calendar.id,
            startDate: formatDateForInput(calendar.startDate),
            endDate: formatDateForInput(calendar.endDate),
          };

          console.log("📤 PUT 요청 데이터 확인", calendar);

          await putCalendar(updatedData);

          const existingEvent = calendarApi?.getEventById(calendar.id);

          if (existingEvent) {
            existingEvent.setProp("title", calendar.title);
            existingEvent.setStart(calendar.startDate);
            existingEvent.setEnd(calendar.endDate);
            existingEvent.setExtendedProp("description", calendar.description);
            existingEvent.setProp("backgroundColor", calendar.backgroundColor);
            existingEvent.setProp("borderColor", calendar.backgroundColor);
          }

          alert("일정이 수정되었습니다.");
        } else {
          // 일정 등록
          const data = await postCalendar(calendar);
          console.log("✅ 일정 등록 완료", data);

          const calendarApi = calendarRef?.current?.getApi();
          calendarApi?.addEvent({
            id: data.cno, // ← 등록 시 반환된 cno(PK)로 ID 지정
            title: calendar.title,
            start: calendar.startDate,
            end: calendar.endDate,
            allDay: calendar.allDay,
            backgroundColor: calendar.backgroundColor,
            borderColor: calendar.backgroundColor,
            extendedProps: {
              description: calendar.description,
            },
          });

          alert("일정 등록 완료!");
        }

        onClose(); // 모달 닫기
      } catch (err) {
        alert("입력하신 정보를 다시 한 번 확인 해주세요");
        console.error(err);
      }
    };
    fetchData();
  };

  //고쳐야됨**
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
        <h3>{isEdit ? "일정 수정" : "일정 등록"}</h3>

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
                value={formatDateForInput(calendar.startDate)}
                onChange={changeHandler}
              />
            </div>
            <div className="date-time-field-group">
              <label>종료 날짜</label>
              <input
                id="end"
                type="datetime-local"
                name="endDate"
                value={formatDateForInput(calendar.endDate)}
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
