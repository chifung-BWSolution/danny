"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Search, Plus, Keyboard, Printer } from "lucide-react";
import { format } from "date-fns";

export function StudentOrderView() {
  const { students, schools, orders, addOrder, addStudent } = useAppStore();
  const [tab, setTab] = useState<"students" | "manual-input" | "add-student">("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Manual Input State
  const [manualStudentId, setManualStudentId] = useState("");
  const [manualDate, setManualDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [manualEntries, setManualEntries] = useState<{ studentId: string; menu: string; date: string }[]>([]);

  // Add Student Form
  const [newStudent, setNewStudent] = useState({
    name: "",
    nameZh: "",
    schoolId: "SCH001",
    className: "1A",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    allergens: "",
    subsidized: false,
  });

  const filteredStudents = students.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameZh.includes(searchQuery) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.schoolId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleKeyPress = (e: React.KeyboardEvent, studentId: string) => {
    const key = e.key;
    if (["1", "2", "3", "4"].includes(key)) {
      const menuType = ["A", "B", "C", "D"][parseInt(key) - 1];
      setManualEntries([...manualEntries, { studentId, menu: menuType, date: manualDate }]);
    }
  };

  const handleAddStudent = () => {
    const id = `STU${String(students.length + 1).padStart(3, "0")}`;
    addStudent({
      id,
      name: newStudent.name,
      nameZh: newStudent.nameZh,
      schoolId: newStudent.schoolId,
      className: newStudent.className,
      balance: 0,
      pendingRefund: 0,
      subsidized: newStudent.subsidized,
      tiedSiblings: [],
      allergens: newStudent.allergens.split(",").map((a) => a.trim()).filter(Boolean),
      parentName: newStudent.parentName,
      parentPhone: newStudent.parentPhone,
      parentEmail: newStudent.parentEmail,
    });
    setTab("students");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">學生及訂單管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理學生、手動輸入訂單及生成紙本訂餐表</p>
        </div>
        <button
          onClick={() => setTab("add-student")}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium"
        >
          <Plus size={14} />
          新增學生
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "students" as const, label: "學生列表", icon: Search },
          { key: "manual-input" as const, label: "手動輸入（快捷鍵）", icon: Keyboard },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition ${
              tab === t.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "students" && (
        <>
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋學生..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">編號</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">姓名</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">學校</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">班別</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">餘額</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">資助</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">過敏源</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">訂單</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const studentOrders = orders.filter((o) => o.studentId === student.id);
                  return (
                    <tr key={student.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-gray-600">{student.id}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-800">{student.nameZh}</p>
                        <p className="text-gray-500">{student.name}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{student.schoolId}</td>
                      <td className="py-3 px-4 text-gray-600">{student.className}</td>
                      <td className="py-3 px-4">
                        <span className="text-green-700 font-medium">HK${student.balance}</span>
                         {student.pendingRefund > 0 && (
                          <p className="text-orange-500 text-[10px]">待退: ${student.pendingRefund}</p>
                         )}
                      </td>
                      <td className="py-3 px-4">
                        {student.subsidized ? (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-medium">是</span>
                        ) : (
                          <span className="text-gray-400">否</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {student.allergens.length > 0 ? (
                          <span className="text-red-600">{student.allergens.join(", ")}</span>
                        ) : (
                          <span className="text-gray-400">無</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{studentOrders.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "manual-input" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800">手動輸入</h3>
              <p className="text-xs text-gray-500 mt-1">
                選擇學生，然後按鍵：1=套餐A, 2=套餐B, 3=套餐C, 4=套餐D
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
              />
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs">
                <Printer size={12} />
                列印紙本訂單
              </button>
            </div>
          </div>

          {/* Hotkey Input */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-500 font-medium">學生編號</label>
              <input
                type="text"
                value={manualStudentId}
                onChange={(e) => setManualStudentId(e.target.value)}
                onKeyDown={(e) => manualStudentId && handleKeyPress(e, manualStudentId)}
                placeholder="輸入學生編號，然後按 1-4 選擇餐單..."
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="grid grid-cols-4 gap-1">
                {["A", "B", "C", "D"].map((menu, i) => (
                  <div key={menu} className="text-center px-3 py-2 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-700">{i + 1}</p>
                    <p className="text-[10px] text-blue-500">Set {menu}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Entry Log */}
          {manualEntries.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-2 px-3 text-gray-500">#</th>
                    <th className="text-left py-2 px-3 text-gray-500">學生</th>
                    <th className="text-left py-2 px-3 text-gray-500">日期</th>
                    <th className="text-left py-2 px-3 text-gray-500">餐單</th>
                    <th className="text-left py-2 px-3 text-gray-500">參考編號</th>
                  </tr>
                </thead>
                <tbody>
                  {manualEntries.map((entry, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="py-2 px-3">{i + 1}</td>
                      <td className="py-2 px-3 font-mono">{entry.studentId}</td>
                      <td className="py-2 px-3">{entry.date}</td>
                      <td className="py-2 px-3 font-bold text-blue-700">Set {entry.menu}</td>
                      <td className="py-2 px-3 font-mono text-gray-500">DK{format(new Date(), "yyyyMMdd")}{String(i + 1).padStart(3, "0")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "add-student" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">新增學生</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-medium">英文姓名</label>
              <input
                type="text"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">中文姓名</label>
              <input
                type="text"
                value={newStudent.nameZh}
                onChange={(e) => setNewStudent({ ...newStudent, nameZh: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">學校</label>
              <select
                value={newStudent.schoolId}
                onChange={(e) => setNewStudent({ ...newStudent, schoolId: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>{s.nameZh}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">班別</label>
              <input
                type="text"
                value={newStudent.className}
                onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">家長姓名</label>
              <input
                type="text"
                value={newStudent.parentName}
                onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">家長電話</label>
              <input
                type="tel"
                value={newStudent.parentPhone}
                onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">家長電郵</label>
              <input
                type="email"
                value={newStudent.parentEmail}
                onChange={(e) => setNewStudent({ ...newStudent, parentEmail: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">過敏源（以逗號分隔）</label>
              <input
                type="text"
                value={newStudent.allergens}
                onChange={(e) => setNewStudent({ ...newStudent, allergens: e.target.value })}
                placeholder="例如：花生, 乳製品"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newStudent.subsidized}
                  onChange={(e) => setNewStudent({ ...newStudent, subsidized: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600"
                />
                <span className="text-sm text-gray-700">關愛基金資助帳戶</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleAddStudent}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              新增學生
            </button>
            <button
              onClick={() => setTab("students")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
