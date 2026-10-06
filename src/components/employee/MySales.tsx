import React, { useState, useEffect } from 'react';
import { Receipt, DollarSign, Droplet, Store, CreditCard, Banknote, Calendar } from 'lucide-react';
import { Employee, Sale } from '../../types';
import { StorageService } from '../../services/storage';
import { DigitalTicketModal } from '../pos/DigitalTicketModal';

interface Props {
  currentEmployee: Employee;
}

export const MySales: React.FC<Props> = ({ currentEmployee }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Sale | null>(null);

  useEffect(() => {
    loadSales();
    const handleUpdate = () => loadSales();
    window.addEventListener('purificadora_data_change', handleUpdate);
    return () => window.removeEventListener('purificadora_data_change', handleUpdate);
  }, [currentEmployee.id]);

  const loadSales = () => {
    const all = StorageService.getSales();
    const todayStr = new Date().toISOString().split('T')[0];
    const mySales = all.filter(
      (s) => s.employeeId === currentEmployee.id && s.timestamp.startsWith(todayStr)
    );
    setSales(mySales);
  };

  const totalAmount = sales.reduce((sum, s) => sum + s.total, 0);
  const totalCash = sales
    .filter((s) => s.paymentMethod === 'efectivo')
    .reduce((sum, s) => sum + s.total, 0);
  const totalTransfer = sales
    .filter((s) => s.paymentMethod === 'transferencia')
    .reduce((sum, s) => sum + s.total, 0);

  const garrafonCount = sales.reduce((count, s) => {
    const garrafonItems = s.items.filter((i) => i.productName.toLowerCase().includes('garraf'));
    return count + garrafonItems.reduce((acc, item) => acc + item.quantity, 0);
  }, 0);

  return (
    <div className="w-full max-w-5xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <div className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
            Mi Resumen de Cobros
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate">
            Ventas de Hoy: {currentEmployee.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cobros registrados automáticamente bajo tu nombre
          </p>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl sm:rounded-2xl border border-slate-200/80 flex items-center justify-between sm:block sm:text-right shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Recaudado Hoy
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* KPI Cards (Clean 2-column mobile with min-w-0 so it never stretches) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase truncate">Cobros</span>
            <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">{sales.length}</div>
          <span className="text-[10px] text-slate-400 block truncate">tickets emitidos</span>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase truncate">Garrafones</span>
            <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-sky-700 truncate">{garrafonCount}</div>
          <span className="text-[10px] text-slate-400 block truncate">despachados</span>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase truncate">Efectivo</span>
            <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-600 truncate">${totalCash.toFixed(2)}</div>
          <span className="text-[10px] text-slate-400 block truncate">en caja física</span>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase truncate">Transferencias</span>
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-blue-600 truncate">${totalTransfer.toFixed(2)}</div>
          <span className="text-[10px] text-slate-400 block truncate">bancarias / QR</span>
        </div>
      </div>

      {/* Sales Ticket List (Fully responsive text wrap) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
            Lista de Cobros Realizados
          </h3>
          <span className="text-[11px] text-slate-400">
            Toca una fila para ver ticket
          </span>
        </div>

        {sales.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            Aún no has registrado cobros el día de hoy.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sales.map((sale) => {
              const timeStr = new Date(sale.timestamp).toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <button
                  key={sale.id}
                  onClick={() => setSelectedTicket(sale)}
                  className="w-full text-left p-3 sm:p-4 hover:bg-slate-50 transition flex items-center justify-between gap-2.5 active:bg-slate-100 min-w-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                      #{sale.ticketNumber}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs sm:text-sm text-slate-800 break-words line-clamp-2">
                        {sale.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span>{timeStr}</span>
                        <span>•</span>
                        <span className="capitalize font-medium text-slate-600">
                          {sale.paymentMethod}
                        </span>
                        <span>•</span>
                        <span className="uppercase text-[10px] font-bold text-sky-600">
                          {sale.area}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-1">
                    <div className="text-xs sm:text-base font-black text-slate-900">
                      ${sale.total.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-sky-600 font-semibold">
                      Ver ticket
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <DigitalTicketModal
        sale={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onNewSale={() => setSelectedTicket(null)}
      />
    </div>
  );
};
