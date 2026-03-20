import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles } from "lucide-react";
const PricingSection = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });
    return (<section id="pricing" className="py-32">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">Simple Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ textWrap: "balance" }}>
            Pays for itself in under 3 months
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Hardware */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="glass rounded-2xl p-8">
            <p className="text-sm text-muted-foreground font-medium mb-1">Hardware</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-foreground">₹9,999</span>
              <span className="text-sm text-muted-foreground">one-time</span>
            </div>
            <ul className="space-y-3">
              {["CaeliFi Controller Unit", "Installation Guide", "1 Year Hardware Warranty", "Free Firmware Updates"].map((f) => (<li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-success shrink-0"/> {f}
                </li>))}
            </ul>
          </motion.div>

          {/* SaaS */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="glass rounded-2xl p-8 border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-bl-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3"/> Recommended
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Cloud + SaaS</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-foreground">₹499</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3">
              {["Live Cloud Dashboard", "AI Optimization Engine", "Alerts & Notifications", "Priority Support", "OTA Updates"].map((f) => (<li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0"/> {f}
                </li>))}
            </ul>
            <a href="#contact" className="mt-6 block w-full text-center py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all active:scale-[0.97]">
              Get Started
            </a>
          </motion.div>
        </div>
      </div>
    </section>);
};
export default PricingSection;
