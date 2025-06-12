import React, { useEffect, useState } from "react";
import { CalendarLayout } from "../../layouts/CalendarLayout";
import { CalendarComponent } from "../../components/calendar/CalendarComponent";
import { useLoginStore } from "../../stores/useLoginStore";
import { useNavigate } from "react-router-dom";
import { getCalendar } from "../../api/userAPI";
import { SidePanel } from "../../components/calendar/SidePanel";

export const CalendarPage = () => {
  const user = useLoginStore((state) => state.user);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/user/login");
      return;
    }

    getCalendar()
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user, navigate]);

  return user ? (
    <CalendarLayout>
      <main className="main-content" id="calendar">
        <div id="calender-side">
          <SidePanel events={events} />
        </div>
        <div id="calendar-container">
          <CalendarComponent events={events} setEvents={setEvents} />
        </div>
      </main>
    </CalendarLayout>
  ) : null;
};
