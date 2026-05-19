"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { TechAdjusterPanel } from "@/components/tech-adjuster-panel";
import { MobileAppView } from "@/components/mobile-app";
import { DesktopDashboard } from "@/components/desktop-dashboard";

export default function Page() {
  const { viewMode } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <TechAdjusterPanel />
      <div className="pt-12">
        {viewMode === "mobile" ? <MobileAppView /> : <DesktopDashboard />}
      </div>
    </div>
  );
}
