import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Filter,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Download,
  Receipt,
  Banknote,
  CreditCard,
  User,
  Droplets,
} from 'lucide-react';
import { DeliveryRoute, Sale, Employee } from '../../types';
import { StorageService } from '../../services/storage';

export const SalesHistory: React.FC = () => {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [selectedDriverId, setSelectedDriverId] = useState<string>('todos');
  const [activeTab, setActiveTab] = useState<'liquidaciones' | 'ventas'>('liquidaciones');

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sanmiguel_data_change', handleUpdate);
    return () => window.removeEventListener('sanmiguel_data_change', handleUpdate);
  }, []);

  const loadData = () => {
    setRoutes(StorageService.getRoutes());
    setSales(StorageService.getSales());
    setEmployees(StorageService.getEmployees().filter((e) => e.role === 'repartidor'));
  };

  const filteredRoutes = routes.filter((r) => {
    if (selectedDriverId !== 'todos' && r.driverId !== selectedDriverId) return false;
    return true;
  });

  const filteredSales = sales.filter((s) => {
    if (selectedDriverId !== 'todos' && s.employeeId !== selectedDriverId) return false;
    return true;
  });

  const totalHistoricalBottles = filteredSales.reduce((sum, s) => sum + s.fullBottlesSold, 0);
  const totalHistoricalCash = filteredSales
    .filter((s) => s.paymentMethod === 'efectivo')
    .reduce((sum, s) => sum + s.total, 0);
  const totalHistoricalTransfer = filteredSales
    .filter((s) => s.paymentMethod === 'transferencia')
    .reduce((sum, s) => sum + s.total, 0);
  const totalHistoricalAmount = totalHistoricalCash + totalHistoricalTransfer;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Fecha', 'Chofer', 'Unidad', 'Garrafones Iniciales', 'Vendidos', 'Llenos Devueltos', 'Vacíos Devueltos', 'Efectivo Entregado', 'Estado'];
    const rows = filteredRoutes.map((r) => {
      const rSales = sales.filter((s) => s.routeId === r.id);
      const sold = rSales.reduce((acc, s) => acc + s.fullBottlesSold, 0);
      return [
        r.date,
        `"${r.driverName}"`,
        `"${r.vehicleName}"`,
        r.initialBottles,
        sold,
        r.returnedFullBottles ?? 0,
        r.returnedEmptyBottles ?? 0,
        r.cashTurnedIn ?? 0,
        r.status,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `historial_rutas_san_miguel_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>Auditoría y Rendimientos</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Historial de Cortes y Liquidaciones
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consulta de liquidaciones cerradas, garrafones despachados y rendimiento histórico por chofer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Chofer filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-600">Filtrar por chofer:</span>
          <select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-sky-500"
          >
            <option value="todos">Todos los choferes</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.assignedVehicleName})
              </option>
            ))}
          </select>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('liquidaciones')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'liquidaciones' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rutas y Liquidaciones ({filteredRoutes.length})
          </button>
          <button
            onClick={() => setActiveTab('ventas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'ventas' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Detalle de Ventas ({filteredSales.length})
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Garrafones Despachados</span>
          <span className="text-2xl font-black text-slate-900">{totalHistoricalBottles}</span>
          <span className="text-[10px] text-slate-500 block">en el historial filtrado</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Recaudado</span>
          <span className="text-2xl font-black text-emerald-600">${totalHistoricalAmount.toFixed(2)}</span>
          <span className="text-[10px] text-slate-500 block">efectivo y transferencia</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Efectivo Físico</span>
          <span className="text-2xl font-black text-slate-900">${totalHistoricalCash.toFixed(2)}</span>
          <span className="text-[10px] text-slate-500 block">ingresado a caja</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rutas Completadas</span>
          <span className="text-2xl font-black text-indigo-700">{filteredRoutes.length}</span>
          <span className="text-[10px] text-slate-500 block">recorridos registrados</span>
        </div>
      </div>

      {/* TAB LIQUIDACIONES */}
      {activeTab === 'liquidaciones' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredRoutes.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No hay rutas registradas con este criterio de búsqueda.
              </div>
            ) : (
              filteredRoutes.map((route) => {
                const rSales = sales.filter((s) => s.routeId === route.id);
                const sold = rSales.reduce((acc, s) => acc + s.fullBottlesSold, 0);
                const isSettled = route.status === 'liquidada';
                const isPending = route.status === 'pendiente_liquidacion';

                return (
                  <div key={route.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          {route.date}
                        </span>
                        <h3 className="font-black text-slate-900 text-sm">
                          {route.driverName}
                        </h3>
                        <span className="text-slate-500 font-medium">· {route.vehicleName}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                        <span>Carga: <strong>{route.initialBottles} garrafones</strong></span>
                        <span>·</span>
                        <span className="text-sky-700 font-bold">Vendidos: {sold}</span>
                        <span>·</span>
                        <span>Llenos sobrantes: {route.returnedFullBottles ?? Math.max(0, route.initialBottles - sold)}</span>
                        <span>·</span>
                        <span className="text-amber-800 font-bold">Vacíos devueltos: {route.returnedEmptyBottles ?? 0}</span>
                        {route.notes && (
                          <span className="text-slate-600 italic">· Nota: {route.notes}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-left sm:text-right">
                        <div className="text-sm font-black text-emerald-700">
                          ${(route.cashTurnedIn ?? rSales.filter(s => s.paymentMethod === 'efectivo').reduce((acc, s) => acc + s.total, 0)).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isSettled ? `Liquidado por ${route.liquidatedByName || 'Administración'}` : 'Sin liquidar'}
                        </div>
                      </div>

                      <div>
                        {isSettled && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Liquidada
                          </span>
                        )}
                        {isPending && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Pendiente
                          </span>
                        )}
                        {route.status === 'en_ruta' && (
                          <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                            En Calle
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB VENTAS DETALLADAS */}
      {activeTab === 'ventas' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100 text-xs">
            {filteredSales.slice(0, 50).map((sale) => (
              <div key={sale.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 font-bold">#{sale.ticketNumber}</span>
                    <span className="font-black text-slate-900">
                      {sale.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {new Date(sale.timestamp).toLocaleString('es-MX')} · {sale.employeeName} ({sale.vehicleName})
                    {sale.customerNotes && ` · ${sale.customerNotes}`}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="font-black text-slate-900 text-sm">
                      ${sale.total.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 block uppercase">
                      {sale.paymentMethod}
                    </span>
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
