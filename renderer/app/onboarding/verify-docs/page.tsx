"use client";

import VerifyDocsForm from "@/components/ui-elements/forms/verifyDocs-form";
import { useOnboarding } from "@/context/OnboardingContext";

export default function VerifyDocsPage() {
  const { setDocsUploaded } = useOnboarding();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Verify Your Documents</h2>

      <VerifyDocsForm onUploadSuccess={() => setDocsUploaded(true)} />
    </div>
  );
}
