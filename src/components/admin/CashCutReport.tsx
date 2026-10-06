import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Calendar,
  DollarSign,
  Droplets,
  CreditCard,
  Banknote,
  FileText,
  User,
  ShieldCheck,
} from 'lucide-react';
import { DeliveryRoute, Employee, Sale } from '../../types';
import { StorageService } from '../../services/storage';

interface Props {
  currentEmployee: Employee;
  selectedRouteId?: string | null;
}

export const CashCutReport: React.FC<Props> = ({ currentEmployee, selectedRouteId }) => {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [activeRouteId, setActiveRouteId] = useState<string>('');
  const [cashReceivedInput, setCashReceivedInput] = useState<number | ''>('');
  const [physicalFullInput, setPhysicalFullInput] = useState<number | ''>('');
  const [physicalEmptyInput, setPhysicalEmptyInput] = useState<number | ''>('');
  const [notes, setNotes] = useState<string>('');
  const [lastLiquidatedRoute, setLastLiquidatedRoute] = useState<DeliveryRoute | null>(null);

  // Checkbox verification states
  const [checkCash, setCheckCash] = useState(false);
  const [checkBottles, setCheckBottles] = useState(false);
  const [checkEmpties, setCheckEmpties] = useState(false);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sanmiguel_data_change', handleUpdate);
    return () => window.removeEventListener('sanmiguel_data_change', handleUpdate);
  }, [selectedRouteId]);

  const loadData = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const allRoutes = StorageService.getRoutes().filter((r) => r.date === todayStr);
    setRoutes(allRoutes);

    // If a route was explicitly passed or pre-select the first pending route
    if (selectedRouteId && allRoutes.some((r) => r.id === selectedRouteId)) {
      selectRoute(selectedRouteId, allRoutes);
    } else if (allRoutes.length > 0 && !activeRouteId) {
      const pending = allRoutes.find((r) => r.status === 'pendiente_liquidacion') || allRoutes[0];
      selectRoute(pending.id, allRoutes);
    }
  };

  const selectRoute = (routeId: string, routesList = routes) => {
    setActiveRouteId(routeId);
    const target = routesList.find((r) => r.id === routeId);
    if (target) {
      const stats = StorageService.getRouteStats(target.id);
      setCashReceivedInput(target.cashTurnedIn !== undefined ? target.cashTurnedIn : stats.totalCash);
      setPhysicalFullInput(
        target.returnedFullBottles !== undefined
          ? target.returnedFullBottles
          : Math.max(0, target.initialBottles - stats.fullBottlesSold)
      );
      setPhysicalEmptyInput(
        target.returnedEmptyBottles !== undefined
          ? target.returnedEmptyBottles
          : stats.emptyBottlesReceived
      );
      setNotes(target.notes || '');
      setCheckCash(target.status === 'liquidada');
      setCheckBottles(target.status === 'liquidada');
      setCheckEmpties(target.status === 'liquidada');
    }
  };

  const currentRoute = routes.find((r) => r.id === activeRouteId);
  const routeStats = currentRoute
    ? StorageService.getRouteStats(currentRoute.id)
    : {
        salesCount: 0,
        totalSoldAmount: 0,
        totalCash: 0,
        totalTransfer: 0,
        fullBottlesSold: 0,
        emptyBottlesReceived: 0,
        emptyBottlesOwed: 0,
        sales: [] as Sale[],
      };

  // Cuadre Math
  const initialBottles = currentRoute?.initialBottles ?? 0;
  const soldBottles = routeStats.fullBottlesSold;
  const returnedFullBottles = physicalFullInput === '' ? 0 : Number(physicalFullInput);
  const returnedEmptyBottles = physicalEmptyInput === '' ? 0 : Number(physicalEmptyInput);

  // Regla 1: Garrafones Iniciales = Vendidos + Devueltos Llenos
  const totalAccountedBottles = soldBottles + returnedFullBottles;
  const fullBottleDiff = totalAccountedBottles - initialBottles;
  const isBottleSquare = fullBottleDiff === 0;

  // Regla 2: Envases Vacíos Recibidos vs Esperados
  const emptyBottleDiff = returnedEmptyBottles - routeStats.emptyBottlesReceived;
  const isEmptySquare = emptyBottleDiff === 0;

  // Regla 3: Efectivo Entregado vs Efectivo Esperado
  const expectedCash = routeStats.totalCash;
  const cashTurnedIn = cashReceivedInput === '' ? 0 : Number(cashReceivedInput);
  const cashDiff = cashTurnedIn - expectedCash;
  const isCashSquare = cashDiff === 0;

  const handleLiquidate = () => {
    if (!currentRoute) return;

    const isAllCorrect = isBottleSquare && isCashSquare && isEmptySquare;

    const updated = StorageService.liquidateRoute(currentRoute.id, {
      liquidatedByName: currentEmployee.name,
      cashTurnedIn,
      transferReported: routeStats.totalTransfer,
      cashDifference: cashDiff,
      emptyBottleDifference: emptyBottleDiff,
      fullBottleDifference: fullBottleDiff,
      isSettledCorrectly: isAllCorrect,
      notes: notes.trim() || undefined,
    });

    if (updated) {
      setLastLiquidatedRoute(updated);
      loadData();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-sky-600" />
            <span>Liquidación y Cuadre de Rutas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Corte Individual por Chofer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cuadre de garrafones despachados, envases vacíos devueltos y dinero entregado al volver a planta.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>Imprimir Comprobante</span>
        </button>
      </div>

      {/* Selector de Ruta del Día */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
          Selecciona al chofer a liquidar hoy:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {routes.map((r) => {
            const isSelected = r.id === activeRouteId;
            const isPending = r.status === 'pendiente_liquidacion';
            const isSettled = r.status === 'liquidada';

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => selectRoute(r.id)}
                className={`p-3 rounded-2xl border text-left transition flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-900 truncate">
                    {r.driverName}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    <span>{r.vehicleName}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {isPending && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                      Por liquidar
                    </span>
                  )}
                  {isSettled && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Liquidada
                    </span>
                  )}
                  {r.status === 'en_ruta' && (
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                      En ruta
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {currentRoute ? (
        <div className="space-y-4">
          {/* Tarjeta de Resumen de Ruta */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                  Ruta: {currentRoute.vehicleName}
                </span>
                <h2 className="text-lg font-black text-white">
                  Chofer: {currentRoute.driverName}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Total Recaudado en Ruta:</span>
                <span className="text-2xl font-black text-emerald-400">
                  ${routeStats.totalSoldAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Carga Inicial</span>
                <span className="text-xl font-black text-white">{currentRoute.initialBottles}</span>
                <span className="text-[10px] text-slate-400 block">garrafones llenos</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Vendidos en Calle</span>
                <span className="text-xl font-black text-sky-300">{soldBottles}</span>
                <span className="text-[10px] text-slate-400 block">{routeStats.salesCount} entregas</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Efectivo en Mano</span>
                <span className="text-xl font-black text-emerald-400">${expectedCash.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 block">a entregar a caja</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Transferencias</span>
                <span className="text-xl font-black text-indigo-300">${routeStats.totalTransfer.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 block">verificadas</span>
              </div>
            </div>
          </div>

          {/* LAS 3 REGLAS DE CUADRE MATEMÁTICO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* REGLA 1: Garrafones Llenos */}
            <div className={`p-4 rounded-3xl border bg-white shadow-2xs space-y-2.5 ${
              isBottleSquare ? 'border-emerald-200' : 'border-amber-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  1. Garrafones Llenos
                </span>
                {isBottleSquare ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ✓ Cuadra Exacto
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Diferencia: {fullBottleDiff > 0 ? `+${fullBottleDiff}` : fullBottleDiff}
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Carga Inicial:</span>
                  <strong>{initialBottles}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Vendidos:</span>
                  <strong>{soldBottles}</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span>Llenos devueltos esperados:</span>
                  <strong className="text-sky-700">{Math.max(0, initialBottles - soldBottles)}</strong>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Llenos Físicos Contados en Planta:
                </label>
                <input
                  type="number"
                  min={0}
                  value={physicalFullInput}
                  onChange={(e) => setPhysicalFullInput(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-10 px-3 text-center font-black text-lg bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* REGLA 2: Envases Vacíos */}
            <div className={`p-4 rounded-3xl border bg-white shadow-2xs space-y-2.5 ${
              isEmptySquare ? 'border-emerald-200' : 'border-amber-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  2. Envases Vacíos
                </span>
                {isEmptySquare ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ✓ Cuadra
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Diferencia: {emptyBottleDiff > 0 ? `+${emptyBottleDiff}` : emptyBottleDiff}
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Vacíos registrados en entregas:</span>
                  <strong>{routeStats.emptyBottlesReceived}</strong>
                </div>
                <div className="flex justify-between text-amber-800">
                  <span>Clientes que deben envase:</span>
                  <strong>{routeStats.emptyBottlesOwed}</strong>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Vacíos Físicos Contados en Planta:
                </label>
                <input
                  type="number"
                  min={0}
                  value={physicalEmptyInput}
                  onChange={(e) => setPhysicalEmptyInput(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-10 px-3 text-center font-black text-lg bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* REGLA 3: Efectivo en Mano */}
            <div className={`p-4 rounded-3xl border bg-white shadow-2xs space-y-2.5 ${
              isCashSquare ? 'border-emerald-200' : 'border-rose-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  3. Efectivo a Entregar
                </span>
                {isCashSquare ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ✓ Cuadra
                  </span>
                ) : (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    cashDiff > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {cashDiff > 0 ? `+$${cashDiff.toFixed(2)} sobrante` : `-$${Math.abs(cashDiff).toFixed(2)} faltante`}
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Ventas en Efectivo:</span>
                  <strong className="text-emerald-700">${expectedCash.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Transferencias:</span>
                  <strong>${routeStats.totalTransfer.toFixed(2)}</strong>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Efectivo Físico Entregado en Caja ($):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={cashReceivedInput}
                  onChange={(e) => setCashReceivedInput(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-10 px-3 text-center font-black text-lg bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Checklist de Validación del Administrador */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Validación y Aprobación del Patrón:
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkBottles}
                  onChange={(e) => setCheckBottles(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Confirmo el conteo físico de garrafones llenos devueltos a la planta</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkEmpties}
                  onChange={(e) => setCheckEmpties(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Confirmo la descarga y conteo de envases vacíos devueltos</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkCash}
                  onChange={(e) => setCheckCash(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Confirmo la recepción del dinero en efectivo en caja física (${cashTurnedIn.toFixed(2)})</span>
              </label>
            </div>

            {/* Observaciones / Notas */}
            <div className="pt-2">
              <input
                type="text"
                placeholder="Observaciones o notas de la liquidación (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            {/* Botón de Liquidar */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLiquidate}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {currentRoute.status === 'liquidada'
                    ? 'Actualizar Liquidación de Chofer'
                    : `Aprobar y Liquidar Ruta de ${currentRoute.driverName}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
          No hay rutas registradas el día de hoy para liquidar.
        </div>
      )}
    </div>
  );
};
