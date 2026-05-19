"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Home, Bell, Star, User, ChevronLeft, ChevronRight, AlertTriangle, Check, X } from "lucide-react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isAfter } from "date-fns";

export function MobileAppView() {
  const {
    mobileTab,
    setMobileTab,
    isLoggedIn,
    setIsLoggedIn,
    hasAcceptedTerms,
    setHasAcceptedTerms,
    currentChildId,
    setCurrentChildId,
    students,
    menuItems,
    orders,
    unfinishedOrder,
    setUnfinishedOrder,
    addOrder,
    cancelOrder,
    deviceEnvironment,
  } = useAppStore();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  if (!hasAcceptedTerms) {
    return <TermsScreen />;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-48px)] bg-gray-100 p-4">
      <div className="w-[390px] h-[844px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-gray-800 relative flex flex-col">
        {/* Status Bar */}
        <div className="bg-blue-600 text-white px-6 py-2 flex justify-between items-center text-xs">
          <span>9:41</span>
          <span className="font-semibold">Danny Kitchen</span>
          <span>100%🔋</span>
        </div>

        {/* Mainland China Banner */}
        {deviceEnvironment === "mainland" && (
          <div className="bg-yellow-500 text-black text-xs px-4 py-1.5 text-center font-medium">
            🔔 Push Notification Gateway routed via Native Vendor Channel (Non-GMS Adaptive Mode)
          </div>
        )}

        {/* Unfinished Order Banner */}
        {unfinishedOrder && mobileTab === "home" && (
          <div className="bg-orange-50 border-b border-orange-200 px-4 py-2 flex items-center justify-between">
            <span className="text-xs text-orange-700">⚠️ You have an unfinished order. Click to resume.</span>
            <button
              onClick={() => {
                setMobileTab("home");
                setUnfinishedOrder(null);
              }}
              className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded"
            >
              Resume
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {mobileTab === "home" && <MobileHome />}
          {mobileTab === "notifications" && <MobileNotifications />}
          {mobileTab === "loyalty" && <MobileLoyalty />}
          {mobileTab === "account" && <MobileAccount />}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 px-2 py-2 flex justify-around items-center">
          {[
            { key: "home" as const, icon: Home, label: "Home/Order" },
            { key: "notifications" as const, icon: Bell, label: "Notifications" },
            { key: "loyalty" as const, icon: Star, label: "Points" },
            { key: "account" as const, icon: User, label: "My Account" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setMobileTab(item.key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
                mobileTab === item.key ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Home Indicator */}
        <div className="bg-white pb-2 flex justify-center">
          <div className="w-32 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function LoginScreen() {
  const { setIsLoggedIn } = useAppStore();
  const [phone, setPhone] = useState("91234567");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-48px)] bg-gray-100 p-4">
      <div className="w-[390px] h-[844px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-gray-800 flex flex-col items-center justify-center p-8">
        <div className="text-5xl mb-4">🍱</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Danny Kitchen</h1>
        <p className="text-sm text-gray-500 mb-8">Student Lunch Box Ordering</p>

        <div className="w-full space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium">Parent Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          {!otpSent ? (
            <button
              onClick={() => setOtpSent(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-700 transition"
            >
              Send OTP
            </button>
          ) : (
            <>
              <div>
                <label className="text-xs text-gray-500 font-medium">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
              </div>
              <button
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-700 transition"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TermsScreen() {
  const { setHasAcceptedTerms } = useAppStore();
  const [checks, setChecks] = useState({ reg: false, user: false, privacy: false });

  const allChecked = checks.reg && checks.user && checks.privacy;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-48px)] bg-gray-100 p-4">
      <div className="w-[390px] h-[844px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-gray-800 flex flex-col p-8 justify-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to Danny Kitchen</h2>
        <p className="text-sm text-gray-500 mb-6">Please review and accept the following terms before continuing:</p>

        <div className="space-y-4">
          {[
            { key: "reg", label: "Registration Terms & Conditions", labelZh: "註冊條款及細則" },
            { key: "user", label: "User Agreement", labelZh: "用戶協議" },
            { key: "privacy", label: "Personal Data Privacy Policy", labelZh: "個人資料私隱政策" },
          ].map((term) => (
            <label
              key={term.key}
              className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-blue-50 transition"
            >
              <input
                type="checkbox"
                checked={checks[term.key as keyof typeof checks]}
                onChange={(e) => setChecks({ ...checks, [term.key]: e.target.checked })}
                className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">{term.label}</p>
                <p className="text-xs text-gray-500">{term.labelZh}</p>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={() => allChecked && setHasAcceptedTerms(true)}
          disabled={!allChecked}
          className={`mt-8 w-full py-3 rounded-xl font-medium text-sm transition ${
            allChecked
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}

function MobileHome() {
  const { currentChildId, students, menuItems, orders, addOrder, cancelOrder, setUnfinishedOrder } = useAppStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const currentStudent = students.find((s) => s.id === currentChildId);
  const today = new Date();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  const dateMenus = selectedDate
    ? menuItems.filter((m) => m.date === selectedDate)
    : [];

  const dateOrders = orders.filter(
    (o) => o.studentId === currentChildId && o.date === selectedDate && o.paymentStatus !== "Refunded"
  );

  const handleOrder = (menuType: string) => {
    setSelectedMenu(menuType);
    setShowCheckout(true);
  };

  const handlePayment = (method: string) => {
    const newOrder: any = {
      id: `ORD${String(orders.length + 1).padStart(3, "0")}`,
      studentId: currentChildId,
      date: selectedDate,
      menuType: selectedMenu,
      paymentStatus: "Paid",
      paymentMethod: method,
      distributionBox: `${currentStudent?.schoolId}-${currentStudent?.className}`,
      referenceNumber: `DK${format(new Date(), "yyyyMMdd")}${String(orders.length + 1).padStart(3, "0")}`,
      createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
    addOrder(newOrder);
    setShowCheckout(false);
    setShowPaymentSuccess(true);
    setTimeout(() => setShowPaymentSuccess(false), 3000);
  };

  if (showPaymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Payment Successful!</h3>
        <p className="text-sm text-gray-500 mt-1">Electronic receipt sent to your email.</p>
        <p className="text-xs text-gray-400 mt-4">付款成功！電子收據已發送到您的郵箱。</p>
      </div>
    );
  }

  if (showCheckout) {
    const menu = dateMenus.find((m) => m.menuType === selectedMenu);
    return (
      <div className="p-4">
        <button onClick={() => setShowCheckout(false)} className="flex items-center gap-1 text-blue-600 text-sm mb-4">
          <ChevronLeft size={16} /> Back
        </button>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Checkout 結帳</h3>
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium">{menu?.mainZh} (Set {menu?.menuType})</p>
          <p className="text-xs text-gray-500">{selectedDate}</p>
          <p className="text-lg font-bold text-blue-600 mt-2">HK${menu?.price}</p>
        </div>

        <p className="text-xs text-gray-500 mb-2">Available Balance: HK${currentStudent?.balance}</p>

        <div className="space-y-2">
          <button
            onClick={() => handlePayment("Wallet")}
            className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-medium"
          >
            💰 Pay with Wallet Balance
          </button>
          <button
            onClick={() => handlePayment("Alipay")}
            className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-medium"
          >
            Pay with Alipay 支付寶
          </button>
          <button
            onClick={() => handlePayment("WeChatPay")}
            className="w-full py-3 bg-green-600 text-white rounded-xl text-sm font-medium"
          >
            Pay with WeChat Pay 微信支付
          </button>
          <button
            onClick={() => handlePayment("HangSeng")}
            className="w-full py-3 bg-emerald-700 text-white rounded-xl text-sm font-medium"
          >
            🏦 Hang Seng Bank App-to-App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Student Info */}
      <div className="bg-blue-50 rounded-xl p-3 mb-4">
        <p className="text-sm font-semibold text-blue-800">
          {currentStudent?.nameZh} ({currentStudent?.name})
        </p>
        <p className="text-xs text-blue-600">
          {currentStudent?.className} | Balance: HK${currentStudent?.balance}
        </p>
        {currentStudent?.allergens.length ? (
          <div className="flex items-center gap-1 mt-1">
            <AlertTriangle size={12} className="text-red-500" />
            <span className="text-xs text-red-600">Allergens: {currentStudent.allergens.join(", ")}</span>
          </div>
        ) : null}
      </div>

      {/* Calendar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setCurrentMonth(addDays(monthStart, -1))} className="p-1">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
          <button onClick={() => setCurrentMonth(addDays(monthEnd, 1))} className="p-1">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-[10px] text-gray-400 py-1">{d}</div>
          ))}
          {Array.from({ length: startPadding }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const hasOrder = orders.some(
              (o) => o.studentId === currentChildId && o.date === dateStr && o.paymentStatus !== "Refunded"
            );
            const isSelected = selectedDate === dateStr;
            const isPast = !isAfter(day, today) && !isSameDay(day, today);
            const isWeekend = getDay(day) === 0 || getDay(day) === 6;

            return (
              <button
                key={dateStr}
                onClick={() => !isWeekend && setSelectedDate(dateStr)}
                disabled={isWeekend}
                className={`text-xs py-2 rounded-lg transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white font-bold"
                    : hasOrder
                    ? "bg-green-100 text-green-700 font-medium"
                    : isPast
                    ? "text-gray-300"
                    : isWeekend
                    ? "text-gray-300"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Options for Selected Date */}
      {selectedDate && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Menu for {selectedDate} 餐單
          </h4>
          {dateOrders.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
              <p className="text-xs text-green-700 font-medium">
                ✓ Ordered: Set {dateOrders[0].menuType} ({dateOrders[0].paymentStatus})
              </p>
              {isAfter(new Date(selectedDate), today) && (
                <button
                  onClick={() => cancelOrder(dateOrders[0].id)}
                  className="mt-2 text-xs text-red-600 underline"
                >
                  Cancel Meal (退餐)
                </button>
              )}
            </div>
          )}
          <div className="space-y-2">
            {dateMenus.map((menu) => {
              const hasAllergenConflict = menu.allergenMarkers.some(
                (a) => currentStudent?.allergens.includes(a)
              );
              return (
                <div
                  key={menu.menuType}
                  className={`border rounded-xl p-3 ${
                    hasAllergenConflict ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold">
                        Set {menu.menuType}: {menu.mainZh}
                      </p>
                      <p className="text-xs text-gray-500">{menu.main}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {menu.sidesZh.join(", ")} | {menu.snackZh} | {menu.dessertZh}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-blue-600">HK${menu.price}</span>
                  </div>
                  {hasAllergenConflict && (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertTriangle size={12} className="text-red-500" />
                      <span className="text-xs text-red-600 font-medium">
                        Contains allergen: {menu.allergenMarkers.filter((a) => currentStudent?.allergens.includes(a)).join(", ")}
                      </span>
                    </div>
                  )}
                  {!dateOrders.length && isAfter(new Date(selectedDate), today) && (
                    <button
                      onClick={() => handleOrder(menu.menuType)}
                      className="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-medium"
                    >
                      Order 訂餐
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNotifications() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Notifications 通知</h3>
      <div className="space-y-3">
        {[
          { time: "Today 09:00", msg: "Tomorrow's menu has been published", type: "info" },
          { time: "Yesterday 14:30", msg: "Refund of HK$28 approved (30-day freeze)", type: "success" },
          { time: "2 days ago", msg: "Allergen alert: Set D contains Peanuts", type: "warning" },
          { time: "3 days ago", msg: "Payment received: HK$140 (5 meals)", type: "success" },
          { time: "1 week ago", msg: "School holiday: No lunch service on 25 Dec", type: "info" },
        ].map((notif, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <div
                className={`w-2 h-2 rounded-full mt-1.5 ${
                  notif.type === "info"
                    ? "bg-blue-500"
                    : notif.type === "success"
                    ? "bg-green-500"
                    : "bg-orange-500"
                }`}
              />
              <div>
                <p className="text-sm text-gray-700">{notif.msg}</p>
                <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileLoyalty() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Loyalty Points 積分</h3>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 text-white mb-4">
        <p className="text-xs opacity-80">Available Points 可用積分</p>
        <p className="text-3xl font-bold mt-1">1,280</p>
        <p className="text-xs opacity-70 mt-2">= HK$12.80 discount value</p>
      </div>

      <h4 className="text-sm font-semibold text-gray-700 mb-2">Point History</h4>
      <div className="space-y-2">
        {[
          { desc: "Order 5 meals bonus", points: "+100", date: "Today" },
          { desc: "Daily order streak (7 days)", points: "+50", date: "Yesterday" },
          { desc: "Used coupon", points: "-200", date: "3 days ago" },
          { desc: "Referral bonus", points: "+300", date: "1 week ago" },
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm text-gray-700">{item.desc}</p>
              <p className="text-xs text-gray-400">{item.date}</p>
            </div>
            <span className={`text-sm font-bold ${item.points.startsWith("+") ? "text-green-600" : "text-red-500"}`}>
              {item.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileAccount() {
  const { currentChildId, setCurrentChildId, students, setIsLoggedIn, setHasAcceptedTerms } = useAppStore();
  const currentStudent = students.find((s) => s.id === currentChildId);
  const siblings = students.filter((s) => currentStudent?.tiedSiblings.includes(s.id));

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">My Account 我的帳戶</h3>

      {/* Current Child */}
      <div className="bg-blue-50 rounded-xl p-4 mb-4">
        <p className="text-sm font-semibold text-blue-800">{currentStudent?.nameZh}</p>
        <p className="text-xs text-blue-600">{currentStudent?.name}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="bg-white rounded-lg p-2">
            <p className="text-[10px] text-gray-500">Available Balance</p>
            <p className="text-sm font-bold text-green-600">HK${currentStudent?.balance}</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-[10px] text-gray-500">Pending Refund (30 days)</p>
            <p className="text-sm font-bold text-orange-500">HK${currentStudent?.pendingRefund}</p>
          </div>
        </div>
      </div>

      {/* Sibling Switcher */}
      {siblings.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 font-medium mb-2">Switch Child 切換子女</p>
          <div className="flex gap-2">
            {[currentStudent, ...siblings].filter(Boolean).map((child) => (
              <button
                key={child!.id}
                onClick={() => setCurrentChildId(child!.id)}
                className={`flex-1 p-3 rounded-xl border transition ${
                  child!.id === currentChildId
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <p className="text-xs font-semibold text-gray-800">{child!.nameZh}</p>
                <p className="text-[10px] text-gray-500">{child!.className}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Account Info */}
      <div className="space-y-3">
        <div className="border border-gray-200 rounded-xl p-3">
          <p className="text-xs text-gray-500">School</p>
          <p className="text-sm font-medium">{currentStudent?.schoolId}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-3">
          <p className="text-xs text-gray-500">Class</p>
          <p className="text-sm font-medium">{currentStudent?.className}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-3">
          <p className="text-xs text-gray-500">Allergens 過敏源</p>
          <p className="text-sm font-medium">
            {currentStudent?.allergens.length ? currentStudent.allergens.join(", ") : "None"}
          </p>
        </div>
        {currentStudent?.subsidized && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <p className="text-xs text-green-700 font-medium">✓ 關愛基金 Subsidized Account Active</p>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          setIsLoggedIn(false);
          setHasAcceptedTerms(false);
        }}
        className="mt-6 w-full py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-200"
      >
        Logout 登出
      </button>
    </div>
  );
}
