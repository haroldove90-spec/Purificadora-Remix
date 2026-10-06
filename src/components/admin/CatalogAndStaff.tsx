import React, { useState, useEffect } from 'react';
import {
  Package,
  Users,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Droplet,
  Store,
  Key,
  Clock,
  Shield,
} from 'lucide-react';
import { Product, Employee, Area } from '../../types';
import { StorageService } from '../../services/storage';

export const CatalogAndStaff: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalogo' | 'personal'>('catalogo');
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // New product state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<Area>('purificadora');
  const [newProductPrice, setNewProductPrice] = useState<number | ''>('');
  const [newProductUnit, setNewProductUnit] = useState('pza');
  const [newProductEmoji, setNewProductEmoji] = useState('💧');

  // New employee state
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpPin, setNewEmpPin] = useState('');
  const [newEmpArea, setNewEmpArea] = useState<Area>('purificadora');
  const [newEmpTime, setNewEmpTime] = useState('08:00');

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('purificadora_data_change', handleUpdate);
    return () => window.removeEventListener('purificadora_data_change', handleUpdate);
  }, []);

  const loadData = () => {
    setProducts(StorageService.getProducts());
    setEmployees(StorageService.getEmployees());
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || newProductPrice === '') return;

    StorageService.addProduct({
      name: newProductName.trim(),
      category: newProductCategory,
      price: Number(newProductPrice),
      unit: newProductUnit,
      emoji: newProductEmoji,
      isQuickAccess: true,
    });

    setNewProductName('');
    setNewProductPrice('');
    setShowAddProduct(false);
    loadData();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Eliminar este producto del catálogo?')) {
      StorageService.deleteProduct(id);
      loadData();
    }
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || newEmpPin.length !== 4) {
      alert('Por favor ingresa un nombre y un PIN de exactamente 4 dígitos numéricos.');
      return;
    }

    StorageService.addEmployee({
      name: newEmpName.trim(),
      pin: newEmpPin,
      defaultArea: newEmpArea,
      scheduledTime: newEmpTime,
      role: 'empleado',
      isActive: true,
      avatarColor: newEmpArea === 'purificadora' ? 'bg-sky-500' : 'bg-emerald-500',
    });

    setNewEmpName('');
    setNewEmpPin('');
    setShowAddEmployee(false);
    loadData();
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('¿Dar de baja a este trabajador?')) {
      StorageService.deleteEmployee(id);
      loadData();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Header with Sub-tabs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Administración del Sistema
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Catálogo de Productos y Personal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Alta, baja y modificación de precios, garrafones, tiendita y claves PIN de trabajadores
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('catalogo')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'catalogo'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-sky-600" />
            <span>Productos ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'personal'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Trabajadores ({employees.length})</span>
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: PRODUCT CATALOG ===================== */}
      {activeTab === 'catalogo' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Productos y Precios Registrados
            </h3>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Producto</span>
            </button>
          </div>

          {/* New Product Form */}
          {showAddProduct && (
            <form
              onSubmit={handleCreateProduct}
              className="bg-white p-5 rounded-3xl border border-sky-300 shadow-sm space-y-4 animate-in fade-in"
            >
              <div className="font-bold text-sm text-slate-900">
                Registrar Nuevo Producto en Catálogo
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nombre del Producto:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Garrafón 20L Premium"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Categoría / Área:
                  </label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as Area)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                  >
                    <option value="purificadora">Purificadora (Agua)</option>
                    <option value="tienda">Tienda (Abarrotes)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Precio de Venta ($):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="0.00"
                    value={newProductPrice}
                    onChange={(e) =>
                      setNewProductPrice(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Emoji / Ícono rápido:
                  </label>
                  <input
                    type="text"
                    value={newProductEmoji}
                    onChange={(e) => setNewProductEmoji(e.target.value)}
                    placeholder="💧, 🪣, 🥤, 🧊"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 hover:bg-slate-50 transition flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{prod.emoji || '📦'}</span>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">
                        {prod.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span
                          className={`font-bold uppercase ${
                            prod.category === 'purificadora'
                              ? 'text-sky-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {prod.category}
                        </span>
                        <span>•</span>
                        <span>Unidad: {prod.unit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base font-black text-slate-900">
                        ${prod.price.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-slate-400">precio mostrador</span>
                    </div>

                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: STAFF & PIN MANAGEMENT ===================== */}
      {activeTab === 'personal' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Cuentas de Trabajadores y Claves PIN
            </h3>
            <button
              onClick={() => setShowAddEmployee(!showAddEmployee)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Alta de Trabajador</span>
            </button>
          </div>

          {/* New Employee Form */}
          {showAddEmployee && (
            <form
              onSubmit={handleCreateEmployee}
              className="bg-white p-5 rounded-3xl border border-emerald-300 shadow-sm space-y-4 animate-in fade-in"
            >
              <div className="font-bold text-sm text-slate-900">
                Crear Nueva Cuenta de Trabajador
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nombre Completo:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Pedro Ramírez"
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    PIN Corto (4 Dígitos):
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    inputMode="numeric"
                    required
                    placeholder="Ej. 4567"
                    value={newEmpPin}
                    onChange={(e) => setNewEmpPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono tracking-widest text-center focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Área Habitual:
                  </label>
                  <select
                    value={newEmpArea}
                    onChange={(e) => setNewEmpArea(e.target.value as Area)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                  >
                    <option value="purificadora">Purificadora (Agua)</option>
                    <option value="tienda">Tienda (Abarrotes)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Horario de Entrada Programado:
                  </label>
                  <input
                    type="time"
                    value={newEmpTime}
                    onChange={(e) => setNewEmpTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmployee(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  Guardar Trabajador
                </button>
              </div>
            </form>
          )}

          {/* Employees List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="p-4 sm:p-5 hover:bg-slate-50 transition flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white text-sm shadow-xs ${
                        emp.avatarColor || 'bg-sky-600'
                      }`}
                    >
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {emp.name}
                        </span>
                        {emp.role === 'admin' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                            Patrón / Admin
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                            {emp.defaultArea}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 font-mono text-slate-700">
                          <Key className="w-3 h-3 text-amber-500" /> PIN: •••• ({emp.pin})
                        </span>
                        <span>•</span>
                        <span>Turno habitual: {emp.scheduledTime || '08:00 AM'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {emp.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Dar de baja trabajador"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
