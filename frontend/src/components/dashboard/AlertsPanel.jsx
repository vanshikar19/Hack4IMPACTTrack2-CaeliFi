import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
const typeToIcon = {
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

const formatTimeAgo = (isoDate) => {
  if (!isoDate) return "just now";

  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (Number.isNaN(seconds) || seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} day ago`;
};

const AlertsPanel = ({ alerts = [] }) => {
  const fallbackAlerts = [
    {
      id: "fallback-1",
      type: "warning",
      msg: "Reverse power risk detected - solar throttled to 60%",
      timestamp: new Date().toISOString(),
    },
  ];

  const displayAlerts = alerts.length ? alerts : fallbackAlerts;

  return (<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }} className="glass rounded-xl p-6">
    <h3 className="text-sm font-semibold text-foreground mb-4">Alerts</h3>
    <div className="space-y-3">
      {displayAlerts.map((a) => {
        const AlertIcon = typeToIcon[a.type] || Info;
        return (<div key={a.id || a.timestamp || a.msg} className={`flex items-start gap-3 p-3 rounded-lg ${a.type === "warning" ? "bg-warning/5 border border-warning/20" :
            a.type === "success" ? "bg-success/5 border border-success/20" :
                "bg-electric/5 border border-electric/20"}`}>
          <AlertIcon className={`w-4 h-4 mt-0.5 shrink-0 ${a.type === "warning" ? "text-warning" : a.type === "success" ? "text-success" : "text-electric"}`}/>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">{a.msg}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatTimeAgo(a.timestamp)}</p>
          </div>
        </div>);
      })}
    </div>
  </motion.div>);
};
export default AlertsPanel;
