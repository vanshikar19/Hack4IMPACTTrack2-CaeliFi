import { motion } from "framer-motion";
import { useEffect, useState } from "react";
const DashboardControls = ({ controls, onUpdateControls }) => {
    const [solarLimit, setSolarLimit] = useState(75);
    const [dgSync, setDgSync] = useState(true);

    useEffect(() => {
      if (controls?.solarLimitPercent !== undefined) {
        setSolarLimit(Number(controls.solarLimitPercent));
      }
      if (controls?.dgSyncMode !== undefined) {
        setDgSync(Boolean(controls.dgSyncMode));
      }
    }, [controls]);

    const handleSolarLimitChange = async (value) => {
      setSolarLimit(value);
      if (onUpdateControls) {
        await onUpdateControls({ solarLimitPercent: value });
      }
    };

    const handleDgSyncToggle = async () => {
      const next = !dgSync;
      setDgSync(next);
      if (onUpdateControls) {
        await onUpdateControls({ dgSyncMode: next });
      }
    };

    return (<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="glass rounded-xl p-6">
      <h3 className="text-sm font-semibold text-foreground mb-6">Controls</h3>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Limit Solar Output</span>
            <span className="text-sm font-bold tabular-nums text-primary">{solarLimit}%</span>
          </div>
          <input type="range" min={0} max={100} value={solarLimit} onChange={(e) => handleSolarLimitChange(+e.target.value)} className="w-full accent-primary"/>
        </div>

      </div>
    </motion.div>);
};
export default DashboardControls;
