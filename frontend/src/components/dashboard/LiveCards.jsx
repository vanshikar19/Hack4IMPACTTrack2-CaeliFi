import { motion } from "framer-motion";
import { Activity, Factory, Gauge, GitBranchPlus, ShieldAlert } from "lucide-react";

const LiveCards = ({ metrics, controls, updatedAt }) => {
  const data = metrics || {};
  const controlData = controls || {};
  const isSafeMode = Boolean(data.safeMode);
  const mode = isSafeMode ? "Safe Mode" : "Normal";
  const dgSyncEnabled = controlData.dgSyncMode !== undefined
    ? Boolean(controlData.dgSyncMode)
    : Boolean(data.dgSyncMode ?? (Number(data.dgOutputKw ?? 0) > 0));

  const updatedMs = updatedAt ? new Date(updatedAt).getTime() : 0;
  const hasFreshUpdate = Number.isFinite(updatedMs) && Date.now() - updatedMs < 45 * 1000;

  const factoryLoadKw = Number(data.loadDemandKw ?? 56.1);
  const solarKw = Number(data.solarOutputKw ?? 42.8);
  const dgKw = Number(data.dgOutputKw ?? 0);
  const hasPowerSignal = factoryLoadKw > 0 || solarKw > 0 || dgKw > 0;
  const isOnline = hasFreshUpdate || hasPowerSignal;

  const cards = [
    {
      icon: isOnline ? Activity : ShieldAlert,
      label: "System Status",
      value: isOnline ? "ONLINE" : "OFFLINE",
      unit: "",
      color: isOnline ? "text-success" : "text-warning",
      bg: isOnline ? "bg-success/10" : "bg-warning/10",
      suffix: mode,
    },
    {
      icon: GitBranchPlus,
      label: "DG Sync",
      value: isSafeMode ? "ON" : "OFF",
      unit: "",
      color: isSafeMode ? "text-success" : "text-warning",
      bg: isSafeMode ? "bg-success/10" : "bg-warning/10",
      suffix: `DG ${dgKw.toFixed(1)} kW`,
    },
    {
      icon: Factory,
      label: "Factory Load",
      value: factoryLoadKw.toFixed(1),
      unit: "kW",
      color: "text-foreground",
      bg: "bg-muted",
    },
    {
      icon: Gauge,
      label: "Solar Output",
      value: solarKw.toFixed(1),
      unit: "kW",
      color: "text-primary",
      bg: "bg-primary/10",
      suffix: `Safe Mode ${isSafeMode ? "ON" : "OFF"}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }} 
          className="glass rounded-xl p-5 hover:bg-white/[0.07] transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${c.bg}`}>
              <c.icon className={`w-4 h-4 ${c.color}`}/>
            </div>
            {/* Visual indicator dot for active status */}
            <div className={`w-2 h-2 rounded-full ${c.value === "ONLINE" || c.value === "ON" ? "bg-success" : "bg-warning"}`} />
          </div>
          <p className="text-2xl font-bold tabular-nums text-foreground">
            {c.value}
            {c.unit && <span className="text-sm text-muted-foreground ml-1">{c.unit}</span>}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
          {c.suffix ? <p className="text-[11px] text-muted-foreground mt-1">{c.suffix}</p> : null}
        </motion.div>
      ))}
    </div>
  );
};

export default LiveCards;