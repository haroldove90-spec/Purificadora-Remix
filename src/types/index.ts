export type Role = 'empleado' | 'admin';
export type Area = 'purificadora' | 'tienda';

export interface Employee {
  id: string;
  name: string;
  pin: string; // 4 digits
  defaultArea: Area;
  scheduledTime: string; // e.g. "08:00"
  role: Role;
  isActive: boolean;
  avatarColor?: string;
}

export interface Product {
  id: string;
  name: string;
  category: Area;
  price: number;
  unit: string;
  isQuickAccess?: boolean; // Highlighted express button
  emoji?: string;
  iconName?: string;
  stock?: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  category: Area;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type PaymentMethod = 'efectivo' | 'transferencia';

export interface Sale {
  id: string;
  ticketNumber: number;
  employeeId: string;
  employeeName: string;
  area: Area;
  items: SaleItem[];
  total: number;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  changeGiven?: number;
  timestamp: string; // ISO date string
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  area: Area;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:mm:ss
  checkOut?: string; // HH:mm:ss
  status: 'en_tiempo' | 'retardo' | 'en_turno' | 'completado';
  hoursWorked?: number;
}

export interface CashCut {
  id: string;
  date: string; // YYYY-MM-DD
  closedAt: string; // ISO timestamp
  closedByName: string;
  totalCash: number;
  totalTransfer: number;
  totalAmount: number;
  salesCount: number;
  purificadoraTotal: number;
  tiendaTotal: number;
  notes?: string;
}
