"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LiveCards from "@/components/dashboard/LiveCards";
import EnergyFlow from "@/components/dashboard/EnergyFlow";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardControls from "@/components/dashboard/DashboardControls";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    return (<div className="flex min-h-screen bg-background">
      <DashboardSidebar active={activeTab} onNavigate={setActiveTab}/>
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "energy" && "Energy Flow"}
            {activeTab === "savings" && "Savings"}
            {activeTab === "alerts" && "Alerts"}
            {activeTab === "settings" && "Settings"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time monitoring & control</p>
        </div>

        {(activeTab === "dashboard" || activeTab === "energy" || activeTab === "savings") && (<div className="space-y-6">
            <LiveCards />
            <EnergyFlow />
            <DashboardCharts />
            <div className="grid lg:grid-cols-2 gap-4">
              <DashboardControls />
              <AlertsPanel />
            </div>
          </div>)}

        {activeTab === "alerts" && (<AlertsPanel />)}

        {activeTab === "settings" && (<div className="glass rounded-xl p-8 max-w-lg">
            <h3 className="font-semibold text-foreground mb-4">Device Settings</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>Device ID</span><span className="font-mono text-foreground">CF-2026-0847</span></div>
              <div className="flex justify-between"><span>Firmware</span><span className="font-mono text-foreground">v2.3.8</span></div>
              <div className="flex justify-between"><span>WiFi</span><span className="text-success">Connected</span></div>
              <div className="flex justify-between"><span>Last Sync</span><span className="text-foreground">12 seconds ago</span></div>
            </div>
          </div>)}
      </main>
    </div>);
};
export default Dashboard;
