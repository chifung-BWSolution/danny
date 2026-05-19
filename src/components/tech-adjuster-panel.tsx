"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { Monitor, Smartphone, Download, Wifi } from "lucide-react";

export function TechAdjusterPanel() {
  const {
    viewMode,
    setViewMode,
    appUpdateMode,
    setAppUpdateMode,
    deviceEnvironment,
    setDeviceEnvironment,
    showCodePushOverlay,
  } = useAppStore();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between gap-4">
      {/* View Mode Toggle */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">檢視：</span>
        <button
          onClick={() => setViewMode("desktop")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            viewMode === "desktop"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          <Monitor size={14} />
          後台管理
        </button>
        <button
          onClick={() => setViewMode("mobile")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            viewMode === "mobile"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          <Smartphone size={14} />
          手機應用
        </button>
      </div>

      {/* Brand */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-orange-400">🍱 Danny Kitchen</span>
        <span className="text-xs text-gray-500">學生午餐飯盒系統</span>
      </div>

      {/* Tech Adjuster */}
      <div className="flex items-center gap-4">
        {/* App Update Method */}
        <div className="flex items-center gap-2">
          <Download size={12} className="text-gray-500" />
          <span className="text-xs text-gray-500">更新方式：</span>
          <select
            value={appUpdateMode}
            onChange={(e) => setAppUpdateMode(e.target.value as "appstore" | "codepush")}
            className="bg-gray-800 border border-gray-700 text-xs text-gray-300 rounded px-2 py-1"
          >
            <option value="appstore">App Store</option>
            <option value="codepush">CodePush 熱更新</option>
          </select>
        </div>

        {/* Device Environment */}
        <div className="flex items-center gap-2">
          <Wifi size={12} className="text-gray-500" />
          <span className="text-xs text-gray-500">裝置環境：</span>
          <select
            value={deviceEnvironment}
            onChange={(e) => setDeviceEnvironment(e.target.value as "standard" | "mainland")}
            className="bg-gray-800 border border-gray-700 text-xs text-gray-300 rounded px-2 py-1"
          >
            <option value="standard">iOS / Android（標準）</option>
            <option value="mainland">中國大陸系統（HarmonyOS/vivo/OPPO）</option>
          </select>
        </div>
      </div>

      {/* CodePush Overlay */}
      {showCodePushOverlay && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center max-w-sm">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white font-medium mb-1">正在下載背景熱修復包...</p>
            <p className="text-green-400 text-sm mt-3">✓ 成功 — 應用已完成更新，無需商店審核</p>
          </div>
        </div>
      )}
    </div>
  );
}
