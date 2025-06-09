import React from "react";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Aside } from "../components/drive/Aside";

export const DriveLayout = ({ children }) => {
  return (
    <div id="drive-container">
      <div className="container">
        <Header />
        <div className="main-layout">
          <Aside />
          <main className="main">{children}</main>
        </div>
        <Footer />
      </div>
    </div>
  );
};
