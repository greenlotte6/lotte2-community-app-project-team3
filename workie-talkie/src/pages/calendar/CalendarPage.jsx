import React, { useEffect } from "react";
import { CalendarLayout } from "../../layouts/CalendarLayout";
import { CalendarComponent } from "../../components/calendar/CalendarComponent";
import { useLoginStore } from "../../stores/useLoginStore";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CALENDAR } from "../../api/http";
import { getCalendar } from "../../api/userAPI";

export const CalendarPage = () => {
  const user = useLoginStore((state) => state.user);
  const navigate = useNavigate();

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
        <CalendarComponent />
      </main>
    </CalendarLayout>
  ) : null;
};
