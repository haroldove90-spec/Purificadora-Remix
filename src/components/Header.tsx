import React from 'react';
import { Droplet, Store, LogOut, ShieldAlert, User, Menu, BookOpen } from 'lucide-react';
import { Employee, Area } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  currentEmployee: Employee;
  currentArea: Area;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onOpenManual?: () => void;
}

export const Header: React.FC<Props> = ({
  currentEmployee,
  currentArea,
  onLogout,
  onToggleSidebar,
  isSidebarOpen,
  onOpenManual,
}) => {
  const isAdmin = currentEmployee.role === 'admin';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs w-full max-w-full overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Brand / Logo + Desktop Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 hidden md:flex items-center justify-center transition shrink-0"
              title={isSidebarOpen ? 'Colapsar menú lateral' : 'Expandir menú lateral'}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-400 via-sky-600 to-blue-700 flex items-center justify-center text-white shadow-xs shadow-sky-500/20 shrink-0">
              <Droplet className="w-4 h-4 sm:w-5 sm:h-5 fill-white/20 stroke-white" />
            </div>
            <div className="min-w-0 truncate">
              <div className="font-extrabold text-xs sm:text-base text-slate-900 leading-tight truncate">
                <span>Purificadora</span>
                <span className="text-sky-600 font-normal mx-0.5">&</span>
                <span className="text-emerald-600">Abarrotes</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden lg:block truncate">
                Punto de Venta y Control Operativo
              </p>
            </div>
          </div>
        </div>

        {/* Right: Active Role Badge + Manual Button + Install Button + Logout */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Active Role Identifier (Super compact on mobile) */}
          <div className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                isAdmin ? 'bg-indigo-600' : 'bg-sky-600'
              }`}
            >
              {isAdmin ? <ShieldAlert className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[120px]">
                {currentEmployee.name}
              </div>
              <div className="text-[10px] font-semibold flex items-center gap-1 mt-0.5">
                {isAdmin ? (
                  <span className="text-indigo-600 uppercase tracking-wider">Patrón</span>
                ) : (
                  <span
                    className={
                      currentArea === 'purificadora'
                        ? 'text-sky-600 uppercase tracking-wider flex items-center gap-0.5'
                        : 'text-emerald-600 uppercase tracking-wider flex items-center gap-0.5'
                    }
                  >
                    {currentArea === 'purificadora' ? (
                      <>
                        <Droplet className="w-2.5 h-2.5" /> Agua
                      </>
                    ) : (
                      <>
                        <Store className="w-2.5 h-2.5" /> Tienda
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Manual / Help Button */}
          {onOpenManual && (
            <button
              onClick={onOpenManual}
              title="Manual de Usuario Fácil"
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 hover:bg-amber-100 transition active:scale-95 shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Manual</span>
            </button>
          )}

          {/* Quick PWA Install Button */}
          <PWAInstallButton />

          {/* Logout / Switch Role Button */}
          <button
            onClick={onLogout}
            title="Salir / Cambiar de rol"
            className="flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition active:scale-95 shrink-0"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline ml-1">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
