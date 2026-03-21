import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
const HeroSection = () => (<section className="relative min-h-screen flex items-center justify-center solar-glow-bg-strong pt-16 overflow-hidden">
    {/* Animated light rays */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (<motion.div key={i} className="absolute top-0 w-px bg-gradient-to-b from-primary/20 to-transparent" style={{
            left: `${20 + i * 15}%`,
            height: "60%",
            transformOrigin: "top",
        }} animate={{ opacity: [0.1, 0.4, 0.1], scaleY: [0.8, 1, 0.8] }} transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}/>))}
    </div>

    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-4xl mx-auto text-center">

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight mb-6" style={{ textWrap: "balance" }}>
          Run Solar + Diesel{" "}
          <br className="hidden sm:block"/>
          Together.{" "}
          <span className="text-gradient-solar">Safely.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10" style={{ textWrap: "pretty" }}>
          Save ₹2,000/hour on diesel. Prevent generator failure.
          Fully automated IoT + AI energy synchronization.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="group flex items-center gap-2 px-8 py-3.5 rounded-xl glass text-foreground font-medium text-base hover:bg-white/10 transition-all active:scale-[0.97]">
            <Play className="w-4 h-4"/>
            View Dashboard
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }} className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
        { value: "₹2K+", label: "Hourly savings" },
        { value: "< 3mo", label: "Payback period" },
        { value: "99.9%", label: "Uptime" },
    ].map((s, i) => (<div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gradient-solar">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>))}
        </motion.div>
      </div>
    </div>
  </section>);
export default HeroSection;
