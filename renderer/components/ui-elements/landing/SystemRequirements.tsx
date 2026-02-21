"use client";

import { Card } from "@/components/ui/card";

export default function SystemRequirements() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">System Requirements</h2>
          <p className="text-gray-600">
            Ensure your system meets the following requirements before starting.
          </p>
        </div>

        <Card className="p-8 space-y-4">
          <ul className="space-y-3 text-gray-700">
            <li>• Windows 10 or later</li>
            <li>• Minimum 8GB RAM recommended</li>
            <li>• Working webcam (required)</li>
            <li>• Working microphone (required)</li>
            <li>• Stable internet connection</li>
            <li>• Single monitor setup recommended</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}
