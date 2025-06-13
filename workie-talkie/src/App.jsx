import { useState } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { RouterProvider } from "react-router-dom";
import router from "./routers/router";
import "./styles/index.scss";
import "./styles/imports/settings.scss";
import "./styles/imports/dashboards.scss";
import "./styles/imports/boards.scss";
import "./styles/imports/users.scss";
import "./styles/imports/pages.scss";
import "./styles/imports/drive.scss";
import "./styles/imports/chats.scss";
import "./styles/imports/landings.scss";
import "./styles/imports/calendar.scss";
import "./styles/imports/projects.scss";
/*
  npm install  
  npm install quill
  npm install sockjs-client @stomp/stompjs
  npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
  npm install date-fns
*/
function App() {
  return <RouterProvider router={router} />;
}

export default App;
