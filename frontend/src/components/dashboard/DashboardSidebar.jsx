import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, LayoutDashboard, Zap, PiggyBank, Bell, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
    { icon: Zap, label: "Energy Flow", id: "energy" },
    { icon: PiggyBank, label: "Savings", id: "savings" },
    { icon: Bell, label: "Alerts", id: "alerts" },
    { icon: Settings, label: "Settings", id: "settings" },
];
const DashboardSidebar = ({ active, onNavigate, }) => {
    const [collapsed, setCollapsed] = useState(false);
    return (<motion.aside animate={{ width: collapsed ? 64 : 220 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="h-screen sticky top-0 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="h-16 flex items-center px-4 gap-2 border-b border-sidebar-border">
        <Sun className="w-6 h-6 text-primary shrink-0"/>
        {!collapsed && (<Link href="/" className="text-base font-bold text-sidebar-accent-foreground">
            Caeli<span className="text-primary">Fi</span>
          </Link>)}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => (<button key={item.id} onClick={() => onNavigate(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active === item.id
                ? "bg-sidebar-accent text-primary font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"}`}>
            <item.icon className="w-4.5 h-4.5 shrink-0"/>
            {!collapsed && <span>{item.label}</span>}
          </button>))}
      </nav>

      <button onClick={() => setCollapsed(!collapsed)} className="p-3 border-t border-sidebar-border text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors flex items-center justify-center">
        {collapsed ? <ChevronRight className="w-4 h-4"/> : <ChevronLeft className="w-4 h-4"/>}
      </button>
    </motion.aside>);
};
export default DashboardSidebar;
