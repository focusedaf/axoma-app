"use client";

import { OL } from "@/components/layout/OnboardingLayout";
import { OnboardingProvider, useOnboarding } from "@/context/OnboardingContext";
import { usePathname, useRouter } from "next/navigation";

function OnboardingInner({ children }: { children: React.ReactNode }) {
  const {
    step,
    totalSteps,
    nextStep,
    prevStep,
    docsUploaded, 
  } = useOnboarding();

  const pathname = usePathname();
  const router = useRouter();

  const isFirstStep = step === 1;
  const isLastStep = step === totalSteps;

  const getNextLabel = () => {
    if (step === 1) return "Get Started";
    if (isLastStep) return "Go to Dashboard";
    return "Continue";
  };

  const getFormId = () => {
    if (pathname === "/onboarding/profile") return "profile-form";
    if (pathname === "/onboarding/verify-docs") return "verify-docs-form";
    return undefined;
  };

  const handleNext = () => {
    if (isLastStep) {
      router.push("/dashboard");
    } else {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-50">
      <OL
        step={step}
        totalSteps={totalSteps}
        onBack={!isFirstStep ? prevStep : undefined}
        onNext={handleNext}
        hideBack={isFirstStep || isLastStep}
        nextLabel={getNextLabel()}
        formId={getFormId()}
        isNextDisabled={pathname === "/onboarding/verify-docs" && !docsUploaded}
      >
        {children}
      </OL>
    </div>
  );
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <OnboardingInner>{children}</OnboardingInner>
    </OnboardingProvider>
  );
}
