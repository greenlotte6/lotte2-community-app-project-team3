import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventModal } from "./EventModal";
import { deleteCalendar, getCalendar } from "../../api/calendarAPI";

export const CalendarComponent = ({ events, setEvents }) => {
  const calendarRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [currentEventData, setCurrentEventData] = useState({
    // 모달에 전달하고 모달에서 수정할 데이터
    title: "",
    startDate: "",
    endDate: "",
    allDay: false,
    description: "",
    backgroundColor: "#3788d8", // 기본 색상
  });

  // 🔄 서버로부터 일정 목록 불러오기
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getCalendar(); // ✅ getCalendar() 사용
        console.log(data);

        const converted = data.map((item) => ({
          id: item.cno,
          title: item.title,
          start: item.startDate,
          end: item.endDate,
          allDay: item.allDay,
          backgroundColor: item.backgroundColor,
          borderColor: item.backgroundColor,
          extendedProps: {
            description: item.description,
          },
        }));
        setEvents(converted); // ➡️ FullCalendar의 events state에 저장
      } catch (err) {
        console.error("일정 불러오기 실패", err);
      }
    };
    loadEvents();
  }, []);

  const handleDateSelect = (arg) => {
    setCurrentEventData({
      title: "",
      startDate: arg.startStr,
      endDate: arg.endStr,
      allDay: arg.allDay,
      description: "",
      backgroundColor: "",
    });
    setIsRegisterModalOpen(true);
  };

  const handleEventClick = (info) => {
    const event = info.event;

    setSelectedEvent(event); // 삭제 등에 사용 예정
    setCurrentEventData({
      id: event.id, // DB의 cno
      title: event.title,
      startDate: event.startStr,
      endDate: event.endStr || event.startStr,
      allDay: event.allDay,
      description: event.extendedProps.description || "",
      backgroundColor: event.backgroundColor || "#4b6986",
    });
    setIsDetailModalOpen(true);
  };

  const deleteEvent = async () => {
    if (selectedEvent && window.confirm("정말 이 일정을 삭제하시겠습니까?")) {
      try {
        await deleteCalendar(selectedEvent.id); // ✅ 백엔드에 삭제 요청
        console.log("삭제 요청 ID:", selectedEvent.id);

        selectedEvent.remove(); // ✅ 성공하면 캘린더에서 제거
        setIsDetailModalOpen(false);
        setSelectedEvent(null);
      } catch (err) {
        alert("일정 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      <FullCalendar
        contentHeight="75vh"
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today addEventButton",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        customButtons={{
          addEventButton: {
            text: "일정 등록",
            click: () => {
              setIsRegisterModalOpen(true);
            },
          },
        }}
        locale="ko"
        selectable={true}
        editable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        events={events}
        // 이벤트 드래그&리사이즈 시 호출
        eventDrop={(info) => {
          // 드롭된 이벤트의 새 시작/종료 시간을 currentEventData에 반영
          setCurrentEventData((prev) => ({
            ...prev,
            id: info.event.id,
            startDate: info.event.startStr,
            endDate: info.event.endStr || info.event.startStr,
            allDay: info.event.allDay,
          }));
          // 여기서 서버에 변경된 일정 정보를 저장하는 API 호출 등을 할 수 있습니다.
          console.log(
            "Event dropped:",
            info.event.id,
            info.event.startStr,
            info.event.endStr
          );
        }}
        eventResize={(info) => {
          // 리사이즈된 이벤트의 새 시작/종료 시간을 currentEventData에 반영
          setCurrentEventData((prev) => ({
            ...prev,
            id: info.event.id,
            startDate: info.event.startStr,
            endDate: info.event.endStr || info.event.startStr,
            allDay: info.event.allDay,
          }));
          // 여기서 서버에 변경된 일정 정보를 저장하는 API 호출 등을 할 수 있습니다.
          console.log(
            "Event resized:",
            info.event.id,
            info.event.startStr,
            info.event.endStr
          );
        }}
      />

      {/* 일정 등록 모달 */}
      <EventModal
        isOpen={isRegisterModalOpen} // CalendarComponent의 상태와 연결
        onClose={() => setIsRegisterModalOpen(false)} // 닫기 함수 전달
        eventData={currentEventData} // 모달에 보여줄 데이터
        calendarRef={calendarRef}
        mode="create"
      />

      {/* 일정 상세/수정 모달 */}
      <EventModal
        isOpen={isDetailModalOpen} // CalendarComponent의 상태와 연결
        onClose={() => setIsDetailModalOpen(false)} // 닫기 함수 전달
        onDelete={deleteEvent} // 삭제 버튼 클릭 시 호출될 함수
        eventData={currentEventData} // 모달에 보여줄 데이터
        calendarRef={calendarRef}
        mode="edit"
      />
    </>
  );
};
