import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Droplets,
  Truck,
  RotateCcw,
  Banknote,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { DeliveryRoute, Employee, Sale } from '../../types';
import { StorageService } from '../../services/storage';

interface Props {
  onSelectLiquidateDriver?: (routeId: string) => void;
}

export const LiveMonitoring: React.FC<Props> = ({ onSelectLiquidateDriver }) => {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sanmiguel_data_change', handleUpdate);
    return () => window.removeEventListener('sanmiguel_data_change', handleUpdate);
  }, []);

  const loadData = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const allRoutes = StorageService.getRoutes().filter((r) => r.date === todayStr);
    setRoutes(allRoutes);

    const emps = StorageService.getEmployees().filter((e) => e.isActive && e.role === 'repartidor');
    setEmployees(emps);

    const allSales = StorageService.getSales().filter(
      (s) => s.timestamp.startsWith(todayStr) && s.status === 'completada'
    );
    setSales(allSales);
  };

  // Fleet Totals
  const totalFleetRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalFleetCash = sales
    .filter((s) => s.paymentMethod === 'efectivo')
    .reduce((sum, s) => sum + s.total, 0);
  const totalFleetTransfer = sales
    .filter((s) => s.paymentMethod === 'transferencia')
    .reduce((sum, s) => sum + s.total, 0);

  const totalBottlesSold = sales.reduce((sum, s) => sum + s.fullBottlesSold, 0);
  const totalEmptyRecovered = sales.reduce((sum, s) => sum + s.emptyBottlesReceived, 0);
  const totalEmptyOwed = sales.reduce((sum, s) => sum + s.emptyBottlesOwed, 0);

  const activeRoutesCount = routes.filter((r) => r.status === 'en_ruta').length;
  const pendingLiquidationCount = routes.filter((r) => r.status === 'pendiente_liquidacion').length;
  const settledRoutesCount = routes.filter((r) => r.status === 'liquidada').length;

  return (
    <div className="w-full max-w-7xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Top Banner: Monitoreo en Vivo 24/7 */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sky-100 text-xs font-bold backdrop-blur-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>MONITOREO REMOTO DE RUTAS EN VIVO</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Flotilla Agua San Miguel
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/90 mt-1">
              Consulta en tiempo real de garrafones vendidos, envases recuperados y dinero cobrado por cada chofer.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center sm:text-right shrink-0">
            <span className="text-[11px] font-bold text-sky-200 uppercase tracking-wider block">
              Ventas Totales Hoy
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ${totalFleetRevenue.toFixed(2)}
            </div>
            <span className="text-[11px] text-emerald-300 font-semibold flex items-center justify-center sm:justify-end gap-1 mt-0.5">
              <Activity className="w-3 h-3 animate-pulse" /> {sales.length} entregas realizadas
            </span>
          </div>
        </div>
      </div>

      {/* Fleet KPIs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Garrafones Despachados */}
        <div className="bg-white p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Garrafones Vendidos
            </span>
            <Droplets className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {totalBottlesSold}
          </div>
          <span className="text-[11px] text-sky-600 font-medium block mt-1">
            despachados en ruta hoy
          </span>
        </div>

        {/* Envases Vacíos Recolectados */}
        <div className="bg-white p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Envases Recuperados
            </span>
            <RotateCcw className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {totalEmptyRecovered}
          </div>
          <span className="text-[11px] text-amber-700 font-medium block mt-1">
            {totalEmptyOwed > 0 ? `⚠️ ${totalEmptyOwed} adeudos de envase` : 'balance 1 a 1 en campo'}
          </span>
        </div>

        {/* Efectivo en Calle / Mano */}
        <div className="bg-white p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Efectivo a Entregar
            </span>
            <Banknote className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            ${totalFleetCash.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            dinero en mano de choferes
          </span>
        </div>

        {/* Transferencias Bancarias */}
        <div className="bg-white p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Transferencias
            </span>
            <CreditCard className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-700">
            ${totalFleetTransfer.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            pagos digitales directos
          </span>
        </div>
      </div>

      {/* Flotilla en Operación (Tarjetas Individuales por Chofer) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Estado Individual de Unidades en Ruta
            </h2>
            <p className="text-xs text-slate-500">
              {activeRoutesCount} en calle · {pendingLiquidationCount} en planta pendientes · {settledRoutesCount} liquidadas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {employees.map((driver) => {
            const route = routes.find((r) => r.driverId === driver.id);
            const driverSales = sales.filter((s) => s.employeeId === driver.id);
            const driverSoldBottles = driverSales.reduce((sum, s) => sum + s.fullBottlesSold, 0);
            const driverEmptyBottles = driverSales.reduce((sum, s) => sum + s.emptyBottlesReceived, 0);
            const driverCash = driverSales
              .filter((s) => s.paymentMethod === 'efectivo')
              .reduce((sum, s) => sum + s.total, 0);
            const driverTransfer = driverSales
              .filter((s) => s.paymentMethod === 'transferencia')
              .reduce((sum, s) => sum + s.total, 0);
            const driverTotal = driverCash + driverTransfer;

            const initial = route ? route.initialBottles : 0;
            const remaining = Math.max(0, initial - driverSoldBottles);
            const progressPercent = initial > 0 ? Math.min(100, Math.round((driverSoldBottles / initial) * 100)) : 0;

            const isPending = route?.status === 'pendiente_liquidacion';
            const isSettled = route?.status === 'liquidada';
            const isInRoute = route?.status === 'en_ruta';

            return (
              <div
                key={driver.id}
                className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all ${
                  isPending
                    ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-md'
                    : isSettled
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200/90 shadow-2xs hover:shadow-sm'
                }`}
              >
                {/* Driver & Unit Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-sm shrink-0">
                      {driver.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-slate-900 truncate">
                        {driver.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{route?.vehicleName || driver.assignedVehicleName || 'Sin unidad'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="shrink-0 text-right">
                    {isInRoute && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        En Ruta
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold animate-pulse">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Por Liquidar
                      </span>
                    )}
                    {isSettled && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Liquidada
                      </span>
                    )}
                    {!route && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium">
                        Sin Ruta Hoy
                      </span>
                    )}
                  </div>
                </div>

                {/* Route Inventory Progress */}
                {route ? (
                  <div className="space-y-2 mb-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Carga Inicial:</span>
                      <strong className="text-slate-800">{route.initialBottles} garrafones</strong>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] font-bold mb-1">
                        <span className="text-sky-700">{driverSoldBottles} Vendidos ({progressPercent}%)</span>
                        <span className="text-slate-500">{remaining} Restantes</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-sky-600 transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                      <span>Vacíos Recuperados:</span>
                      <strong className="text-amber-800">{driverEmptyBottles} pzas</strong>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-400 mb-3">
                    El chofer aún no ha registrado salida de planta hoy.
                  </div>
                )}

                {/* Dinero Cobrado */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                      Efectivo en Mano
                    </span>
                    <span className="text-base font-black text-emerald-800">
                      ${driverCash.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-100">
                    <span className="text-[10px] font-bold uppercase text-indigo-700 block">
                      Transferencia
                    </span>
                    <span className="text-base font-black text-indigo-800">
                      ${driverTransfer.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Total Acumulado & Quick Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Cobrado Total
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      ${driverTotal.toFixed(2)}
                    </span>
                  </div>

                  {route && onSelectLiquidateDriver && (
                    <button
                      type="button"
                      onClick={() => onSelectLiquidateDriver(route.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1 active:scale-95 ${
                        isPending
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm'
                          : isSettled
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-sky-50 hover:bg-sky-100 text-sky-800'
                      }`}
                    >
                      <span>{isSettled ? 'Ver Corte' : 'Liquidar'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
