import React from "react";
import { HeroSection } from "../../components/landing/HeroSection";
import { FeaturesSection } from "../../components/landing/FeatureSection";
import { WorkspaceTitle } from "../../components/landing/WorkspaceTitle";
import { InteractiveSection } from "../../components/landing/InteractiveSection";
import { PricingSection } from "../../components/landing/PricingSection";
import { FAQSection } from "../../components/landing/FAQSection";
import { LandingLayout } from "../../layouts/LandingLayout";

const IntroPage = () => {
  return (
    <div id="intro-page">
      <LandingLayout>
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
      </LandingLayout>
    </div>
  );
};

export { IntroPage };
