// Danny Kitchen Student Lunch Box Ordering System - Mock Data
import { format, addDays, subDays } from "date-fns";

export interface School {
  id: string;
  name: string;
  nameZh: string;
  area: string;
  address: string;
  classList: string[];
  singleMealPrice: number;
  contractStatus: "Active" | "Expired";
  contractDocument: string;
  moqPerClass: number;
  insulatedBoxCode: string;
  orderDeadlineHours: number;
  holidays: string[];
}

export interface Student {
  id: string;
  name: string;
  nameZh: string;
  schoolId: string;
  className: string;
  balance: number;
  pendingRefund: number;
  subsidized: boolean;
  tiedSiblings: string[];
  allergens: string[];
  parentName: string;
  parentPhone: string;
  parentEmail: string;
}

export interface MenuItem {
  date: string;
  menuType: "A" | "B" | "C" | "D";
  main: string;
  mainZh: string;
  sides: string[];
  sidesZh: string[];
  snack: string;
  snackZh: string;
  dessert: string;
  dessertZh: string;
  photoUrl: string;
  allergenMarkers: string[];
  price: number;
}

export interface Order {
  id: string;
  studentId: string;
  date: string;
  menuType: "A" | "B" | "C" | "D";
  paymentStatus: "Paid" | "Pending" | "Subsidized" | "Refunded";
  paymentMethod: "Wallet" | "Alipay" | "WeChatPay" | "HangSeng" | "Coupon" | "Subsidized";
  distributionBox: string;
  referenceNumber: string;
  createdAt: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}

export interface RolePermission {
  role: string;
  modules: { [key: string]: "full" | "read-only" | "hidden" };
}

// Schools Mock Data
export const schools: School[] = [
  {
    id: "SCH001",
    name: "St. Mary's Primary School",
    nameZh: "聖瑪利小學",
    area: "Shatin",
    address: "12 Tai Wai Road, Shatin, NT",
    classList: ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"],
    singleMealPrice: 28,
    contractStatus: "Active",
    contractDocument: "contract_SCH001_2024.pdf",
    moqPerClass: 15,
    insulatedBoxCode: "IB-SM-001",
    orderDeadlineHours: 48,
    holidays: ["2024-12-25", "2024-12-26", "2025-01-01"],
  },
  {
    id: "SCH002",
    name: "Tuen Mun Catholic Primary",
    nameZh: "屯門天主教小學",
    area: "Tuen Mun",
    address: "88 Castle Peak Road, Tuen Mun, NT",
    classList: ["1A", "1B", "1C", "2A", "2B", "2C", "3A", "3B", "4A", "4B", "5A", "5B", "6A"],
    singleMealPrice: 26,
    contractStatus: "Active",
    contractDocument: "contract_SCH002_2024.pdf",
    moqPerClass: 12,
    insulatedBoxCode: "IB-TM-002",
    orderDeadlineHours: 48,
    holidays: ["2024-12-25", "2025-01-01"],
  },
  {
    id: "SCH003",
    name: "Kwun Tong Baptist Primary",
    nameZh: "觀塘浸信會小學",
    area: "Kwun Tong",
    address: "45 Mut Wah Street, Kwun Tong, KLN",
    classList: ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "6A"],
    singleMealPrice: 30,
    contractStatus: "Active",
    contractDocument: "contract_SCH003_2024.pdf",
    moqPerClass: 10,
    insulatedBoxCode: "IB-KT-003",
    orderDeadlineHours: 72,
    holidays: [],
  },
  {
    id: "SCH004",
    name: "Wong Tai Sin Government School",
    nameZh: "黃大仙官立小學",
    area: "Wong Tai Sin",
    address: "22 Lung Cheung Road, Wong Tai Sin, KLN",
    classList: ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "5A", "6A"],
    singleMealPrice: 25,
    contractStatus: "Expired",
    contractDocument: "contract_SCH004_2023.pdf",
    moqPerClass: 8,
    insulatedBoxCode: "IB-WTS-004",
    orderDeadlineHours: 48,
    holidays: [],
  },
];

// Students Mock Data
export const students: Student[] = [
  {
    id: "STU001",
    name: "Chan Tai Ming",
    nameZh: "陳大明",
    schoolId: "SCH001",
    className: "3A",
    balance: 280,
    pendingRefund: 56,
    subsidized: false,
    tiedSiblings: ["STU002"],
    allergens: ["Peanuts", "Shellfish"],
    parentName: "Chan Wing Kee",
    parentPhone: "91234567",
    parentEmail: "chan.wk@email.com",
  },
  {
    id: "STU002",
    name: "Chan Siu Ming",
    nameZh: "陳小明",
    schoolId: "SCH001",
    className: "1B",
    balance: 336,
    pendingRefund: 0,
    subsidized: false,
    tiedSiblings: ["STU001"],
    allergens: [],
    parentName: "Chan Wing Kee",
    parentPhone: "91234567",
    parentEmail: "chan.wk@email.com",
  },
  {
    id: "STU003",
    name: "Wong Ka Yan",
    nameZh: "黃嘉欣",
    schoolId: "SCH001",
    className: "5A",
    balance: 140,
    pendingRefund: 28,
    subsidized: true,
    tiedSiblings: [],
    allergens: ["Dairy"],
    parentName: "Wong Mei Ling",
    parentPhone: "98765432",
    parentEmail: "wong.ml@email.com",
  },
  {
    id: "STU004",
    name: "Lee Ho Yin",
    nameZh: "李浩然",
    schoolId: "SCH002",
    className: "4A",
    balance: 520,
    pendingRefund: 0,
    subsidized: false,
    tiedSiblings: ["STU005"],
    allergens: ["Eggs"],
    parentName: "Lee Wai Man",
    parentPhone: "65432198",
    parentEmail: "lee.wm@email.com",
  },
  {
    id: "STU005",
    name: "Lee Hei Tung",
    nameZh: "李希彤",
    schoolId: "SCH002",
    className: "2B",
    balance: 390,
    pendingRefund: 26,
    subsidized: false,
    tiedSiblings: ["STU004"],
    allergens: [],
    parentName: "Lee Wai Man",
    parentPhone: "65432198",
    parentEmail: "lee.wm@email.com",
  },
  {
    id: "STU006",
    name: "Ng Chi Wai",
    nameZh: "吳志偉",
    schoolId: "SCH003",
    className: "6A",
    balance: 0,
    pendingRefund: 0,
    subsidized: true,
    tiedSiblings: [],
    allergens: ["Gluten", "Soy"],
    parentName: "Ng Siu Fong",
    parentPhone: "54321876",
    parentEmail: "ng.sf@email.com",
  },
  {
    id: "STU007",
    name: "Lam Yui Kei",
    nameZh: "林瑞琪",
    schoolId: "SCH002",
    className: "3B",
    balance: 208,
    pendingRefund: 0,
    subsidized: false,
    tiedSiblings: [],
    allergens: [],
    parentName: "Lam Siu Hung",
    parentPhone: "67891234",
    parentEmail: "lam.sh@email.com",
  },
  {
    id: "STU008",
    name: "Cheung Hoi Lam",
    nameZh: "張凱琳",
    schoolId: "SCH001",
    className: "4B",
    balance: 84,
    pendingRefund: 56,
    subsidized: true,
    tiedSiblings: [],
    allergens: ["Sesame"],
    parentName: "Cheung Mei Yee",
    parentPhone: "92345678",
    parentEmail: "cheung.my@email.com",
  },
];

// Generate Menu Items for the next 2 weeks
const today = new Date();
export const menuItems: MenuItem[] = [];

const menuTemplates = [
  {
    type: "A" as const,
    main: "Steamed Chicken with Rice",
    mainZh: "蒸雞飯",
    sides: ["Seasonal Vegetables", "Corn Soup"],
    sidesZh: ["時令蔬菜", "粟米湯"],
    snack: "Fish Ball",
    snackZh: "魚蛋",
    dessert: "Fruit Cup",
    dessertZh: "生果杯",
    allergenMarkers: [],
  },
  {
    type: "B" as const,
    main: "Braised Pork with Noodles",
    mainZh: "紅燒肉配麵",
    sides: ["Broccoli", "Egg Drop Soup"],
    sidesZh: ["西蘭花", "蛋花湯"],
    snack: "Spring Roll",
    snackZh: "春卷",
    dessert: "Red Bean Cake",
    dessertZh: "紅豆糕",
    allergenMarkers: ["Gluten", "Eggs"],
  },
  {
    type: "C" as const,
    main: "Fish Fillet with Fried Rice",
    mainZh: "魚柳炒飯",
    sides: ["Mixed Vegetables", "Tomato Soup"],
    sidesZh: ["雜菜", "蕃茄湯"],
    snack: "Chicken Wing",
    snackZh: "雞翼",
    dessert: "Jelly",
    dessertZh: "啫喱",
    allergenMarkers: ["Shellfish"],
  },
  {
    type: "D" as const,
    main: "Curry Chicken with Rice",
    mainZh: "咖喱雞飯",
    sides: ["Potato", "Mushroom Soup"],
    sidesZh: ["薯仔", "蘑菇湯"],
    snack: "Siu Mai",
    snackZh: "燒賣",
    dessert: "Mango Pudding",
    dessertZh: "芒果布甸",
    allergenMarkers: ["Dairy", "Peanuts"],
  },
];

for (let i = -7; i < 14; i++) {
  const date = format(addDays(today, i), "yyyy-MM-dd");
  menuTemplates.forEach((template) => {
    menuItems.push({
      date,
      menuType: template.type,
      main: template.main,
      mainZh: template.mainZh,
      sides: template.sides,
      sidesZh: template.sidesZh,
      snack: template.snack,
      snackZh: template.snackZh,
      dessert: template.dessert,
      dessertZh: template.dessertZh,
      photoUrl: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=60`,
      allergenMarkers: template.allergenMarkers,
      price: 28,
    });
  });
}

// Generate Orders
export const orders: Order[] = [
  {
    id: "ORD001",
    studentId: "STU001",
    date: format(addDays(today, 1), "yyyy-MM-dd"),
    menuType: "A",
    paymentStatus: "Paid",
    paymentMethod: "Wallet",
    distributionBox: "IB-SM-001-3A",
    referenceNumber: "DK20240101001",
    createdAt: format(subDays(today, 2), "yyyy-MM-dd HH:mm:ss"),
  },
  {
    id: "ORD002",
    studentId: "STU001",
    date: format(addDays(today, 2), "yyyy-MM-dd"),
    menuType: "B",
    paymentStatus: "Paid",
    paymentMethod: "Alipay",
    distributionBox: "IB-SM-001-3A",
    referenceNumber: "DK20240101002",
    createdAt: format(subDays(today, 2), "yyyy-MM-dd HH:mm:ss"),
  },
  {
    id: "ORD003",
    studentId: "STU003",
    date: format(addDays(today, 1), "yyyy-MM-dd"),
    menuType: "C",
    paymentStatus: "Subsidized",
    paymentMethod: "Subsidized",
    distributionBox: "IB-SM-001-5A",
    referenceNumber: "DK20240101003",
    createdAt: format(subDays(today, 1), "yyyy-MM-dd HH:mm:ss"),
  },
  {
    id: "ORD004",
    studentId: "STU004",
    date: format(addDays(today, 1), "yyyy-MM-dd"),
    menuType: "A",
    paymentStatus: "Paid",
    paymentMethod: "HangSeng",
    distributionBox: "IB-TM-002-4A",
    referenceNumber: "DK20240101004",
    createdAt: format(subDays(today, 1), "yyyy-MM-dd HH:mm:ss"),
  },
  {
    id: "ORD005",
    studentId: "STU006",
    date: format(addDays(today, 1), "yyyy-MM-dd"),
    menuType: "D",
    paymentStatus: "Subsidized",
    paymentMethod: "Subsidized",
    distributionBox: "IB-KT-003-6A",
    referenceNumber: "DK20240101005",
    createdAt: format(subDays(today, 1), "yyyy-MM-dd HH:mm:ss"),
  },
  {
    id: "ORD006",
    studentId: "STU002",
    date: format(addDays(today, 1), "yyyy-MM-dd"),
    menuType: "A",
    paymentStatus: "Paid",
    paymentMethod: "Wallet",
    distributionBox: "IB-SM-001-1B",
    referenceNumber: "DK20240101006",
    createdAt: format(today, "yyyy-MM-dd HH:mm:ss"),
  },
  {
    id: "ORD007",
    studentId: "STU007",
    date: format(addDays(today, 2), "yyyy-MM-dd"),
    menuType: "B",
    paymentStatus: "Pending",
    paymentMethod: "WeChatPay",
    distributionBox: "IB-TM-002-3B",
    referenceNumber: "DK20240101007",
    createdAt: format(today, "yyyy-MM-dd HH:mm:ss"),
  },
  {
    id: "ORD008",
    studentId: "STU008",
    date: format(addDays(today, 1), "yyyy-MM-dd"),
    menuType: "C",
    paymentStatus: "Subsidized",
    paymentMethod: "Subsidized",
    distributionBox: "IB-SM-001-4B",
    referenceNumber: "DK20240101008",
    createdAt: format(today, "yyyy-MM-dd HH:mm:ss"),
  },
];

// System Log
export const systemLogs: LogEntry[] = [
  {
    id: "LOG001",
    timestamp: format(subDays(today, 1), "yyyy-MM-dd 09:15:00"),
    user: "Admin Lee",
    role: "Administrator",
    action: "Import Student List",
    details: "Imported 45 students for SCH001 via Excel upload",
  },
  {
    id: "LOG002",
    timestamp: format(subDays(today, 1), "yyyy-MM-dd 10:30:00"),
    user: "Staff Wong",
    role: "Data Entry",
    action: "Manual Order Entry",
    details: "Added 12 paper orders for SCH002 Class 2A",
  },
  {
    id: "LOG003",
    timestamp: format(today, "yyyy-MM-dd 08:00:00"),
    user: "System",
    role: "System",
    action: "Auto Menu Publish",
    details: "Published menu for next week (Mon-Fri)",
  },
  {
    id: "LOG004",
    timestamp: format(today, "yyyy-MM-dd 08:45:00"),
    user: "Admin Lee",
    role: "Administrator",
    action: "Batch Refund",
    details: "Emergency typhoon refund processed for 2024-01-15, 230 orders",
  },
  {
    id: "LOG005",
    timestamp: format(today, "yyyy-MM-dd 09:30:00"),
    user: "Accountant Cheung",
    role: "Accountant",
    action: "Export Invoice",
    details: "Exported subsidized student invoice for December 2024",
  },
];

// Role Permissions
export const rolePermissions: RolePermission[] = [
  {
    role: "Administrator",
    modules: {
      Dashboard: "full",
      "School Mgt": "full",
      "Student & Order Mgt": "full",
      "Menu Pricing": "full",
      "Refund & Cloud Control": "full",
      "Logistics & Production": "full",
      "Accounting Center": "full",
      "System Security Log": "full",
    },
  },
  {
    role: "Accountant",
    modules: {
      Dashboard: "read-only",
      "School Mgt": "read-only",
      "Student & Order Mgt": "read-only",
      "Menu Pricing": "hidden",
      "Refund & Cloud Control": "full",
      "Logistics & Production": "hidden",
      "Accounting Center": "full",
      "System Security Log": "read-only",
    },
  },
  {
    role: "Data Entry",
    modules: {
      Dashboard: "read-only",
      "School Mgt": "read-only",
      "Student & Order Mgt": "full",
      "Menu Pricing": "read-only",
      "Refund & Cloud Control": "read-only",
      "Logistics & Production": "read-only",
      "Accounting Center": "hidden",
      "System Security Log": "hidden",
    },
  },
  {
    role: "Kitchen Staff",
    modules: {
      Dashboard: "read-only",
      "School Mgt": "hidden",
      "Student & Order Mgt": "hidden",
      "Menu Pricing": "read-only",
      "Refund & Cloud Control": "hidden",
      "Logistics & Production": "full",
      "Accounting Center": "hidden",
      "System Security Log": "hidden",
    },
  },
  {
    role: "Driver",
    modules: {
      Dashboard: "hidden",
      "School Mgt": "hidden",
      "Student & Order Mgt": "hidden",
      "Menu Pricing": "hidden",
      "Refund & Cloud Control": "hidden",
      "Logistics & Production": "read-only",
      "Accounting Center": "hidden",
      "System Security Log": "hidden",
    },
  },
];
