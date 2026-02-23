"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type OnboardingContextType = {
  step: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
};

const steps = [
  "/onboarding/profile",
  "/onboarding/verify-docs",
  "/onboarding/success",
];

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const totalSteps = steps.length;

  const [step, setStep] = useState(1);

  useEffect(() => {
    const index = steps.indexOf(pathname);
    if (index !== -1) setStep(index + 1);
  }, [pathname]);

  const nextStep = () => {
    if (step < totalSteps) {
      router.push(steps[step]);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      router.push(steps[step - 2]);
    }
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= totalSteps) {
      router.push(steps[stepNumber - 1]);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{ step, totalSteps, nextStep, prevStep, goToStep }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside provider");
  return ctx;
};
