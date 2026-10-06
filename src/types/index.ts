export type Role = 'repartidor' | 'admin' | 'empleado';

export interface Vehicle {
  id: string;
  name: string;
  type: 'camioneta' | 'triciclo' | 'motocarro' | 'otro';
  capacity: number;
}

export interface Employee {
  id: string;
  name: string;
  pin: string; // 4 digits
  role: Role;
  assignedVehicleId?: string;
  assignedVehicleName?: string;
  phone?: string;
  scheduledTime?: string; // e.g. "08:00"
  isActive: boolean;
  avatarColor?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  isQuickAccess?: boolean; // Highlighted express button
  emoji?: string;
  isBottleIncluded?: boolean; // Garrafón nuevo completo con envase
  requiresEmptyReturn?: boolean; // Relleno / cambio requiere recibir envase
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isBottleIncluded?: boolean;
  requiresEmptyReturn?: boolean;
}

export type PaymentMethod = 'efectivo' | 'transferencia';

export interface Sale {
  id: string;
  ticketNumber: number;
  routeId?: string;
  employeeId: string;
  employeeName: string;
  vehicleName: string;
  items: SaleItem[];
  total: number;
  fullBottlesSold: number;
  emptyBottlesReceived: number;
  emptyBottlesOwed: number; // Garrafones que el cliente quedó a deber
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  changeGiven?: number;
  customerNotes?: string;
  timestamp: string; // ISO date string
  status: 'completada' | 'cancelada';
}

export type RouteStatus = 'en_ruta' | 'pendiente_liquidacion' | 'liquidada';

export interface DeliveryRoute {
  id: string;
  date: string; // YYYY-MM-DD
  driverId: string;
  driverName: string;
  vehicleName: string;
  initialBottles: number; // Garrafones llenos cargados al iniciar
  startTime: string; // ISO timestamp
  endTime?: string; // ISO timestamp
  status: RouteStatus;
  
  // Conteo físico reportado por el chofer al volver a planta
  returnedFullBottles?: number; // Garrafones llenos sobrantes
  returnedEmptyBottles?: number; // Garrafones vacíos recuperados
  
  // Datos de liquidación validados por el patrón / administrador
  liquidatedAt?: string;
  liquidatedByName?: string;
  cashTurnedIn?: number; // Dinero físico entregado a caja
  transferReported?: number; // Monto reportado por transferencias
  cashDifference?: number; // Diferencia de efectivo ($)
  emptyBottleDifference?: number; // Diferencia de envases vacíos
  fullBottleDifference?: number; // Iniciales - (Vendidos + Devueltos Llenos)
  isSettledCorrectly?: boolean;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:mm:ss
  checkOut?: string; // HH:mm:ss
  status: 'en_tiempo' | 'retardo' | 'en_turno' | 'completado';
  hoursWorked?: number;
}

export interface GeneralDailyCut {
  id: string;
  date: string; // YYYY-MM-DD
  closedAt: string; // ISO timestamp
  closedByName: string;
  totalSales: number;
  totalCash: number;
  totalTransfer: number;
  totalBottlesSold: number;
  totalRefillsSold: number;
  totalNewBottlesSold: number;
  routesCount: number;
  settledRoutesCount: number;
  notes?: string;
}
