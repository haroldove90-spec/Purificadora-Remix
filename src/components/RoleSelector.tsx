import React, { useState } from 'react';
import { Droplets, Store, Clock, ShieldCheck, Download } from 'lucide-react';
import { PinModal } from './PinModal';
import { Employee, Area } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  onSelectRole: (employee: Employee, area: Area, navigateTo?: string) => void;
}

interface RoleCardItem {
  id: 'purificadora' | 'tienda' | 'checador' | 'admin';
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
}

const ROLES: RoleCardItem[] = [
  {
    id: 'purificadora',
    name: 'Purificadora',
    icon: Droplets,
    accentColor: 'text-sky-600 group-hover:text-sky-700',
    badgeBg: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-100/80',
  },
  {
    id: 'tienda',
    name: 'Tienda / Abarrotes',
    icon: Store,
    accentColor: 'text-emerald-600 group-hover:text-emerald-700',
    badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100/80',
  },
  {
    id: 'checador',
    name: 'Reloj Checador',
    icon: Clock,
    accentColor: 'text-amber-600 group-hover:text-amber-700',
    badgeBg: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100/80',
  },
  {
    id: 'admin',
    name: 'Patrón / Administrador',
    icon: ShieldCheck,
    accentColor: 'text-indigo-600 group-hover:text-indigo-700',
    badgeBg: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-100/80',
  },
];

export const RoleSelector: React.FC<Props> = ({ onSelectRole }) => {
  const [activeModalRole, setActiveModalRole] = useState<RoleCardItem | null>(null);

  const handleCardClick = (role: RoleCardItem) => {
    setActiveModalRole(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Top utility row with PWA installer */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 px-2">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Purificadora y abarrotes
        </div>
        <PWAInstallButton />
      </div>

      {/* Strict Role Grid: 2 Columns Mobile / 4 Columns Desktop */}
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleCardClick(role)}
                className="group relative flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-200 active:scale-97 text-center focus:outline-hidden focus:ring-4 focus:ring-sky-500/20 aspect-square min-h-[170px]"
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 border ${role.badgeBg}`}
                >
                  <Icon className={`w-8 h-8 sm:w-9 sm:h-9 ${role.accentColor}`} />
                </div>
                {/* STRICT REQUIREMENT: "Sin header, sin descripciones, solo nombre del rol" */}
                <span className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-sky-700 transition-colors tracking-tight leading-snug">
                  {role.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PIN modal */}
      {activeModalRole && (
        <PinModal
          isOpen={true}
          onClose={() => setActiveModalRole(null)}
          targetRoleType={activeModalRole.id}
          roleTitle={activeModalRole.name}
          onSuccess={(employee, area, navigateTo) => {
            setActiveModalRole(null);
            onSelectRole(employee, area, navigateTo);
          }}
        />
      )}
    </div>
  );
};
