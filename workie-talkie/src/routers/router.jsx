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
  { path: "/board/main", element: <BoardMain /> },
  { path: "/board/list", element: <BoardList /> },
]);

// 라우터 내보내기
export default router;
