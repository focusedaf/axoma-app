import React from "react";
import { ArrowBigRight } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col justify-center items-center text-center space-y-6 px-4">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to Axoma!</h1>
      <p className="text-lg text-gray-600">
        Let's get your profile set up. This will only take 2 minutes.
      </p>

      <div className="space-y-5 flex flex-col text-lg font-semibold justify-center max-w-md mx-auto mt-8 text-gray-700">
        {[
          "Complete your profile",
          "Verify your credentials",
          "Get access to the platform",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <ArrowBigRight className="h-4 w-4" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
