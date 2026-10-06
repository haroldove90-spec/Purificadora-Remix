import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Droplets,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Calendar,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { DeliveryRoute, Sale } from '../../types';
import { StorageService } from '../../services/storage';

export const BottleBalanceReport: React.FC = () => {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sanmiguel_data_change', handleUpdate);
    return () => window.removeEventListener('sanmiguel_data_change', handleUpdate);
  }, []);

  const loadData = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRoutes = StorageService.getRoutes().filter((r) => r.date === todayStr);
    const todaySales = StorageService.getSales().filter(
      (s) => s.timestamp.startsWith(todayStr) && s.status === 'completada'
    );
    setRoutes(todayRoutes);
    setSales(todaySales);
  };

  // Global calculations
  const totalLoadedBottles = routes.reduce((sum, r) => sum + r.initialBottles, 0);
  const totalSoldBottles = sales.reduce((sum, s) => sum + s.fullBottlesSold, 0);

  // New bottles sold (customer bought container, so 1 container permanently leaves the plant)
  const newBottlesSold = sales.reduce((count, s) => {
    const newItems = s.items.filter((i) => i.isBottleIncluded);
    return count + newItems.reduce((acc, item) => acc + item.quantity, 0);
  }, 0);

  // Refill bottles sold (expected 1:1 empty container return)
  const refillsSold = sales.reduce((count, s) => {
    const refillItems = s.items.filter((i) => i.requiresEmptyReturn);
    return count + refillItems.reduce((acc, item) => acc + item.quantity, 0);
  }, 0);

  // Empty bottles actually recovered
  const emptiesRecovered = sales.reduce((sum, s) => sum + s.emptyBottlesReceived, 0);
  // Empty bottles customers owe
  const emptiesOwed = sales.reduce((sum, s) => sum + s.emptyBottlesOwed, 0);

  // Returned full bottles from routes (if reported or estimated)
  const fullBottlesReturned = routes.reduce((sum, r) => {
    if (r.returnedFullBottles !== undefined) return sum + r.returnedFullBottles;
    const rSales = sales.filter((s) => s.routeId === r.id);
    const sold = rSales.reduce((acc, s) => acc + s.fullBottlesSold, 0);
    return sum + Math.max(0, r.initialBottles - sold);
  }, 0);

  // Total physical containers back at plant
  const totalContainersBackAtPlant = fullBottlesReturned + emptiesRecovered;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>Inventario y Control de Envases</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Control Global de Envases (Planta vs. Ruta)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Balance integral de garrafones que salieron a recorrido contra los que regresaron a la planta para evitar mermas.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>Imprimir Balance</span>
        </button>
      </div>

      {/* Hero Visual Container Flow */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Salieron de Planta */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Salieron de Planta</span>
            <ArrowUpRight className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {totalLoadedBottles}
          </div>
          <span className="text-[10px] text-sky-700 font-medium block mt-0.5">
            garrafones llenos cargados
          </span>
        </div>

        {/* Retornaron a Planta */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Retornaron a Planta</span>
            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {totalContainersBackAtPlant}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
            {fullBottlesReturned} llenos + {emptiesRecovered} vacíos
          </span>
        </div>

        {/* Nuevos con Envase */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Envases Nuevos</span>
            <Droplets className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-700">
            {newBottlesSold}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
            salieron definitivos (vendidos)
          </span>
        </div>

        {/* Envases en Calle / Pendientes */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Adeudos de Envase</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {emptiesOwed}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
            clientes quedaron a deber
          </span>
        </div>
      </div>

      {/* Fórmula y Explicación del Balance */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-5 text-xs text-slate-700 space-y-2">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-sky-600" />
          <span>Fórmula de Conciliación de Envases:</span>
        </h3>
        <p className="font-mono text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200">
          Garrafones Iniciales ({totalLoadedBottles}) = Llenos Sobrantes ({fullBottlesReturned}) + Vacíos Recuperados ({emptiesRecovered}) + Envases Nuevos ({newBottlesSold}) + Adeudos ({emptiesOwed})
        </p>
        <p className="text-slate-500 text-[11px]">
          Los envases nuevos con agua representan garrafones que los clientes compraron completos (no se esperaba recuperar un envase a cambio). Los adeudos representan clientes donde el chofer entregó agua pero no recogió el envase vacío.
        </p>
      </div>

      {/* Desglose por Chofer / Unidad */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900">
            Balance Individual de Envases por Unidad
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {routes.map((r) => {
            const rSales = sales.filter((s) => s.routeId === r.id);
            const sold = rSales.reduce((acc, s) => acc + s.fullBottlesSold, 0);
            const empties = rSales.reduce((acc, s) => acc + s.emptyBottlesReceived, 0);
            const owed = rSales.reduce((acc, s) => acc + s.emptyBottlesOwed, 0);
            const returnedFull = r.returnedFullBottles !== undefined ? r.returnedFullBottles : Math.max(0, r.initialBottles - sold);

            return (
              <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <span>{r.driverName}</span>
                    <span className="text-slate-400 font-normal">· {r.vehicleName}</span>
                  </div>
                  <div className="text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]">
                    <span>Carga: <strong>{r.initialBottles} llenos</strong></span>
                    <span>Vendidos: <strong>{sold}</strong></span>
                    <span>Llenos devueltos: <strong>{returnedFull}</strong></span>
                    <span>Vacíos devueltos: <strong className="text-emerald-700">{empties}</strong></span>
                    {owed > 0 && (
                      <span className="text-amber-700 font-bold">Adeudos: {owed}</span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Estado</div>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize bg-slate-100 text-slate-700">
                    {r.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
