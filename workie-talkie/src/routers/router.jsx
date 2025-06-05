import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Profile } from "../pages/setting/profile";
import { Page } from "../pages/setting/Page";
import { Project } from "../pages/setting/Project";
import { Board } from "../pages/setting/Board";
import { Calendar } from "../pages/setting/Calendar";
import { Message } from "../pages/setting/Message";
import { AutoMessage } from "../pages/setting/AutoMessage";
import { Drive } from "../pages/setting/Drive";
import { Plan } from "../pages/setting/Plan";
import { Dashboard } from "../pages/dashboard/dashboard";

//라우터 생성

const router = createBrowserRouter([
  { path: "/", element: null },
  { path: "/dashboard/dashboard", element: <Dashboard /> },
  { path: "/setting/profile", element: <Profile /> },
  { path: "/setting/page", element: <Page /> },
  { path: "/setting/message", element: <Message /> },
  { path: "/setting/autoMessage", element: <AutoMessage /> },
  { path: "/setting/calendar", element: <Calendar /> },
  { path: "/setting/project", element: <Project /> },
  { path: "/setting/drive", element: <Drive /> },
  { path: "/setting/board", element: <Board /> },
  { path: "/setting/plan", element: <Plan /> },
]);

// 라우터 내보내기
export default router;
