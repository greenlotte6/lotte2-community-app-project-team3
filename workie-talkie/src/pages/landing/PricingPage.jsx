import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const PricingPage = () => {
  return (
    <div id="wrapper">
      <Header />
      <div className="empty-box" />

      <main>
        <h1>프라이싱 페이지</h1>
        <p>요금제 상세 페이지입니다.</p>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
