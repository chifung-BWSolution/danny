"use client";

import React, { useState } from "react";
import { useAppStore, DesktopSection } from "@/lib/store";
import {
  LayoutDashboard,
  School,
  Users,
  UtensilsCrossed,
  RotateCcw,
  Truck,
  Calculator,
  Shield,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  User,
} from "lucide-react";
import { DashboardView } from "./backend/dashboard-view";
import { SchoolMgtView } from "./backend/school-mgt-view";
import { StudentOrderView } from "./backend/student-order-view";
import { MenuPricingView } from "./backend/menu-pricing-view";
import { RefundCloudView } from "./backend/refund-cloud-view";
import { LogisticsView } from "./backend/logistics-view";
import { AccountingView } from "./backend/accounting-view";
import { SecurityLogView } from "./backend/security-log-view";

const navItems: { key: DesktopSection; icon: any; label: string; labelZh: string }[] = [
  { key: "dashboard", icon: LayoutDashboard, label: "儀表板", labelZh: "Dashboard" },
  { key: "school-mgt", icon: School, label: "學校管理", labelZh: "School Mgt" },
  { key: "student-order", icon: Users, label: "學生及訂單", labelZh: "Student & Order" },
  { key: "menu-pricing", icon: UtensilsCrossed, label: "餐單定價", labelZh: "Menu Pricing" },
  { key: "refund-cloud", icon: RotateCcw, label: "退款控制", labelZh: "Refund & Cloud" },
  { key: "logistics", icon: Truck, label: "物流生產", labelZh: "Logistics" },
  { key: "accounting", icon: Calculator, label: "會計中心", labelZh: "Accounting" },
  { key: "security-log", icon: Shield, label: "安全日誌", labelZh: "Security Log" },
];

export function DesktopDashboard() {
  const { desktopSection, setDesktopSection } = useAppStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-[calc(100vh-48px)] bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-56"
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <span className="text-2xl">🍱</span>
          {!sidebarCollapsed && (
            <div>
              <p className="text-sm font-bold text-gray-800">Danny Kitchen</p>
              <p className="text-[10px] text-gray-400">管理後台</p>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setDesktopSection(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${
                desktopSection === item.key
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon size={18} />
              {!sidebarCollapsed && (
                <div>
                  <p className="text-xs font-medium">{item.label}</p>
                  <p className="text-[10px] text-gray-400">{item.labelZh}</p>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-3 border-t border-gray-100 text-gray-400 hover:text-gray-700 flex justify-center"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋學生、學校、訂單..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-700 transition">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">管理員 Lee</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {desktopSection === "dashboard" && <DashboardView />}
          {desktopSection === "school-mgt" && <SchoolMgtView />}
          {desktopSection === "student-order" && <StudentOrderView />}
          {desktopSection === "menu-pricing" && <MenuPricingView />}
          {desktopSection === "refund-cloud" && <RefundCloudView />}
          {desktopSection === "logistics" && <LogisticsView />}
          {desktopSection === "accounting" && <AccountingView />}
          {desktopSection === "security-log" && <SecurityLogView />}
        </div>
      </div>
    </div>
  );
}
