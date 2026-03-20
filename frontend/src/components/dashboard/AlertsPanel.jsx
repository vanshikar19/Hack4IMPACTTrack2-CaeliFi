import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
const alerts = [
    { type: "warning", icon: AlertTriangle, msg: "Reverse power risk detected — solar throttled to 60%", time: "2 min ago" },
    { type: "success", icon: CheckCircle, msg: "System optimized — DG sync stable at 18.3 kW", time: "5 min ago" },
    { type: "info", icon: Info, msg: "Firmware update v2.4.1 available", time: "1 hr ago" },
    { type: "success", icon: CheckCircle, msg: "Daily savings target achieved: ₹4,280", time: "3 hr ago" },
];
const AlertsPanel = () => (<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }} className="glass rounded-xl p-6">
    <h3 className="text-sm font-semibold text-foreground mb-4">Alerts</h3>
    <div className="space-y-3">
      {alerts.map((a, i) => (<div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${a.type === "warning" ? "bg-warning/5 border border-warning/20" :
            a.type === "success" ? "bg-success/5 border border-success/20" :
                "bg-electric/5 border border-electric/20"}`}>
          <a.icon className={`w-4 h-4 mt-0.5 shrink-0 ${a.type === "warning" ? "text-warning" : a.type === "success" ? "text-success" : "text-electric"}`}/>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">{a.msg}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
          </div>
        </div>))}
    </div>
  </motion.div>);
export default AlertsPanel;
