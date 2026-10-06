import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Banknote,
  CreditCard,
  Droplet,
  Store,
  CheckCircle2,
  Printer,
  FileText,
  Calendar,
  Lock,
} from 'lucide-react';
import { Sale, CashCut, Employee } from '../../types';
import { StorageService } from '../../services/storage';

interface Props {
  currentEmployee: Employee;
}

export const CashCutReport: React.FC<Props> = ({ currentEmployee }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [cuts, setCuts] = useState<CashCut[]>([]);
  const [notes, setNotes] = useState('');
  const [lastCutDone, setLastCutDone] = useState<CashCut | null>(null);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('purificadora_data_change', handleUpdate);
    return () => window.removeEventListener('purificadora_data_change', handleUpdate);
  }, []);

  const loadData = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaySales = StorageService.getSales().filter((s) => s.timestamp.startsWith(todayStr));
    setSales(todaySales);
    setCuts(StorageService.getCashCuts());
  };

  const totalAmount = sales.reduce((sum, s) => sum + s.total, 0);
  const totalCash = sales
    .filter((s) => s.paymentMethod === 'efectivo')
    .reduce((sum, s) => sum + s.total, 0);
  const totalTransfer = sales
    .filter((s) => s.paymentMethod === 'transferencia')
    .reduce((sum, s) => sum + s.total, 0);

  const purificadoraTotal = sales
    .filter((s) => s.area === 'purificadora')
    .reduce((sum, s) => sum + s.total, 0);
  const tiendaTotal = sales
    .filter((s) => s.area === 'tienda')
    .reduce((sum, s) => sum + s.total, 0);

  const handlePerformCut = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newCut = StorageService.saveCashCut({
      date: todayStr,
      closedByName: currentEmployee.name,
      totalCash,
      totalTransfer,
      totalAmount,
      salesCount: sales.length,
      purificadoraTotal,
      tiendaTotal,
      notes: notes || 'Corte de caja de cierre diario sin incidencias.',
    });
    setLastCutDone(newCut);
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
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Finanzas y Cuadre de Caja
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Corte de Caja Rápido
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Resumen total de dinero cobrado en efectivo y en transferencias para cerrar el día de inmediato
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>Imprimir Resumen</span>
        </button>
      </div>

      {/* Main Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Grand Balance */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-sky-300 uppercase tracking-wider block">
              Gran Total Acumulado
            </span>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
              ${totalAmount.toFixed(2)}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {sales.length} ventas procesadas hoy
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-xs text-slate-300">
            <span>Fecha de corte:</span>
            <span className="font-bold text-white">
              {new Date().toLocaleDateString('es-MX')}
            </span>
          </div>
        </div>

        {/* Efectivo Físico en Cajón */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Banknote className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              Dinero en Efectivo
            </span>
            <div className="text-3xl font-black text-emerald-600 mt-1">
              ${totalCash.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Total que debe existir en el cajón de dinero físico
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700">
            Arqueo de billetes y monedas
          </div>
        </div>

        {/* Dinero en Banco / Transferencias */}
        <div className="bg-white p-6 rounded-3xl border border-blue-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">
              Transferencias / QR
            </span>
            <div className="text-3xl font-black text-blue-600 mt-1">
              ${totalTransfer.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Total reflejado en la cuenta bancaria del negocio
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-700">
            Comprobantes bancarios listos
          </div>
        </div>
      </div>

      {/* Area Breakdown (Agua vs Tienda) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900">
          Distribución de Ingresos por Área
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-800">Purificadora (Agua)</div>
                <div className="text-[11px] text-slate-500">Rellenos, garrafones, hielo</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-sky-800">
                ${purificadoraTotal.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-800">Tienda de Abarrotes</div>
                <div className="text-[11px] text-slate-500">Refrescos, botanas, varios</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-emerald-800">
                ${tiendaTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation & Close Day Action */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-600" />
          <span>Realizar Cierre de Caja Formal</span>
        </h3>
        <p className="text-xs text-slate-500">
          Al generar el corte, se registra el arqueo oficial del día con fecha y hora actual para consulta histórica.
        </p>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Observaciones o notas del corte (opcional):
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej. Todo cuadrado con el cajón físico. Sin diferencias."
            className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        <button
          onClick={handlePerformCut}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>GUARDAR CORTE DE CAJA OFICIAL</span>
        </button>

        {lastCutDone && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-bold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              ¡Corte de caja guardado con éxito! Se archivó el balance total de ${lastCutDone.totalAmount.toFixed(2)}.
            </span>
          </div>
        )}
      </div>

      {/* Past Cuts List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">
            Cortes Realizados Anteriores
          </h3>
          <span className="text-xs text-slate-400">
            {cuts.length} registros guardados
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {cuts.map((cut) => (
            <div
              key={cut.id}
              className="p-4 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-extrabold text-slate-900 text-sm">
                  Corte del {cut.date}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Cerrado por: <strong className="text-slate-700">{cut.closedByName}</strong> •{' '}
                  {cut.salesCount} ventas
                </div>
                {cut.notes && (
                  <div className="text-[11px] text-slate-400 italic mt-0.5">
                    "{cut.notes}"
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Efectivo: ${cut.totalCash.toFixed(0)} | Transf: ${cut.totalTransfer.toFixed(0)}
                  </div>
                  <div className="text-base font-black text-slate-900">
                    Total: ${cut.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
