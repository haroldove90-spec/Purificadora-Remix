import React, { useState, useEffect } from 'react';
import {
  Plus,
  Minus,
  Trash2,
  Check,
  CreditCard,
  Banknote,
  Search,
  Droplet,
  Store,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Product, SaleItem, Employee, Area, PaymentMethod, Sale } from '../../types';
import { StorageService } from '../../services/storage';
import { DigitalTicketModal } from './DigitalTicketModal';

interface Props {
  currentEmployee: Employee;
  currentArea: Area;
  onChangeArea: (area: Area) => void;
}

export const ExpressPOS: React.FC<Props> = ({
  currentEmployee,
  currentArea,
  onChangeArea,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'purificadora' | 'tienda'>(currentArea);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [cashReceived, setCashReceived] = useState<number | ''>('');
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  useEffect(() => {
    loadProducts();
    const handleUpdate = () => loadProducts();
    window.addEventListener('purificadora_data_change', handleUpdate);
    return () => window.removeEventListener('purificadora_data_change', handleUpdate);
  }, []);

  // Sync category tab if currentArea changes
  useEffect(() => {
    setSelectedCategory(currentArea);
  }, [currentArea]);

  const loadProducts = () => {
    setProducts(StorageService.getProducts());
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === 'todos' || p.category === selectedCategory;
    const matchSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const parsedCash = cashReceived === '' ? 0 : Number(cashReceived);
  const changeDue = Math.max(0, parsedCash - cartTotal);
  const isCashSufficient = paymentMethod === 'transferencia' || parsedCash >= cartTotal;

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.unitPrice,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          category: product.category,
          quantity: 1,
          unitPrice: product.price,
          subtotal: product.price,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0
              ? {
                  ...item,
                  quantity: nextQty,
                  subtotal: nextQty * item.unitPrice,
                }
              : null;
          }
          return item;
        })
        .filter((item): item is SaleItem => item !== null)
    );
  };

  const clearCart = () => {
    setCart([]);
    setCashReceived('');
  };

  const handleQuickCash = (amount: number | 'exact') => {
    if (amount === 'exact') {
      setCashReceived(cartTotal);
    } else {
      setCashReceived(amount);
    }
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'efectivo' && parsedCash < cartTotal) {
      alert(`El efectivo recibido ($${parsedCash}) es menor al total ($${cartTotal})`);
      return;
    }

    const newSale = StorageService.addSale({
      employeeId: currentEmployee.id,
      employeeName: currentEmployee.name,
      area: currentArea,
      items: cart,
      total: cartTotal,
      paymentMethod,
      cashReceived: paymentMethod === 'efectivo' ? parsedCash : cartTotal,
      changeGiven: paymentMethod === 'efectivo' ? changeDue : 0,
    });

    setCompletedSale(newSale);
    clearCart();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-6 space-y-3 sm:space-y-4 overflow-hidden">
      {/* Top Banner: Employee badge & active area */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
            {currentEmployee.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
              Venta asignada a:
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 truncate">
              <span>{currentEmployee.name}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Turno Activo
              </span>
            </div>
          </div>
        </div>

        {/* Quick Area Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => onChangeArea('purificadora')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentArea === 'purificadora'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Purificadora</span>
          </button>
          <button
            onClick={() => onChangeArea('tienda')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentArea === 'tienda'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Tienda</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Products (Left) + Tactile Cart & Change (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Product Selection & Express Big Buttons (lg: 7 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Filter Pills & Search */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedCategory('todos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === 'todos'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedCategory('purificadora')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === 'purificadora'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                }`}
              >
                <Droplet className="w-3 h-3" />
                <span>Agua y Garrafones</span>
              </button>
              <button
                onClick={() => setSelectedCategory('tienda')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === 'tienda'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <Store className="w-3 h-3" />
                <span>Tiendita</span>
              </button>
            </div>

            <div className="relative w-full sm:w-48">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Express Big Buttons Grid (Táctiles & Rápidos) */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Botones Grandes de Cobro Exprés
              </span>
              <span className="text-[11px] text-slate-400">
                Toca para añadir al carrito
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {filteredProducts.map((product) => {
                const inCartItem = cart.find((i) => i.productId === product.id);
                const isWater = product.category === 'purificadora';

                return (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    type="button"
                    className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-150 active:scale-96 flex flex-col justify-between min-h-[110px] shadow-xs hover:shadow-md ${
                      inCartItem
                        ? isWater
                          ? 'bg-sky-50/80 border-sky-300 ring-2 ring-sky-400/30'
                          : 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/30'
                        : isWater
                        ? 'bg-white hover:bg-sky-50/40 border-slate-200/90 hover:border-sky-300'
                        : 'bg-white hover:bg-emerald-50/40 border-slate-200/90 hover:border-emerald-300'
                    }`}
                  >
                    {/* Item count badge if in cart */}
                    {inCartItem && (
                      <span className="absolute top-2.5 right-2.5 bg-slate-900 text-white font-extrabold text-[11px] w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                        {inCartItem.quantity}
                      </span>
                    )}

                    <div className="flex items-start gap-2">
                      <span className="text-2xl">{product.emoji || (isWater ? '💧' : '🛒')}</span>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                          {product.name}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {product.unit}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between">
                      <span
                        className={`text-base sm:text-lg font-extrabold tracking-tight ${
                          isWater ? 'text-sky-700' : 'text-emerald-700'
                        }`}
                      >
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        + Agregar
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Ticket / Cart Summary & Change Calculator (lg: 5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Detalle del Cobro
              </h2>
              <span className="text-[11px] text-slate-400">
                {cart.length === 0 ? 'Sin artículos' : `${cart.length} productos listados`}
              </span>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar</span>
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Droplet className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                <p className="text-xs font-medium">Toca los botones para agregar garrafones o productos</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {item.productName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      ${item.unitPrice.toFixed(2)} c/u
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 active:scale-95 shadow-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center hover:bg-sky-700 active:scale-95 shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="w-16 text-right font-extrabold text-xs text-slate-900 pl-2">
                    ${item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Grand Total Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-700 text-white flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">
                Total a Cobrar
              </span>
              <div className="text-xs opacity-90">
                {cart.reduce((s, i) => s + i.quantity, 0)} artículos
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              ${cartTotal.toFixed(2)}
            </div>
          </div>

          {/* Payment Method Switcher */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Forma de Pago
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('efectivo')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'efectivo'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Efectivo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('transferencia');
                  setCashReceived(cartTotal);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'transferencia'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Transferencia</span>
              </button>
            </div>
          </div>

          {/* Cash & Change Calculator (Táctil con Billetes Rápidos) */}
          {paymentMethod === 'efectivo' && (
            <div className="space-y-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Efectivo Recibido ($):
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={cashReceived}
                  onChange={(e) =>
                    setCashReceived(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="0.00"
                  className="w-28 text-right font-mono font-bold text-base px-2.5 py-1 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Quick Bill shortcuts */}
              <div className="grid grid-cols-4 gap-1.5">
                {[50, 100, 200, 500].map((bill) => (
                  <button
                    key={bill}
                    type="button"
                    onClick={() => handleQuickCash(bill)}
                    className="py-1 px-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 text-xs font-bold shadow-2xs active:scale-95 transition"
                  >
                    ${bill}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleQuickCash('exacto' as any)}
                className="w-full py-1 text-center text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-200/60 rounded-lg transition"
              >
                Cobro Exacto (${cartTotal.toFixed(2)})
              </button>

              {/* Calculated Change Box */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  Cambio a Devolver:
                </span>
                <span
                  className={`text-xl font-extrabold ${
                    changeDue > 0 ? 'text-emerald-700' : 'text-slate-700'
                  }`}
                >
                  ${changeDue.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Big Action Complete Button */}
          <button
            type="button"
            disabled={cart.length === 0 || !isCashSufficient}
            onClick={handleCompleteSale}
            className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 ${
              cart.length === 0 || !isCashSufficient
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
            }`}
          >
            <Check className="w-5 h-5" />
            <span>COBRAR Y GENERAR TICKET</span>
          </button>
        </div>
      </div>

      {/* Digital Ticket Modal */}
      <DigitalTicketModal
        sale={completedSale}
        onClose={() => setCompletedSale(null)}
        onNewSale={() => {
          setCompletedSale(null);
          clearCart();
        }}
      />
    </div>
  );
};
