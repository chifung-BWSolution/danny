"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { format, addDays } from "date-fns";

export function MenuPricingView() {
  const { menuItems, schools } = useAppStore();
  const today = new Date();
  const nextWeekDates = Array.from({ length: 5 }, (_, i) => format(addDays(today, i + 1), "yyyy-MM-dd"));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">餐單定價</h1>
        <p className="text-sm text-gray-500 mt-1">管理每日餐單、設定價格及配置過敏原標記</p>
      </div>

      {/* Pricing Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {schools.filter((s) => s.contractStatus === "Active").map((school) => (
          <div key={school.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{school.nameZh}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">HK${school.singleMealPrice}</p>
            <p className="text-[10px] text-gray-400 mt-1">每餐</p>
          </div>
        ))}
      </div>

      {/* Weekly Menu Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">未來五天餐單</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium w-24">Date</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Set A</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Set B</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Set C</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Set D</th>
              </tr>
            </thead>
            <tbody>
              {nextWeekDates.map((date) => {
                const dayMenus = menuItems.filter((m) => m.date === date);
                return (
                  <tr key={date} className="border-t border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-700">
                      {format(new Date(date), "EEE")}<br />
                      <span className="text-gray-400">{date}</span>
                    </td>
                    {["A", "B", "C", "D"].map((type) => {
                      const menu = dayMenus.find((m) => m.menuType === type);
                      return (
                        <td key={type} className="py-3 px-4">
                          {menu ? (
                            <div>
                              <p className="font-medium text-gray-800">{menu.mainZh}</p>
                              <p className="text-gray-500">{menu.main}</p>
                              <p className="text-gray-400 mt-1">
                                {menu.sidesZh.join(" + ")} | {menu.snackZh} | {menu.dessertZh}
                              </p>
                              {menu.allergenMarkers.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {menu.allergenMarkers.map((a) => (
                                    <span key={a} className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[10px]">
                                      {a}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allergen Legend */}
      <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Allergen Legend 過敏原圖例</h3>
        <div className="flex flex-wrap gap-2">
          {["Peanuts", "Shellfish", "Dairy", "Eggs", "Gluten", "Soy", "Sesame", "Tree Nuts"].map((a) => (
            <span key={a} className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs border border-red-100">
              ⚠️ {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
