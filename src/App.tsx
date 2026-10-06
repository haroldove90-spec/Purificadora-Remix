import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { Employee, Role } from './types';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { ExpressPOS } from './components/pos/ExpressPOS';
import { ClockInOut } from './components/employee/ClockInOut';
import { MySales } from './components/employee/MySales';
import { LiveMonitoring } from './components/admin/LiveMonitoring';
import { CashCutReport } from './components/admin/CashCutReport';
import { BottleBalanceReport } from './components/admin/BottleBalanceReport';
import { DailyFleetCut } from './components/admin/DailyFleetCut';
import { CatalogAndStaff } from './components/admin/CatalogAndStaff';
import { SalesHistory } from './components/admin/SalesHistory';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ManualModal } from './components/ManualModal';

export default function App() {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<string>('pos');
  const [selectedRouteForLiquidation, setSelectedRouteForLiquidation] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isManualOpen, setIsManualOpen] = useState(false);

  // Initialize storage and check if there is an active session
  useEffect(() => {
    StorageService.init();
    const session = StorageService.getActiveSession();
    if (session) {
      setCurrentEmployee(session.employee);
      setActiveTab(session.employee.role === 'admin' ? 'monitoreo' : 'pos');
    }
  }, []);

  const handleSelectRole = (
    employee: Employee,
    navigateTo?: string
  ) => {
    setCurrentEmployee(employee);
    StorageService.setActiveSession({ employee });

    if (navigateTo) {
      setActiveTab(navigateTo);
    } else if (employee.role === 'admin') {
      setActiveTab('monitoreo');
    } else {
      setActiveTab('pos');
    }
  };

  const handleLogout = () => {
    StorageService.setActiveSession(null);
    setCurrentEmployee(null);
    setSelectedRouteForLiquidation(null);
  };

  const handleSelectLiquidateFromMonitoring = (routeId: string) => {
    setSelectedRouteForLiquidation(routeId);
    setActiveTab('corte');
  };

  // If no employee/role is logged in, show the clean Role Selector
  if (!currentEmployee) {
    return (
      <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 antialiased">
        <RoleSelector onSelectRole={handleSelectRole} />
        <OfflineIndicator />
        <ManualModal
          isOpen={isManualOpen}
          onClose={() => setIsManualOpen(false)}
        />
      </main>
    );
  }

  const role: Role = currentEmployee.role;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 flex flex-col antialiased text-slate-900 pb-16 md:pb-0">
      {/* Cabecera Institucional Unificada */}
      <Header
        currentEmployee={currentEmployee}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        onOpenManual={() => setIsManualOpen(true)}
      />

      {/* Main Workspace with Desktop Sidebar & Mobile Bottom Nav */}
      <div className="flex-1 flex w-full max-w-full overflow-x-hidden">
        {/* Menú Lateral Desplegable en Escritorio */}
        <Sidebar
          role={role}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          currentEmployee={currentEmployee}
          onLogout={handleLogout}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          {/* Repartidor / Chofer Modules */}
          {role !== 'admin' && (
            <>
              {activeTab === 'pos' && (
                <ExpressPOS currentEmployee={currentEmployee} />
              )}
              {activeTab === 'mis_ventas' && (
                <MySales currentEmployee={currentEmployee} />
              )}
              {activeTab === 'checador' && (
                <ClockInOut currentEmployee={currentEmployee} />
              )}
            </>
          )}

          {/* Patrón / Administrador Modules */}
          {role === 'admin' && (
            <>
              {activeTab === 'monitoreo' && (
                <LiveMonitoring
                  onSelectLiquidateDriver={handleSelectLiquidateFromMonitoring}
                />
              )}
              {activeTab === 'corte' && (
                <CashCutReport
                  currentEmployee={currentEmployee}
                  selectedRouteId={selectedRouteForLiquidation}
                />
              )}
              {activeTab === 'envases' && <BottleBalanceReport />}
              {activeTab === 'corte_general' && (
                <DailyFleetCut currentEmployee={currentEmployee} />
              )}
              {activeTab === 'catalogo' && <CatalogAndStaff />}
              {activeTab === 'historial' && <SalesHistory />}
              {activeTab === 'pos' && (
                <ExpressPOS currentEmployee={currentEmployee} />
              )}
              {activeTab === 'checador' && (
                <ClockInOut currentEmployee={currentEmployee} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Navegación Móvil y Tablet (Bottom Bar) */}
      <BottomNav
        role={role}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <OfflineIndicator />
      <ManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        defaultRole={role}
      />
    </div>
  );
}
