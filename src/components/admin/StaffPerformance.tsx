import React, { useState, useEffect } from 'react';
import {
  Award,
  TrendingUp,
  Receipt,
  DollarSign,
  Droplet,
  Truck,
  Crown,
  Medal,
  Calendar,
} from 'lucide-react';
import { Sale, Employee } from '../../types';
import { StorageService } from '../../services/storage';

interface EmployeePerformance {
  employee: Employee;
  totalSalesCount: number;
  revenue: number;
  garrafonCount: number;
  cashRevenue: number;
  transferRevenue: number;
  averageTicket: number;
  sharePercentage: number;
}

export const StaffPerformance: React.FC = () => {
  const [performanceList, setPerformanceList] = useState<EmployeePerformance[]>([]);
  const [totalStoreRevenue, setTotalStoreRevenue] = useState(0);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sanmiguel_data_change', handleUpdate);
    return () => window.removeEventListener('sanmiguel_data_change', handleUpdate);
  }, []);

  const loadData = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const employees = StorageService.getEmployees().filter((e) => e.isActive && e.role === 'repartidor');
    const todaySales = StorageService.getSales().filter(
      (s) => s.timestamp.startsWith(todayStr) && s.status === 'completada'
    );

    const storeRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
    setTotalStoreRevenue(storeRevenue);

    const perf: EmployeePerformance[] = employees.map((emp) => {
      const empSales = todaySales.filter((s) => s.employeeId === emp.id);
      const revenue = empSales.reduce((sum, s) => sum + s.total, 0);
      const cashRevenue = empSales
        .filter((s) => s.paymentMethod === 'efectivo')
        .reduce((sum, s) => sum + s.total, 0);
      const transferRevenue = empSales
        .filter((s) => s.paymentMethod === 'transferencia')
        .reduce((sum, s) => sum + s.total, 0);

      const garrafonCount = empSales.reduce((count, s) => count + s.fullBottlesSold, 0);
      const averageTicket = empSales.length > 0 ? revenue / empSales.length : 0;
      const sharePercentage = storeRevenue > 0 ? (revenue / storeRevenue) * 100 : 0;

      return {
        employee: emp,
        totalSalesCount: empSales.length,
        revenue,
        garrafonCount,
        cashRevenue,
        transferRevenue,
        averageTicket,
        sharePercentage,
      };
    });

    perf.sort((a, b) => b.revenue - a.revenue);
    setPerformanceList(perf);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-sky-600" />
            <span>Productividad y Rendimiento</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Rendimiento por Chofer de Reparto
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Métricas de ventas, garrafones despachados y aporte a las ventas del día
          </p>
        </div>
      </div>

      {/* Grid of employees */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceList.map((perf, index) => (
          <div key={perf.employee.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 font-black text-base flex items-center justify-center">
                {index === 0 ? <Crown className="w-6 h-6 text-amber-500" /> : perf.employee.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">{perf.employee.name}</h3>
                <span className="text-[11px] text-slate-500">
                  {perf.employee.assignedVehicleName || 'Repartidor'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Dinero Total Ingresado</span>
              <div className="text-2xl font-black text-slate-900">${perf.revenue.toFixed(2)}</div>
              <div className="text-xs text-slate-500 mt-1 flex justify-between">
                <span>Garrafones vendidos:</span>
                <strong className="text-sky-700">{perf.garrafonCount} pzas</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block font-bold">Efectivo</span>
                <span className="font-black text-emerald-800">${perf.cashRevenue.toFixed(2)}</span>
              </div>
              <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100">
                <span className="text-[10px] text-indigo-700 block font-bold">Transferencias</span>
                <span className="font-black text-indigo-800">${perf.transferRevenue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
