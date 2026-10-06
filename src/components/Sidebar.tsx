import React from 'react';
import {
  TrendingUp,
  Wallet,
  RotateCcw,
  FileCheck,
  Users,
  Calendar,
  Truck,
  Droplets,
  Clock,
  ChevronLeft,
  ChevronRight,
  Receipt,
  LogOut,
} from 'lucide-react';
import { Role, Employee } from '../types';

interface Props {
  role: Role;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  currentEmployee: Employee;
  onLogout: () => void;
}

export const Sidebar: React.FC<Props> = ({
  role,
  activeTab,
  onTabChange,
  isOpen,
  onToggle,
  currentEmployee,
  onLogout,
}) => {
  const driverItems = [
    { id: 'pos', label: 'Cobro Exprés en Ruta', icon: Droplets },
    { id: 'mis_ventas', label: 'Mi Unidad e Inventario', icon: Truck },
    { id: 'checador', label: 'Reloj Checador', icon: Clock },
  ];

  const adminItems = [
    { id: 'monitoreo', label: 'Monitoreo en Tiempo Real', icon: TrendingUp },
    { id: 'corte', label: 'Liquidación por Chofer', icon: Wallet },
    { id: 'envases', label: 'Control de Envases', icon: RotateCcw },
    { id: 'corte_general', label: 'Corte General Flotilla', icon: FileCheck },
    { id: 'catalogo', label: 'Choferes y Precios', icon: Users },
    { id: 'historial', label: 'Historial de Cortes', icon: Calendar },
    { id: 'pos', label: 'Venta en Mostrador Planta', icon: Droplets },
  ];

  const items = role === 'admin' ? adminItems : driverItems;

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 relative select-none shrink-0 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Collapse/Expand Toggle Button on sidebar edge */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-5 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 z-20"
        title={isOpen ? 'Contraer panel' : 'Expandir panel'}
      >
        {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* Driver Unit Header if in route */}
      {role === 'repartidor' && isOpen && (
        <div className="p-3 mx-3 my-3 rounded-2xl bg-sky-50 border border-sky-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700 mb-0.5">
            Unidad Asignada:
          </p>
          <div className="text-xs font-black text-sky-950 truncate flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="truncate">{currentEmployee.assignedVehicleName || 'Camioneta de Reparto'}</span>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl font-bold text-xs transition-all text-left ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {isOpen && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom User info & Logout */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-xs text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {isOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};
