import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Truck,
  RotateCcw,
  Check,
  CreditCard,
  Banknote,
  Plus,
  Minus,
  Sparkles,
  AlertTriangle,
  Receipt,
  User,
  MapPin,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Product, Employee, PaymentMethod, Sale, DeliveryRoute, Vehicle } from '../../types';
import { StorageService } from '../../services/storage';
import { DigitalTicketModal } from './DigitalTicketModal';
import { ReturnToPlantModal } from '../employee/ReturnToPlantModal';

interface Props {
  currentEmployee: Employee;
  currentArea?: string;
  onChangeArea?: (area: any) => void;
}

export const ExpressPOS: React.FC<Props> = ({ currentEmployee }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeRoute, setActiveRoute] = useState<DeliveryRoute | null>(null);
  const [routeStats, setRouteStats] = useState<{
    salesCount: number;
    totalSoldAmount: number;
    totalCash: number;
    totalTransfer: number;
    fullBottlesSold: number;
    emptyBottlesReceived: number;
  }>({
    salesCount: 0,
    totalSoldAmount: 0,
    totalCash: 0,
    totalTransfer: 0,
    fullBottlesSold: 0,
    emptyBottlesReceived: 0,
  });

  // State for starting a new route
  const [selectedVehicle, setSelectedVehicle] = useState<string>(
    currentEmployee.assignedVehicleName || 'Camioneta Nissan #01'
  );
  const [initialBottlesInput, setInitialBottlesInput] = useState<number>(40);

  // Field Sale builder state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [emptyBottlesReceived, setEmptyBottlesReceived] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [cashReceived, setCashReceived] = useState<number | ''>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sanmiguel_data_change', handleUpdate);
    return () => window.removeEventListener('sanmiguel_data_change', handleUpdate);
  }, [currentEmployee.id]);

  const loadData = () => {
    const prods = StorageService.getProducts();
    setProducts(prods);
    setVehicles(StorageService.getVehicles());

    // Select refill product by default
    if (!selectedProduct && prods.length > 0) {
      const refill = prods.find((p) => p.name.toLowerCase().includes('relleno')) || prods[0];
      setSelectedProduct(refill);
      setEmptyBottlesReceived(refill.requiresEmptyReturn ? 1 : 0);
    }

    // Check active route for this driver
    const route = StorageService.getActiveRouteForDriver(currentEmployee.id);
    setActiveRoute(route);
    if (route) {
      const stats = StorageService.getRouteStats(route.id);
      setRouteStats(stats);
    }
  };

  // Adjust empty bottles received when product or quantity changes
  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    if (prod.requiresEmptyReturn) {
      setEmptyBottlesReceived(quantity);
    } else {
      setEmptyBottlesReceived(0);
    }
  };

  const handleSetQuantity = (newQty: number) => {
    const validQty = Math.max(1, newQty);
    setQuantity(validQty);
    if (selectedProduct?.requiresEmptyReturn) {
      setEmptyBottlesReceived(validQty);
    }
  };

  // Quick Start Route
  const handleStartRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialBottlesInput <= 0) {
      alert('Por favor ingresa una cantidad válida de garrafones llenos.');
      return;
    }

    const route = StorageService.startRoute({
      driverId: currentEmployee.id,
      driverName: currentEmployee.name,
      vehicleName: selectedVehicle,
      initialBottles: initialBottlesInput,
    });
    setActiveRoute(route);
    loadData();
  };

  // Sale Calculations
  const unitPrice = selectedProduct?.price ?? 18;
  const saleTotal = unitPrice * quantity;
  const parsedCash = cashReceived === '' ? 0 : Number(cashReceived);
  const changeDue = Math.max(0, parsedCash - saleTotal);
  const isCashSufficient = paymentMethod === 'transferencia' || parsedCash >= saleTotal;

  // Remaining bottles on the vehicle
  const remainingFullOnVehicle = activeRoute
    ? Math.max(0, activeRoute.initialBottles - routeStats.fullBottlesSold)
    : 999;
  const emptyBottlesOnVehicle = routeStats.emptyBottlesReceived;

  // Execute Field Sale
  const handleCompleteSale = () => {
    if (!selectedProduct) return;
    if (paymentMethod === 'efectivo' && parsedCash < saleTotal) {
      alert(`El efectivo recibido ($${parsedCash}) es menor al total a cobrar ($${saleTotal})`);
      return;
    }

    // Calculate bottles sold: if water product, count pieces
    const isWaterGarrafon = selectedProduct.name.toLowerCase().includes('garraf');
    const fullBottlesSold = isWaterGarrafon ? quantity : 0;

    // Check how many empty bottles were owed (if customer gave fewer than refills)
    const expectedEmpty = selectedProduct.requiresEmptyReturn ? quantity : 0;
    const emptyOwed = Math.max(0, expectedEmpty - emptyBottlesReceived);

    const newSale = StorageService.addSale({
      routeId: activeRoute?.id,
      employeeId: currentEmployee.id,
      employeeName: currentEmployee.name,
      vehicleName: activeRoute?.vehicleName || currentEmployee.assignedVehicleName || 'Mostrador Planta',
      items: [
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity,
          unitPrice: selectedProduct.price,
          subtotal: saleTotal,
          isBottleIncluded: selectedProduct.isBottleIncluded,
          requiresEmptyReturn: selectedProduct.requiresEmptyReturn,
        },
      ],
      total: saleTotal,
      fullBottlesSold,
      emptyBottlesReceived,
      emptyBottlesOwed: emptyOwed,
      paymentMethod,
      cashReceived: paymentMethod === 'efectivo' ? parsedCash : undefined,
      changeGiven: paymentMethod === 'efectivo' ? changeDue : undefined,
      customerNotes: customerNotes.trim() || undefined,
    });

    setCompletedSale(newSale);
    // Reset quick form
    setQuantity(1);
    if (selectedProduct.requiresEmptyReturn) {
      setEmptyBottlesReceived(1);
    }
    setCashReceived('');
    setCustomerNotes('');
    setFeedbackMsg(`✓ Venta #${newSale.ticketNumber} registrada exitosamente`);
    setTimeout(() => setFeedbackMsg(null), 3000);
    loadData();
  };

  // If driver has no route active today, show Carga Inicial de Ruta screen
  if (!activeRoute || activeRoute.status === 'liquidada') {
    return (
      <div className="w-full max-w-xl mx-auto p-3 sm:p-6 space-y-4">
        <div className="bg-gradient-to-br from-sky-600 via-sky-700 to-blue-800 text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sky-100 text-xs font-bold backdrop-blur-xs mb-3">
            <Truck className="w-4 h-4" />
            <span>PASO 1: SALIDA A RUTA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Carga Inicial de Unidad
          </h1>
          <p className="text-xs sm:text-sm text-sky-100/90 mt-1">
            Hola <strong className="text-white">{currentEmployee.name}</strong>, registra cuántos garrafones llenos subes a tu vehículo para iniciar el recorrido de hoy.
          </p>
        </div>

        <form onSubmit={handleStartRoute} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          {/* Vehículo Asignado */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Unidad de Reparto Asignada:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedVehicle(v.name);
                    setInitialBottlesInput(v.capacity);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                    selectedVehicle === v.name
                      ? 'border-sky-500 bg-sky-50 text-sky-900 font-bold ring-2 ring-sky-500/30'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${selectedVehicle === v.name ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{v.name}</div>
                    <div className="text-[10px] text-slate-500">Capacidad: {v.capacity} pzas</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Garrafones Llenos Iniciales */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Garrafones Llenos a Bordo:
              </label>
              <span className="text-xs font-semibold text-sky-600">
                {initialBottlesInput} garrafones
              </span>
            </div>

            {/* Presets rápidos */}
            <div className="flex gap-2 mb-3">
              {[20, 30, 40, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setInitialBottlesInput(preset)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    initialBottlesInput === preset
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Stepper numérico táctil */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInitialBottlesInput(Math.max(1, initialBottlesInput - 5))}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xl active:scale-95 flex items-center justify-center border border-slate-200"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => setInitialBottlesInput(Math.max(1, initialBottlesInput - 1))}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xl active:scale-95 flex items-center justify-center border border-slate-200"
              >
                -1
              </button>
              <input
                type="number"
                min={1}
                value={initialBottlesInput}
                onChange={(e) => setInitialBottlesInput(Math.max(1, Number(e.target.value) || 1))}
                className="flex-1 h-12 text-center font-black text-2xl bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={() => setInitialBottlesInput(initialBottlesInput + 1)}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xl active:scale-95 flex items-center justify-center border border-slate-200"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => setInitialBottlesInput(initialBottlesInput + 5)}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xl active:scale-95 flex items-center justify-center border border-slate-200"
              >
                +5
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-black text-base shadow-lg shadow-sky-500/25 transition flex items-center justify-center gap-2"
          >
            <span>Confirmar Carga e Iniciar Ruta</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    );
  }

  // If route is in 'pendiente_liquidacion' status
  if (activeRoute.status === 'pendiente_liquidacion') {
    return (
      <div className="w-full max-w-lg mx-auto p-3 sm:p-6 space-y-4">
        <div className="bg-amber-500 text-slate-950 p-6 rounded-3xl shadow-lg text-center">
          <RotateCcw className="w-12 h-12 mx-auto mb-2 text-slate-900 animate-spin" />
          <h2 className="text-xl font-black">Ruta Finalizada en Planta</h2>
          <p className="text-xs font-semibold text-amber-950 mt-1">
            Esperando cuadre y liquidación del patrón / administrador.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Resumen de tu recorrido:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 block">Garrafones Vendidos:</span>
              <span className="text-lg font-black text-slate-900">{routeStats.fullBottlesSold} pzas</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 block">Llenos Sobrantes:</span>
              <span className="text-lg font-black text-slate-900">{activeRoute.returnedFullBottles ?? 0} pzas</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 block">Vacíos Devueltos:</span>
              <span className="text-lg font-black text-slate-900">{activeRoute.returnedEmptyBottles ?? 0} pzas</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-emerald-700 block font-bold">Efectivo a Entregar:</span>
              <span className="text-xl font-black text-emerald-800">${routeStats.totalCash.toFixed(2)}</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900">
            Transferencias registradas: <strong className="font-bold">${routeStats.totalTransfer.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    );
  }

  // Active Route POS in the Field
  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
      {/* Dynamic Route Header Bar: Garrafones a Bordo & Fin de Ruta */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-md border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Info chofer & unidad */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                <span>{activeRoute.vehicleName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  EN RUTA
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                Chofer: {currentEmployee.name}
              </div>
            </div>
          </div>

          {/* KPI garrafones a bordo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Llenos restantes */}
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Llenos Restantes
              </span>
              <span className={`text-base sm:text-lg font-black ${remainingFullOnVehicle <= 5 ? 'text-amber-400' : 'text-sky-300'}`}>
                {remainingFullOnVehicle} <span className="text-xs text-slate-400 font-normal">/ {activeRoute.initialBottles}</span>
              </span>
            </div>

            {/* Vacíos a bordo */}
            <div className="text-right border-l border-slate-800 pl-2 sm:pl-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Vacíos a Bordo
              </span>
              <span className="text-base sm:text-lg font-black text-amber-300">
                {emptyBottlesOnVehicle} <span className="text-xs text-slate-400 font-normal">recup.</span>
              </span>
            </div>

            {/* Botón de Fin de Ruta / Regreso a Planta */}
            <button
              type="button"
              onClick={() => setIsReturnModalOpen(true)}
              className="ml-1 sm:ml-2 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs transition flex items-center gap-1 shadow-sm shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Finalizar Ruta</span>
              <span className="sm:hidden">Fin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs text-center animate-in fade-in">
          {feedbackMsg}
        </div>
      )}

      {/* Main Express Sales Box */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4">
        {/* PASO A: Selector directo de Producto (Botones Gigantes Táctiles) */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            1. ¿Qué producto vas a despachar?
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* HERO BUTTON 1: Relleno / Cambio */}
            {products
              .filter((p) => p.isQuickAccess)
              .slice(0, 2)
              .map((prod) => {
                const isSelected = selectedProduct?.id === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleSelectProduct(prod)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all active:scale-98 flex items-center justify-between ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/90 text-sky-950 shadow-md ring-2 ring-sky-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-3xl shrink-0">{prod.emoji || '💧'}</span>
                      <div className="min-w-0">
                        <div className="text-base font-black truncate">{prod.name}</div>
                        <div className="text-xs text-slate-500">
                          {prod.requiresEmptyReturn ? 'Requiere recibir envase vacío' : 'Incluye envase nuevo'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <div className="text-2xl font-black text-sky-700">
                        ${prod.price}
                      </div>
                      <div className="text-[10px] text-slate-400">por pieza</div>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Otros productos de agua (si hay más como garrafón 10L, galón, etc.) */}
          {products.filter((p) => !p.isQuickAccess || (!p.name.includes('Relleno') && !p.name.includes('Nuevo'))).length > 0 && (
            <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
              {products
                .filter((p) => !p.name.includes('Relleno') && !p.name.includes('Nuevo'))
                .map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleSelectProduct(prod)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border shrink-0 transition ${
                      selectedProduct?.id === prod.id
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{prod.emoji} {prod.name}</span>
                    <span className="ml-1 opacity-80 font-normal">(${prod.price})</span>
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* PASO B: Cantidad de piezas vendidas */}
        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              2. Cantidad de piezas:
            </label>
            <span className="text-xs font-bold text-slate-700">
              Total a entregar: <strong className="text-sky-700">{quantity} garrafón(es)</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Presets: 1, 2, 3, 4, 5 */}
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleSetQuantity(num)}
                className={`flex-1 h-12 rounded-xl text-base font-black transition active:scale-95 border ${
                  quantity === num
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {num}
              </button>
            ))}

            {/* Steppers */}
            <button
              type="button"
              onClick={() => handleSetQuantity(quantity - 1)}
              className="w-12 h-12 rounded-xl bg-white text-slate-800 border border-slate-200 font-black text-xl hover:bg-slate-100 active:scale-95 flex items-center justify-center shrink-0"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => handleSetQuantity(quantity + 1)}
              className="w-12 h-12 rounded-xl bg-white text-slate-800 border border-slate-200 font-black text-xl hover:bg-slate-100 active:scale-95 flex items-center justify-center shrink-0"
            >
              +
            </button>
          </div>
        </div>

        {/* PASO C: CONTROL DE ENVASES VACÍOS RECUPERADOS (Clave para evitar pérdidas) */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-amber-700" />
              <label className="text-xs font-black text-amber-950 uppercase tracking-tight">
                Control de Envases Vacíos Recibidos:
              </label>
            </div>
            <span className="text-xs font-bold text-amber-900">
              {emptyBottlesReceived} vacíos recibidos
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Si el cliente entrega exactamente los mismos que se vendieron */}
            <button
              type="button"
              onClick={() => setEmptyBottlesReceived(quantity)}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition ${
                emptyBottlesReceived === quantity
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              Normal (1 a 1: {quantity})
            </button>

            {/* Si el cliente queda a deber envase */}
            <button
              type="button"
              onClick={() => setEmptyBottlesReceived(Math.max(0, quantity - 1))}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition ${
                emptyBottlesReceived === Math.max(0, quantity - 1) && quantity > 0 && emptyBottlesReceived !== quantity
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-rose-700 border-amber-200 hover:bg-rose-50'
              }`}
            >
              Debe 1 envase
            </button>

            {/* Stepper manual */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setEmptyBottlesReceived(Math.max(0, emptyBottlesReceived - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-amber-300 font-bold text-slate-700 flex items-center justify-center text-sm"
              >
                -
              </button>
              <span className="w-7 text-center font-black text-amber-950 text-sm">
                {emptyBottlesReceived}
              </span>
              <button
                type="button"
                onClick={() => setEmptyBottlesReceived(emptyBottlesReceived + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-amber-300 font-bold text-slate-700 flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
          </div>

          {selectedProduct?.requiresEmptyReturn && emptyBottlesReceived < quantity && (
            <div className="text-[11px] text-rose-700 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>
                Atención: El cliente queda a deber {quantity - emptyBottlesReceived} envase(s) vacío(s).
              </span>
            </div>
          )}
        </div>

        {/* PASO D: Método de Pago (Efectivo vs Transferencia) */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            3. Método de pago recibido:
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('efectivo')}
              className={`py-3.5 px-4 rounded-2xl border-2 text-center font-black text-sm transition flex items-center justify-center gap-2 ${
                paymentMethod === 'efectivo'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Banknote className="w-5 h-5 text-emerald-600" />
              <span>Efectivo</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('transferencia')}
              className={`py-3.5 px-4 rounded-2xl border-2 text-center font-black text-sm transition flex items-center justify-center gap-2 ${
                paymentMethod === 'transferencia'
                  ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-5 h-5 text-sky-600" />
              <span>Transferencia</span>
            </button>
          </div>

          {/* Si es efectivo: Calculadora rápida de cambio */}
          {paymentMethod === 'efectivo' && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">Billetes recibidos:</span>
                <span className="font-bold text-emerald-700">
                  {parsedCash > 0 ? `$${parsedCash.toFixed(2)}` : 'Pendiente'}
                </span>
              </div>

              {/* Botones rápidos de billetes comunes */}
              <div className="grid grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => setCashReceived(saleTotal)}
                  className="py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-xs hover:bg-slate-100 text-slate-800"
                >
                  Exacto
                </button>
                {[50, 100, 200, 500].map((bill) => (
                  <button
                    key={bill}
                    type="button"
                    onClick={() => setCashReceived(bill)}
                    className="py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-xs hover:bg-slate-100 text-slate-800"
                  >
                    ${bill}
                  </button>
                ))}
              </div>

              {parsedCash > 0 && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
                  <span className="text-slate-600 font-semibold">Cambio a devolver:</span>
                  <span className={`text-base font-black ${changeDue >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    ${changeDue.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nota / Domicilio opcional */}
        <div>
          <input
            type="text"
            placeholder="Domicilio o nombre del cliente (opcional, ej: Morelos #14)"
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          />
        </div>

        {/* Total Gigante y Botón Principal de Cobro */}
        <div className="pt-2">
          <div className="flex items-baseline justify-between mb-3 px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total a cobrar:
            </span>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              ${saleTotal.toFixed(2)}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCompleteSale}
            disabled={!isCashSufficient}
            className={`w-full py-4 rounded-2xl font-black text-base transition-all active:scale-98 flex items-center justify-center gap-2 shadow-lg ${
              isCashSufficient
                ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/30'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5" />
            <span>REGISTRAR COBRO (${saleTotal.toFixed(2)})</span>
          </button>
        </div>
      </div>

      {/* Ticket Modal */}
      <DigitalTicketModal
        sale={completedSale}
        onClose={() => setCompletedSale(null)}
        onNewSale={() => setCompletedSale(null)}
      />

      {/* Return to Plant Modal */}
      {activeRoute && (
        <ReturnToPlantModal
          isOpen={isReturnModalOpen}
          onClose={() => setIsReturnModalOpen(false)}
          route={activeRoute}
          currentEmployee={currentEmployee}
          onFinished={loadData}
        />
      )}
    </div>
  );
};
