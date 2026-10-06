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
  Printer,
  Smartphone,
  AlertCircle,
  HelpCircle,
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[92vh] rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Manual de Uso Sencillo · Agua San Miguel
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Guía rápida en palabras fáciles, sin términos complicados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition flex items-center gap-1 text-xs font-semibold"
              title="Imprimir guía para pegar en planta o tener en la camioneta"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir Hoja</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-3 bg-slate-100/60 border-b border-slate-200/60 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedRoleTab('repartidor')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
              selectedRoleTab === 'repartidor'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Para el Repartidor / Chofer (En Calle)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRoleTab('patron')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
              selectedRoleTab === 'patron'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Para el Patrón / Encargado (En Planta)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700">
          {selectedRoleTab === 'repartidor' ? (
            <div className="space-y-4">
              {/* Resumen en 1 minuto */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 text-sky-950 text-xs">
                <strong>¿En qué consiste tu trabajo con la app?</strong>
                <p className="mt-0.5">
                  Solo haces 3 cosas en todo el día: <strong>1)</strong> Dices cuántos garrafones subes a tu unidad, <strong>2)</strong> En cada casa marcas lo que vendes y los vacíos que te dan, y <strong>3)</strong> Al volver a la planta cuentas los que te sobraron y entregas el dinero. ¡Es todo!
                </p>
              </div>

              {/* PASO 1 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">1</span>
                  <span>Al iniciar el día: Cargar tu Camioneta o Triciclo</span>
                </div>
                <ol className="space-y-1.5 list-decimal list-inside text-slate-600 text-xs pl-1">
                  <li>Toca tu nombre en la pantalla e ingresa tu <strong>PIN de 4 dígitos</strong> (por ejemplo: Juan es <code>1234</code>, Carlos es <code>3456</code>).</li>
                  <li>Aparecerá la pantalla: <em>"Carga Inicial de Unidad"</em>.</li>
                  <li>Selecciona tu vehículo (Camioneta Nissan o Triciclo).</li>
                  <li>Pon la cantidad de garrafones llenos que subiste (ejemplo: 40 garrafones). Puedes usar los botones rápidos <code>[20] [30] [40] [50]</code> o el <code>+</code> y <code>-</code>.</li>
                  <li>Presiona el botón azul grande: <strong>"Confirmar Carga e Iniciar Ruta"</strong>.</li>
                </ol>
              </div>

              {/* PASO 2 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">2</span>
                  <span>En cada casa o negocio: Registrar la venta en 10 segundos</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <p>Cuando llegues a entregar agua, abre la app:</p>
                  <ul className="space-y-1.5 list-disc list-inside pl-1">
                    <li><strong>Botón 1:</strong> Toca <code>💧 Relleno / Cambio ($18)</code> si el cliente te da envase a cambio, o <code>🪣 Garrafón Nuevo ($110)</code> si se lo lleva completo con envase nuevo.</li>
                    <li><strong>Botón 2:</strong> Toca el número de garrafones que entregas: <code>[1] [2] [3] [4] [5]</code>.</li>
                    <li><strong>Control de envases vacíos:</strong>
                      <div className="mt-1 p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-medium">
                        • Si te entregó los mismos envases vacíos, déjalo en <strong>"Normal"</strong>.<br />
                        • Si el cliente <em>no tiene envase hoy y te lo queda a deber</em>, presiona <strong>"Debe 1 envase"</strong>.
                      </div>
                    </li>
                    <li><strong>Forma de pago:</strong>
                      <br />• Si paga en efectivo, toca <strong>"Efectivo"</strong> y selecciona el billete recibido ($50, $100, $200). La app te dice cuánto cambio exacto debes regresar.
                      <br />• Si te mandó transferencia, toca <strong>"Transferencia"</strong>.
                    </li>
                    <li>Presiona <strong>"REGISTRAR COBRO"</strong>. La app descontará el garrafón de tu camioneta y te generará el comprobante. Puedes enviarlo por WhatsApp al cliente si te lo pide.</li>
                  </ul>
                </div>
              </div>

              {/* PASO 3 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">3</span>
                  <span>Al volver a la Planta: Entregar cuentas y garrafones</span>
                </div>
                <ol className="space-y-1.5 list-decimal list-inside text-slate-600 text-xs pl-1">
                  <li>Estaciona tu unidad en la planta y presiona el botón <strong>"Finalizar Ruta"</strong>.</li>
                  <li>Cuenta cuántos garrafones llenos no vendiste y anótalo en la casilla <em>"Garrafones Llenos Restantes"</em>.</li>
                  <li>Cuenta cuántos garrafones vacíos traes a bordo y anótalo en <em>"Garrafones Vacíos Recuperados"</em>.</li>
                  <li>Presiona <strong>"Finalizar Ruta y Solicitar Liquidación"</strong>.</li>
                  <li>Pasa a la mesa del patrón y entrégale el efectivo en mano que marca la pantalla en verde.</li>
                </ol>
              </div>

              {/* Consejos prácticos */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <strong className="text-slate-800 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                  ¿Te equivocaste de dedo en una venta?
                </strong>
                <p>
                  Entra a la pestaña <em>"Mi Unidad"</em>, busca el ticket que marcaste mal y toca el botón rojo de basura (Cancelar). Los garrafones regresarán a tu inventario y el dinero se corregirá de inmediato.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Resumen para el Patrón */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 text-indigo-950 text-xs">
                <strong>Control Total de tu Negocio sin Llamar por Teléfono</strong>
                <p className="mt-0.5">
                  Con este sistema puedes ver en vivo cuánto dinero lleva cada chofer en la bolsa, cuántos garrafones le quedan en la camioneta y cuadrar al centavo cuando regrese a la planta.
                </p>
              </div>

              {/* MODULO 1: Monitoreo */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span>1. Monitoreo Remoto en Tiempo Real (Pestaña "En Vivo")</span>
                </div>
                <p className="text-xs text-slate-600">
                  Desde tu teléfono o computadora verás tarjetas individuales de cada chofer:
                </p>
                <ul className="space-y-1 list-disc list-inside text-xs text-slate-600 pl-1">
                  <li><strong>Barra de avance:</strong> Cuántos garrafones vendió y cuántos le quedan en la camioneta. Si le quedan pocos, sabes que necesita recargar.</li>
                  <li><strong>Efectivo vs. Transferencias:</strong> Cuánto dinero trae físicamente en mano el chofer y cuánto cayó a la cuenta del banco.</li>
                  <li><strong>Envases recolectados:</strong> Cuántos vacíos lleva recuperados para asegurar que no los regale ni los pierda.</li>
                </ul>
              </div>

              {/* MODULO 2: Liquidación por Chofer */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                  <span>2. Cómo Liquidar a un Chofer en 2 Minutos (Pestaña "Liquidar")</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1.5">
                  <p>Cuando el repartidor regrese a planta, selecciónalo en la lista. El sistema te mostrará 3 cuadros de validación:</p>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1 text-slate-800">
                    <div><strong>1. Garrafones Llenos:</strong> Iniciales ({40}) = Vendidos ({30}) + Llenos Devueltos ({10}).</div>
                    <div><strong>2. Envases Vacíos:</strong> Deben coincidir con los cambios de garrafón registrados.</div>
                    <div><strong>3. Efectivo en Mano:</strong> El dinero físico exacto que el chofer te debe entregar en el escritorio.</div>
                  </div>
                  <p>
                    Cuenta el dinero recibido, marca las casillas de verificación y presiona <strong>"Aprobar y Liquidar Ruta"</strong>. Puedes imprimirle su comprobante de corte sellado.
                  </p>
                </div>
              </div>

              {/* MODULO 3: Control de Envases */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <RotateCcw className="w-5 h-5 text-amber-600" />
                  <span>3. Control Global de Envases (Evitar Pérdidas de Envase)</span>
                </div>
                <p className="text-xs text-slate-600">
                  En la pestaña <em>"Envases"</em> ves el balance de la planta: cuántos envases salieron cargados y cuántos retornaron físicos (llenos + vacíos). Si algún cliente quedó a deber envase, el sistema te indica exactamente qué chofer tiene el adeudo registrado.
                </p>
              </div>

              {/* MODULO 4: Gestión de Precios y Choferes */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <Layers className="w-5 h-5 text-sky-600" />
                  <span>4. Cambiar Precios y Dar de Alta Choferes (Pestaña "Precios")</span>
                </div>
                <p className="text-xs text-slate-600">
                  Puedes cambiar el precio del Relleno ($18) o del Garrafón Nuevo ($110) en cualquier momento tocando el lápiz. El cambio se aplica de inmediato a todas las camionetas en calle. También puedes dar de alta nuevos choferes con su PIN de 4 dígitos y asignarles vehículo.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Agua San Miguel · Sistema de Reparto en Campo
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            Cerrar Manual
          </button>
        </div>
      </div>
    </div>
  );
};
