import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Banknote,
  CreditCard,
  Droplets,
  CheckCircle2,
  Printer,
  Calendar,
  Layers,
  Truck,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { DeliveryRoute, Sale, GeneralDailyCut, Employee } from '../../types';
import { StorageService } from '../../services/storage';

interface Props {
  currentEmployee: Employee;
}

export const DailyFleetCut: React.FC<Props> = ({ currentEmployee }) => {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [dailyCuts, setDailyCuts] = useState<GeneralDailyCut[]>([]);
  const [notes, setNotes] = useState('');
  const [lastSavedCut, setLastSavedCut] = useState<GeneralDailyCut | null>(null);

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
    setDailyCuts(StorageService.getDailyCuts());
  };

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalCash = sales
    .filter((s) => s.paymentMethod === 'efectivo')
    .reduce((sum, s) => sum + s.total, 0);
  const totalTransfer = sales
    .filter((s) => s.paymentMethod === 'transferencia')
    .reduce((sum, s) => sum + s.total, 0);

  const totalBottlesSold = sales.reduce((sum, s) => sum + s.fullBottlesSold, 0);
  const refillsCount = sales.reduce((count, s) => {
    const refillItems = s.items.filter((i) => i.requiresEmptyReturn);
    return count + refillItems.reduce((acc, item) => acc + item.quantity, 0);
  }, 0);
  const newBottlesCount = sales.reduce((count, s) => {
    const newItems = s.items.filter((i) => i.isBottleIncluded);
    return count + newItems.reduce((acc, item) => acc + item.quantity, 0);
  }, 0);

  const settledRoutes = routes.filter((r) => r.status === 'liquidada');

  const handleSaveCut = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newCut = StorageService.saveDailyCut({
      date: todayStr,
      closedByName: currentEmployee.name,
      totalSales,
      totalCash,
      totalTransfer,
      totalBottlesSold,
      totalRefillsSold: refillsCount,
      totalNewBottlesSold: newBottlesCount,
      routesCount: routes.length,
      settledRoutesCount: settledRoutes.length,
      notes: notes.trim() || 'Corte general diario de flotilla sin anomalías.',
    });
    setLastSavedCut(newCut);
    setNotes('');
    loadData();
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
            <FileCheck className="w-4 h-4 text-sky-600" />
            <span>Finanzas y Caja Central</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Corte General Diario de la Flotilla
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidado de todas las unidades de reparto en campo para cerrar la jornada general de la planta.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>Imprimir Corte</span>
        </button>
      </div>

      {/* Totales Generales de la Empresa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-sm">
          <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
            Efectivo Físico en Caja
          </span>
          <div className="text-3xl sm:text-4xl font-black mt-1">
            ${totalCash.toFixed(2)}
          </div>
          <p className="text-xs text-emerald-100/90 mt-1">
            Monto total en billetes y monedas ingresado por los repartidores
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-5 rounded-3xl shadow-sm">
          <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block">
            Transferencias Bancarias
          </span>
          <div className="text-3xl sm:text-4xl font-black mt-1">
            ${totalTransfer.toFixed(2)}
          </div>
          <p className="text-xs text-indigo-100/90 mt-1">
            Pagos electrónicos directos a cuenta de banco
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-950 text-white p-5 rounded-3xl shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Venta Bruta Total
          </span>
          <div className="text-3xl sm:text-4xl font-black mt-1">
            ${totalSales.toFixed(2)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {sales.length} entregas totales realizadas por la flotilla hoy
          </p>
        </div>
      </div>

      {/* Resumen de Garrafones y Unidades */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Garrafones</span>
          <span className="text-2xl font-black text-slate-900">{totalBottlesSold}</span>
          <span className="text-[11px] text-slate-500 block">despachados hoy</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Rellenos / Cambios</span>
          <span className="text-2xl font-black text-sky-700">{refillsCount}</span>
          <span className="text-[11px] text-slate-500 block">con cambio de envase</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Nuevos Completos</span>
          <span className="text-2xl font-black text-indigo-700">{newBottlesCount}</span>
          <span className="text-[11px] text-slate-500 block">con envase nuevo</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Rutas Liquidadas</span>
          <span className="text-2xl font-black text-emerald-600">
            {settledRoutes.length} <span className="text-sm font-normal text-slate-400">/ {routes.length}</span>
          </span>
          <span className="text-[11px] text-slate-500 block">choferes cerrados</span>
        </div>
      </div>

      {/* Formulario de Cierre Diario */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900">
          Guardar y Archivar Corte General Diario
        </h3>
        <p className="text-xs text-slate-500">
          Cierra formalmente las finanzas de la planta del día de hoy bajo el registro de <strong>{currentEmployee.name}</strong>.
        </p>

        <div>
          <input
            type="text"
            placeholder="Notas del día (ej. Todo cuadrado sin faltantes, camión 01 reportó ponchadura menor)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          />
        </div>

        <button
          type="button"
          onClick={handleSaveCut}
          className="w-full py-4 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Cerrar y Guardar Corte General del Día (${totalSales.toFixed(2)})</span>
        </button>

        {lastSavedCut && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold text-center">
            ✓ Corte general guardado con éxito a las {new Date(lastSavedCut.closedAt).toLocaleTimeString('es-MX')}.
          </div>
        )}
      </div>

      {/* Historial de Cortes Anteriores */}
      {dailyCuts.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900">
              Cortes Generales Archivados Recientes
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {dailyCuts.slice(-5).reverse().map((cut) => (
              <div key={cut.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-800">
                    Fecha: {cut.date} · Cerrado por: {cut.closedByName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {cut.totalBottlesSold} garrafones · {cut.routesCount} rutas · {cut.notes}
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-sm font-black text-slate-900">
                    ${cut.totalSales.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Efectivo: ${cut.totalCash.toFixed(2)} | Transf: ${cut.totalTransfer.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
