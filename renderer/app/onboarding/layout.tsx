"use client";

import { usePathname, useRouter } from "next/navigation";
import { OL } from "@/components/layout/OnboardingLayout";
import { OnboardingProvider } from "@/context/OnboardingContext";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const getStepInfo = () => {
    switch (pathname) {
      case "/onboarding":
        return {
          step: 1,
          hideBack: true,
          nextRoute: "/onboarding/profile",
        };

      case "/onboarding/profile":
        return {
          step: 2,
          hideBack: false,
          formId: "profile-form",
          backRoute: "/onboarding",
        };

      case "/onboarding/verify-docs":
        return {
          step: 3,
          hideBack: false,
          formId: "verify-docs-form",
          backRoute: "/onboarding/profile",
        };

      case "/onboarding/success":
        return {
          step: 4,
          hideBack: true,
          nextRoute: "/dashboard",
        };

      default:
        return {
          step: 1,
          hideBack: true,
          nextRoute: "/onboarding/profile",
        };
    }
  };

  const { step, hideBack, nextRoute, formId, backRoute } = getStepInfo();

  const handleBack = () => {
    if (backRoute) router.push(backRoute);
  };

  const handleNext = () => {
    if (nextRoute) router.push(nextRoute);
  };

  return (
    <OnboardingProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-50">
        <OL
          step={step}
          totalSteps={4}
          onBack={handleBack}
          onNext={handleNext}
          hideBack={hideBack}
          formId={formId}
        >
          {children}
        </OL>
      </div>
    </OnboardingProvider>
  );
}
