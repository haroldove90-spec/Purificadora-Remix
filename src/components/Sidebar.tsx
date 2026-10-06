import React from 'react';
import {
  ShoppingCart,
  Clock,
  Receipt,
  TrendingUp,
  Users,
  Award,
  Wallet,
  Package,
  Calendar,
  LogOut,
  Droplet,
  Store,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Role, Employee, Area } from '../types';

interface Props {
  role: Role;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  currentEmployee: Employee;
  currentArea: Area;
  onChangeArea?: (area: Area) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<Props> = ({
  role,
  activeTab,
  onTabChange,
  isOpen,
  onToggle,
  currentEmployee,
  currentArea,
  onChangeArea,
  onLogout,
}) => {
  const employeeItems = [
    { id: 'pos', label: 'Punto de Cobro Exprés', icon: ShoppingCart },
    { id: 'checador', label: 'Reloj Checador (Turnos)', icon: Clock },
    { id: 'mis_ventas', label: 'Mis Cobros del Día', icon: Receipt },
  ];

  const adminItems = [
    { id: 'monitoreo', label: 'Monitoreo en Tiempo Real', icon: TrendingUp },
    { id: 'asistencia', label: 'Asistencia y Puntualidad', icon: Users },
    { id: 'rendimiento', label: 'Rendimiento por Empleado', icon: Award },
    { id: 'corte', label: 'Corte de Caja Rápido', icon: Wallet },
    { id: 'catalogo', label: 'Catálogo y Personal', icon: Package },
    { id: 'historial', label: 'Historial y Conciliación', icon: Calendar },
    { id: 'pos', label: 'Cobro Mostrador', icon: ShoppingCart },
  ];

  const items = role === 'admin' ? adminItems : employeeItems;

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

      {/* Area Switcher if employee */}
      {role === 'empleado' && onChangeArea && isOpen && (
        <div className="p-3 mx-3 my-3 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
            Área de Trabajo Activa:
          </p>
          <div className="grid grid-cols-2 gap-1 bg-slate-200/60 p-1 rounded-xl">
            <button
              onClick={() => onChangeArea('purificadora')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentArea === 'purificadora'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplet className="w-3 h-3" />
              <span>Agua</span>
            </button>
            <button
              onClick={() => onChangeArea('tienda')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentArea === 'tienda'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3 h-3" />
              <span>Tienda</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation menu items */}
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {isOpen && (
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
            {role === 'admin' ? 'Módulos de Gestión' : 'Operación'}
          </p>
        )}

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={!isOpen ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-sky-50 text-sky-700 shadow-xs border border-sky-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              } ${!isOpen ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
              {isOpen && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Bottom User / Session actions */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        {isOpen ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 px-2 py-1">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                  role === 'admin' ? 'bg-indigo-600' : 'bg-sky-600'
                }`}
              >
                {role === 'admin' ? <ShieldAlert className="w-4 h-4" /> : currentEmployee.name.charAt(0)}
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-bold text-slate-800 truncate">
                  {currentEmployee.name}
                </div>
                <div className="text-[10px] text-slate-500 capitalize">
                  {role === 'admin' ? 'Administrador' : `Operador (${currentArea})`}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition border border-rose-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="w-full p-2.5 flex items-center justify-center text-rose-600 hover:bg-rose-50 rounded-xl transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
};
