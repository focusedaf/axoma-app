"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Complete System Check",
    description:
      "Verify camera, microphone, and device compatibility before starting.",
  },
  {
    title: "Verify Identity",
    description:
      "Confirm your identity using live verification before accessing the exam.",
  },
  {
    title: "Take Your Exam",
    description:
      "Focus on answering questions while monitoring runs securely in the background.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">Simple & Secure Process</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full">
                <div className="text-3xl font-bold text-slate-300 mb-4">
                  {i + 1}
                </div>
                <h3 className="text-xl mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
