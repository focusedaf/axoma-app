import React from "react";
import { Button } from "@/components/ui/button";
import { StepProgress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface OLProps {
  children: React.ReactNode;
  className?: string;
  step: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  hideBack?: boolean;
  isNextDisabled?: boolean;
}

export const OL: React.FC<OLProps> = ({
  children,
  className,
  step,
  totalSteps,
  onBack,
  onNext,
  nextLabel = "Continue",
  hideBack = false,
  isNextDisabled = false,
}) => {
  return (
    <div className={cn("max-w-3xl mx-auto px-4 py-8", className)}>
      <div className="mb-8">
        <StepProgress currentStep={step} totalSteps={totalSteps} />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {children}

        <div
          className={cn(
            "mt-8 pt-6 border-t border-gray-200",
            hideBack ? "flex justify-center" : "flex justify-between",
          )}
        >
          {!hideBack && (
            <Button variant="outline" onClick={onBack}>
              ← Back
            </Button>
          )}
          <Button onClick={onNext} disabled={isNextDisabled}>
            {nextLabel} →
          </Button>
        </div>
      </div>
    </div>
  );
};
