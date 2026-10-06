import { Employee, Product, Sale, AttendanceRecord, CashCut, Area } from '../types';

const STORAGE_KEYS = {
  EMPLOYEES: 'purificadora_employees',
  PRODUCTS: 'purificadora_products',
  SALES: 'purificadora_sales',
  ATTENDANCE: 'purificadora_attendance',
  CASH_CUTS: 'purificadora_cash_cuts',
  ACTIVE_SESSION: 'purificadora_active_session',
};

// Default seed employees
const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Juan Pérez',
    pin: '1234',
    defaultArea: 'purificadora',
    scheduledTime: '08:00',
    role: 'empleado',
    isActive: true,
    avatarColor: 'bg-sky-500',
  },
  {
    id: 'emp-2',
    name: 'María López',
    pin: '2345',
    defaultArea: 'tienda',
    scheduledTime: '08:30',
    role: 'empleado',
    isActive: true,
    avatarColor: 'bg-emerald-500',
  },
  {
    id: 'emp-3',
    name: 'Carlos Ruiz',
    pin: '3456',
    defaultArea: 'purificadora',
    scheduledTime: '09:00',
    role: 'empleado',
    isActive: true,
    avatarColor: 'bg-cyan-500',
  },
  {
    id: 'admin-1',
    name: 'Don Roberto (Patrón)',
    pin: '9999',
    defaultArea: 'purificadora',
    scheduledTime: '07:30',
    role: 'admin',
    isActive: true,
    avatarColor: 'bg-indigo-600',
  },
];

// Default seed products: Water items + groceries
const DEFAULT_PRODUCTS: Product[] = [
  // Purificadora Express Items
  {
    id: 'prod-w1',
    name: 'Relleno Garrafón 20L',
    category: 'purificadora',
    price: 18,
    unit: 'pza',
    isQuickAccess: true,
    emoji: '💧',
  },
  {
    id: 'prod-w2',
    name: 'Garrafón Nuevo Completo',
    category: 'purificadora',
    price: 120,
    unit: 'pza',
    isQuickAccess: true,
    emoji: '🪣',
  },
  {
    id: 'prod-w3',
    name: 'Medio Garrafón 10L',
    category: 'purificadora',
    price: 12,
    unit: 'pza',
    isQuickAccess: true,
    emoji: '🍶',
  },
  {
    id: 'prod-w4',
    name: 'Galón de Agua 4L',
    category: 'purificadora',
    price: 8,
    unit: 'pza',
    isQuickAccess: true,
    emoji: '🧴',
  },
  {
    id: 'prod-w5',
    name: 'Bolsa de Hielo 5kg',
    category: 'purificadora',
    price: 30,
    unit: 'bolsa',
    isQuickAccess: true,
    emoji: '🧊',
  },
  {
    id: 'prod-w6',
    name: 'Tapa selladora / Tapón',
    category: 'purificadora',
    price: 3,
    unit: 'pza',
    isQuickAccess: false,
    emoji: '🔘',
  },
  // Tienda / Abarrotes Items
  {
    id: 'prod-g1',
    name: 'Coca Cola 600ml',
    category: 'tienda',
    price: 20,
    unit: 'botella',
    isQuickAccess: true,
    emoji: '🥤',
  },
  {
    id: 'prod-g2',
    name: 'Refresco Familiar 2L',
    category: 'tienda',
    price: 38,
    unit: 'botella',
    isQuickAccess: true,
    emoji: '🍾',
  },
  {
    id: 'prod-g3',
    name: 'Papas Sabritas Clásicas',
    category: 'tienda',
    price: 19,
    unit: 'bolsa',
    isQuickAccess: true,
    emoji: '🥔',
  },
  {
    id: 'prod-g4',
    name: 'Galletas Marías / Emperador',
    category: 'tienda',
    price: 18,
    unit: 'paquete',
    isQuickAccess: true,
    emoji: '🍪',
  },
  {
    id: 'prod-g5',
    name: 'Botella Agua Purificada 1L',
    category: 'tienda',
    price: 12,
    unit: 'botella',
    isQuickAccess: true,
    emoji: '💦',
  },
  {
    id: 'prod-g6',
    name: 'Leche Entera 1L',
    category: 'tienda',
    price: 26,
    unit: 'litro',
    isQuickAccess: false,
    emoji: '🥛',
  },
  {
    id: 'prod-g7',
    name: 'Huevo (Kilo)',
    category: 'tienda',
    price: 44,
    unit: 'kg',
    isQuickAccess: false,
    emoji: '🥚',
  },
  {
    id: 'prod-g8',
    name: 'Pan Dulce / Bolillo (pza)',
    category: 'tienda',
    price: 7,
    unit: 'pza',
    isQuickAccess: false,
    emoji: '🥖',
  },
];

// Seed attendance for today
const todayDateStr = new Date().toISOString().split('T')[0];

const DEFAULT_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'emp-1',
    employeeName: 'Juan Pérez',
    area: 'purificadora',
    date: todayDateStr,
    checkIn: '07:55:12',
    status: 'en_turno',
  },
  {
    id: 'att-2',
    employeeId: 'emp-2',
    employeeName: 'María López',
    area: 'tienda',
    date: todayDateStr,
    checkIn: '08:42:05',
    status: 'en_turno',
  },
];

// Seed initial sales for today
const DEFAULT_SALES: Sale[] = [
  {
    id: 'sale-1001',
    ticketNumber: 1001,
    employeeId: 'emp-1',
    employeeName: 'Juan Pérez',
    area: 'purificadora',
    items: [
      {
        productId: 'prod-w1',
        productName: 'Relleno Garrafón 20L',
        category: 'purificadora',
        quantity: 3,
        unitPrice: 18,
        subtotal: 54,
      },
    ],
    total: 54,
    paymentMethod: 'efectivo',
    cashReceived: 100,
    changeGiven: 46,
    timestamp: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
  },
  {
    id: 'sale-1002',
    ticketNumber: 1002,
    employeeId: 'emp-1',
    employeeName: 'Juan Pérez',
    area: 'purificadora',
    items: [
      {
        productId: 'prod-w2',
        productName: 'Garrafón Nuevo Completo',
        category: 'purificadora',
        quantity: 1,
        unitPrice: 120,
        subtotal: 120,
      },
      {
        productId: 'prod-w1',
        productName: 'Relleno Garrafón 20L',
        category: 'purificadora',
        quantity: 1,
        unitPrice: 18,
        subtotal: 18,
      },
    ],
    total: 138,
    paymentMethod: 'transferencia',
    cashReceived: 138,
    changeGiven: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
  },
  {
    id: 'sale-1003',
    ticketNumber: 1003,
    employeeId: 'emp-2',
    employeeName: 'María López',
    area: 'tienda',
    items: [
      {
        productId: 'prod-g1',
        productName: 'Coca Cola 600ml',
        category: 'tienda',
        quantity: 2,
        unitPrice: 20,
        subtotal: 40,
      },
      {
        productId: 'prod-g3',
        productName: 'Papas Sabritas Clásicas',
        category: 'tienda',
        quantity: 1,
        unitPrice: 19,
        subtotal: 19,
      },
    ],
    total: 59,
    paymentMethod: 'efectivo',
    cashReceived: 100,
    changeGiven: 41,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'sale-1004',
    ticketNumber: 1004,
    employeeId: 'emp-1',
    employeeName: 'Juan Pérez',
    area: 'purificadora',
    items: [
      {
        productId: 'prod-w1',
        productName: 'Relleno Garrafón 20L',
        category: 'purificadora',
        quantity: 2,
        unitPrice: 18,
        subtotal: 36,
      },
      {
        productId: 'prod-w5',
        productName: 'Bolsa de Hielo 5kg',
        category: 'purificadora',
        quantity: 1,
        unitPrice: 30,
        subtotal: 30,
      },
    ],
    total: 66,
    paymentMethod: 'efectivo',
    cashReceived: 100,
    changeGiven: 34,
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
];

// Seed yesterday cash cut
const yesterdayDateStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const DEFAULT_CASH_CUTS: CashCut[] = [
  {
    id: 'cut-yesterday',
    date: yesterdayDateStr,
    closedAt: new Date(Date.now() - 86400000 + 3600000 * 20).toISOString(),
    closedByName: 'Don Roberto (Patrón)',
    totalCash: 2450,
    totalTransfer: 980,
    totalAmount: 3430,
    salesCount: 38,
    purificadoraTotal: 2540,
    tiendaTotal: 890,
    notes: 'Corte de caja sin diferencias. Todo en orden.',
  },
];

// Helper to notify changes across the app
function notifyUpdate(key: string) {
  window.dispatchEvent(new CustomEvent('purificadora_data_change', { detail: { key } }));
}

export const StorageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(DEFAULT_EMPLOYEES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(DEFAULT_SALES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(DEFAULT_ATTENDANCE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CASH_CUTS)) {
      localStorage.setItem(STORAGE_KEYS.CASH_CUTS, JSON.stringify(DEFAULT_CASH_CUTS));
    }
  },

  getEmployees(): Employee[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return data ? JSON.parse(data) : DEFAULT_EMPLOYEES;
    } catch {
      return DEFAULT_EMPLOYEES;
    }
  },

  saveEmployees(employees: Employee[]) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    notifyUpdate(STORAGE_KEYS.EMPLOYEES);
  },

  addEmployee(employee: Omit<Employee, 'id'>): Employee {
    const employees = this.getEmployees();
    const newEmp: Employee = {
      ...employee,
      id: `emp-${Date.now()}`,
    };
    employees.push(newEmp);
    this.saveEmployees(employees);
    return newEmp;
  },

  updateEmployee(id: string, updates: Partial<Employee>) {
    const employees = this.getEmployees().map(e => e.id === id ? { ...e, ...updates } : e);
    this.saveEmployees(employees);
  },

  deleteEmployee(id: string) {
    const employees = this.getEmployees().filter(e => e.id !== id);
    this.saveEmployees(employees);
  },

  getProducts(): Product[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  },

  saveProducts(products: Product[]) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    notifyUpdate(STORAGE_KEYS.PRODUCTS);
  },

  addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    products.push(newProd);
    this.saveProducts(products);
    return newProd;
  },

  updateProduct(id: string, updates: Partial<Product>) {
    const products = this.getProducts().map(p => p.id === id ? { ...p, ...updates } : p);
    this.saveProducts(products);
  },

  deleteProduct(id: string) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  },

  getSales(): Sale[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SALES);
      return data ? JSON.parse(data) : DEFAULT_SALES;
    } catch {
      return DEFAULT_SALES;
    }
  },

  saveSales(sales: Sale[]) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    notifyUpdate(STORAGE_KEYS.SALES);
  },

  addSale(saleData: Omit<Sale, 'id' | 'ticketNumber' | 'timestamp'>): Sale {
    const sales = this.getSales();
    const nextTicketNumber = sales.length > 0 ? Math.max(...sales.map(s => s.ticketNumber || 1000)) + 1 : 1001;
    const newSale: Sale = {
      ...saleData,
      id: `sale-${Date.now()}`,
      ticketNumber: nextTicketNumber,
      timestamp: new Date().toISOString(),
    };
    sales.unshift(newSale);
    this.saveSales(sales);
    return newSale;
  },

  getAttendance(): AttendanceRecord[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : DEFAULT_ATTENDANCE;
    } catch {
      return DEFAULT_ATTENDANCE;
    }
  },

  saveAttendance(attendance: AttendanceRecord[]) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
    notifyUpdate(STORAGE_KEYS.ATTENDANCE);
  },

  recordCheckIn(employee: Employee, area: Area): AttendanceRecord {
    const list = this.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:mm:ss

    // Determine punctuality
    const [schedH, schedM] = (employee.scheduledTime || '08:00').split(':').map(Number);
    const schedDate = new Date(now);
    schedDate.setHours(schedH, schedM + 15, 0, 0); // 15 min tolerance
    const isLate = now.getTime() > schedDate.getTime();

    const record: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      area: area,
      date: today,
      checkIn: timeStr,
      status: isLate ? 'retardo' : 'en_turno',
    };

    list.unshift(record);
    this.saveAttendance(list);
    return record;
  },

  recordCheckOut(employeeId: string): AttendanceRecord | null {
    const list = this.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    // Find the latest open record for this employee today
    const index = list.findIndex(r => r.employeeId === employeeId && r.date === today && !r.checkOut);
    if (index === -1) return null;

    const target = list[index];
    const [inH, inM, inS] = target.checkIn.split(':').map(Number);
    const checkInDate = new Date(now);
    checkInDate.setHours(inH, inM, inS || 0, 0);

    const diffHours = Math.max(0.1, Number(((now.getTime() - checkInDate.getTime()) / (1000 * 60 * 60)).toFixed(2)));

    const updatedRecord: AttendanceRecord = {
      ...target,
      checkOut: timeStr,
      status: 'completado',
      hoursWorked: diffHours,
    };

    list[index] = updatedRecord;
    this.saveAttendance(list);
    return updatedRecord;
  },

  getCashCuts(): CashCut[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CASH_CUTS);
      return data ? JSON.parse(data) : DEFAULT_CASH_CUTS;
    } catch {
      return DEFAULT_CASH_CUTS;
    }
  },

  saveCashCut(cutData: Omit<CashCut, 'id' | 'closedAt'>): CashCut {
    const cuts = this.getCashCuts();
    const newCut: CashCut = {
      ...cutData,
      id: `cut-${Date.now()}`,
      closedAt: new Date().toISOString(),
    };
    cuts.unshift(newCut);
    localStorage.setItem(STORAGE_KEYS.CASH_CUTS, JSON.stringify(cuts));
    notifyUpdate(STORAGE_KEYS.CASH_CUTS);
    return newCut;
  },

  // Active session
  getActiveSession(): { employee: Employee; area: Area } | null {
    try {
      const str = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      return str ? JSON.parse(str) : null;
    } catch {
      return null;
    }
  },

  setActiveSession(session: { employee: Employee; area: Area } | null) {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
    notifyUpdate(STORAGE_KEYS.ACTIVE_SESSION);
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(DEFAULT_EMPLOYEES));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(DEFAULT_SALES));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(DEFAULT_ATTENDANCE));
    localStorage.setItem(STORAGE_KEYS.CASH_CUTS, JSON.stringify(DEFAULT_CASH_CUTS));
    notifyUpdate('all');
  }
};
