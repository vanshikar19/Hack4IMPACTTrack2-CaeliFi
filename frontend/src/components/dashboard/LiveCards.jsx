import { motion } from "framer-motion";
import { Sun, Fuel, Gauge, IndianRupee, TrendingUp, TrendingDown } from "lucide-react";
const LiveCards = ({ metrics }) => {
  const cards = [
    {
      icon: Sun,
      label: "Solar Output",
      value: Number(metrics?.solarOutputKw ?? 42.8).toFixed(1),
      unit: "kW",
      change: "+12%",
      up: true,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Fuel,
      label: "DG Output",
      value: Number(metrics?.dgOutputKw ?? 18.3).toFixed(1),
      unit: "kW",
      change: "-24%",
      up: false,
      color: "text-electric",
      bg: "bg-electric/10",
    },
    {
      icon: Gauge,
      label: "Load Demand",
      value: Number(metrics?.loadDemandKw ?? 56.1).toFixed(1),
      unit: "kW",
      change: "+3%",
      up: true,
      color: "text-foreground",
      bg: "bg-muted",
    },
    {
      icon: IndianRupee,
      label: "Today's Savings",
      value: Number(metrics?.todaySavingsInr ?? 4280).toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      }),
      unit: "₹",
      change: "+18%",
      up: true,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {cards.map((c, i) => (<motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }} className="glass rounded-xl p-5 hover:bg-white/[0.07] transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${c.bg}`}>
            <c.icon className={`w-4 h-4 ${c.color}`}/>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${c.up ? "text-success" : "text-danger"}`}>
            {c.up ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
            {c.change}
          </div>
        </div>
        <p className="text-2xl font-bold tabular-nums text-foreground">
          {c.unit === "₹" && "₹"}{c.value}{c.unit !== "₹" && <span className="text-sm text-muted-foreground ml-1">{c.unit}</span>}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
      </motion.div>))}
  </div>);
};
export default LiveCards;
