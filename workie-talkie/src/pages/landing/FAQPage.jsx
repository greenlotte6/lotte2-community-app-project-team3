import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const FAQPage = () => {
  return (
    <div id="wrapper">
      <Header />
      <div className="empty-box" />

      <main>
        <h1>FAQ 페이지</h1>
        <p>자주 묻는 질문 페이지입니다.</p>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;
