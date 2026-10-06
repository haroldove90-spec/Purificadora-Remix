import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Truck,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Droplets,
  Key,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Product, Employee, Vehicle } from '../../types';
import { StorageService } from '../../services/storage';

export const CatalogAndStaff: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'precios' | 'choferes' | 'vehiculos'>('precios');
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Add Driver State
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPin, setNewDriverPin] = useState('');
  const [newDriverVehicle, setNewDriverVehicle] = useState('Camioneta Nissan #01');
  const [newDriverPhone, setNewDriverPhone] = useState('');

  // Add Vehicle State
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehName, setNewVehName] = useState('');
  const [newVehType, setNewVehType] = useState<Vehicle['type']>('camioneta');
  const [newVehCapacity, setNewVehCapacity] = useState<number>(40);

  // Edit Product Price State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sanmiguel_data_change', handleUpdate);
    return () => window.removeEventListener('sanmiguel_data_change', handleUpdate);
  }, []);

  const loadData = () => {
    setProducts(StorageService.getProducts());
    setEmployees(StorageService.getEmployees());
    setVehicles(StorageService.getVehicles());
  };

  // Drivers handlers
  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim() || newDriverPin.length !== 4) {
      alert('Ingresa el nombre del chofer y un PIN de exactamente 4 dígitos.');
      return;
    }

    StorageService.addEmployee({
      name: newDriverName.trim(),
      pin: newDriverPin,
      role: 'repartidor',
      assignedVehicleName: newDriverVehicle,
      phone: newDriverPhone.trim() || undefined,
      isActive: true,
      avatarColor: 'bg-sky-500',
    });

    setNewDriverName('');
    setNewDriverPin('');
    setNewDriverPhone('');
    setShowAddDriver(false);
    loadData();
  };

  const handleToggleDriverStatus = (emp: Employee) => {
    StorageService.updateEmployee(emp.id, { isActive: !emp.isActive });
    loadData();
  };

  // Vehicle handlers
  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehName.trim() || newVehCapacity <= 0) return;

    StorageService.addVehicle({
      name: newVehName.trim(),
      type: newVehType,
      capacity: newVehCapacity,
    });

    setNewVehName('');
    setShowAddVehicle(false);
    loadData();
  };

  // Price handlers
  const handleStartEditPrice = (prod: Product) => {
    setEditingProductId(prod.id);
    setEditingPrice(prod.price);
  };

  const handleSavePrice = (productId: string) => {
    if (editingPrice <= 0) return;
    StorageService.updateProduct(productId, { price: Number(editingPrice) });
    setEditingProductId(null);
    loadData();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-600" />
            <span>Configuración del Sistema</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Gestión de Repartidores, Vehículos y Precios
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Alta de choferes, asignación de unidades de reparto y catálogo de precios de agua purificada.
          </p>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex bg-slate-100 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('precios')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'precios' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Precios Oficiales
          </button>
          <button
            onClick={() => setActiveTab('choferes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'choferes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Choferes ({employees.filter(e => e.role === 'repartidor').length})
          </button>
          <button
            onClick={() => setActiveTab('vehiculos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'vehiculos' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unidades ({vehicles.length})
          </button>
        </div>
      </div>

      {/* TAB PRECIOS */}
      {activeTab === 'precios' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Catálogo de Precios de Venta en Campo
              </h2>
              <p className="text-xs text-slate-500">
                Precios que aparecen en los botones exprés de los repartidores.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {products.map((prod) => {
              const isEditing = editingProductId === prod.id;
              return (
                <div key={prod.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{prod.emoji || '💧'}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-black text-slate-900 truncate">
                        {prod.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {prod.isBottleIncluded ? 'Incluye envase nuevo' : prod.requiresEmptyReturn ? 'Requiere cambio de envase' : 'Accesorio'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-500">$</span>
                        <input
                          type="number"
                          value={editingPrice}
                          onChange={(e) => setEditingPrice(Number(e.target.value))}
                          className="w-20 h-9 px-2 text-center font-black text-base border border-sky-400 rounded-xl focus:ring-2 focus:ring-sky-500"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSavePrice(prod.id)}
                          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                          title="Guardar precio"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProductId(null)}
                          className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-black text-sky-800">
                          ${prod.price.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleStartEditPrice(prod)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                          title="Modificar precio"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CHOFERES */}
      {activeTab === 'choferes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">
              Personal de Reparto y Choferes
            </h2>
            <button
              onClick={() => setShowAddDriver(!showAddDriver)}
              className="px-3 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Alta de Repartidor</span>
            </button>
          </div>

          {/* Formulario de Alta de Chofer */}
          {showAddDriver && (
            <form onSubmit={handleCreateDriver} className="bg-white p-5 rounded-3xl border border-sky-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                Registrar Nuevo Chofer
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Nombre Completo:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Pedro Gómez"
                    value={newDriverName}
                    onChange={(e) => setNewDriverName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    PIN Corto de Acceso (4 dígitos):
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    placeholder="Ej. 5678"
                    value={newDriverPin}
                    onChange={(e) => setNewDriverPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono tracking-widest focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Unidad Asignada:
                  </label>
                  <select
                    value={newDriverVehicle}
                    onChange={(e) => setNewDriverVehicle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name} ({v.capacity} garrafones)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Teléfono Celular:
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej. 55 1234 5678"
                    value={newDriverPhone}
                    onChange={(e) => setNewDriverPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDriver(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs"
                >
                  Guardar Chofer
                </button>
              </div>
            </form>
          )}

          {/* Lista de Choferes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {employees.map((emp) => {
              const isRepartidor = emp.role === 'repartidor';
              return (
                <div key={emp.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 font-black text-sm flex items-center justify-center">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900">{emp.name}</h3>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-slate-400" />
                          <span>{emp.assignedVehicleName || 'Sin unidad fija'}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      emp.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {emp.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <span className="font-mono">PIN: <strong>••••</strong> ({emp.pin})</span>
                    <button
                      type="button"
                      onClick={() => handleToggleDriverStatus(emp)}
                      className="text-xs text-sky-600 hover:text-sky-800 font-semibold"
                    >
                      {emp.isActive ? 'Desactivar' : 'Reactivar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB VEHICULOS */}
      {activeTab === 'vehiculos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">
              Unidades y Vehículos de Reparto
            </h2>
            <button
              onClick={() => setShowAddVehicle(!showAddVehicle)}
              className="px-3 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Alta de Unidad</span>
            </button>
          </div>

          {showAddVehicle && (
            <form onSubmit={handleCreateVehicle} className="bg-white p-5 rounded-3xl border border-sky-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                Registrar Unidad de Reparto
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Nombre:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Camioneta Chevrolet #04"
                    value={newVehName}
                    onChange={(e) => setNewVehName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Tipo:</label>
                  <select
                    value={newVehType}
                    onChange={(e) => setNewVehType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  >
                    <option value="camioneta">Camioneta</option>
                    <option value="triciclo">Triciclo</option>
                    <option value="motocarro">Moto-carro</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Capacidad Máxima:</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newVehCapacity}
                    onChange={(e) => setNewVehCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicle(false)}
                  className="px-3.5 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
                >
                  Guardar Unidad
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {vehicles.map((v) => (
              <div key={v.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">{v.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase">{v.type}</p>
                  </div>
                </div>
                <div className="pt-2 text-xs text-slate-600 flex justify-between border-t border-slate-100">
                  <span>Capacidad de Carga:</span>
                  <strong className="text-sky-800">{v.capacity} garrafones</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
