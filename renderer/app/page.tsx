import Navbar from "@/components/ui-elements/landing/Navbar";
import Hero from "@/components/ui-elements/landing/Hero";
import Features from "@/components/ui-elements/landing/Features";
import HowItWorks from "@/components/ui-elements/landing/HowItWorks";
import SystemRequirements from "@/components/ui-elements/landing/SystemRequirements";
import Footer from "@/components/ui-elements/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section id="hero">
        <Hero />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="requirements">
        <SystemRequirements />
      </section>
      <Footer />
    </div>
  );
}
