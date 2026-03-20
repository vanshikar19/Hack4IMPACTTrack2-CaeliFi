import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Calculator, TrendingUp } from "lucide-react";
const AnimatedNumber = ({ value }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const duration = 800;
        const start = performance.now();
        const from = display;
        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(from + (value - from) * eased));
            if (progress < 1)
                requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value]);
    return <>{display.toLocaleString("en-IN")}</>;
};
const SavingsCalculator = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });
    const [solarKW, setSolarKW] = useState(50);
    const [dieselCost, setDieselCost] = useState(80);
    const [outageHours, setOutageHours] = useState(6);
    const dailySavings = solarKW * 0.7 * outageHours * (dieselCost / 4);
    const monthlySavings = dailySavings * 26;
    return (<section id="calculator" className="py-32">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">Savings Calculator</p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ textWrap: "balance" }}>
            See How Much You Save
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="max-w-3xl mx-auto glass rounded-2xl p-8 sm:p-10">
          <div className="grid sm:grid-cols-3 gap-8 mb-10">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Solar Capacity (kW)</label>
              <input type="range" min={10} max={500} value={solarKW} onChange={(e) => setSolarKW(+e.target.value)} className="w-full accent-primary"/>
              <div className="text-2xl font-bold text-foreground mt-1 tabular-nums">{solarKW} kW</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Diesel Cost (₹/litre)</label>
              <input type="range" min={60} max={120} value={dieselCost} onChange={(e) => setDieselCost(+e.target.value)} className="w-full accent-primary"/>
              <div className="text-2xl font-bold text-foreground mt-1 tabular-nums">₹{dieselCost}/L</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Daily Outage (hours)</label>
              <input type="range" min={1} max={16} value={outageHours} onChange={(e) => setOutageHours(+e.target.value)} className="w-full accent-primary"/>
              <div className="text-2xl font-bold text-foreground mt-1 tabular-nums">{outageHours} hrs</div>
            </div>
          </div>

          <div className="rounded-xl bg-primary/10 border border-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-primary"/>
              <div>
                <p className="text-sm text-muted-foreground">Estimated monthly savings</p>
                <p className="text-4xl font-extrabold text-gradient-solar tabular-nums">
                  ₹<AnimatedNumber value={monthlySavings}/>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-success text-sm font-medium">
              <TrendingUp className="w-4 h-4"/>
              ROI in ~{Math.max(1, Math.ceil(9999 / monthlySavings))} months
            </div>
          </div>
        </motion.div>
      </div>
    </section>);
};
export default SavingsCalculator;
