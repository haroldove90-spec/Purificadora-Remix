import React from 'react';
import { CheckCircle2, Printer, Plus, Share2, Droplet, Store } from 'lucide-react';
import { Sale } from '../../types';

interface Props {
  sale: Sale | null;
  onClose: () => void;
  onNewSale: () => void;
}

export const DigitalTicketModal: React.FC<Props> = ({ sale, onClose, onNewSale }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(sale.timestamp).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Success Banner */}
        <div className="text-center pb-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 shadow-sm animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            ¡Cobro Registrado!
          </h3>
          <p className="text-xs text-slate-500">
            Ticket #{sale.ticketNumber} • Asignado a {sale.employeeName}
          </p>
        </div>

        {/* Realistic Receipt Paper Ticket */}
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4 font-mono text-xs text-slate-700 shadow-inner my-2">
          <div className="text-center border-b border-dashed border-slate-300 pb-2 mb-2 font-sans">
            <div className="font-extrabold text-sm text-slate-900">
              PURIFICADORA & ABARROTES
            </div>
            <div className="text-[10px] text-slate-500">Agua Purificada y Tienda</div>
            <div className="text-[10px] text-slate-500 mt-1">{formattedDate}</div>
            <div className="text-[10px] font-bold text-sky-700 mt-0.5">
              Atendió: {sale.employeeName} ({sale.area.toUpperCase()})
            </div>
          </div>

          {/* Items breakdown */}
          <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-2 mb-2">
            {sale.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <span className="flex-1 pr-2 truncate">
                  {item.quantity}x {item.productName}
                </span>
                <span className="font-bold shrink-0">
                  ${item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals & Payment */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm font-bold text-slate-900">
              <span>TOTAL:</span>
              <span>${sale.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Forma de Pago:</span>
              <span className="capitalize font-semibold">{sale.paymentMethod}</span>
            </div>
            {sale.paymentMethod === 'efectivo' && sale.cashReceived !== undefined && (
              <>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Efectivo Recibido:</span>
                  <span>${sale.cashReceived.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold text-xs pt-0.5 border-t border-slate-200">
                  <span>CAMBIO:</span>
                  <span>${(sale.changeGiven ?? 0).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-3 pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-400 font-sans">
            ¡Gracias por su preferencia!
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <button
            onClick={() => {
              onClose();
              onNewSale();
            }}
            className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Siguiente Cobro Rápido</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Cerrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
