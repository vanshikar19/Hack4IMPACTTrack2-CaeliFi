import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, Fuel, PowerOff, Zap, Shield, Brain, CloudCog } from "lucide-react";
const Section = ({ children, className = "" }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });
    return (<motion.div ref={ref} initial={{ opacity: 0, y: 20, filter: "blur(4px)" }} animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>);
};
const problems = [
    { icon: AlertTriangle, title: "Generator Damage", desc: "Reverse power from solar destroys expensive DG sets" },
    { icon: Fuel, title: "₹2000/hr Diesel Cost", desc: "Running DG at full load wastes thousands daily" },
    { icon: PowerOff, title: "Solar Shutdown", desc: "Installers disable solar during outages to protect DG" },
];
const solutions = [
    { icon: Zap, title: "Smart Sync", desc: "CaeliFi balances solar + DG load in real time" },
    { icon: Shield, title: "DG Protection", desc: "Automatic cutoff prevents reverse power damage" },
    { icon: Brain, title: "AI Optimization", desc: "ML algorithms maximize solar usage, minimize diesel" },
    { icon: CloudCog, title: "Cloud Dashboard", desc: "Monitor and control your entire energy system remotely" },
];
const ProblemSolution = () => (<section id="problem" className="py-32 relative">
    <div className="container mx-auto px-6">
      <Section>
        <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3 text-center">The Problem</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ textWrap: "balance" }}>
          Solar + Diesel Don't Play Nice
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
          Without intelligent synchronization, factories face equipment damage, wasted fuel, and forced solar shutdowns.
        </p>
      </Section>

      <div className="grid md:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
        {/* Problems */}
        <Section className="space-y-5">
          {problems.map((p, i) => (<motion.div key={i} className="glass rounded-xl p-5 flex items-start gap-4 group hover:bg-danger/5 transition-colors" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <div className="p-2.5 rounded-lg bg-danger/10 text-danger shrink-0">
                <p.icon className="w-5 h-5"/>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            </motion.div>))}
        </Section>

        {/* Solutions */}
        <Section className="space-y-5">
          <p className="text-sm font-semibold text-electric tracking-widest uppercase mb-1">The CaeliFi Solution</p>
          {solutions.map((s, i) => (<motion.div key={i} className="glass rounded-xl p-5 flex items-start gap-4 group hover:bg-electric/5 transition-colors" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <div className="p-2.5 rounded-lg bg-electric/10 text-electric shrink-0">
                <s.icon className="w-5 h-5"/>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </motion.div>))}
        </Section>
      </div>
    </div>
  </section>);
export default ProblemSolution;
