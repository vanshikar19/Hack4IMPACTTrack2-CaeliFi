import { motion } from "framer-motion";
import { useState } from "react";
const DashboardControls = () => {
    const [solarLimit, setSolarLimit] = useState(75);
    const [dgSync, setDgSync] = useState(true);
    return (<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="glass rounded-xl p-6">
      <h3 className="text-sm font-semibold text-foreground mb-6">Controls</h3>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Limit Solar Output</span>
            <span className="text-sm font-bold tabular-nums text-primary">{solarLimit}%</span>
          </div>
          <input type="range" min={0} max={100} value={solarLimit} onChange={(e) => setSolarLimit(+e.target.value)} className="w-full accent-primary"/>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">DG Sync Mode</span>
          <button onClick={() => setDgSync(!dgSync)} className={`relative w-12 h-6 rounded-full transition-colors ${dgSync ? "bg-success" : "bg-muted"}`}>
            <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-foreground" animate={{ left: dgSync ? 26 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}/>
          </button>
        </div>
      </div>
    </motion.div>);
};
export default DashboardControls;
