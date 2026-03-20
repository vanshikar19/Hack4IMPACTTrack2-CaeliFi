import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Cpu, Wifi, BarChart3, Plug } from "lucide-react";
const features = [
    { icon: Plug, title: "Plug & Play", desc: "Install in under 30 minutes. No rewiring needed." },
    { icon: Cpu, title: "ESP32 Powered", desc: "Industrial-grade microcontroller with real-time processing." },
    { icon: Wifi, title: "IoT Connected", desc: "WiFi + 4G connectivity for remote monitoring anywhere." },
    { icon: BarChart3, title: "Cloud Dashboard", desc: "Live analytics, alerts, and remote control via web app." },
];
const ProductSection = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });
    return (<section className="py-32 solar-glow-bg">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">The Device</p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ textWrap: "balance" }}>
            Smart Hardware. Smarter Software.
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Device mockup */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="relative">
            <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-electric/5"/>
              <div className="relative">
                <div className="w-full aspect-square max-w-[280px] mx-auto rounded-2xl bg-secondary border border-border flex flex-col items-center justify-center gap-4 relative">
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-success animate-pulse"/>
                  <Cpu className="w-16 h-16 text-primary"/>
                  <span className="text-sm font-mono text-muted-foreground">CaeliFi Controller v2</span>
                  <div className="flex gap-2">
                    <div className="w-8 h-1 rounded-full bg-primary/40 animate-pulse-glow"/>
                    <div className="w-8 h-1 rounded-full bg-electric/40 animate-pulse-glow" style={{ animationDelay: "0.5s" }}/>
                    <div className="w-8 h-1 rounded-full bg-success/40 animate-pulse-glow" style={{ animationDelay: "1s" }}/>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="space-y-5">
            {features.map((f, i) => (<motion.div key={i} className="flex items-start gap-4 glass rounded-xl p-5 hover:bg-white/[0.07] transition-colors" whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                  <f.icon className="w-5 h-5"/>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>))}
          </motion.div>
        </div>
      </div>
    </section>);
};
export default ProductSection;
