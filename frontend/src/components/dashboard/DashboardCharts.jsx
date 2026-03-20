import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
const DashboardCharts = ({ histories }) => {
  const lineData = histories?.power ?? [
    { time: "06:00", solar: 5, dg: 40, load: 45 },
    { time: "08:00", solar: 20, dg: 30, load: 50 },
    { time: "10:00", solar: 38, dg: 15, load: 53 },
    { time: "12:00", solar: 48, dg: 10, load: 55 },
    { time: "14:00", solar: 45, dg: 12, load: 57 },
    { time: "16:00", solar: 30, dg: 25, load: 54 },
    { time: "18:00", solar: 10, dg: 40, load: 50 },
  ];

  const barData = histories?.savings ?? [
    { day: "Mon", savings: 3800 },
    { day: "Tue", savings: 4200 },
    { day: "Wed", savings: 3600 },
    { day: "Thu", savings: 4800 },
    { day: "Fri", savings: 5100 },
    { day: "Sat", savings: 2900 },
    { day: "Sun", savings: 1500 },
  ];

  return (<div className="grid lg:grid-cols-2 gap-4">
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="glass rounded-xl p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Solar vs DG vs Load</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)"/>
            <XAxis dataKey="time" tick={{ fill: "hsl(0 0% 55%)", fontSize: 11 }} axisLine={false}/>
            <YAxis tick={{ fill: "hsl(0 0% 55%)", fontSize: 11 }} axisLine={false} unit=" kW"/>
            <Tooltip contentStyle={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 16%)", borderRadius: 8, color: "#fff", fontSize: 12 }}/>
            <Line type="monotone" dataKey="solar" stroke="#FFD60A" strokeWidth={2} dot={false}/>
            <Line type="monotone" dataKey="dg" stroke="#00D4FF" strokeWidth={2} dot={false}/>
            <Line type="monotone" dataKey="load" stroke="#888" strokeWidth={2} dot={false} strokeDasharray="4 4"/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="glass rounded-xl p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Daily Savings (₹)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)"/>
            <XAxis dataKey="day" tick={{ fill: "hsl(0 0% 55%)", fontSize: 11 }} axisLine={false}/>
            <YAxis tick={{ fill: "hsl(0 0% 55%)", fontSize: 11 }} axisLine={false}/>
            <Tooltip contentStyle={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 16%)", borderRadius: 8, color: "#fff", fontSize: 12 }} formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Savings"]}/>
            <Bar dataKey="savings" fill="#FFD60A" radius={[4, 4, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  </div>);
};
export default DashboardCharts;
