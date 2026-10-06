import React, { useState, useEffect } from 'react';
import { Users, Clock, AlertTriangle, CheckCircle, XCircle, UserCheck, Shield } from 'lucide-react';
import { Employee, AttendanceRecord } from '../../types';
import { StorageService } from '../../services/storage';

export const AttendanceReport: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('purificadora_data_change', handleUpdate);
    return () => window.removeEventListener('purificadora_data_change', handleUpdate);
  }, []);

  const loadData = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setEmployees(StorageService.getEmployees().filter((e) => e.isActive && e.role === 'empleado'));
    setAttendance(StorageService.getAttendance().filter((a) => a.date === todayStr));
  };

  const handleAdminCheckOut = (employeeId: string) => {
    StorageService.recordCheckOut(employeeId);
    loadData();
  };

  const handleAdminCheckIn = (employee: Employee) => {
    StorageService.recordCheckIn(employee, employee.defaultArea);
    loadData();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Supervisión de Personal
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Control de Asistencia y Puntualidad
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoreo en tiempo real de checadas de entrada, retardos y ausencias
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Hoy: {new Date().toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      {/* Employee Attendance Cards / Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">
            Estado de la Plantilla ({employees.length} trabajadores registrados)
          </h3>
          <span className="text-xs text-slate-400">
            Tolerancia de puntualidad: 15 minutos
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {employees.map((emp) => {
            // Find today's record for this employee
            const record = attendance.find((a) => a.employeeId === emp.id);

            let statusBadge = (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">
                <XCircle className="w-3.5 h-3.5" />
                Ausente / No ha checado
              </span>
            );

            if (record) {
              if (record.checkOut) {
                statusBadge = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
                    Turno Concluido ({record.hoursWorked} hrs)
                  </span>
                );
              } else if (record.status === 'retardo') {
                statusBadge = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    En Turno con Retardo
                  </span>
                );
              } else {
                statusBadge = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    En Turno Puntual
                  </span>
                );
              }
            }

            return (
              <div
                key={emp.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base text-white shadow-xs ${
                      emp.avatarColor || 'bg-sky-600'
                    }`}
                  >
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-extrabold text-slate-900">
                        {emp.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {emp.defaultArea}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                      <span>
                        Entrada programada: <strong>{emp.scheduledTime || '08:00 AM'}</strong>
                      </span>
                      {record && (
                        <>
                          <span>•</span>
                          <span>
                            Checó entrada:{' '}
                            <strong className="text-slate-800">{record.checkIn}</strong>
                          </span>
                        </>
                      )}
                      {record?.checkOut && (
                        <>
                          <span>•</span>
                          <span>
                            Checó salida:{' '}
                            <strong className="text-slate-800">{record.checkOut}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {statusBadge}

                  {/* Manual administrative override punch if needed */}
                  {record && !record.checkOut && (
                    <button
                      onClick={() => handleAdminCheckOut(emp.id)}
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 border border-slate-200 transition"
                      title="Registrar salida administrativa"
                    >
                      Cerrar Turno
                    </button>
                  )}

                  {!record && (
                    <button
                      onClick={() => handleAdminCheckIn(emp)}
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition"
                      title="Registrar entrada manual"
                    >
                      Checar Entrada
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
