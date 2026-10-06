import React, { useState } from 'react';
import { X, Delete, Lock, UserCheck, AlertCircle, Truck, ShieldCheck } from 'lucide-react';
import { Employee } from '../types';
import { StorageService } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetRoleType: 'repartidor' | 'admin' | 'checador' | 'mostrador';
  roleTitle: string;
  onSuccess: (employee: Employee, navigateTo?: string) => void;
}

export const PinModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetRoleType,
  roleTitle,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');

  if (!isOpen) return null;

  const employees = StorageService.getEmployees().filter((e) => e.isActive);

  // Filter relevant employees
  const relevantEmployees =
    targetRoleType === 'admin'
      ? employees.filter((e) => e.role === 'admin')
      : targetRoleType === 'repartidor'
      ? employees.filter((e) => e.role === 'repartidor')
      : employees;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(null);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    setPin('');
    setError(null);
  };

  const verifyPin = (pinToTest: string) => {
    let emp: Employee | undefined;
    if (selectedEmpId) {
      emp = employees.find((e) => e.id === selectedEmpId && e.pin === pinToTest);
    } else {
      if (targetRoleType === 'admin') {
        emp = employees.find((e) => e.role === 'admin' && e.pin === pinToTest);
      } else {
        emp = employees.find((e) => e.pin === pinToTest);
      }
    }

    if (!emp) {
      setError('PIN incorrecto. Intenta de nuevo.');
      setTimeout(() => setPin(''), 600);
      return;
    }

    const targetView =
      targetRoleType === 'checador'
        ? 'checador'
        : targetRoleType === 'admin'
        ? 'monitoreo'
        : 'pos';

    onSuccess(emp, targetView);
  };

  const quickFillEmployee = (e: Employee) => {
    setSelectedEmpId(e.id);
    setPin(e.pin);
    setError(null);
    setTimeout(() => {
      const targetView =
        targetRoleType === 'checador'
          ? 'checador'
          : e.role === 'admin'
          ? 'monitoreo'
          : 'pos';
      onSuccess(e, targetView);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-2 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">{roleTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingresa tu clave corta personal (PIN de 4 dígitos)
          </p>
        </div>

        {/* Quick select tabs */}
        <div className="mt-3 mb-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-1.5">
            Acceso rápido por chofer / encargado:
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {relevantEmployees.map((emp) => (
              <button
                key={emp.id}
                type="button"
                onClick={() => quickFillEmployee(emp)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-all flex items-center gap-1 active:scale-95 ${
                  selectedEmpId === emp.id
                    ? 'bg-sky-500 text-white border-sky-500 font-semibold shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50 hover:border-sky-300'
                }`}
              >
                <span>{emp.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75 font-mono">({emp.pin})</span>
              </button>
            ))}
          </div>
        </div>

        {/* PIN Dots Display */}
        <div className="flex justify-center items-center gap-4 my-3">
          {[0, 1, 2, 3].map((i) => {
            const filled = pin.length > i;
            return (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  filled
                    ? 'bg-sky-600 scale-125 shadow-sm shadow-sky-500/50'
                    : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center justify-center gap-1 text-xs text-rose-600 font-medium mb-1 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Numeric Tactile Keypad */}
        <div className="grid grid-cols-3 gap-2.5 my-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleKeyPress(n.toString())}
              className="h-13 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-sky-100 active:text-sky-700 text-slate-800 font-bold text-xl transition-all shadow-xs border border-slate-200/60 active:scale-95 flex items-center justify-center"
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            className="h-13 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 font-semibold text-xs transition-all border border-slate-200/60 active:scale-95 flex items-center justify-center uppercase tracking-wider"
          >
            Borrar
          </button>

          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-13 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-sky-100 active:text-sky-700 text-slate-800 font-bold text-xl transition-all shadow-xs border border-slate-200/60 active:scale-95 flex items-center justify-center"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="h-13 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-semibold transition-all border border-slate-200/60 active:scale-95 flex items-center justify-center"
            aria-label="Borrar dígito"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-2 text-center text-[11px] text-slate-400">
          Usa los botones rápidos o teclea tu PIN de 4 dígitos
        </div>
      </div>
    </div>
  );
};
