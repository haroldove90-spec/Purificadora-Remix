import React from 'react';
import { CheckCircle2, Printer, Plus, Share2, Droplets, RotateCcw } from 'lucide-react';
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

  const handleShareWhatsApp = () => {
    const text = `*AGUA SAN MIGUEL - Comprobante de Entrega*\n` +
      `Ticket #${sale.ticketNumber}\n` +
      `Repartidor: ${sale.employeeName}\n` +
      `Unidad: ${sale.vehicleName}\n` +
      `Fecha: ${new Date(sale.timestamp).toLocaleString('es-MX')}\n` +
      `--------------------------------\n` +
      sale.items.map(i => `${i.quantity}x ${i.productName} = $${i.subtotal}`).join('\n') +
      `\n--------------------------------\n` +
      `*TOTAL: $${sale.total.toFixed(2)} (${sale.paymentMethod.toUpperCase()})*\n` +
      `Garrafones llenos entregados: ${sale.fullBottlesSold}\n` +
      `Envases vacíos recibidos: ${sale.emptyBottlesReceived}\n` +
      (sale.emptyBottlesOwed > 0 ? `⚠️ Envases pendientes por entregar: ${sale.emptyBottlesOwed}\n` : '') +
      `\n¡Gracias por su preferencia!`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const formattedDate = new Date(sale.timestamp).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Success Banner */}
        <div className="text-center pb-2">
          <div className="w-13 h-13 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            ¡Venta Registrada!
          </h3>
          <p className="text-xs text-slate-500">
            Ticket #{sale.ticketNumber} • {sale.vehicleName}
          </p>
        </div>

        {/* Realistic Receipt Paper Ticket */}
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4 font-mono text-xs text-slate-700 shadow-inner my-2">
          <div className="text-center border-b border-dashed border-slate-300 pb-2 mb-2 font-sans">
            <div className="font-extrabold text-sm text-sky-800 tracking-tight flex items-center justify-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-sky-600 inline" /> AGUA SAN MIGUEL
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Reparto de Agua Purificada en Campo</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{formattedDate}</div>
            <div className="text-[10px] font-bold text-sky-700 mt-1">
              Chofer: {sale.employeeName} · {sale.vehicleName}
            </div>
            {sale.customerNotes && (
              <div className="text-[10px] text-slate-600 italic mt-0.5">
                Ref: {sale.customerNotes}
              </div>
            )}
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

          {/* Container Balance on Delivery */}
          <div className="bg-sky-50/70 rounded-lg p-2 mb-2 text-[11px] font-sans border border-sky-100/80">
            <div className="flex justify-between text-slate-700">
              <span>Garrafones Llenos:</span>
              <span className="font-bold text-sky-700">{sale.fullBottlesSold} pza</span>
            </div>
            <div className="flex justify-between text-slate-700 mt-0.5">
              <span>Envases Vacíos Recibidos:</span>
              <span className="font-bold text-emerald-700">{sale.emptyBottlesReceived} pza</span>
            </div>
            {sale.emptyBottlesOwed > 0 && (
              <div className="flex justify-between text-amber-700 font-bold mt-0.5">
                <span>Envase Pendiente (Debe):</span>
                <span>{sale.emptyBottlesOwed} pza</span>
              </div>
            )}
          </div>

          {/* Totals & Payment */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm font-black text-slate-900">
              <span>TOTAL:</span>
              <span>${sale.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Forma de Pago:</span>
              <span className="capitalize font-bold text-slate-800">
                {sale.paymentMethod === 'efectivo' ? '💵 Efectivo' : '📱 Transferencia'}
              </span>
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
            ¡Agua Purificada San Miguel • Salud y Calidad!
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 space-y-2">
          <button
            onClick={() => {
              onClose();
              onNewSale();
            }}
            className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Siguiente Venta en Ruta</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition flex items-center justify-center gap-1.5 border border-emerald-200/60"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
