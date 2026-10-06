import {
  Employee,
  Product,
  Sale,
  DeliveryRoute,
  Vehicle,
  AttendanceRecord,
  GeneralDailyCut,
} from '../types';

const STORAGE_KEYS = {
  EMPLOYEES: 'sanmiguel_employees',
  VEHICLES: 'sanmiguel_vehicles',
  PRODUCTS: 'sanmiguel_products',
  SALES: 'sanmiguel_sales',
  ROUTES: 'sanmiguel_routes',
  ATTENDANCE: 'sanmiguel_attendance',
  DAILY_CUTS: 'sanmiguel_daily_cuts',
  ACTIVE_SESSION: 'sanmiguel_active_session',
};

// Default Vehicles
const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    name: 'Camioneta Nissan #01',
    type: 'camioneta',
    capacity: 50,
  },
  {
    id: 'veh-2',
    name: 'Triciclo de Reparto #02',
    type: 'triciclo',
    capacity: 20,
  },
  {
    id: 'veh-3',
    name: 'Camioneta Ford #03',
    type: 'camioneta',
    capacity: 60,
  },
];

// Default Employees (Repartidores y Patrón)
const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Juan Pérez',
    pin: '1234',
    role: 'repartidor',
    assignedVehicleId: 'veh-1',
    assignedVehicleName: 'Camioneta Nissan #01',
    phone: '55 1234 5678',
    scheduledTime: '07:30',
    isActive: true,
    avatarColor: 'bg-sky-500',
  },
  {
    id: 'emp-2',
    name: 'Carlos Ruiz',
    pin: '3456',
    role: 'repartidor',
    assignedVehicleId: 'veh-2',
    assignedVehicleName: 'Triciclo de Reparto #02',
    phone: '55 9876 5432',
    scheduledTime: '08:00',
    isActive: true,
    avatarColor: 'bg-teal-500',
  },
  {
    id: 'admin-1',
    name: 'Don Roberto (Patrón)',
    pin: '9999',
    role: 'admin',
    scheduledTime: '07:00',
    isActive: true,
    avatarColor: 'bg-indigo-600',
  },
];

// Default Products for Agua San Miguel (Strictly Purified Water & Containers, NO groceries)
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-w1',
    name: 'Relleno / Cambio Garrafón 20L',
    price: 18,
    unit: 'garrafón',
    isQuickAccess: true,
    emoji: '💧',
    isBottleIncluded: false,
    requiresEmptyReturn: true,
  },
  {
    id: 'prod-w2',
    name: 'Garrafón Nuevo Completo (con envase)',
    price: 110,
    unit: 'garrafón',
    isQuickAccess: true,
    emoji: '🪣',
    isBottleIncluded: true,
    requiresEmptyReturn: false,
  },
  {
    id: 'prod-w3',
    name: 'Medio Garrafón 10L',
    price: 12,
    unit: 'garrafón',
    isQuickAccess: true,
    emoji: '🍶',
    isBottleIncluded: false,
    requiresEmptyReturn: true,
  },
  {
    id: 'prod-w4',
    name: 'Galón de Agua 4L',
    price: 8,
    unit: 'pza',
    isQuickAccess: true,
    emoji: '🧴',
    isBottleIncluded: false,
    requiresEmptyReturn: false,
  },
  {
    id: 'prod-w5',
    name: 'Tapa selladora / Tapón nuevo',
    price: 3,
    unit: 'pza',
    isQuickAccess: false,
    emoji: '🔘',
    isBottleIncluded: false,
    requiresEmptyReturn: false,
  },
];

const dispatchDataChange = () => {
  window.dispatchEvent(new CustomEvent('sanmiguel_data_change'));
  window.dispatchEvent(new CustomEvent('purificadora_data_change'));
};

const getTodayStr = () => new Date().toISOString().split('T')[0];

export const StorageService = {
  init() {
    // Check if initial data exists, if not initialize
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(DEFAULT_EMPLOYEES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(DEFAULT_VEHICLES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }

    // Seed initial routes & sales for today if empty
    const todayStr = getTodayStr();
    const existingRoutes = this.getRoutes();
    if (existingRoutes.length === 0) {
      // Seed an active route for Juan Pérez (Camioneta Nissan #01)
      const juanRoute: DeliveryRoute = {
        id: `route-${todayStr}-1`,
        date: todayStr,
        driverId: 'emp-1',
        driverName: 'Juan Pérez',
        vehicleName: 'Camioneta Nissan #01',
        initialBottles: 40,
        startTime: `${todayStr}T08:00:00.000Z`,
        status: 'en_ruta',
      };

      // Seed an active route for Carlos Ruiz (Triciclo #02)
      const carlosRoute: DeliveryRoute = {
        id: `route-${todayStr}-2`,
        date: todayStr,
        driverId: 'emp-2',
        driverName: 'Carlos Ruiz',
        vehicleName: 'Triciclo de Reparto #02',
        initialBottles: 20,
        startTime: `${todayStr}T08:30:00.000Z`,
        status: 'en_ruta',
      };

      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify([juanRoute, carlosRoute]));

      // Seed realistic sales for Juan Pérez
      const seedSales: Sale[] = [
        {
          id: 'sale-1',
          ticketNumber: 101,
          routeId: juanRoute.id,
          employeeId: 'emp-1',
          employeeName: 'Juan Pérez',
          vehicleName: 'Camioneta Nissan #01',
          items: [
            {
              productId: 'prod-w1',
              productName: 'Relleno / Cambio Garrafón 20L',
              quantity: 3,
              unitPrice: 18,
              subtotal: 54,
              requiresEmptyReturn: true,
            },
          ],
          total: 54,
          fullBottlesSold: 3,
          emptyBottlesReceived: 3,
          emptyBottlesOwed: 0,
          paymentMethod: 'efectivo',
          cashReceived: 100,
          changeGiven: 46,
          customerNotes: 'Calle Hidalgo #45 (Doña Rosa)',
          timestamp: `${todayStr}T08:45:00.000Z`,
          status: 'completada',
        },
        {
          id: 'sale-2',
          ticketNumber: 102,
          routeId: juanRoute.id,
          employeeId: 'emp-1',
          employeeName: 'Juan Pérez',
          vehicleName: 'Camioneta Nissan #01',
          items: [
            {
              productId: 'prod-w1',
              productName: 'Relleno / Cambio Garrafón 20L',
              quantity: 2,
              unitPrice: 18,
              subtotal: 36,
              requiresEmptyReturn: true,
            },
            {
              productId: 'prod-w2',
              productName: 'Garrafón Nuevo Completo (con envase)',
              quantity: 1,
              unitPrice: 110,
              subtotal: 110,
              isBottleIncluded: true,
            },
          ],
          total: 146,
          fullBottlesSold: 3,
          emptyBottlesReceived: 2, // 2 rellenos con envase, 1 nuevo sin envase
          emptyBottlesOwed: 0,
          paymentMethod: 'transferencia',
          customerNotes: 'Abarrotes La Esquina (Transferencia BBVA)',
          timestamp: `${todayStr}T09:20:00.000Z`,
          status: 'completada',
        },
        {
          id: 'sale-3',
          ticketNumber: 103,
          routeId: juanRoute.id,
          employeeId: 'emp-1',
          employeeName: 'Juan Pérez',
          vehicleName: 'Camioneta Nissan #01',
          items: [
            {
              productId: 'prod-w1',
              productName: 'Relleno / Cambio Garrafón 20L',
              quantity: 4,
              unitPrice: 18,
              subtotal: 72,
              requiresEmptyReturn: true,
            },
          ],
          total: 72,
          fullBottlesSold: 4,
          emptyBottlesReceived: 4,
          emptyBottlesOwed: 0,
          paymentMethod: 'efectivo',
          cashReceived: 100,
          changeGiven: 28,
          customerNotes: 'Taller Mecánico San Juan',
          timestamp: `${todayStr}T10:15:00.000Z`,
          status: 'completada',
        },
        {
          id: 'sale-4',
          ticketNumber: 104,
          routeId: carlosRoute.id,
          employeeId: 'emp-2',
          employeeName: 'Carlos Ruiz',
          vehicleName: 'Triciclo de Reparto #02',
          items: [
            {
              productId: 'prod-w1',
              productName: 'Relleno / Cambio Garrafón 20L',
              quantity: 2,
              unitPrice: 18,
              subtotal: 36,
              requiresEmptyReturn: true,
            },
          ],
          total: 36,
          fullBottlesSold: 2,
          emptyBottlesReceived: 2,
          emptyBottlesOwed: 0,
          paymentMethod: 'efectivo',
          cashReceived: 50,
          changeGiven: 14,
          customerNotes: 'Privada Los Pinos #12',
          timestamp: `${todayStr}T09:05:00.000Z`,
          status: 'completada',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(seedSales));
    }
  },

  // Employees
  getEmployees(): Employee[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return raw ? JSON.parse(raw) : DEFAULT_EMPLOYEES;
  },

  saveEmployees(employees: Employee[]) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    dispatchDataChange();
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
    const employees = this.getEmployees().map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    this.saveEmployees(employees);
  },

  // Vehicles
  getVehicles(): Vehicle[] {
    const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return raw ? JSON.parse(raw) : DEFAULT_VEHICLES;
  },

  addVehicle(vehicle: Omit<Vehicle, 'id'>): Vehicle {
    const vehicles = this.getVehicles();
    const newVeh: Vehicle = {
      ...vehicle,
      id: `veh-${Date.now()}`,
    };
    vehicles.push(newVeh);
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    dispatchDataChange();
    return newVeh;
  },

  // Products
  getProducts(): Product[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : DEFAULT_PRODUCTS;
  },

  saveProducts(products: Product[]) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    dispatchDataChange();
  },

  updateProduct(id: string, updates: Partial<Product>) {
    const products = this.getProducts().map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    this.saveProducts(products);
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

  deleteProduct(id: string) {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(products);
  },

  // Delivery Routes (Ciclo de Vida de Rutas en Campo)
  getRoutes(): DeliveryRoute[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTES);
    return raw ? JSON.parse(raw) : [];
  },

  saveRoutes(routes: DeliveryRoute[]) {
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
    dispatchDataChange();
  },

  getActiveRouteForDriver(driverId: string): DeliveryRoute | null {
    const todayStr = getTodayStr();
    const routes = this.getRoutes();
    // Return today's active or pending settlement route for this driver
    return (
      routes.find(
        (r) =>
          r.driverId === driverId &&
          r.date === todayStr &&
          (r.status === 'en_ruta' || r.status === 'pendiente_liquidacion')
      ) || null
    );
  },

  startRoute(data: {
    driverId: string;
    driverName: string;
    vehicleName: string;
    initialBottles: number;
  }): DeliveryRoute {
    const todayStr = getTodayStr();
    const routes = this.getRoutes();
    const newRoute: DeliveryRoute = {
      id: `route-${Date.now()}`,
      date: todayStr,
      driverId: data.driverId,
      driverName: data.driverName,
      vehicleName: data.vehicleName,
      initialBottles: data.initialBottles,
      startTime: new Date().toISOString(),
      status: 'en_ruta',
    };
    routes.push(newRoute);
    this.saveRoutes(routes);
    return newRoute;
  },

  finishRoute(
    routeId: string,
    returnedFullBottles: number,
    returnedEmptyBottles: number
  ): DeliveryRoute | null {
    const routes = this.getRoutes();
    let updatedRoute: DeliveryRoute | null = null;
    const updated = routes.map((r) => {
      if (r.id === routeId) {
        updatedRoute = {
          ...r,
          status: 'pendiente_liquidacion',
          endTime: new Date().toISOString(),
          returnedFullBottles,
          returnedEmptyBottles,
        };
        return updatedRoute;
      }
      return r;
    });
    this.saveRoutes(updated);
    return updatedRoute;
  },

  liquidateRoute(
    routeId: string,
    data: {
      liquidatedByName: string;
      cashTurnedIn: number;
      transferReported: number;
      cashDifference: number;
      emptyBottleDifference: number;
      fullBottleDifference: number;
      isSettledCorrectly: boolean;
      notes?: string;
    }
  ): DeliveryRoute | null {
    const routes = this.getRoutes();
    let updatedRoute: DeliveryRoute | null = null;
    const updated = routes.map((r) => {
      if (r.id === routeId) {
        updatedRoute = {
          ...r,
          status: 'liquidada',
          liquidatedAt: new Date().toISOString(),
          ...data,
        };
        return updatedRoute;
      }
      return r;
    });
    this.saveRoutes(updated);
    return updatedRoute;
  },

  // Sales
  getSales(): Sale[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    return raw ? JSON.parse(raw) : [];
  },

  saveSales(sales: Sale[]) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    dispatchDataChange();
  },

  addSale(saleData: {
    routeId?: string;
    employeeId: string;
    employeeName: string;
    vehicleName: string;
    items: Sale['items'];
    total: number;
    fullBottlesSold: number;
    emptyBottlesReceived: number;
    emptyBottlesOwed: number;
    paymentMethod: Sale['paymentMethod'];
    cashReceived?: number;
    changeGiven?: number;
    customerNotes?: string;
  }): Sale {
    const sales = this.getSales();
    const nextTicketNumber =
      sales.length > 0 ? Math.max(...sales.map((s) => s.ticketNumber || 0)) + 1 : 101;

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      ticketNumber: nextTicketNumber,
      ...saleData,
      timestamp: new Date().toISOString(),
      status: 'completada',
    };

    sales.push(newSale);
    this.saveSales(sales);
    return newSale;
  },

  cancelSale(saleId: string) {
    const sales = this.getSales().map((s) =>
      s.id === saleId ? { ...s, status: 'cancelada' as const } : s
    );
    this.saveSales(sales);
  },

  // Calculations & Analytics for Routes
  getRouteStats(routeId: string) {
    const allSales = this.getSales().filter(
      (s) => s.routeId === routeId && s.status === 'completada'
    );

    const totalSoldAmount = allSales.reduce((sum, s) => sum + s.total, 0);
    const totalCash = allSales
      .filter((s) => s.paymentMethod === 'efectivo')
      .reduce((sum, s) => sum + s.total, 0);
    const totalTransfer = allSales
      .filter((s) => s.paymentMethod === 'transferencia')
      .reduce((sum, s) => sum + s.total, 0);

    const fullBottlesSold = allSales.reduce((sum, s) => sum + s.fullBottlesSold, 0);
    const emptyBottlesReceived = allSales.reduce(
      (sum, s) => sum + s.emptyBottlesReceived,
      0
    );
    const emptyBottlesOwed = allSales.reduce(
      (sum, s) => sum + s.emptyBottlesOwed,
      0
    );

    return {
      salesCount: allSales.length,
      totalSoldAmount,
      totalCash,
      totalTransfer,
      fullBottlesSold,
      emptyBottlesReceived,
      emptyBottlesOwed,
      sales: allSales,
    };
  },

  // Attendance Records
  getAttendance(): AttendanceRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return raw ? JSON.parse(raw) : [];
  },

  saveAttendance(records: AttendanceRecord[]) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
    dispatchDataChange();
  },

  recordCheckIn(employeeId: string, employeeName: string): AttendanceRecord {
    const records = this.getAttendance();
    const todayStr = getTodayStr();
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      employeeName,
      date: todayStr,
      checkIn: timeStr,
      status: 'en_turno',
    };

    records.push(newRecord);
    this.saveAttendance(records);
    return newRecord;
  },

  recordCheckOut(recordId: string): AttendanceRecord | null {
    const records = this.getAttendance();
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    let updated: AttendanceRecord | null = null;
    const list = records.map((r) => {
      if (r.id === recordId) {
        updated = {
          ...r,
          checkOut: timeStr,
          status: 'completado',
        };
        return updated;
      }
      return r;
    });

    this.saveAttendance(list);
    return updated;
  },

  // General Daily Cuts (Corte General de la Flotilla)
  getDailyCuts(): GeneralDailyCut[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_CUTS);
    return raw ? JSON.parse(raw) : [];
  },

  saveDailyCut(cut: Omit<GeneralDailyCut, 'id' | 'closedAt'>): GeneralDailyCut {
    const cuts = this.getDailyCuts();
    const newCut: GeneralDailyCut = {
      ...cut,
      id: `cut-${Date.now()}`,
      closedAt: new Date().toISOString(),
    };
    cuts.push(newCut);
    localStorage.setItem(STORAGE_KEYS.DAILY_CUTS, JSON.stringify(cuts));
    dispatchDataChange();
    return newCut;
  },

  // Active Session
  getActiveSession(): { employee: Employee } | null {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    return raw ? JSON.parse(raw) : null;
  },

  setActiveSession(session: { employee: Employee } | null) {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  },
};
