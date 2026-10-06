import React, { useState, useEffect } from 'react';
import {
  Clock,
  LogIn,
  LogOut,
  Droplet,
  Store,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { Employee, Area, AttendanceRecord } from '../../types';
import { StorageService } from '../../services/storage';

interface Props {
  currentEmployee: Employee;
  currentArea: Area;
  onChangeArea: (area: Area) => void;
}

export const ClockInOut: React.FC<Props> = ({
  currentEmployee,
  currentArea,
  onChangeArea,
}) => {
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
    window.addEventListener('purificadora_data_change', handleUpdate);
    return () => window.removeEventListener('purificadora_data_change', handleUpdate);
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
    const record = StorageService.recordCheckIn(currentEmployee, currentArea);
    setFeedbackMsg({
      type: 'success',
      text: `Entrada registrada a las ${record.checkIn} en el área de ${currentArea.toUpperCase()}`,
    });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handlePunchOut = () => {
    const record = StorageService.recordCheckOut(currentEmployee.id);
    if (record) {
      setFeedbackMsg({
        type: 'info',
        text: `Salida registrada a las ${record.checkOut}. Turno completado (${record.hoursWorked} hrs laboradas).`,
      });
      setTimeout(() => setFeedbackMsg(null), 4000);
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
        {/* Subtle background ripples */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-sky-500/10 blur-2xl" />
        <div className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold backdrop-blur-xs uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Reloj Checador Oficial</span>
          </div>

          <div className="font-mono text-4xl sm:text-6xl font-black tracking-tight text-white py-2">
            {formattedCurrentTime}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 capitalize font-medium">
            {formattedCurrentDate}
          </p>
        </div>
      </div>

      {/* Area Selection & Status Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2">
            1. Selección de Área a Laborar
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Marca el área donde trabajarás durante este turno para clasificar tus labores y ventas.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChangeArea('purificadora')}
              className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all active:scale-97 ${
                currentArea === 'purificadora'
                  ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-400/30'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  currentArea === 'purificadora'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-sky-600 border border-slate-200'
                }`}
              >
                <Droplet className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  Purificadora
                </div>
                <div className="text-[11px] text-slate-500">
                  Agua y Garrafones
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onChangeArea('tienda')}
              className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all active:scale-97 ${
                currentArea === 'tienda'
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/30'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  currentArea === 'tienda'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-emerald-600 border border-slate-200'
                }`}
              >
                <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  Tienda
                </div>
                <div className="text-[11px] text-slate-500">
                  Abarrotes y Botanas
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {feedbackMsg && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in duration-200 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Current Shift Status & Action Button */}
        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3">
            2. Registro de Turno
          </h3>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  activeShift ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
                }`}
              >
                {activeShift ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Estado Actual de {currentEmployee.name}
                </div>
                <div className="text-base font-extrabold text-slate-900">
                  {activeShift ? (
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      En Turno Activo (Entró a las {activeShift.checkIn})
                    </span>
                  ) : (
                    <span className="text-slate-600">
                      Fuera de Turno / Listo para checar
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  Horario habitual: {currentEmployee.scheduledTime || '08:00 AM'}
                </div>
              </div>
            </div>

            {/* Direct Big Punch Button */}
            <div>
              {activeShift ? (
                <button
                  type="button"
                  onClick={handlePunchOut}
                  className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-rose-600/25 transition flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>REGISTRAR SALIDA</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePunchIn}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 transition flex items-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  <span>REGISTRAR ENTRADA</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Punch History for this worker */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-600" />
          <span>Mis Registros de Hoy ({todayStr})</span>
        </h3>

        {employeeTodayRecords.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">
            No tienes registros de checada guardados hoy. Pulsa «Registrar Entrada» para comenzar tu jornada.
          </p>
        ) : (
          <div className="space-y-2">
            {employeeTodayRecords.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
                      rec.area === 'purificadora' ? 'bg-sky-600' : 'bg-emerald-600'
                    }`}
                  >
                    {rec.area === 'purificadora' ? (
                      <Droplet className="w-3.5 h-3.5" />
                    ) : (
                      <Store className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 capitalize">
                      {rec.area}
                    </span>
                    <span className="text-slate-400 text-[10px] ml-2">
                      Entrada: <strong className="text-slate-700">{rec.checkIn}</strong>
                    </span>
                    {rec.checkOut && (
                      <span className="text-slate-400 text-[10px] ml-2">
                        Salida: <strong className="text-slate-700">{rec.checkOut}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {rec.checkOut ? (
                    <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
                      {rec.hoursWorked} hrs laboradas
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Laborando actualmente
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
