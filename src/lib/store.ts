import { create } from "zustand";
import {
  schools,
  students,
  menuItems,
  orders,
  systemLogs,
  rolePermissions,
  School,
  Student,
  MenuItem,
  Order,
  LogEntry,
  RolePermission,
} from "./mock-data";
import { format } from "date-fns";

export type ViewMode = "mobile" | "desktop";
export type MobileTab = "home" | "notifications" | "loyalty" | "account";
export type DesktopSection =
  | "dashboard"
  | "school-mgt"
  | "student-order"
  | "menu-pricing"
  | "refund-cloud"
  | "logistics"
  | "accounting"
  | "security-log";

export type AppUpdateMode = "appstore" | "codepush";
export type DeviceEnvironment = "standard" | "mainland";

interface AppState {
  // View Mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Mobile State
  mobileTab: MobileTab;
  setMobileTab: (tab: MobileTab) => void;
  currentChildId: string;
  setCurrentChildId: (id: string) => void;
  hasAcceptedTerms: boolean;
  setHasAcceptedTerms: (val: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  unfinishedOrder: { date: string; menuType: string } | null;
  setUnfinishedOrder: (order: { date: string; menuType: string } | null) => void;

  // Desktop State
  desktopSection: DesktopSection;
  setDesktopSection: (section: DesktopSection) => void;

  // Tech Overrides
  appUpdateMode: AppUpdateMode;
  setAppUpdateMode: (mode: AppUpdateMode) => void;
  deviceEnvironment: DeviceEnvironment;
  setDeviceEnvironment: (env: DeviceEnvironment) => void;
  showCodePushOverlay: boolean;
  setShowCodePushOverlay: (val: boolean) => void;

  // Data
  schools: School[];
  students: Student[];
  menuItems: MenuItem[];
  orders: Order[];
  systemLogs: LogEntry[];
  rolePermissions: RolePermission[];

  // Data Actions
  addOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => void;
  addStudent: (student: Student) => void;
  updateStudentBalance: (studentId: string, amount: number) => void;
  toggleSubsidized: (studentId: string) => void;
  addLogEntry: (entry: Omit<LogEntry, "id" | "timestamp">) => void;
  batchRefund: (date: string, reason: string) => void;
  swapMeals: (schoolId: string, className: string, date: string, fromType: string, toType: string) => void;
  frozenMonths: string[];
  freezeMonth: (month: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // View Mode
  viewMode: "desktop",
  setViewMode: (mode) => set({ viewMode: mode }),

  // Mobile State
  mobileTab: "home",
  setMobileTab: (tab) => set({ mobileTab: tab }),
  currentChildId: "STU001",
  setCurrentChildId: (id) => set({ currentChildId: id }),
  hasAcceptedTerms: false,
  setHasAcceptedTerms: (val) => set({ hasAcceptedTerms: val }),
  isLoggedIn: false,
  setIsLoggedIn: (val) => set({ isLoggedIn: val }),
  unfinishedOrder: null,
  setUnfinishedOrder: (order) => set({ unfinishedOrder: order }),

  // Desktop State
  desktopSection: "dashboard",
  setDesktopSection: (section) => set({ desktopSection: section }),

  // Tech Overrides
  appUpdateMode: "appstore",
  setAppUpdateMode: (mode) => {
    set({ appUpdateMode: mode });
    if (mode === "codepush") {
      set({ showCodePushOverlay: true });
      setTimeout(() => set({ showCodePushOverlay: false }), 3000);
    }
  },
  deviceEnvironment: "standard",
  setDeviceEnvironment: (env) => set({ deviceEnvironment: env }),
  showCodePushOverlay: false,
  setShowCodePushOverlay: (val) => set({ showCodePushOverlay: val }),

  // Data
  schools: [...schools],
  students: [...students],
  menuItems: [...menuItems],
  orders: [...orders],
  systemLogs: [...systemLogs],
  rolePermissions: [...rolePermissions],

  // Data Actions
  addOrder: (order) => {
    set((state) => ({ orders: [...state.orders, order] }));
    get().addLogEntry({
      user: "Parent App",
      role: "Parent",
      action: "New Order",
      details: `Order ${order.id} created for student ${order.studentId}`,
    });
  },
  cancelOrder: (orderId) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, paymentStatus: "Refunded" as const } : o
      ),
    }));
    get().addLogEntry({
      user: "Parent App",
      role: "Parent",
      action: "Cancel Order",
      details: `Order ${orderId} cancelled and refund requested`,
    });
  },
  addStudent: (student) => {
    set((state) => ({ students: [...state.students, student] }));
    get().addLogEntry({
      user: "Admin",
      role: "Administrator",
      action: "Add Student",
      details: `Student ${student.name} (${student.id}) added`,
    });
  },
  updateStudentBalance: (studentId, amount) => {
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId ? { ...s, balance: s.balance + amount } : s
      ),
    }));
  },
  toggleSubsidized: (studentId) => {
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId ? { ...s, subsidized: !s.subsidized } : s
      ),
    }));
    const student = get().students.find((s) => s.id === studentId);
    get().addLogEntry({
      user: "Admin",
      role: "Administrator",
      action: "Toggle Subsidized Status",
      details: `Student ${student?.name} subsidized status changed to ${!student?.subsidized}`,
    });
  },
  addLogEntry: (entry) => {
    const newEntry: LogEntry = {
      id: `LOG${String(get().systemLogs.length + 1).padStart(3, "0")}`,
      timestamp: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      ...entry,
    };
    set((state) => ({ systemLogs: [newEntry, ...state.systemLogs] }));
  },
  batchRefund: (date, reason) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.date === date ? { ...o, paymentStatus: "Refunded" as const } : o
      ),
    }));
    const affectedCount = get().orders.filter((o) => o.date === date).length;
    get().addLogEntry({
      user: "Admin",
      role: "Administrator",
      action: `Emergency Batch Refund - ${reason}`,
      details: `All ${affectedCount} orders on ${date} refunded due to ${reason}`,
    });
  },
  swapMeals: (schoolId, className, date, fromType, toType) => {
    set((state) => ({
      orders: state.orders.map((o) => {
        const student = state.students.find((s) => s.id === o.studentId);
        if (student?.schoolId === schoolId && student?.className === className && o.date === date && o.menuType === fromType) {
          return { ...o, menuType: toType as "A" | "B" | "C" | "D" };
        }
        return o;
      }),
    }));
    get().addLogEntry({
      user: "Admin",
      role: "Administrator",
      action: "Class Meal Swap",
      details: `Swapped Set ${fromType} to Set ${toType} for ${schoolId} ${className} on ${date}`,
    });
  },
  frozenMonths: [],
  freezeMonth: (month) => {
    set((state) => ({ frozenMonths: [...state.frozenMonths, month] }));
    get().addLogEntry({
      user: "Accountant",
      role: "Accountant",
      action: "Freeze Accounting Data",
      details: `Month ${month} accounting data frozen and locked`,
    });
  },
}));
