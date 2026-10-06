import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Truck,
  ShieldCheck,
  UserX,
} from 'lucide-react';
import { Employee, AttendanceRecord } from '../../types';
import { StorageService } from '../../services/storage';

export const AttendanceReport: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sanmiguel_data_change', handleUpdate);
    return () => window.removeEventListener('sanmiguel_data_change', handleUpdate);
  }, []);

  const loadData = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setEmployees(StorageService.getEmployees().filter((e) => e.isActive && e.role === 'repartidor'));
    setAttendance(StorageService.getAttendance().filter((a) => a.date === todayStr));
  };

  const handleAdminCheckOut = (recordId: string) => {
    StorageService.recordCheckOut(recordId);
    loadData();
  };

  const handleAdminCheckIn = (employee: Employee) => {
    StorageService.recordCheckIn(employee.id, employee.name);
    loadData();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-600" />
            <span>Supervisión de Personal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Control de Asistencia de Choferes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoreo en tiempo real de checadas de entrada y salida a turnos de reparto
          </p>
        </div>
      </div>

      {/* Grid of employees */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => {
          const shift = attendance.find((a) => a.employeeId === emp.id && !a.checkOut);
          const completedShifts = attendance.filter((a) => a.employeeId === emp.id && a.checkOut);

          return (
            <div key={emp.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 font-black text-sm flex items-center justify-center">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">{emp.name}</h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Truck className="w-3 h-3 text-slate-400" />
                      <span>{emp.assignedVehicleName || 'Repartidor'}</span>
                    </p>
                  </div>
                </div>

                {shift ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    En Turno ({shift.checkIn})
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                    Fuera de Turno
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {shift ? (
                  <button
                    type="button"
                    onClick={() => handleAdminCheckOut(shift.id)}
                    className="w-full py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition"
                  >
                    Registrar Salida de Turno
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAdminCheckIn(emp)}
                    className="w-full py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition"
                  >
                    Registrar Entrada Manual
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
