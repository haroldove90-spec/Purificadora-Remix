import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, Droplet, DollarSign, Receipt, Percent } from 'lucide-react';
import { Employee, Sale } from '../../types';
import { StorageService } from '../../services/storage';

export const StaffPerformance: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('purificadora_data_change', handleUpdate);
    return () => window.removeEventListener('purificadora_data_change', handleUpdate);
  }, []);

  const loadData = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setEmployees(StorageService.getEmployees().filter((e) => e.isActive && e.role === 'empleado'));
    setSales(StorageService.getSales().filter((s) => s.timestamp.startsWith(todayStr)));
  };

  const totalStoreSales = sales.reduce((sum, s) => sum + s.total, 0);

  // Compute metrics per employee
  const performanceData = employees.map((emp) => {
    const empSales = sales.filter((s) => s.employeeId === emp.id);
    const revenue = empSales.reduce((sum, s) => sum + s.total, 0);
    const ticketsCount = empSales.length;
    const garrafonCount = empSales.reduce((count, s) => {
      const items = s.items.filter((i) => i.productName.toLowerCase().includes('garraf'));
      return count + items.reduce((acc, item) => acc + item.quantity, 0);
    }, 0);
    const avgTicket = ticketsCount > 0 ? revenue / ticketsCount : 0;
    const sharePercentage = totalStoreSales > 0 ? (revenue / totalStoreSales) * 100 : 0;

    return {
      employee: emp,
      revenue,
      ticketsCount,
      garrafonCount,
      avgTicket,
      sharePercentage,
    };
  });

  // Sort by revenue descending
  performanceData.sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Productividad y Eficiencia
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Rendimiento por Empleado
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Desglose de cuántas ventas y cuánto dinero ingresó cada trabajador durante la jornada
          </p>
        </div>

        <div className="text-right bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Ingresos Totales del Personal
          </span>
          <span className="text-xl font-black text-emerald-600">
            ${totalStoreSales.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceData.map((perf, index) => {
          const isLeader = index === 0 && perf.revenue > 0;

          return (
            <div
              key={perf.employee.id}
              className={`bg-white rounded-3xl p-5 border transition-all duration-200 relative flex flex-col justify-between ${
                isLeader
                  ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-md'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              {isLeader && (
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Award className="w-3 h-3 text-slate-900" />
                  <span>Mayor Recaudador</span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-base shadow-xs ${
                      perf.employee.avatarColor || 'bg-sky-600'
                    }`}
                  >
                    {perf.employee.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {perf.employee.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500 capitalize">
                      Área principal: {perf.employee.defaultArea}
                    </span>
                  </div>
                </div>

                {/* Big Metric Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Dinero Total Ingresado
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    ${perf.revenue.toFixed(2)}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Aporte al negocio:</span>
                    <span className="font-bold text-sky-700">
                      {perf.sharePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className="bg-sky-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${perf.sharePercentage}%` }}
                    />
                  </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Ventas
                    </span>
                    <span className="text-base font-extrabold text-slate-800">
                      {perf.ticketsCount}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Garrafones
                    </span>
                    <span className="text-base font-extrabold text-sky-700">
                      {perf.garrafonCount}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Ticket Prom.
                    </span>
                    <span className="text-base font-extrabold text-emerald-700">
                      ${perf.avgTicket.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
