import { format, isWithinInterval, addDays, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";

export const SidePanel = ({ events = [] }) => {
  const dateOnly = (d) => startOfDay(new Date(d));
  const today = startOfDay(new Date());
  const upcomingDates = Array.from({ length: 3 }, (_, i) =>
    addDays(today, i + 1)
  );

  const todayEvents = events.filter((event) => {
    const start = new Date(event.start);
    const end = new Date(event.end || event.start);
    return isWithinInterval(today, { start, end });
  });

  const upcomingEventsRaw = events.filter((event) => {
    const start = new Date(event.start);
    const end = new Date(event.end || event.start);
    return upcomingDates.some((date) =>
      isWithinInterval(dateOnly(date), {
        start: dateOnly(event.start),
        end: dateOnly(event.end || event.start),
      })
    );
  });

  // 📌 날짜별로 일정 필터링 (정확한 표시용)
  const upcomingEventsGrouped = upcomingDates.reduce((acc, date) => {
    const groupKey = format(date, "yyyy-MM-dd");
    const matched = events.filter((event) => {
      const start = new Date(event.start);
      const end = new Date(event.end || event.start);
      return isWithinInterval(dateOnly(date), {
        start: dateOnly(event.start),
        end: dateOnly(event.end || event.start),
      });
    });

    if (matched.length > 0) {
      acc[groupKey] = matched;
    }

    return acc;
  }, {});
  const formatTime = (dateStr) => format(new Date(dateStr), "HH:mm");

  return (
    <>
      <section className="side-panel-section today-section">
        <h4>📅 오늘의 일정</h4>
        <div className="date-header">
          📆 {format(new Date(today), "M월 d일 (EEE)", { locale: ko })}
        </div>
        <ul className="event-list">
          {todayEvents.length > 0 ? (
            todayEvents.map((event) => (
              <li key={event.id} className="event-item">
                <span className="event-time">{formatTime(event.start)}</span>
                <span className="event-title">{event.title}</span>
              </li>
            ))
          ) : (
            <li className="event-empty">일정 없음</li>
          )}
        </ul>
      </section>

      <section className="side-panel-section upcoming-section">
        <h4>🔜 다가오는 일정</h4>
        {Object.keys(upcomingEventsGrouped).length > 0 ? (
          Object.entries(upcomingEventsGrouped).map(([date, eventList]) => (
            <div className="event-group" key={date}>
              <div className="date-header">
                📆 {format(new Date(date), "M월 d일 (EEE)", { locale: ko })}
              </div>
              <ul className="event-list">
                {eventList.map((event) => (
                  <li key={event.id} className="event-item">
                    <span className="event-time">
                      {formatTime(event.start)}
                    </span>
                    <span className="event-title">{event.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="event-empty">예정된 일정 없음</p>
        )}
      </section>

      <section className="side-panel-section stats-section">
        <h4>📊 일정 통계</h4>
        <p>
          총 일정: <strong>{events.length}개</strong>
        </p>
        <p>
          이번 주:{" "}
          <strong>{todayEvents.length + upcomingEventsRaw.length}개</strong>
        </p>
      </section>
    </>
  );
};
