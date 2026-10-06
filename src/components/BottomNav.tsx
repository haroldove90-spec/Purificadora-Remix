import React from 'react';
import {
  Droplets,
  Truck,
  Clock,
  TrendingUp,
  Wallet,
  RotateCcw,
  FileCheck,
  Users,
  Calendar,
} from 'lucide-react';
import { Role } from '../types';

interface Props {
  role: Role;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<Props> = ({ role, activeTab, onTabChange }) => {
  const driverItems = [
    { id: 'pos', label: 'Cobro Ruta', icon: Droplets },
    { id: 'mis_ventas', label: 'Mi Unidad', icon: Truck },
    { id: 'checador', label: 'Checador', icon: Clock },
  ];

  const adminItems = [
    { id: 'monitoreo', label: 'En Vivo', icon: TrendingUp },
    { id: 'corte', label: 'Liquidar', icon: Wallet },
    { id: 'envases', label: 'Envases', icon: RotateCcw },
    { id: 'corte_general', label: 'Corte Día', icon: FileCheck },
    { id: 'catalogo', label: 'Precios', icon: Users },
    { id: 'historial', label: 'Historial', icon: Calendar },
  ];

  const items = role === 'admin' ? adminItems : driverItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg md:hidden">
      <div className="flex items-center justify-around px-1 py-1 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-sky-100 text-sky-700 shadow-xs' : 'bg-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight mt-0.5 tracking-tight truncate w-full text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
