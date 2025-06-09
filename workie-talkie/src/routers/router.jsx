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
import { Main } from "../pages/dashboard/Main";
import { BoardMain } from "../pages/board/BoardMain";
import { BoardList } from "../pages/board/BoardList";
import { Login } from "../pages/user/Login";
import { Policies } from "../pages/user/Policies";
import { Register } from "../pages/user/Register";
import { FindId } from "../pages/user/FindId";
import { FindPw } from "../pages/user/FindPw";
import { FindResult } from "../pages/user/FindResult";
import Drivepage from "../pages/drive/Drivepage";
import { CalendarPage } from "../pages/calendar/CalendarPage";
import { Member } from "../pages/setting/Member";
import { ProjectMain } from "../pages/project/ProjectMain";
import { ProjectDetails } from "../pages/project/ProjectDetails";

// 랜딩페이지
//import IntroPage from "../pages/landing/IntroPage";
//import PricingPage from "../pages/landing/PricingPage";
//import FAQPage from "../pages/landing/FAQPage";

//라우터 생성

const router = createBrowserRouter([
  { path: "/", element: null },
  { path: "/user/login", element: <Login /> },
  { path: "/user/policies", element: <Policies /> },
  { path: "/user/register", element: <Register /> },
  { path: "/user/findId", element: <FindId /> },
  { path: "/user/findPw", element: <FindPw /> },
  { path: "/user/findResult", element: <FindResult /> },
  { path: "/dashboard/main", element: <Main /> },
  { path: "/setting/profile", element: <Profile /> },
  { path: "/setting/page", element: <Page /> },
  { path: "/setting/message", element: <Message /> },
  { path: "/setting/autoMessage", element: <AutoMessage /> },
  { path: "/setting/calendar", element: <Calendar /> },
  { path: "/setting/project", element: <Project /> },
  { path: "/setting/drive", element: <Drive /> },
  { path: "/setting/board", element: <Board /> },
  { path: "/setting/plan", element: <Plan /> },
  { path: "/setting/member", element: <Member /> },
  { path: "/board/main", element: <BoardMain /> },
  { path: "/board/list", element: <BoardList /> },

  { path: "/drive", element: <Drivepage /> },
  { path: "/calendar", element: <CalendarPage /> },

  { path: "/project", element: <ProjectMain /> },
  { path: "/project/details", element: <ProjectDetails /> },

  // 랜딩 페이지들
  //{ path: "/", element: <IntroPage /> },
  //{ path: "/pricing", element: <PricingPage /> },
  //{ path: "/faq", element: <FAQPage /> },
]);

// 라우터 내보내기
export default router;
