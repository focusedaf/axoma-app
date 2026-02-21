"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-6 text-center max-w-3xl">
        <motion.h1
          className="text-4xl md:text-6xl font-semibold text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Secure. Monitored. Distraction-Free.
        </motion.h1>

        <motion.p
          className="mt-6 text-gray-600 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Focus on your exam while we ensure a safe and fair environment through
          real-time monitoring and system protection.
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button size="lg">Start System Check</Button>
          <Button size="lg" variant="outline">
            View Requirements
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
