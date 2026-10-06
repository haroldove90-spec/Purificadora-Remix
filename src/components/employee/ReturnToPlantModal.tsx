import React, { useState } from 'react';
import {
  X,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Droplets,
  DollarSign,
  Banknote,
  Smartphone,
} from 'lucide-react';
import { DeliveryRoute, Employee } from '../../types';
import { StorageService } from '../../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  route: DeliveryRoute;
  currentEmployee: Employee;
  onFinished: () => void;
}

export const ReturnToPlantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  route,
  currentEmployee,
  onFinished,
}) => {
  const stats = StorageService.getRouteStats(route.id);

  // Suggested values based on sales
  // Expected full bottles remaining = Initial - Sold
  const expectedFullRemaining = Math.max(0, route.initialBottles - stats.fullBottlesSold);
  // Expected empty bottles = Empty bottles received from customers
  const expectedEmptyReturned = stats.emptyBottlesReceived;

  const [returnedFull, setReturnedFull] = useState<number>(expectedFullRemaining);
  const [returnedEmpty, setReturnedEmpty] = useState<number>(expectedEmptyReturned);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Formula de cuadre:
  // Garrafones Iniciales = Vendidos + Devueltos Llenos
  const totalAccountedBottles = stats.fullBottlesSold + returnedFull;
  const bottleDifference = totalAccountedBottles - route.initialBottles;
  const isBottleSquare = bottleDifference === 0;

  const handleFinishRoute = () => {
    setIsSubmitting(true);
    StorageService.finishRoute(route.id, returnedFull, returnedEmpty);
    setIsSubmitting(false);
    onFinished();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Retorno a Planta y Cuadre
              </h2>
              <p className="text-xs text-slate-500">
                {route.vehicleName} · {currentEmployee.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paso a paso explicativo */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 my-3 text-xs text-slate-600 space-y-1.5">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <span>Conteo Físico al Descargar la Unidad</span>
          </div>
          <p>
            Verifica físicamente los garrafones que traes de regreso en la unidad antes de entregar cuentas a administración.
          </p>
        </div>

        {/* Resumen de Ventas en Campo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="bg-sky-50 border border-sky-100 p-2.5 rounded-xl text-center">
            <span className="text-[10px] font-bold text-sky-700 uppercase block">Carga Inicial</span>
            <span className="text-xl font-black text-sky-900">{route.initialBottles}</span>
            <span className="text-[10px] text-sky-600 block">salieron llenos</span>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-xl text-center">
            <span className="text-[10px] font-bold text-blue-700 uppercase block">Vendidos</span>
            <span className="text-xl font-black text-blue-900">{stats.fullBottlesSold}</span>
            <span className="text-[10px] text-blue-600 block">{stats.salesCount} ventas</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-center">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">Efectivo Cobrado</span>
            <span className="text-lg font-black text-emerald-900">${stats.totalCash.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-600 block">en mano</span>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl text-center">
            <span className="text-[10px] font-bold text-indigo-700 uppercase block">Transferencias</span>
            <span className="text-lg font-black text-indigo-900">${stats.totalTransfer.toFixed(2)}</span>
            <span className="text-[10px] text-indigo-600 block">bancarias</span>
          </div>
        </div>

        {/* Inputs de Conteo Físico */}
        <div className="space-y-3 mb-4">
          {/* Garrafones Llenos Restantes */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Garrafones Llenos Restantes (No Vendidos):
              </label>
              <span className="text-[11px] text-slate-500">
                Esperados: <strong className="text-slate-800">{expectedFullRemaining}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setReturnedFull(Math.max(0, returnedFull - 1))}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-lg hover:bg-slate-100 active:scale-95 flex items-center justify-center"
              >
                -
              </button>
              <input
                type="number"
                min={0}
                value={returnedFull}
                onChange={(e) => setReturnedFull(Math.max(0, Number(e.target.value) || 0))}
                className="flex-1 h-10 text-center font-black text-xl bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={() => setReturnedFull(returnedFull + 1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-lg hover:bg-slate-100 active:scale-95 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Garrafones Vacíos Recuperados */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Garrafones Vacíos Recuperados (A Bordo):
              </label>
              <span className="text-[11px] text-slate-500">
                Registrados en ventas: <strong className="text-slate-800">{expectedEmptyReturned}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setReturnedEmpty(Math.max(0, returnedEmpty - 1))}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-lg hover:bg-slate-100 active:scale-95 flex items-center justify-center"
              >
                -
              </button>
              <input
                type="number"
                min={0}
                value={returnedEmpty}
                onChange={(e) => setReturnedEmpty(Math.max(0, Number(e.target.value) || 0))}
                className="flex-1 h-10 text-center font-black text-xl bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={() => setReturnedEmpty(returnedEmpty + 1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-lg hover:bg-slate-100 active:scale-95 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Validación de Cuadre */}
        <div
          className={`p-3.5 rounded-2xl border mb-4 ${
            isBottleSquare
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5">
              {isBottleSquare ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              {isBottleSquare
                ? '¡Cuadre perfecto de garrafones!'
                : `Diferencia de garrafones: ${bottleDifference > 0 ? `+${bottleDifference} sobrante` : `${bottleDifference} faltante`}`}
            </span>
          </div>
          <div className="text-[11px] mt-1 opacity-90">
            Iniciales ({route.initialBottles}) = Vendidos ({stats.fullBottlesSold}) + Llenos Devueltos ({returnedFull})
          </div>
        </div>

        {/* Efectivo a Entregar */}
        <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Efectivo Total a Entregar al Patrón:
            </span>
            <span className="text-xs text-slate-400">
              Corresponde exactamente a las ventas en efectivo
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            ${stats.totalCash.toFixed(2)}
          </div>
        </div>

        {/* Botón de Enviar */}
        <button
          type="button"
          onClick={handleFinishRoute}
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-black text-sm shadow-md transition flex items-center justify-center gap-2"
        >
          <span>Finalizar Ruta y Solicitar Liquidación</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
