import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventModal } from "./EventModal";

export const CalendarComponent = () => {
  const calendarRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [currentEventData, setCurrentEventData] = useState({
    // 모달에 전달하고 모달에서 수정할 데이터
    title: "",
    startDate: "",
    endDate: "",
    allDay: false,
    description: "",
    backgroundColor: "#3788d8", // 기본 색상
  });

  // EventModal 내부 입력 필드 변경을 처리하는 공통 핸들러
  const handleEventDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentEventData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateSelect = (arg) => {
    setCurrentEventData({
      title: "",
      startDate: arg.startStr,
      endDate: arg.endStr,
      allDay: arg.allDay,
      description: "",
      backgroundColor: "#3788d8",
    });
    setIsRegisterModalOpen(true);
  };

  const handleEventClick = (info) => {
    const event = info.event;
    setSelectedEvent(event);
    setFormData({
      title: event.title.split(" / ")[0],
      startDate: event.startStr,
      endDate: event.endStr || event.startStr,
      allDay: event.allDay,
      location: event.extendedProps.location || "",
      description: event.extendedProps.description || "",
      backgroundColor: event.backgroundColor || "#3788d8",
    });
    setIsDetailModalOpen(true);
  };

  const addEvent = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent({
      ...currentEventData,
      title:
        currentEventData.title +
        (currentEventData.location ? ` / ${currentEventData.location}` : ""),
      extendedProps: {
        description: currentEventData.description,
        location: currentEventData.location,
      },

      borderColor: currentEventData.backgroundColor,
    });
    setIsRegisterModalOpen(false);

    setCurrentEventData({
      title: "",
      startDate: "",
      endDate: "",
      allDay: false,
      description: "",
      backgroundColor: "#3788d8",
    });
  };

  const updateEvent = () => {
    if (!selectedEvent) return; // 선택된 이벤트가 없으면 함수 종료

    // FullCalendar Event 객체의 속성 업데이트
    selectedEvent.setProp(
      "title",
      currentEventData.title +
        (currentEventData.location ? ` / ${currentEventData.location}` : "")
    );
    selectedEvent.setStart(currentEventData.start);
    selectedEvent.setEnd(currentEventData.end);
    selectedEvent.setAllDay(currentEventData.allDay);
    selectedEvent.setExtendedProp("description", currentEventData.description);
    selectedEvent.setExtendedProp("location", currentEventData.location); // location 업데이트
    selectedEvent.setProp("backgroundColor", currentEventData.backgroundColor);
    selectedEvent.setProp("borderColor", currentEventData.backgroundColor);

    setIsDetailModalOpen(false); // 모달 닫기
    setSelectedEvent(null); // 선택된 이벤트 초기화
    // 모달 닫은 후 상태 초기화
    setCurrentEventData({
      title: "",
      startDate: "",
      endDate: "",
      allDay: false,
      description: "",
      backgroundColor: "#3788d8",
    });
  };

  const deleteEvent = () => {
    if (selectedEvent && window.confirm("정말 이 일정을 삭제하시겠습니까?")) {
      selectedEvent.remove(); // FullCalendar에서 이벤트 제거
      setIsDetailModalOpen(false); // 모달 닫기
      setSelectedEvent(null); // 선택된 이벤트 초기화
      // 모달 닫은 후 상태 초기화
      setCurrentEventData({
        title: "",
        startDate: "",
        endDate: "",
        allDay: false,
        description: "",
        backgroundColor: "#3788d8",
      });
    }
  };
  return (
    <div id="calendar-container">
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
              setFormData({});
              setIsRegisterModalOpen(true);
            },
          },
        }}
        locale="ko"
        selectable={true}
        editable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        events={null}
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
        onSubmit={addEvent} // 등록 버튼 클릭 시 호출될 함수
        eventData={currentEventData} // 모달에 보여줄 데이터
        onChange={handleEventDataChange} // 모달 내부 입력 변경 시 호출될 함수
      />

      {/* 일정 상세/수정 모달 */}
      <EventModal
        isOpen={isDetailModalOpen} // CalendarComponent의 상태와 연결
        onClose={() => setIsDetailModalOpen(false)} // 닫기 함수 전달
        onSubmit={updateEvent} // 수정 버튼 클릭 시 호출될 함수
        onDelete={deleteEvent} // 삭제 버튼 클릭 시 호출될 함수
        eventData={currentEventData} // 모달에 보여줄 데이터
        onChange={handleEventDataChange} // 모달 내부 입력 변경 시 호출될 함수
      />
    </div>
  );
};
