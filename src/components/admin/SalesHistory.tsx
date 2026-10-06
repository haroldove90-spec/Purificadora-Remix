import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Download,
  Filter,
  Receipt,
  FileSpreadsheet,
  Droplet,
  Store,
  DollarSign,
} from 'lucide-react';
import { Sale } from '../../types';
import { StorageService } from '../../services/storage';
import { DigitalTicketModal } from '../pos/DigitalTicketModal';

export const SalesHistory: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [dateFilter, setDateFilter] = useState<'hoy' | 'ayer' | 'semana' | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Sale | null>(null);

  useEffect(() => {
    loadSales();
    const handleUpdate = () => loadSales();
    window.addEventListener('purificadora_data_change', handleUpdate);
    return () => window.removeEventListener('purificadora_data_change', handleUpdate);
  }, []);

  const loadSales = () => {
    setSales(StorageService.getSales());
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);

  const filteredSales = sales.filter((s) => {
    // Date filter
    if (dateFilter === 'hoy' && !s.timestamp.startsWith(todayStr)) return false;
    if (dateFilter === 'ayer' && !s.timestamp.startsWith(yesterdayStr)) return false;
    if (dateFilter === 'semana' && new Date(s.timestamp) < sevenDaysAgo) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTicket = s.ticketNumber.toString().includes(q);
      const matchEmployee = s.employeeName.toLowerCase().includes(q);
      const matchProduct = s.items.some((i) => i.productName.toLowerCase().includes(q));
      if (!matchTicket && !matchEmployee && !matchProduct) return false;
    }

    return true;
  });

  const totalFilteredAmount = filteredSales.reduce((sum, s) => sum + s.total, 0);

  const exportToCSV = () => {
    if (filteredSales.length === 0) return;

    const headers = ['Ticket', 'Fecha y Hora', 'Empleado', 'Área', 'Método', 'Total', 'Artículos'];
    const rows = filteredSales.map((s) => [
      s.ticketNumber,
      `"${new Date(s.timestamp).toLocaleString('es-MX')}"`,
      `"${s.employeeName}"`,
      s.area,
      s.paymentMethod,
      s.total,
      `"${s.items.map((i) => `${i.quantity}x ${i.productName}`).join('; ')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_ventas_${dateFilter}_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Auditoría y Conciliación
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Historial de Ventas y Conciliación
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Consulta de días anteriores para conciliar ingresos semanales o mensuales
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Exportar a Excel / CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setDateFilter('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dateFilter === 'todos'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos los Tiempos
          </button>
          <button
            onClick={() => setDateFilter('hoy')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dateFilter === 'hoy'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => setDateFilter('ayer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dateFilter === 'ayer'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Ayer
          </button>
          <button
            onClick={() => setDateFilter('semana')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dateFilter === 'semana'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Últimos 7 días
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por ticket, empleado o producto..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block font-semibold">Total Filtrado</span>
            <span className="text-sm font-black text-slate-900">
              ${totalFilteredAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">
            Transacciones Encontradas ({filteredSales.length})
          </h3>
          <span className="text-xs text-slate-400">
            Haz clic en un ticket para ver reimpresión
          </span>
        </div>

        {filteredSales.length === 0 ? (
          <div className="text-center py-14 text-slate-400 text-xs">
            No se encontraron ventas con los filtros seleccionados.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSales.map((sale) => {
              const dateStr = new Date(sale.timestamp).toLocaleString('es-MX', {
                dateStyle: 'short',
                timeStyle: 'short',
              });

              return (
                <button
                  key={sale.id}
                  onClick={() => setSelectedTicket(sale)}
                  className="w-full text-left p-4 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      #{sale.ticketNumber}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">
                        {sale.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="font-semibold text-slate-700">
                          {sale.employeeName}
                        </span>
                        <span>•</span>
                        <span className="uppercase text-[10px] font-bold text-sky-600">
                          {sale.area}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{sale.paymentMethod}</span>
                        <span>•</span>
                        <span>{dateStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
                    <div>
                      <div className="text-base font-black text-slate-900">
                        ${sale.total.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-sky-600 font-bold hover:underline">
                        Ver Comprobante
                      </span>
                    </div>
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
