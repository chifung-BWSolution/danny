"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { Users, School, ClipboardCheck, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { format, addDays } from "date-fns";

export function DashboardView() {
  const { students, schools, orders } = useAppStore();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayOrders = orders.filter((o) => o.date === today);
  const totalRevenue = orders.filter((o) => o.paymentStatus === "Paid").length * 28;

  const stats = [
    {
      label: "學生總數",
      labelZh: "Total Students",
      value: students.length,
      change: "+12 本週",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      label: "活躍學校",
      labelZh: "Active Schools",
      value: schools.filter((s) => s.contractStatus === "Active").length,
      change: "3 份合約生效中",
      trend: "up",
      icon: School,
      color: "green",
    },
    {
      label: "今日訂單",
      labelZh: "Today's Orders",
      value: todayOrders.length,
      change: `${todayOrders.filter((o) => o.paymentStatus === "Paid").length} 已付款`,
      trend: "up",
      icon: ClipboardCheck,
      color: "purple",
    },
    {
      label: "本月收入",
      labelZh: "Monthly Revenue",
      value: `HK$${totalRevenue.toLocaleString()}`,
      change: "+8.5% 較上月",
      trend: "up",
      icon: Calendar,
      color: "orange",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">儀表板</h1>
        <p className="text-sm text-gray-500 mt-1">歡迎回來，管理員 Lee。以下是今日概覽。</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                stat.color === "blue" ? "bg-blue-100" :
                stat.color === "green" ? "bg-green-100" :
                stat.color === "purple" ? "bg-purple-100" : "bg-orange-100"
              }`}>
                <stat.icon size={18} className={
                  stat.color === "blue" ? "text-blue-600" :
                  stat.color === "green" ? "text-green-600" :
                  stat.color === "purple" ? "text-purple-600" : "text-orange-600"
                } />
              </div>
              {stat.trend === "up" ? (
                <TrendingUp size={14} className="text-green-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            <p className="text-[10px] text-gray-400">{stat.labelZh}</p>
            <p className="text-xs text-green-600 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Order Trend */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">每週訂單趨勢</h3>
          <div className="h-48 flex items-end gap-2">
            {[65, 78, 92, 84, 95, 72, 88].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
                  style={{ height: `${(val / 100) * 160}px` }}
                />
                <span className="text-[10px] text-gray-400">
                  {["一", "二", "三", "四", "五", "六", "日"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">支付方式分佈</h3>
          <div className="space-y-3">
            {[
              { method: "錢包餘額", pct: 45, color: "bg-blue-500" },
              { method: "支付寶", pct: 25, color: "bg-sky-500" },
              { method: "微信支付", pct: 15, color: "bg-green-500" },
              { method: "恒生銀行", pct: 10, color: "bg-emerald-500" },
              { method: "關愛基金", pct: 5, color: "bg-purple-500" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{item.method}</span>
                  <span className="text-gray-500">{item.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">最近訂單</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 text-gray-500 font-medium">訂單編號</th>
              <th className="text-left py-2 text-gray-500 font-medium">學生</th>
              <th className="text-left py-2 text-gray-500 font-medium">日期</th>
              <th className="text-left py-2 text-gray-500 font-medium">餐單</th>
              <th className="text-left py-2 text-gray-500 font-medium">狀態</th>
              <th className="text-left py-2 text-gray-500 font-medium">支付方式</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 8).map((order) => {
              const student = students.find((s) => s.id === order.studentId);
              return (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 font-mono text-gray-600">{order.id}</td>
                  <td className="py-2 text-gray-700">{student?.nameZh || order.studentId}</td>
                  <td className="py-2 text-gray-500">{order.date}</td>
                  <td className="py-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                      Set {order.menuType}
                    </span>
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded font-medium ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-50 text-green-700"
                          : order.paymentStatus === "Subsidized"
                          ? "bg-purple-50 text-purple-700"
                          : order.paymentStatus === "Refunded"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500">{order.paymentMethod}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
