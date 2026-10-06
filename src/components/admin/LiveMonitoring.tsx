import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Droplet,
  Store,
  CreditCard,
  Banknote,
  Receipt,
  Clock,
  Sparkles,
  ArrowUpRight,
  Activity,
  Users,
} from 'lucide-react';
import { Sale, AttendanceRecord, Employee } from '../../types';
import { StorageService } from '../../services/storage';

export const LiveMonitoring: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('purificadora_data_change', handleUpdate);
    return () => window.removeEventListener('purificadora_data_change', handleUpdate);
  }, []);

  const loadData = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const allSales = StorageService.getSales();
    const todaySales = allSales.filter((s) => s.timestamp.startsWith(todayStr));
    setSales(todaySales);
    setAttendance(StorageService.getAttendance().filter((a) => a.date === todayStr));
    setEmployees(StorageService.getEmployees().filter((e) => e.isActive));
  };

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalCash = sales
    .filter((s) => s.paymentMethod === 'efectivo')
    .reduce((sum, s) => sum + s.total, 0);
  const totalTransfer = sales
    .filter((s) => s.paymentMethod === 'transferencia')
    .reduce((sum, s) => sum + s.total, 0);

  const purificadoraRevenue = sales
    .filter((s) => s.area === 'purificadora')
    .reduce((sum, s) => sum + s.total, 0);
  const tiendaRevenue = sales
    .filter((s) => s.area === 'tienda')
    .reduce((sum, s) => sum + s.total, 0);

  const totalGarrafones = sales.reduce((count, s) => {
    const garrafonItems = s.items.filter((i) => i.productName.toLowerCase().includes('garraf'));
    return count + garrafonItems.reduce((acc, item) => acc + item.quantity, 0);
  }, 0);

  const activeWorkersCount = attendance.filter((a) => !a.checkOut).length;

  return (
    <div className="w-full max-w-7xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Live Status Header for Phone / Desktop */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sky-100 text-xs font-bold backdrop-blur-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>MONITOREO REMOTO EN VIVO (24/7)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Ingresos y Operaciones del Día
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/90 mt-1">
              Consulta en tiempo real de ventas, garrafones despachados y personal activo.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center sm:text-right shrink-0">
            <span className="text-[11px] font-bold text-sky-200 uppercase tracking-wider block">
              Ventas Totales Hoy
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ${totalRevenue.toFixed(2)}
            </div>
            <span className="text-[11px] text-emerald-300 font-semibold flex items-center justify-center sm:justify-end gap-1 mt-0.5">
              <Activity className="w-3 h-3 animate-pulse" /> {sales.length} transacciones registradas
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Garrafones KPI */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Garrafones
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-700">
            {totalGarrafones}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Rellenos y nuevos despachados
          </p>
        </div>

        {/* Efectivo en Caja */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Efectivo en Caja
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            ${totalCash.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Dinero físico para arquear
          </p>
        </div>

        {/* Transferencias / QR */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Transferencias
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600">
            ${totalTransfer.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Ingresos a cuenta bancaria
          </p>
        </div>

        {/* Personal en Turno */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Personal Activo
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {activeWorkersCount}{' '}
            <span className="text-xs font-medium text-slate-400">
              de {employees.filter((e) => e.role === 'empleado').length} trabajadores
            </span>
          </div>
          <p className="text-xs text-emerald-600 mt-1 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Atendiendo mostrador
          </p>
        </div>
      </div>

      {/* Revenue Breakdown: Purificadora vs Tienda */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Purificadora Card */}
        <div className="bg-white p-5 rounded-3xl border border-sky-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Área Purificadora (Agua)
                </h3>
                <span className="text-[11px] text-slate-400">Rellenos, garrafones, hielo</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-sky-700">
                ${purificadoraRevenue.toFixed(2)}
              </span>
              <div className="text-[10px] text-slate-400">
                {totalRevenue > 0
                  ? `${Math.round((purificadoraRevenue / totalRevenue) * 100)}% del total`
                  : '0%'}
              </div>
            </div>
          </div>

          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-sky-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${totalRevenue > 0 ? (purificadoraRevenue / totalRevenue) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Tienda de Abarrotes Card */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Área Tienda de Abarrotes
                </h3>
                <span className="text-[11px] text-slate-400">Refrescos, botanas, básicos</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-emerald-700">
                ${tiendaRevenue.toFixed(2)}
              </span>
              <div className="text-[10px] text-slate-400">
                {totalRevenue > 0
                  ? `${Math.round((tiendaRevenue / totalRevenue) * 100)}% del total`
                  : '0%'}
              </div>
            </div>
          </div>

          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${totalRevenue > 0 ? (tiendaRevenue / totalRevenue) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Live Sales Stream Feed */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Flujo de Ventas al Momento (Live Stream)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Actualización inmediata
          </span>
        </div>

        {sales.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Aún no hay transacciones registradas el día de hoy.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {sales.map((sale) => {
              const timeStr = new Date(sale.timestamp).toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={sale.id}
                  className="p-3.5 sm:p-4 hover:bg-slate-50 transition flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      #{sale.ticketNumber}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs sm:text-sm">
                        {sale.items.map((i) => `${i.quantity}x ${i.productName}`).join(' • ')}
                      </div>
                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          👤 {sale.employeeName}
                        </span>
                        <span>•</span>
                        <span className="capitalize text-slate-600">
                          {sale.paymentMethod === 'efectivo' ? '💵 Efectivo' : '💳 Transferencia'}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">{timeStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm sm:text-base font-black text-slate-900">
                      ${sale.total.toFixed(2)}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        sale.area === 'purificadora' ? 'text-sky-600' : 'text-emerald-600'
                      }`}
                    >
                      {sale.area}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
