import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Key,
  Truck,
  Droplets,
  RotateCcw,
  Banknote,
  ShieldCheck,
  TrendingUp,
  Wallet,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Role } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: Role;
}

export const ManualModal: React.FC<Props> = ({ isOpen, onClose, defaultRole = 'repartidor' }) => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<'repartidor' | 'patron'>(
    defaultRole === 'admin' ? 'patron' : 'repartidor'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[92vh] rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Manual de Reparto Agua San Miguel
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Flujo paso a paso desde la salida hasta la liquidación en planta
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-3 bg-slate-100/60 border-b border-slate-200/60 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedRoleTab('repartidor')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              selectedRoleTab === 'repartidor'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Guía para Repartidor / Chofer</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRoleTab('patron')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              selectedRoleTab === 'patron'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Guía para Patrón / Administrador</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs text-slate-700">
          {selectedRoleTab === 'repartidor' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 space-y-1">
                <span className="font-bold text-sky-900 flex items-center gap-1.5 text-sm">
                  <Key className="w-4 h-4 text-sky-600" />
                  1. Inicio de Turno y Carga de Unidad
                </span>
                <p className="text-sky-800 text-[11px]">
                  Ingresa tu PIN de 4 dígitos. Antes de arrancar la unidad, indica cuántos garrafones llenos subes a tu camioneta o triciclo y presiona <strong>"Confirmar Carga e Iniciar Ruta"</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  2. Venta y Cobro Exprés en Campo
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600 text-[11px]">
                  <li>
                    <strong>Selecciona el producto:</strong> Presiona <em>"Relleno / Cambio ($18)"</em> o <em>"Garrafón Nuevo Completo ($110)"</em>.
                  </li>
                  <li>
                    <strong>Cantidad de piezas:</strong> Toca el número directo (1, 2, 3, etc.) o usa los botones + y -.
                  </li>
                  <li>
                    <strong>Control de envases vacíos:</strong> Si es cambio, el sistema sugiere 1 vacío por cada garrafón vendido. Si el cliente queda a deber el envase, presiona <em>"Debe 1 envase"</em>.
                  </li>
                  <li>
                    <strong>Método de pago:</strong> Selecciona Efectivo o Transferencia. Si es efectivo, indica el billete recibido para ver el cambio automático.
                  </li>
                  <li>
                    Presiona <strong>"Registrar Cobro"</strong>. Se descontará del inventario de tu unidad y se emitirá el ticket digital para WhatsApp.
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                <span className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  3. Retorno a Planta y Fin de Ruta
                </span>
                <p className="text-amber-800 text-[11px]">
                  Al terminar el recorrido y llegar a la planta, presiona <strong>"Finalizar Ruta"</strong>. Cuenta físicamente los garrafones llenos que te sobraron y los vacíos que recolectaste. Verás tu resumen de entrega para entregar cuentas al patrón.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1">
                <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-sm">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  1. Monitoreo en Tiempo Real (24/7)
                </span>
                <p className="text-indigo-800 text-[11px]">
                  Consulta en todo momento el avance de cada camioneta y triciclo: cuántos garrafones han vendido, cuántos les quedan a bordo y cuánto dinero llevan cobrado en efectivo y transferencias sin interrumpirlos por teléfono.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  2. Cuadre y Liquidación por Chofer
                </span>
                <p className="text-slate-600 text-[11px]">
                  Al llegar cada chofer a la planta, abre la pestaña <strong>"Liquidación por Chofer"</strong>. El sistema valida las 3 reglas de oro:
                </p>
                <div className="p-2.5 rounded-xl bg-slate-50 font-mono text-[10px] space-y-1 border border-slate-200">
                  <div>• Garrafones Iniciales = Garrafones Vendidos + Llenos Devueltos</div>
                  <div>• Envases Vacíos Recibidos = Cambios de Garrafón Registrados</div>
                  <div>• Efectivo en Mano = Total de Ventas en Efectivo Registradas</div>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Valida los conteos físicos en pantalla y presiona <strong>"Aprobar y Liquidar"</strong> para cerrar la cuenta del chofer.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <Layers className="w-4 h-4 text-sky-600" />
                  3. Control de Envases y Corte General
                </span>
                <p className="text-slate-600 text-[11px]">
                  Consulta el <strong>Control de Envases</strong> para evitar mermas en planta y el <strong>Corte General</strong> para ver las utilidades consolidadas de toda la flotilla al final del día.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            Entendido, Cerrar Manual
          </button>
        </div>
      </div>
    </div>
  );
};
