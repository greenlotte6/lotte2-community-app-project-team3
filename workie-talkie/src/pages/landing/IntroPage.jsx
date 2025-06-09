import React from "react";
import { Header } from "../../components/landing/Header";
import { HeroSection } from "../../components/landing/HeroSection";
import { FeaturesSection } from "../../components/landing/FeatureSection";
import { WorkspaceTitle } from "../../components/landing/WorkspaceTitle";
import { InteractiveSection } from "../../components/landing/InteractiveSection";
import { PricingSection } from "../../components/landing/PricingSection";
import { FAQSection } from "../../components/landing/FAQSection";
import { Footer } from "../../components/common/Footer";
import "../../styles/landing/intro.scss";

const IntroPage = () => {
  return (
    <div id="intro-page">
      <Header />
      <div className="empty-box" />

      <main>
        <div className="main-wrapper">
          <div className="main-content">
            <HeroSection />
            <FeaturesSection />
          </div>
        </div>

        <WorkspaceTitle />
        <InteractiveSection />
        <PricingSection />
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
};

export { IntroPage };
