import React from "react";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Aside } from "../components/setting/Aside";

export const SettingLayout = ({ children }) => {
  return (
    <div className="container">
      <Header />
      <div className="main-layout">
        <Aside />
        {children}
      </div>
      <Footer />
    </div>
  );
};
