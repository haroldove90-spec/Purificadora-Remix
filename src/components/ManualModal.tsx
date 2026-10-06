import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Key,
  Clock,
  Droplet,
  Banknote,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Users,
  CheckCircle2,
  Smartphone,
  Printer,
} from 'lucide-react';
import { Role } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: Role;
}

export const ManualModal: React.FC<Props> = ({ isOpen, onClose, defaultRole = 'empleado' }) => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<'empleado' | 'patron'>(
    defaultRole === 'admin' ? 'patron' : 'empleado'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[92vh] rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Manual de Uso Sencillo
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Guía paso a paso explicada de la forma más fácil
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
            onClick={() => setSelectedRoleTab('empleado')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              selectedRoleTab === 'empleado'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>Guía para el Empleado / Trabajador</span>
          </button>
          <button
            onClick={() => setSelectedRoleTab('patron')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              selectedRoleTab === 'patron'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Guía para el Patrón / Administrador</span>
          </button>
        </div>

        {/* Manual Content (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* ======================= ROL EMPLEADO ======================= */}
          {selectedRoleTab === 'empleado' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900">
                <span className="font-extrabold text-sm block mb-1">
                  ¡Hola! Bienvenido al sistema de tu trabajo
                </span>
                Este programa está diseñado para que cobres rápido y sin complicaciones. No necesitas saber de computación. Solo sigue estos sencillos pasos:
              </div>

              {/* Paso 1: Entrar con tu PIN */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Cómo entrar al sistema (Tu PIN de 4 números)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  En la pantalla de inicio toca tu área (por ejemplo <strong>Purificadora</strong> o <strong>Tienda</strong>). Te pedirá tu clave secreta de 4 números (como la del cajero). Teclea tus 4 números y entrarás de inmediato.
                </p>
                <div className="text-[11px] bg-white p-2.5 rounded-xl border border-slate-200 font-medium text-slate-700">
                  💡 <em>Consejo:</em> Puedes pulsar tu nombre arriba del teclado si aparece para rellenarlo rápido.
                </div>
              </div>

              {/* Paso 2: Checar Entrada y Salida */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Cómo registrar tu hora de entrada y salida (Reloj Checador)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Toca la pestaña de abajo que dice <strong>«Checador»</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>
                    <strong>Al llegar:</strong> Pulsa el botón verde grande que dice <strong>«REGISTRAR ENTRADA»</strong>. El sistema guardará la hora exacta en que empezaste.
                  </li>
                  <li>
                    <strong>Al terminar tu turno:</strong> Vuelve al Checador y pulsa el botón rojo que dice <strong>«REGISTRAR SALIDA»</strong>.
                  </li>
                </ul>
              </div>

              {/* Paso 3: Cobrar un Garrafón o Producto */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Cómo cobrar en el mostrador (Cobro Exprés)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  En la pestaña <strong>«Cobro Exprés»</strong> verás botones grandes con dibujos:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li>
                    <strong>Para agregar un garrafón:</strong> Solo toca el botón de <em>«Relleno Garrafón 20L»</em>. Si el cliente lleva 2 o 3, tócalo varias veces o usa los signos <strong>+</strong> y <strong>-</strong>.
                  </li>
                  <li>
                    <strong>Para productos de la tiendita:</strong> Toca la pestaña «Tiendita» y pulsa el refresco o botana que pidió el cliente.
                  </li>
                </ul>
              </div>

              {/* Paso 4: Calcular el Cambio sin Errores */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                    4
                  </span>
                  <span>Cómo dar el cambio y entregar ticket</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  En la parte derecha verás el <strong>TOTAL A COBRAR</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>
                    <strong>Si pagan en efectivo:</strong> Toca el botón del billete con el que te pagan ($50, $100, $200 o $500). El sistema te dirá en números verdes gigantes cuánto <strong>CAMBIO EXACTO</strong> debes regresar.
                  </li>
                  <li>
                    <strong>Si pagan con transferencia / QR:</strong> Toca el botón <em>«Transferencia»</em>.
                  </li>
                  <li>
                    Por último, pulsa el botón verde gigante <strong>«COBRAR Y GENERAR TICKET»</strong>. ¡Listo! La venta quedó registrada a tu nombre.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* ======================= ROL PATRÓN / ADMIN ======================= */}
          {selectedRoleTab === 'patron' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900">
                <span className="font-extrabold text-sm block mb-1">
                  Control Total de tu Negocio desde tu Celular
                </span>
                Puedes revisar todo lo que pasa en tu purificadora y tienda estés donde estés, desde cualquier teléfono o computadora sin instalar programas complicados.
              </div>

              {/* Módulo 1: Monitoreo En Vivo */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span>1. Monitoreo en Tiempo Real (En Vivo)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Consulta de un vistazo cuánto dinero se ha vendido en el día, cuántos garrafones se han llenado, cuánto dinero hay en efectivo en el cajón y cuánto entró a la cuenta por transferencias. Además, ves cada cobro en el momento exacto en que ocurre.
                </p>
              </div>

              {/* Módulo 2: Asistencia y Puntualidad */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>2. Asistencia, Retardos y Ausencias</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  En la sección <strong>«Personal»</strong> puedes verificar al instante quién ya checó entrada, a qué hora exacta llegó y si tiene retardo. Si alguien olvida checar salida, puedes cerrar su turno manualmente con un toque.
                </p>
              </div>

              {/* Módulo 3: Rendimiento por Empleado */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  <span>3. Rendimiento por Trabajador</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Conoce exactamente cuánto dinero cobró cada empleado en su turno y cuántos garrafones despachó. Esto evita dudas y te ayuda a premiar la productividad.
                </p>
              </div>

              {/* Módulo 4: Corte de Caja Diario */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  <span>4. Corte de Caja Rápido (Cierre Diario)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Al terminar la jornada, ve al módulo <strong>«Corte Caja»</strong>. El sistema te dice cuánto dinero en efectivo debe haber físicamente en el cajón para el arqueo y cuánto en el banco. Escribe una nota si lo deseas y pulsa <strong>«Guardar Corte de Caja Oficial»</strong> para archivar el día.
                </p>
              </div>

              {/* Módulo 5: Catálogo y Trabajadores */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <Key className="w-5 h-5 text-sky-600" />
                  <span>5. Cambiar Precios y Dar de Alta Empleados</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  En <strong>«Catálogo»</strong> puedes dar de alta nuevos productos o ajustar los precios de los garrafones. En la pestaña <strong>«Trabajadores»</strong> puedes agregar nuevos empleados y asignarles su clave PIN de 4 dígitos.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Purificadora y abarrotes • Sistema Simple
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Entendido, cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
