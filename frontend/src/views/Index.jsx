"use client";

import ParticleField from "@/components/landing/ParticleField";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSolution from "@/components/landing/ProblemSolution";
import ScenariosSection from "@/components/landing/ScenariosSection";
import SavingsCalculator from "@/components/landing/SavingsCalculator";
import ProductSection from "@/components/landing/ProductSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";
const Index = () => (<div className="relative">
    <ParticleField />
    <Navbar />
    <HeroSection />
    <ProblemSolution />
    <ScenariosSection />
    <SavingsCalculator />
    <ProductSection />
    <Footer />
  </div>);
export default Index;
