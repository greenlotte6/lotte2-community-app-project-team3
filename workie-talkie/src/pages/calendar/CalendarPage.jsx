import React from "react";
import { CalendarLayout } from "../../layouts/CalendarLayout";
import { CalendarComponent } from "../../components/calendar/CalendarComponent";

export const CalendarPage = () => {
  return (
    <CalendarLayout>
      <main className="main-content" id="calendar">
        <CalendarComponent />
      </main>
    </CalendarLayout>
  );
};
