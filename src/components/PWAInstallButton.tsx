import React, { useState } from 'react';
import { Download, Check, Share, PlusSquare, Monitor, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  className?: string;
  showAlways?: boolean;
}

export const PWAInstallButton: React.FC<Props> = ({ className = '', showAlways = true }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 3000);
        return;
      }
    }
    // If not installable via event (iOS, desktop browser that needs manual prompt, or already standalone), show intuitive guidance modal
    setShowModal(true);
  };

  if (isInstalled && !showAlways) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Instalar Purificadora en este dispositivo"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 ${
          isInstalled
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            : 'bg-sky-600 text-white hover:bg-sky-700 hover:shadow-md'
        } ${className}`}
      >
        {justInstalled || isInstalled ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">App Instalada</span>
            <span className="sm:hidden">Instalada</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </>
        )}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Instalar Purificadora y abarrotes
                </h3>
                <p className="text-xs text-slate-500">
                  Acceso directo de alta velocidad y modo sin conexión
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {/* Android / Chrome instructions */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                  <Smartphone className="w-4 h-4 text-sky-600" />
                  <span>En Android (Google Chrome)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Toca el menú de tres puntos (<strong>⋮</strong>) en la esquina superior derecha y selecciona <strong>«Instalar aplicación»</strong> o <strong>«Agregar a pantalla principal»</strong>.
                </p>
              </div>

              {/* iPhone / iPad instructions */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                  <Share className="w-4 h-4 text-blue-600" />
                  <span>En iPhone / iPad (Safari)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Toca el botón <Share className="inline w-3 h-3 text-blue-500" /> <strong>Compartir</strong> en la barra inferior y luego pulsa <PlusSquare className="inline w-3 h-3 text-slate-700" /> <strong>«Agregar a inicio»</strong>.
                </p>
              </div>

              {/* PC / Laptop instructions */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                  <Monitor className="w-4 h-4 text-emerald-600" />
                  <span>En Computadora (Chrome / Edge)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Haz clic en el icono de instalación <Download className="inline w-3 h-3 text-sky-600" /> en el extremo derecho de la barra de direcciones de tu navegador.
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              {isInstallable && (
                <button
                  onClick={async () => {
                    await install();
                    setShowModal(false);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 text-white font-medium text-xs hover:bg-sky-700 transition"
                >
                  Continuar instalación
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-medium text-xs hover:bg-slate-200 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
