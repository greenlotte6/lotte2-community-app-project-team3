import { useState } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { RouterProvider } from "react-router-dom";
import router from "./routers/router";
import "./styles/index.scss";
import "./styles/imports/settings.scss";
import "./styles/imports/dashboards.scss";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
