import React from "react";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";

export const CalendarLayout = ({ children }) => {
  return (
    <div className="container">
      <Header />
      <div className="main-layout">{children}</div>
      <Footer />
    </div>
  );
};
