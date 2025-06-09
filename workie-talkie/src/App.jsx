import { useState } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { RouterProvider } from "react-router-dom";
import router from "./routers/router";
import "./styles/index.scss";
import "./styles/imports/settings.scss";
import "./styles/imports/dashboards.scss";
import "./styles/imports/boards.scss";
import "./styles/imports/users.scss";
import "./styles/imports/drive.scss";
import "./styles/imports/chats.scss";
// import "./styles/landing/intro.scss";
// import "./styles/landing/pricing.scss";
// import "./styles/landing/faq.scss";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
