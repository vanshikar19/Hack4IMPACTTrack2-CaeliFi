import { motion } from "framer-motion";
import { Sun, Fuel, Factory, ArrowRight } from "lucide-react";
const EnergyFlow = ({ metrics }) => (<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="glass rounded-xl p-6">
    <h3 className="text-sm font-semibold text-foreground mb-6">Energy Flow</h3>
    <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
      {/* Solar */}
      <div className="flex flex-col items-center gap-2">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary">
          <Sun className="w-8 h-8"/>
        </div>
        <span className="text-xs text-muted-foreground">Solar</span>
        <span className="text-lg font-bold tabular-nums text-primary">{Number(metrics?.solarOutputKw ?? 42.8).toFixed(1)} kW</span>
      </div>

      {/* Arrow solar -> load */}
      <div className="relative w-16 h-2 flex items-center">
        <div className="absolute inset-0 rounded-full bg-primary/20 overflow-hidden">
          <motion.div className="h-full w-8 rounded-full bg-primary/60" animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}/>
        </div>
        <ArrowRight className="absolute -right-1 w-4 h-4 text-primary"/>
      </div>

      {/* Load */}
      <div className="flex flex-col items-center gap-2">
        <div className="p-4 rounded-2xl bg-muted text-foreground">
          <Factory className="w-8 h-8"/>
        </div>
        <span className="text-xs text-muted-foreground">Load</span>
        <span className="text-lg font-bold tabular-nums text-foreground">{Number(metrics?.loadDemandKw ?? 56.1).toFixed(1)} kW</span>
      </div>

      {/* Arrow load <- DG */}
      <div className="relative w-16 h-2 flex items-center">
        <div className="absolute inset-0 rounded-full bg-electric/20 overflow-hidden">
          <motion.div className="h-full w-8 rounded-full bg-electric/60" animate={{ x: ["200%", "-100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}/>
        </div>
        <ArrowRight className="absolute -left-1 w-4 h-4 text-electric rotate-180"/>
      </div>

      {/* DG */}
      <div className="flex flex-col items-center gap-2">
        <div className="p-4 rounded-2xl bg-electric/10 text-electric">
          <Fuel className="w-8 h-8"/>
        </div>
        <span className="text-xs text-muted-foreground">DG Set</span>
        <span className="text-lg font-bold tabular-nums text-electric">{Number(metrics?.dgOutputKw ?? 18.3).toFixed(1)} kW</span>
      </div>
    </div>
  </motion.div>);
export default EnergyFlow;
