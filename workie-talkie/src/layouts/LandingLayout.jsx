import React from "react";
import { Header } from "../components/landing/Header";
import { Footer } from "../components/common/Footer";

export const LandingLayout = ({ children }) => {
  return (
    <div id="wrapper">
      <Header />
      {children}
      <Footer />
    </div>
  );
};
