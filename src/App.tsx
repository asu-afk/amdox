/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Lock, 
  LayoutDashboard, 
  DollarSign, 
  Warehouse, 
  Users, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Terminal, 
  LogOut,
  Bell,
  RefreshCw,
  Clock,
  ArrowUpRight
} from 'lucide-react';

// Import our custom modules
import MarketingPortal from './components/MarketingPortal';
import SSOAuthentic from './components/SSOAuthentic';
import DeveloperCenter from './components/DeveloperCenter';
import BiWorkbenches from './components/BiWorkbenches';
import FinancialLedgerCtrl from './components/FinancialLedgerCtrl';
import HrPayrollWorkspace from './components/HrPayrollWorkspace';
import ScmInventoryCtrl from './components/ScmInventoryCtrl';
import ProjectTrackerWorkspace from './components/ProjectTrackerWorkspace';
import SystemAuditCompliance from './components/SystemAuditCompliance';
import ThreeDRobot from './components/ThreeDRobot';
import OnboardingGuide from './components/OnboardingGuide';

import TopBar from './components/TopBar';
import { Transaction, InventoryItem, LogisticsShipment, AIPrediction, ERPDataState } from './types';

export default function App() {
  const userEmail = "swainaasutosh@gmail.com";

  // Navigation views: 'marketing' | 'sso' | 'cockpit'
  const [viewMode, setViewMode] = useState<'marketing' | 'sso' | 'cockpit'>('marketing');
  
  // Multi-tab cockpit view management & interactive onboarding guide
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Cockpit active modules
  type CockpitModule = 'analytics' | 'finance' | 'scm' | 'hr' | 'project' | 'compliance' | 'specs';
  const [activeModule, setActiveModule] = useState<CockpitModule>('analytics');

  // Activate onboarding guide automatically for first-time users on login
  useEffect(() => {
    if (viewMode === 'cockpit') {
      const hasOnboarded = localStorage.getItem('amdox_onboarded_guide_completed');
      if (!hasOnboarded) {
        setShowGuide(true);
      }
    }
  }, [viewMode]);

  // Core state from express backend
  const [erpData, setErpData] = useState<ERPDataState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Notifications alerts toast state
  const [notifications, setNotifications] = useState<Array<{ id: string, text: string, type: 'info' | 'warning' | 'error' }>>([
    { id: 'notif-1', text: "Low Stock Trigger: MCU-V5-AMDX microcontroller reserves are critically below compliance safety margins.", type: 'error' },
    { id: 'notif-2', text: "Transatlantic Delay Resolved: Shipment SH-48922 ETA adjusted.", type: 'info' }
  ]);

  // Employee modal states
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState<boolean>(false);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    role: '',
    department: 'Engineering' as 'Operations' | 'Finance' | 'Engineering' | 'Logistics' | 'Sales' | 'HR',
    email: '',
    salary: '',
    status: 'active' as 'active' | 'leave' | 'pending'
  });
  const [empSubmitting, setEmpSubmitting] = useState<boolean>(false);
  const [empError, setEmpError] = useState<string | null>(null);

  // Fetch full live state from local sandbox
  const fetchState = async (showRefresher = false) => {
    if (showRefresher) setRefreshing(true);
    try {
      const res = await fetch('/api/erp/state');
      if (!res.ok) throw new Error('ERP endpoint integrity validation failed');
      const data = await res.json();
      setErpData(data);
    } catch (err) {
      console.error('Failed to sync ERP state:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchState();

    const handleRefresh = () => {
      fetchState(true);
    };
    window.addEventListener('refresh-erp', handleRefresh);
    return () => {
      window.removeEventListener('refresh-erp', handleRefresh);
    };
  }, []);

  // Post new ledger transactions manually (F-02)
  const handleAddTransaction = async (tx: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/erp/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx)
      });
      if (!res.ok) throw new Error('Transaction rejected by database parity validators');
      const payload = await res.json();
      if (payload.success) {
        setNotifications(prev => [
          { id: String(Date.now()), text: `Journal Post Recorded: ${tx.account} [Value $${tx.amount.toLocaleString()}]`, type: 'info' },
          ...prev
        ]);
        await fetchState();
        return true;
      }
      return false;
    } catch (err) {
      console.error('GL Dispatch failed:', err);
      return false;
    }
  };

  // Modify ledger transaction verification states (F-02 / F-04)
  const handleUpdateTxStatus = async (txId: string, status: 'cleared' | 'pending' | 'flagged') => {
    try {
      const res = await fetch('/api/erp/transaction/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: txId, status })
      });
      if (!res.ok) throw new Error('Database status threshold error');
      const payload = await res.json();
      if (payload.success) {
        setNotifications(prev => [
          { id: String(Date.now()), text: `Audit state lock altered: Ledger ${txId} flagged compliance cleared.`, type: 'info' },
          ...prev
        ]);
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger SCM reorder restock PO (F-05)
  const handleTriggerReorder = async (sku: string, qty: number): Promise<boolean> => {
    try {
      const res = await fetch('/api/erp/inventory/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, orderQty: qty })
      });
      if (!res.ok) throw new Error('Procurement API reorder dispatch rejected');
      const payload = await res.json();
      if (payload.success) {
        setNotifications(prev => [
          { id: String(Date.now()), text: `Emergency PO Dispatched [SKU ${sku}]: Added +${qty} raw materials units to schedule.`, type: 'info' },
          ...prev
        ]);
        await fetchState();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Dispatch Logistics Freights expedition adjustments
  const handleExpediteShipment = async (shipId: string): Promise<any> => {
    try {
      const res = await fetch('/api/erp/shipment/expedite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: shipId })
      });
      if (!res.ok) throw new Error('Expedite dispatch threshold failed');
      const payload = await res.json();
      if (payload.success) {
        setNotifications(prev => [
          { id: String(Date.now()), text: `Transit Expedition Approved: Shipment ${shipId} flagged High-priority delivery.`, type: 'info' },
          ...prev
        ]);
        await fetchState();
        return payload.shipment;
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Employee lifecycle registration directly (F-04)
  const handleAddEmployee = async (emp: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/erp/hr/employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emp)
      });
      if (!res.ok) throw new Error('HR onboarding threshold rejection');
      const payload = await res.json();
      if (payload.success) {
        setNotifications(prev => [
          { id: String(Date.now()), text: `Architect Onboarded: [${payload.employee.id}] ${emp.name} registered and synced.`, type: 'info' },
          ...prev
        ]);
        await fetchState();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleUpdateEmployeeStatus = async (empId: string, status: 'active' | 'leave' | 'pending') => {
    try {
      const res = await fetch('/api/erp/hr/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: empId, status })
      });
      if (!res.ok) throw new Error('Status assignment failed');
      const payload = await res.json();
      if (payload.success) {
        setNotifications(prev => [
          { id: String(Date.now()), text: `HR Status Updated: [${empId}] set to ${status.toUpperCase()}`, type: 'info' },
          ...prev
        ]);
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Onboard Employee modal form submit
  const handleFormCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeForm.name || !employeeForm.role || !employeeForm.email || !employeeForm.salary) {
      setEmpError("Please fill out all credentials cells.");
      return;
    }
    setEmpSubmitting(true);
    setEmpError(null);
    const success = await handleAddEmployee({
      ...employeeForm,
      salary: parseFloat(employeeForm.salary)
    });
    setEmpSubmitting(false);

    if (success) {
      setEmployeeForm({
        name: '',
        role: '',
        department: 'Engineering',
        email: '',
        salary: '',
        status: 'active'
      });
      setShowAddEmployeeModal(false);
    } else {
      setEmpError("Intercompany database sync failed during architect onboarding.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center text-text-primary gap-4">
        <div className="w-14 h-14 border-4 border-t-brand-primary border-r-[#00d4aa] border-brand-outline rounded-full animate-spin" />
        <div className="text-center font-mono text-xs">
          <h2 className="font-sans font-bold text-sm tracking-widest text-white uppercase select-none">AMDOX CORE COCKPIT</h2>
          <p className="text-[10px] text-[#7c8099] mt-1">Reconciling ledger hashes, initiating OIDC integrations...</p>
        </div>
      </div>
    );
  }

  // Deconstruct balance totals safely
  const { totalAssets, cashOnHand, accountsReceivable, inventoryValue } = erpData?.balanceSheet || {
    totalAssets: 4890000,
    cashOnHand: 2450000,
    accountsReceivable: 1240000,
    inventoryValue: 1200000
  };

  const predictions = erpData?.predictions || [];
  const transactions = erpData?.transactions || [];
  const inventory = erpData?.inventory || [];
  const shipments = erpData?.shipments || [];
  const employees = erpData?.employees || [];

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary font-sans">
      
      {/* 1. PUBLIC MARKETING HOMEPAGE PORTAL VIEW */}
      {viewMode === 'marketing' && (
        <MarketingPortal onEnterSSO={() => setViewMode('sso')} userEmail={userEmail} />
      )}

      {/* 2. AUTHENTICATION SSO SAML GATED LOGIN VIEW */}
      {viewMode === 'sso' && (
        <SSOAuthentic 
          onLoginSuccess={() => setViewMode('cockpit')} 
          userEmail={userEmail}
        />
      )}

      {/* 3. MULTI-TAB COCKPIT ENTERPRISE WORKSPACE */}
      {viewMode === 'cockpit' && (
        <div className="pt-[56px] pl-0 lg:pl-56 select-none">
          
          {/* Dynamic Top Administrative Info Bar */}
          <TopBar 
            userEmail={userEmail} 
            totalAssets={totalAssets} 
            onOpenGuide={() => setShowGuide(true)}
          />

          {/* Interactive Onboarding Quick Guide */}
          <OnboardingGuide
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            isOpen={showGuide}
            onClose={() => {
              setShowGuide(false);
              localStorage.setItem('amdox_onboarded_guide_completed', 'true');
            }}
          />

          {/* SIDERADIAL MODULES SELECTOR PANEL */}
          <aside className="fixed bottom-0 top-[56px] left-0 w-full lg:w-56 bg-[#090b11] border-t lg:border-t-0 lg:border-r border-brand-outline/80 flex flex-row lg:flex-col justify-around lg:justify-start items-stretch py-2 lg:py-5 px-3 z-40">
            
            <div className="hidden lg:block px-4 mb-4 select-none">
              <p className="text-[9px] font-mono tracking-widest text-[#7c8099] uppercase select-none">Suite Divisions</p>
            </div>

            <nav className="flex flex-row lg:flex-col gap-1 w-full justify-around lg:justify-start">
              
              <button 
                onClick={() => setActiveModule('analytics')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-[11px] font-mono font-bold transition-all w-full text-left cursor-pointer ${
                  activeModule === 'analytics' 
                    ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,106,255,0.25)]' 
                    : 'text-text-secondary hover:text-white hover:bg-surf-card/30'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline uppercase">BI Workbenches</span>
              </button>

              <button 
                onClick={() => setActiveModule('finance')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-[11px] font-mono font-bold transition-all w-full text-left cursor-pointer ${
                  activeModule === 'finance' 
                    ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,106,255,0.25)]' 
                    : 'text-text-secondary hover:text-white hover:bg-surf-card/30'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline uppercase">Double GL Ledger</span>
              </button>

              <button 
                onClick={() => setActiveModule('scm')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-[11px] font-mono font-bold transition-all w-full text-left cursor-pointer ${
                  activeModule === 'scm' 
                    ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,106,255,0.25)]' 
                    : 'text-text-secondary hover:text-white hover:bg-surf-card/30'
                }`}
              >
                <Warehouse className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline uppercase">Supply SKU Chain</span>
              </button>

              <button 
                onClick={() => setActiveModule('hr')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-[11px] font-mono font-bold transition-all w-full text-left cursor-pointer ${
                  activeModule === 'hr' 
                    ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,106,255,0.25)]' 
                    : 'text-text-secondary hover:text-white hover:bg-surf-card/30'
                }`}
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline uppercase">Hr & 10k Payroll</span>
              </button>

              <button 
                onClick={() => setActiveModule('project')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-[11px] font-mono font-bold transition-all w-full text-left cursor-pointer ${
                  activeModule === 'project' 
                    ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,106,255,0.25)]' 
                    : 'text-text-secondary hover:text-white hover:bg-surf-card/30'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline uppercase">Gantt Milestones</span>
              </button>

              <button 
                onClick={() => setActiveModule('compliance')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-[11px] font-mono font-bold transition-all w-full text-left cursor-pointer ${
                  activeModule === 'compliance' 
                    ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,106,255,0.25)]' 
                    : 'text-text-secondary hover:text-white hover:bg-surf-card/30'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline uppercase">Audit (F-09)</span>
              </button>

              <button 
                onClick={() => setActiveModule('specs')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-[11px] font-mono font-bold transition-all w-full text-left cursor-pointer ${
                  activeModule === 'specs' 
                    ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,106,255,0.25)]' 
                    : 'text-text-secondary hover:text-white hover:bg-surf-card/30'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline uppercase">OpenAPI Gateway</span>
              </button>

            </nav>

            <div className="hidden lg:block mt-auto border-t border-brand-outline/40 pt-4 px-3 select-none">
              <button
                type="button"
                onClick={() => {
                  setViewMode('marketing');
                }}
                className="w-full flex items-center gap-2 text-stone-400 hover:text-white text-[11px] font-mono font-bold uppercase transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock Session</span>
              </button>
            </div>
          </aside>

          {/* ACTIVE CONTENT VIEW */}
          <main className="p-4 lg:p-6 pb-24 max-w-[1600px] mx-auto space-y-6">
            
            {/* Real-time Notifications Toast Bar */}
            <div className="space-y-2">
              {notifications.slice(0, 1).map((notif) => (
                <div key={notif.id} className="p-3 bg-surf-lowest border-l-4 border-brand-primary rounded-r-lg flex justify-between items-center text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-primary font-bold">[NOTIF]</span>
                    <span className="text-text-secondary">{notif.text}</span>
                  </div>
                  <button 
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                    className="text-text-secondary hover:text-white uppercase font-bold text-[10px]"
                  >
                    Mute
                  </button>
                </div>
              ))}
            </div>

            {/* RENDER THE CORRESPONDING ERP DIVISION WORKSPACE */}
            {activeModule === 'analytics' && (
              <BiWorkbenches 
                predictions={predictions} 
                transactions={transactions} 
                inventory={inventory}
                shipments={shipments}
                userEmail={userEmail}
              />
            )}

            {activeModule === 'finance' && (
              <FinancialLedgerCtrl 
                transactions={transactions}
                totalAssets={totalAssets}
                cashOnHand={cashOnHand}
                accountsReceivable={accountsReceivable}
                inventoryValue={inventoryValue}
                onAddTransaction={handleAddTransaction}
                onUpdateTxStatus={handleUpdateTxStatus}
              />
            )}

            {activeModule === 'scm' && (
              <ScmInventoryCtrl 
                inventory={inventory}
                shipments={shipments}
                onTriggerReorder={handleTriggerReorder}
                onExpediteShipment={handleExpediteShipment}
              />
            )}

            {activeModule === 'hr' && (
              <HrPayrollWorkspace 
                employees={employees}
                transactions={transactions}
                onAddEmployee={handleAddEmployee}
                onUpdateEmployeeStatus={handleUpdateEmployeeStatus}
                onUpdateTxStatus={handleUpdateTxStatus}
                showAddEmployeeModal={showAddEmployeeModal}
                setShowAddEmployeeModal={setShowAddEmployeeModal}
                employeeForm={employeeForm}
                setEmployeeForm={setEmployeeForm}
                handleCreateEmployee={handleFormCreateEmployee}
                empSubmitting={empSubmitting}
                empError={empError}
                setEmpError={setEmpError}
              />
            )}

            {activeModule === 'project' && (
              <ProjectTrackerWorkspace employees={employees} />
            )}

            {activeModule === 'compliance' && (
              <SystemAuditCompliance />
            )}

            {activeModule === 'specs' && (
              <DeveloperCenter />
            )}

          </main>

        </div>
      )}

      {/* Global Onboard Employee Modal panel (F-04) */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-[#000]/80 flex items-center justify-center z-50 p-4 font-mono text-xs">
          <div className="bg-surf-card border border-brand-outline rounded-2xl max-w-md w-full p-6 space-y-4 animate-fade-in">
            <div className="border-b border-brand-outline/40 pb-2 flex justify-between items-center">
              <h3 className="font-bold text-white uppercase text-xs">Register Corporate Candidate</h3>
              <button 
                type="button"
                onClick={() => setShowAddEmployeeModal(false)}
                className="text-[#7c8099] hover:text-white uppercase font-bold"
              >
                Close
              </button>
            </div>

            {empError && <p className="text-rose-400 font-bold bg-rose-500/10 p-2 border border-rose-500/20 rounded">{empError}</p>}

            <form onSubmit={handleFormCreateEmployee} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-[#7c8099] font-bold">Full Name:</label>
                <input 
                  type="text" 
                  placeholder="e.g. Liam Sterling"
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full bg-[#0c0d14] text-white border border-brand-outline rounded py-1.5 px-3"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-[#7c8099] font-bold">Email Address:</label>
                <input 
                  type="email" 
                  placeholder="name@amdox.com"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full bg-[#0c0d14] text-white border border-brand-outline rounded py-1.5 px-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-[#7c8099] font-bold">Role Title:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Principal Architect"
                    value={employeeForm.role}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, role: e.target.value }))}
                    required
                    className="w-full bg-[#0c0d14] text-white border border-brand-outline rounded py-1.5 px-3"
                  />
                </div>

                <div className="space-y-1 font-mono">
                  <label className="text-[10px] uppercase text-[#7c8099] font-bold">Target Division:</label>
                  <select 
                    value={employeeForm.department}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, department: e.target.value as any }))}
                    className="w-full bg-[#0c0d14] text-white border border-brand-outline rounded py-1.5 px-2.5 cursor-pointer font-bold"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-[#7c8099] font-bold">Target Salary ($/mo):</label>
                  <input 
                    type="number" 
                    placeholder="7500"
                    value={employeeForm.salary}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, salary: e.target.value }))}
                    required
                    className="w-full bg-[#0c0d14] text-white border border-brand-outline rounded py-1.5 px-3"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-[#7c8099] font-bold">Credentials Status:</label>
                  <select 
                    value={employeeForm.status}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-[#0c0d14] text-white border border-brand-outline rounded py-1.5 px-2.5 cursor-pointer font-bold"
                  >
                    <option value="active">Active</option>
                    <option value="leave">On Leave</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={empSubmitting}
                className="w-full py-2 bg-brand-primary text-white font-bold uppercase rounded shadow-[0_0_12px_rgba(124,106,255,0.3)] cursor-pointer"
              >
                {empSubmitting ? 'Syncing registration...' : 'Onboard Employee'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Interactive 3D Robo Assistant */}
      <ThreeDRobot userEmail={userEmail} />

    </div>
  );
}
