"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LiveCards from "@/components/dashboard/LiveCards";
import EnergyFlow from "@/components/dashboard/EnergyFlow";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardControls from "@/components/dashboard/DashboardControls";
import AlertsPanel from "@/components/dashboard/AlertsPanel";

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getDashboardSnapshot = async () => {
      const response = await fetch(`${API_BASE}/api/dashboard`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Dashboard fetch failed with status ${response.status}`);
      }

      const json = await response.json();
      if (!json?.success || !json?.data) {
        throw new Error("Invalid dashboard response");
      }

      setDashboardData(json.data);
      setError("");
    };

    useEffect(() => {
      let mounted = true;

      const load = async () => {
        try {
          await getDashboardSnapshot();
        } catch (err) {
          if (mounted) {
            setError(err instanceof Error ? err.message : "Could not load dashboard");
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

      load();
      const intervalId = setInterval(load, 5000);

      return () => {
        mounted = false;
        clearInterval(intervalId);
      };
    }, []);

    const handleControlsUpdate = async (patch) => {
      const response = await fetch(`${API_BASE}/api/dashboard/controls`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patch),
      });

      if (!response.ok) {
        throw new Error(`Control update failed with status ${response.status}`);
      }

      const json = await response.json();
      if (json?.success && json?.data) {
        setDashboardData(json.data);
      }
    };

    const statusText = useMemo(() => {
      if (loading) return "Loading real-time data...";
      if (error) return "Live mode unavailable - showing latest known values";
      return "Real-time monitoring & control";
    }, [loading, error]);

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
          <p className="text-sm text-muted-foreground mt-1">{statusText}</p>
          {error && <p className="text-xs text-warning mt-2">{error}</p>}
        </div>

        {(activeTab === "dashboard" || activeTab === "energy" || activeTab === "savings") && (<div className="space-y-6">
            <LiveCards metrics={dashboardData?.metrics} />
            <EnergyFlow metrics={dashboardData?.metrics} />
            <DashboardCharts histories={dashboardData?.histories} />
            <div className="grid lg:grid-cols-2 gap-4">
              <DashboardControls
                controls={dashboardData?.controls}
                onUpdateControls={handleControlsUpdate}
              />
              <AlertsPanel alerts={dashboardData?.alerts} />
            </div>
          </div>)}

        {activeTab === "alerts" && (<AlertsPanel alerts={dashboardData?.alerts} />)}

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
