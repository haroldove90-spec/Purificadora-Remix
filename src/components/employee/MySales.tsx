import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Droplets,
  CreditCard,
  Banknote,
  RotateCcw,
  Truck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Trash2,
  Share2,
} from 'lucide-react';
import { Employee, Sale, DeliveryRoute } from '../../types';
import { StorageService } from '../../services/storage';
import { DigitalTicketModal } from '../pos/DigitalTicketModal';
import { ReturnToPlantModal } from './ReturnToPlantModal';

interface Props {
  currentEmployee: Employee;
}

export const MySales: React.FC<Props> = ({ currentEmployee }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [activeRoute, setActiveRoute] = useState<DeliveryRoute | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Sale | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sanmiguel_data_change', handleUpdate);
    return () => window.removeEventListener('sanmiguel_data_change', handleUpdate);
  }, [currentEmployee.id]);

  const loadData = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const all = StorageService.getSales();
    const mySales = all.filter(
      (s) => s.employeeId === currentEmployee.id && s.timestamp.startsWith(todayStr)
    );
    setSales(mySales);

    const route = StorageService.getActiveRouteForDriver(currentEmployee.id);
    setActiveRoute(route);
  };

  const activeSales = sales.filter((s) => s.status === 'completada');

  const totalAmount = activeSales.reduce((sum, s) => sum + s.total, 0);
  const totalCash = activeSales
    .filter((s) => s.paymentMethod === 'efectivo')
    .reduce((sum, s) => sum + s.total, 0);
  const totalTransfer = activeSales
    .filter((s) => s.paymentMethod === 'transferencia')
    .reduce((sum, s) => sum + s.total, 0);

  const totalBottlesSold = activeSales.reduce((sum, s) => sum + s.fullBottlesSold, 0);
  const totalEmptyReceived = activeSales.reduce((sum, s) => sum + s.emptyBottlesReceived, 0);
  const totalEmptyOwed = activeSales.reduce((sum, s) => sum + s.emptyBottlesOwed, 0);

  const remainingFull = activeRoute
    ? Math.max(0, activeRoute.initialBottles - totalBottlesSold)
    : 0;

  const handleCancelSale = (saleId: string) => {
    if (confirm('¿Deseas anular esta venta de campo? Los garrafones se regresarán a tu inventario.')) {
      StorageService.cancelSale(saleId);
      loadData();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <div className="text-[11px] font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-sky-600" />
            <span>Mi Unidad e Inventario en Ruta</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate">
            {activeRoute ? activeRoute.vehicleName : currentEmployee.assignedVehicleName || 'Repartidor'} · {currentEmployee.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeRoute
              ? `Ruta iniciada a las ${new Date(activeRoute.startTime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
              : 'Sin ruta activa el día de hoy'}
          </p>
        </div>

        {activeRoute && activeRoute.status === 'en_ruta' && (
          <button
            type="button"
            onClick={() => setIsReturnModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-sm shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Finalizar Recorrido y Cuadrar</span>
          </button>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Garrafones Llenos Restantes */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase truncate">Llenos Restantes</span>
            <Droplets className="w-4 h-4 text-sky-500 shrink-0" />
          </div>
          <div className="text-2xl font-black text-sky-800">
            {remainingFull}
            {activeRoute && (
              <span className="text-xs text-slate-400 font-normal ml-1">/ {activeRoute.initialBottles}</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block truncate">garrafones a bordo</span>
        </div>

        {/* Vacíos Recuperados */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase truncate">Vacíos A Bordo</span>
            <RotateCcw className="w-4 h-4 text-amber-500 shrink-0" />
          </div>
          <div className="text-2xl font-black text-amber-700">{totalEmptyReceived}</div>
          <span className="text-[10px] text-slate-400 block truncate">
            {totalEmptyOwed > 0 ? `⚠️ ${totalEmptyOwed} cliente debe` : 'envases devueltos'}
          </span>
        </div>

        {/* Efectivo en Mano */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase truncate">Efectivo en Mano</span>
            <Banknote className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600">${totalCash.toFixed(2)}</div>
          <span className="text-[10px] text-slate-400 block truncate">a entregar al patrón</span>
        </div>

        {/* Transferencias */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase truncate">Transferencias</span>
            <CreditCard className="w-4 h-4 text-indigo-500 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-700">${totalTransfer.toFixed(2)}</div>
          <span className="text-[10px] text-slate-400 block truncate">bancos verificados</span>
        </div>
      </div>

      {/* Historial de Ventas en Campo */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              Ventas Registradas en la Ruta de Hoy
            </h3>
            <p className="text-xs text-slate-500">
              {activeSales.length} entregas completadas ({totalBottlesSold} garrafones despachados)
            </p>
          </div>
        </div>

        {sales.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Aún no has registrado entregas en este recorrido. Usa el módulo de cobro exprés.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sales.map((sale) => {
              const isCancelled = sale.status === 'cancelada';
              return (
                <div
                  key={sale.id}
                  className={`p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                    isCancelled ? 'bg-rose-50/50 opacity-60' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        #{sale.ticketNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {sale.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </span>
                      {isCancelled && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                          Cancelada
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span>{new Date(sale.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>·</span>
                      <span className="font-semibold text-sky-700">
                        {sale.fullBottlesSold} garrafón(es)
                      </span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">
                        {sale.emptyBottlesReceived} vacíos recibidos
                      </span>
                      {sale.emptyBottlesOwed > 0 && (
                        <span className="text-amber-700 font-bold">
                          · (Debe {sale.emptyBottlesOwed} envase)
                        </span>
                      )}
                      {sale.customerNotes && (
                        <span className="text-slate-600 italic">
                          · {sale.customerNotes}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-base font-black text-slate-900">
                        ${sale.total.toFixed(2)}
                      </div>
                      <div className="text-[10px] font-semibold uppercase text-slate-500">
                        {sale.paymentMethod === 'efectivo' ? '💵 Efectivo' : '📱 Transferencia'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(sale)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                        title="Ver ticket"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>

                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => handleCancelSale(sale.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition"
                          title="Anular venta por equivocación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      <DigitalTicketModal
        sale={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onNewSale={() => setSelectedTicket(null)}
      />

      {/* Return To Plant Modal */}
      {activeRoute && (
        <ReturnToPlantModal
          isOpen={isReturnModalOpen}
          onClose={() => setIsReturnModalOpen(false)}
          route={activeRoute}
          currentEmployee={currentEmployee}
          onFinished={loadData}
        />
      )}
    </div>
  );
};
