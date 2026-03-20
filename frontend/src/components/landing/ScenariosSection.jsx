import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plug, ZapOff, AlertTriangle, ShieldCheck } from "lucide-react";
const scenarios = [
    {
        icon: Plug,
        title: "Grid ON",
        desc: "Solar feeds the load, excess goes to grid. DG stays off. Maximum savings.",
        color: "text-success",
        bg: "bg-success/10",
        glow: "glow-success",
        border: "border-success/20",
    },
    {
        icon: ZapOff,
        title: "Blackout",
        desc: "Grid fails. DG starts automatically. Solar continues safely in sync with DG.",
        color: "text-warning",
        bg: "bg-warning/10",
        glow: "",
        border: "border-warning/20",
    },
    {
        icon: AlertTriangle,
        title: "DG Danger Zone",
        desc: "Solar output exceeds DG capacity — reverse power risk! Without CaeliFi, DG gets destroyed.",
        color: "text-danger",
        bg: "bg-danger/10",
        glow: "glow-danger",
        border: "border-danger/20",
    },
    {
        icon: ShieldCheck,
        title: "CaeliFi Safe Mode",
        desc: "Intelligent throttling limits solar output. DG runs safely. Zero damage, maximum efficiency.",
        color: "text-electric",
        bg: "bg-electric/10",
        glow: "glow-accent",
        border: "border-electric/20",
    },
];
const ScenariosSection = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });
    const [hovered, setHovered] = useState(null);
    return (<section id="scenarios" className="py-32 solar-glow-bg">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ textWrap: "balance" }}>
            4 Scenarios. 1 Smart Controller.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {scenarios.map((s, i) => (<motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} className={`glass rounded-2xl p-6 cursor-default transition-all duration-300 border ${s.border} ${hovered === i ? s.glow : ""}`}>
              <div className={`p-3 rounded-xl ${s.bg} ${s.color} w-fit mb-4`}>
                <s.icon className="w-6 h-6"/>
              </div>
              <h3 className={`font-bold text-lg mb-2 ${hovered === i ? s.color : "text-foreground"} transition-colors`}>
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>

              {/* Animated energy bar */}
              <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div className={`h-full rounded-full ${s.bg.replace("/10", "")}`} style={{ background: s.color.includes("success") ? "#22c55e" : s.color.includes("warning") ? "#f59e0b" : s.color.includes("danger") ? "#ef4444" : "#00D4FF" }} initial={{ width: "0%" }} animate={hovered === i ? { width: "100%" } : { width: "30%" }} transition={{ duration: 0.8, ease: "easeOut" }}/>
              </div>
            </motion.div>))}
        </div>
      </div>
    </section>);
};
export default ScenariosSection;
