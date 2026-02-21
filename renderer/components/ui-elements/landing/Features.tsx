"use client";

import { Card } from "@/components/ui/card";
import { Camera, Monitor, Shield, Lock } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Monitor,
    title: "Protected Exam Environment",
    description:
      "Prevents screen switching, background apps, and unauthorized access during the exam.",
  },
  {
    icon: Camera,
    title: "Live Camera & Microphone Monitoring",
    description:
      "Ensures identity verification and detects suspicious activity in real time.",
  },
  {
    icon: Shield,
    title: "Multi-Layer Integrity Checks",
    description:
      "Detects multi-monitor setups, developer tools, and abnormal system behavior.",
  },
  {
    icon: Lock,
    title: "Secure Exam Delivery",
    description:
      "Loads exam content securely and ensures tamper-resistant submissions.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">
            Built for a Fair Examination Experience
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything runs in a protected environment to maintain integrity and
            transparency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 hover:shadow-lg transition-shadow h-full">
                  <div className="mb-4 p-3 bg-slate-100 rounded-lg w-fit">
                    <Icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <h3 className="text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
