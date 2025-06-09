import React from "react";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Aside } from "../components/drive/Aside";

export const DriveLayout = ({ children }) => {
  return (
    <div className="container">
      <Header />
      <div className="main-layout" id="drive-container">
        <Aside />
        {children}
      </div>
      <Footer />
    </div>
  );
};
