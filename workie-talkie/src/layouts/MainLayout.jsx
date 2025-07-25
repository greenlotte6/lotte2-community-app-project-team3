import React from "react";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Aside } from "../components/setting/Aside";

export const MainLayout = ({ children }) => {
  return (
    <div className="container">
      <Header />
      <div className="main-layout">{children}</div>
      <Footer />
    </div>
  );
};
