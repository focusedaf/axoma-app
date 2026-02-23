"use client";

import React, { ReactNode } from "react";
import { OL } from "@/components/layout/OnboardingLayout";
import { usePathname, useRouter } from "next/navigation";

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getStepInfo = () => {
    switch (pathname) {
      case "/onboarding":
        return {
          step: 1,
          totalSteps: 4,
          hideBack: true,
          nextLabel: "Get Started",
          nextRoute: "/onboarding/profile",
        };

      case "/onboarding/profile":
        return {
          step: 2,
          totalSteps: 4,
          hideBack: false,
          nextLabel: "Continue",
          nextRoute: null,
        };

      case "/onboarding/verify-docs":
        return {
          step: 3,
          totalSteps: 4,
          hideBack: false,
          nextLabel: "Submit",
          nextRoute: "/onboarding/success",
        };

      case "/onboarding/success":
        return {
          step: 4,
          totalSteps: 4,
          hideBack: true,
          nextLabel: "Go to Dashboard",
          nextRoute: "/issuer-dashboard",
        };

      default:
        return {
          step: 1,
          totalSteps: 4,
          hideBack: true,
          nextLabel: "Get Started",
          nextRoute: "/onboarding/profile",
        };
    }
  };

  const { step, totalSteps, hideBack, nextLabel, nextRoute } = getStepInfo();

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (pathname === "/onboarding/profile") {
      const form = document.getElementById(
        "profile-form",
      ) as HTMLFormElement | null;

      form?.requestSubmit();
      return;
    }

    if (nextRoute) {
      router.push(nextRoute);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-50">
      <OL
        step={step}
        totalSteps={totalSteps}
        onBack={handleBack}
        onNext={handleNext}
        hideBack={hideBack}
        nextLabel={nextLabel}
      >
        {children}
      </OL>
    </div>
  );
}
