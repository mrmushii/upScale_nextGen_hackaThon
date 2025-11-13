import Hero from "@/components/Hero";
import WhyStandOut from "@/components/WhyStandOut";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Statistics from "@/components/Statistics";
import Steps from "@/components/Steps";
import Testimonials from "@/components/Testimonials";
import PaymentPartners from "@/components/PaymentPartners";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <WhyStandOut />
      <Features />
      <HowItWorks />
      <Statistics />
      <Steps />
      <Pricing />
      <Testimonials />
      <PaymentPartners />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}

