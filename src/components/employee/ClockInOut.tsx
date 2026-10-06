import React, { useState, useEffect } from 'react';
import {
  Clock,
  LogIn,
  LogOut,
  Droplets,
  Truck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { Employee, AttendanceRecord } from '../../types';
import { StorageService } from '../../services/storage';

interface Props {
  currentEmployee: Employee;
}

export const ClockInOut: React.FC<Props> = ({ currentEmployee }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Live clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAttendance = () => {
    setAttendanceList(StorageService.getAttendance());
  };

  useEffect(() => {
    loadAttendance();
    const handleUpdate = () => loadAttendance();
    window.addEventListener('sanmiguel_data_change', handleUpdate);
    return () => window.removeEventListener('sanmiguel_data_change', handleUpdate);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // Check if current employee has an active open check-in today
  const activeShift = attendanceList.find(
    (r) => r.employeeId === currentEmployee.id && r.date === todayStr && !r.checkOut
  );

  // Today's records for this employee
  const employeeTodayRecords = attendanceList.filter(
    (r) => r.employeeId === currentEmployee.id && r.date === todayStr
  );

  const handlePunchIn = () => {
    const record = StorageService.recordCheckIn(currentEmployee.id, currentEmployee.name);
    setFeedbackMsg({
      type: 'success',
      text: `Entrada registrada a las ${record.checkIn} para ${currentEmployee.name}`,
    });
    setTimeout(() => setFeedbackMsg(null), 4000);
    loadAttendance();
  };

  const handlePunchOut = () => {
    if (!activeShift) return;
    const record = StorageService.recordCheckOut(activeShift.id);
    if (record) {
      setFeedbackMsg({
        type: 'info',
        text: `Salida registrada a las ${record.checkOut}. Turno completado.`,
      });
      setTimeout(() => setFeedbackMsg(null), 4000);
      loadAttendance();
    }
  };

  const formattedCurrentTime = currentTime.toLocaleTimeString('es-MX', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedCurrentDate = currentTime.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Real-time Clock Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold backdrop-blur-xs uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Reloj Checador Oficial · Agua San Miguel</span>
          </div>

          <div className="font-mono text-4xl sm:text-6xl font-black tracking-tight text-white py-2">
            {formattedCurrentTime}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 capitalize font-medium">
            {formattedCurrentDate}
          </p>
        </div>
      </div>

      {/* Action Punch In / Out Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Registro de Jornada: {currentEmployee.name}
            </h3>
            <p className="text-xs text-slate-500">
              {currentEmployee.assignedVehicleName || 'Repartidor de Campo'}
            </p>
          </div>

          <div>
            {activeShift ? (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Turno en Curso (Entrada: {activeShift.checkIn})
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                Sin Turno Activo
              </span>
            )}
          </div>
        </div>

        {feedbackMsg && (
          <div
            className={`p-3 rounded-2xl text-xs font-bold text-center ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-sky-50 text-sky-800 border border-sky-200'
            }`}
          >
            {feedbackMsg.text}
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handlePunchIn}
            disabled={!!activeShift}
            className={`py-5 rounded-2xl font-black text-base transition flex items-center justify-center gap-2.5 shadow-md ${
              !activeShift
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98 shadow-emerald-600/30'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
            }`}
          >
            <LogIn className="w-5 h-5" />
            <span>REGISTRAR ENTRADA</span>
          </button>

          <button
            type="button"
            onClick={handlePunchOut}
            disabled={!activeShift}
            className={`py-5 rounded-2xl font-black text-base transition flex items-center justify-center gap-2.5 shadow-md ${
              activeShift
                ? 'bg-rose-600 hover:bg-rose-700 text-white active:scale-98 shadow-rose-600/30'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span>REGISTRAR SALIDA</span>
          </button>
        </div>
      </div>

      {/* Registros de Hoy */}
      {employeeTodayRecords.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Tus Registros de Asistencia Hoy
          </h4>
          <div className="divide-y divide-slate-100 text-xs">
            {employeeTodayRecords.map((r) => (
              <div key={r.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Entrada: {r.checkIn}</span>
                  {r.checkOut && (
                    <span className="text-slate-500 ml-2">· Salida: {r.checkOut}</span>
                  )}
                </div>
                <span className="text-emerald-700 font-bold capitalize">
                  {r.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
