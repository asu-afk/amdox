/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Layers, 
  TrendingUp, 
  Truck, 
  Sparkles, 
  Plus, 
  Search, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Send, 
  Database, 
  Sliders, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Info,
  DollarSign,
  Package,
  Users,
  UserPlus
} from 'lucide-react';
import TopBar from './components/TopBar';
import { Transaction, InventoryItem, LogisticsShipment, AIPrediction, ERPDataState } from './types';

export default function App() {
  // Developer metadata from AI Studio env
  const userEmail = "swainaasutosh@gmail.com";

  // System states
  const [erpData, setErpData] = useState<ERPDataState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ledger' | 'logistics' | 'forecaster' | 'assets' | 'hr'>('ledger');

  // Filter & search states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Dynamic state for creating transaction
  const [showAddTxModal, setShowAddTxModal] = useState<boolean>(false);
  const [txForm, setTxForm] = useState({
    account: '',
    type: 'debit' as 'debit' | 'credit',
    amount: '',
    description: '',
    department: 'Engineering' as 'Operations' | 'Finance' | 'Engineering' | 'Logistics' | 'Sales' | 'HR',
    status: 'cleared' as 'cleared' | 'pending' | 'flagged'
  });
  const [txSubmitting, setTxSubmitting] = useState<boolean>(false);
  const [txError, setTxError] = useState<string | null>(null);

  // Dynamic state for creating shipment
  const [showAddShipmentModal, setShowAddShipmentModal] = useState<boolean>(false);
  const [shipmentForm, setShipmentForm] = useState({
    origin: '',
    destination: '',
    carrier: '',
    cargoValue: '',
    eta: '',
    temperatureControlled: false
  });
  const [shipmentSubmitting, setShipmentSubmitting] = useState<boolean>(false);
  const [shipmentError, setShipmentError] = useState<string | null>(null);

  // Dynamic state for adding employee
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

  // AI query & interactive insights cockpit states
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>(
    `### AI COCKPIT: STANDBY MODE
Select an automated orchestration play below or enter a customized system query to evaluate capital projections and material bottlenecks.`
  );
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Scenario Simulator variables (reactive interactive panel)
  const [simulationGrowth, setSimulationGrowth] = useState<number>(15); // % simulated positive sales growth
  const [simulationLogisticsStrain, setSimulationLogisticsStrain] = useState<number>(35); // % simulated transport latency strain
  const [simulationRawMaterialCost, setSimulationRawMaterialCost] = useState<number>(0); // % raw price surcharge

  // Alerts box
  const [recentNotifications, setRecentNotifications] = useState<Array<{id: string, text: string, type: 'error' | 'warning' | 'info'}>>([
    { id: '1', text: "Low Stock Alert: Micro-Controller Core V5 is below safety limit (450/1200)", type: 'error' },
    { id: '2', text: "Delay Detected: Transatlantic shipment SH-48922 via FedEx holds a current disruption risk", type: 'warning' },
    { id: '3', text: "Ledger Update: Accounts receivable pending balance evaluated at $125,000", type: 'info' }
  ]);

  // Fetch complete ERP state from backend sandbox
  const fetchState = async (showRefresher = false) => {
    if (showRefresher) setRefreshing(true);
    try {
      const res = await fetch('/api/erp/state');
      if (!res.ok) throw new Error('API communication threshold compromised');
      const data = await res.json();
      setErpData(data);
    } catch (err) {
      console.error('Ledger extraction error: ', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Submit transaction payload to backend
  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.account || !txForm.amount) {
      setTxError("Critical ledger markers must not be left void.");
      return;
    }
    setTxSubmitting(true);
    setTxError(null);
    try {
      const res = await fetch('/api/erp/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...txForm,
          amount: parseFloat(txForm.amount)
        })
      });
      if (!res.ok) throw new Error('Failed to insert ledger record securely');
      const payload = await res.json();
      if (payload.success) {
        // Play notification
        const newNotif = {
          id: String(Date.now()),
          text: `Ledger entry logged: ${txForm.account} [+$${parseFloat(txForm.amount).toLocaleString()}]`,
          type: 'info' as const
        };
        setRecentNotifications(prev => [newNotif, ...prev]);

        // Reset state
        setTxForm({
          account: '',
          type: 'debit',
          amount: '',
          description: '',
          department: 'Engineering',
          status: 'cleared'
        });
        setShowAddTxModal(false);
        // Refresh local cash balance
        fetchState();
      }
    } catch (err: any) {
      setTxError(err.message || 'Ledger integration failure detected');
    } finally {
      setTxSubmitting(false);
    }
  };

  // Restock action trigger
  const handleRestock = async (sku: string, orderStock: number) => {
    try {
      const res = await fetch('/api/erp/inventory/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, orderQty: orderStock })
      });
      if (!res.ok) throw new Error('Failed to post procurement batch to warehouse network');
      const payload = await res.json();
      if (payload.success) {
        // Pre-add a notification log
        const newLog = {
          id: String(Date.now()),
          text: `Logistics alert resolved: Restock order of +${orderStock} units completed for SKU ${sku}`,
          type: 'info' as const
        };
        setRecentNotifications(prev => [newLog, ...prev.filter(n => !n.text.includes(sku))]);
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Ledger transaction status instantly
  const handleUpdateTxStatus = async (txId: string, status: 'cleared' | 'pending' | 'flagged') => {
    try {
      const res = await fetch('/api/erp/transaction/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: txId, status })
      });
      if (!res.ok) throw new Error('Security threshold check failed on ledger status');
      const payload = await res.json();
      if (payload.success) {
        const updated = payload.transaction;
        const newNotif = {
          id: String(Date.now()),
          text: `Ledger Audit State Updated: [${updated.id}] ${updated.account} is now ${status.toUpperCase()}`,
          type: (status === 'flagged' ? 'error' : status === 'pending' ? 'warning' : 'info') as 'error' | 'warning' | 'info'
        };
        setRecentNotifications(prev => [newNotif, ...prev]);
        fetchState();
      }
    } catch (err: any) {
      console.error('Ledger status sync failure:', err);
    }
  };

  // Expedite shipment progress
  const handleExpediteShipment = async (shipId: string) => {
    try {
      const res = await fetch('/api/erp/shipment/expedite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: shipId })
      });
      if (!res.ok) throw new Error('Transit validation token invalid');
      const payload = await res.json();
      if (payload.success) {
        const updated = payload.shipment;
        const newNotif = {
          id: String(Date.now()),
          text: `Logistics Dispatch: Freight ${updated.id} expedited. Progress currently at ${updated.progress}% [Status: ${updated.status}]`,
          type: 'info' as const
        };
        setRecentNotifications(prev => [newNotif, ...prev]);
        fetchState();
      }
    } catch (err: any) {
      console.error('Freight expedition command failed:', err);
    }
  };

  // Dispatch new shipment
  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipmentForm.origin || !shipmentForm.destination || !shipmentForm.carrier || !shipmentForm.cargoValue || !shipmentForm.eta) {
      setShipmentError("All freight operational fields must be registered.");
      return;
    }
    setShipmentSubmitting(true);
    setShipmentError(null);
    try {
      const res = await fetch('/api/erp/shipment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...shipmentForm,
          cargoValue: parseFloat(shipmentForm.cargoValue)
        })
      });
      if (!res.ok) throw new Error('Customs rejection on dynamic freight creation');
      const payload = await res.json();
      if (payload.success) {
        const newNotif = {
          id: String(Date.now()),
          text: `New cargo route dispatched: ${shipmentForm.origin} to ${shipmentForm.destination} via ${shipmentForm.carrier} [Val: $${parseFloat(shipmentForm.cargoValue).toLocaleString()}]`,
          type: 'info' as const
        };
        setRecentNotifications(prev => [newNotif, ...prev]);
        setShipmentForm({
          origin: '',
          destination: '',
          carrier: '',
          cargoValue: '',
          eta: '',
          temperatureControlled: false
        });
        setShowAddShipmentModal(false);
        fetchState();
      }
    } catch (err: any) {
      setShipmentError(err.message || 'Logistics database connection failed');
    } finally {
      setShipmentSubmitting(false);
    }
  };

  // Onboard new candidate to HR Directory
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeForm.name || !employeeForm.role || !employeeForm.email || !employeeForm.salary) {
      setEmpError("Please fill out all employee onboarding details.");
      return;
    }
    setEmpSubmitting(true);
    setEmpError(null);
    try {
      const res = await fetch('/api/erp/hr/employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...employeeForm,
          salary: parseFloat(employeeForm.salary)
        })
      });
      if (!res.ok) throw new Error('Onboarding failed on server criteria');
      const payload = await res.json();
      if (payload.success) {
        const newNotif = {
          id: String(Date.now()),
          text: `Talent Onboarded: [${payload.employee.id}] ${employeeForm.name} registered as ${employeeForm.role}`,
          type: 'info' as const
        };
        setRecentNotifications(prev => [newNotif, ...prev]);
        setEmployeeForm({
          name: '',
          role: '',
          department: 'Engineering',
          email: '',
          salary: '',
          status: 'active'
        });
        setShowAddEmployeeModal(false);
        fetchState();
      }
    } catch (err: any) {
      setEmpError(err.message || 'Onboarding system failure');
    } finally {
      setEmpSubmitting(false);
    }
  };

  // Update employee active status
  const handleUpdateEmployeeStatus = async (empId: string, status: 'active' | 'leave' | 'pending') => {
    try {
      const res = await fetch('/api/erp/hr/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: empId, status })
      });
      if (!res.ok) throw new Error('Database rejection on status adjustment');
      const payload = await res.json();
      if (payload.success) {
        const newNotif = {
          id: String(Date.now()),
          text: `HR Update: [${empId}] status modified to ${status.toUpperCase()}`,
          type: 'info' as const
        };
        setRecentNotifications(prev => [newNotif, ...prev]);
        fetchState();
      }
    } catch (err: any) {
      console.error('Failed to change employee status:', err);
    }
  };

  // Submit query focus to Gemini server-side orchestrator
  const queryAICockpit = async (promptOverride?: string) => {
    const activePrompt = promptOverride || aiQuery;
    if (!activePrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/erp/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: activePrompt })
      });
      if (!res.ok) throw new Error('Predictive AI channel compromised');
      const payload = await res.json();
      if (payload.success) {
        setAiResponse(payload.insight);
      }
    } catch (err: any) {
      setAiResponse(`### AI COCKPIT ERROR\nConnection error: ${err.message || 'System failed to negotiate payload analysis.'}`);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center text-text-primary gap-4">
        <div className="w-16 h-16 border-4 border-t-brand-primary border-r-brand-secondary border-brand-outline rounded-full animate-spin" />
        <div className="text-center">
          <h2 className="font-sans font-bold text-lg tracking-wider text-white">AMDOX ENTERPRISE LEDGER</h2>
          <p className="text-xs text-text-secondary font-mono mt-1">Acquiring synchronized state tunnels, verifying telemetry cryptographic keys...</p>
        </div>
      </div>
    );
  }

  const { totalAssets, cashOnHand, accountsReceivable, inventoryValue } = erpData?.balanceSheet || {
    totalAssets: 0,
    cashOnHand: 0,
    accountsReceivable: 0,
    inventoryValue: 0
  };

  // Filter transactions based on active UI selections
  const filteredTransactions = (erpData?.transactions || []).filter(tx => {
    const matchesSearch = tx.account.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'all' || tx.department === filterDept;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary font-sans pt-[56px] pl-0 md:pl-52">
      {/* Dynamic Top Header */}
      <TopBar userEmail={userEmail} totalAssets={totalAssets} />

      {/* FIXED SIDE NAVIGATION BAR */}
      <aside className="fixed bottom-0 top-[56px] left-0 w-full md:w-52 bg-surf-lowest border-t md:border-t-0 md:border-r border-brand-outline flex flex-row md:flex-col justify-around md:justify-start items-center md:items-stretch py-2 md:py-6 px-3 z-40">
        
        {/* Navigation Section title */}
        <div className="hidden md:block px-4 mb-4">
          <p className="text-[10px] font-mono tracking-widest text-text-secondary uppercase select-none">COCKPIT DOMAINS</p>
        </div>

        {/* Navigation Buttons */}
        <nav className="flex flex-row md:flex-col gap-1 w-full justify-around md:justify-start">
          <button 
            id="nav-ledger-btn"
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-2.5 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'ledger' 
                ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,58,237,0.2)]' 
                : 'text-text-secondary hover:text-white hover:bg-surf-card/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Ledger Journal</span>
          </button>

          <button 
            id="nav-logistics-btn"
            onClick={() => setActiveTab('logistics')}
            className={`flex items-center gap-2.5 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'logistics' 
                ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,58,237,0.2)]' 
                : 'text-text-secondary hover:text-white hover:bg-surf-card/50'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span className="hidden sm:inline">Logistics & Supply</span>
          </button>

          <button 
            id="nav-forecast-btn"
            onClick={() => setActiveTab('forecaster')}
            className={`flex items-center gap-2.5 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'forecaster' 
                ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,58,237,0.2)]' 
                : 'text-text-secondary hover:text-white hover:bg-surf-card/50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">AI Oracle Forecast</span>
          </button>

          <button 
            id="nav-assets-btn"
            onClick={() => setActiveTab('assets')}
            className={`flex items-center gap-2.5 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'assets' 
                ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,58,237,0.2)]' 
                : 'text-text-secondary hover:text-white hover:bg-surf-card/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Balance Sheet</span>
          </button>

          <button 
            id="nav-hr-btn"
            onClick={() => setActiveTab('hr')}
            className={`flex items-center gap-2.5 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'hr' 
                ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,58,237,0.2)]' 
                : 'text-text-secondary hover:text-white hover:bg-surf-card/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Human Resources</span>
          </button>
        </nav>

        {/* Refresher and alerts section inside sidebar */}
        <div className="hidden md:flex flex-col mt-auto pt-6 border-t border-brand-outline gap-4 px-3 w-full">
          <button 
            onClick={() => fetchState(true)} 
            disabled={refreshing}
            className="flex items-center justify-center gap-2 py-1.5 text-[11px] font-mono font-semibold tracking-wider uppercase border border-brand-outline hover:border-brand-primary text-text-secondary hover:text-white rounded-lg transition-all bg-[#0d1c2d]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'SYNC LEDGER'}
          </button>

          <div className="bg-surf-card/30 rounded-lg p-2.5 text-[11px] border border-brand-outline">
            <span className="text-[10px] font-mono text-brand-secondary font-bold block mb-1">COCKPIT ADVISORY</span>
            <span className="text-text-secondary leading-snug">System-wide treasury lines operate under real-time cryptographic audit rules.</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER STREAM */}
      <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-12">
        
        {/* UPPER STATUS SUMMARY PANELS - Amdox KPI Cards with subtle bottom bars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Cash On Hand */}
          <div className="bg-surf-card rounded-xl p-5 border border-brand-outline relative overflow-hidden transition-all hover:bg-surf-high/60 group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono tracking-widest text-text-secondary uppercase">CASH RESERVES</span>
              <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold font-sans text-white tracking-tight">
              ${cashOnHand.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-[11px] text-text-secondary font-mono mt-1">94.5% immediately liquid</p>
            {/* KPI Progress bar on absolute bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 opacity-60" />
          </div>

          {/* Card 2: Receivables */}
          <div className="bg-surf-card rounded-xl p-5 border border-brand-outline relative overflow-hidden transition-all hover:bg-surf-high/60 group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono tracking-widest text-text-secondary uppercase">RECEIVABLES</span>
              <div className="p-1 rounded bg-brand-secondary/10 text-brand-secondary-dim">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold font-sans text-white tracking-tight">
              ${accountsReceivable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-[11px] text-text-secondary font-mono mt-1">${(125000).toLocaleString()} standard billing baseline</p>
            {/* KPI Progress bar on absolute bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-secondary opacity-60" />
          </div>

          {/* Card 3: Inventory Value */}
          <div className="bg-surf-card rounded-xl p-5 border border-brand-outline relative overflow-hidden transition-all hover:bg-surf-high/60 group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono tracking-widest text-text-secondary uppercase">INVENTORY VALUE</span>
              <div className="p-1 rounded bg-brand-primary-dim/10 text-brand-primary-dim">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold font-sans text-white tracking-tight">
              ${inventoryValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-[11px] text-text-secondary font-mono mt-1">Across 3 regional Giga-warehouses</p>
            {/* KPI Progress bar on absolute bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary opacity-60" />
          </div>

          {/* Card 4: Total Managed Strength */}
          <div className="bg-surf-card rounded-xl p-5 border border-brand-outline relative overflow-hidden transition-all hover:bg-surf-high/60 group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono tracking-widest text-text-secondary uppercase">METRIC ASSETS</span>
              <div className="p-1 rounded bg-amber-500/10 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold font-sans text-white tracking-tight">
              ${totalAssets.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-[11px] text-text-secondary font-mono mt-1">Enterprise Net Capital</p>
            {/* KPI Progress bar on absolute bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 opacity-60" />
          </div>
        </div>

        {/* NOTIFICATIONS & BULLETINS */}
        <div className="bg-surf-lowest p-3.5 rounded-xl border border-brand-outline flex items-center justify-between gap-4 overflow-hidden">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-primary select-none animate-ping" />
            <span className="text-xs font-mono font-extrabold uppercase text-brand-primary-dim tracking-widest select-none">SYSTEM BULLETINS:</span>
            <p className="text-xs text-text-primary truncate font-mono">
              {recentNotifications[0]?.text || "All system networks operating nominal. Cryptographic ledger intact."}
            </p>
          </div>
          <p className="hidden md:block text-[10px] text-text-secondary font-mono bg-surf-card px-2.5 py-1 rounded border border-brand-outline tracking-wider flex-shrink-0 select-none">
            {recentNotifications.length} Bulletins Logged
          </p>
        </div>

        {/* TAB CONTENTS - ROUTING ACCORDINGLY */}

        {/* TAB 1: LEDGER JOURNAL COCKPIT */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            
            {/* Search and filter controls panel */}
            <div className="bg-surf-card p-4 rounded-xl border border-brand-outline flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Left search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-text-secondary" />
                <input 
                  type="text" 
                  placeholder="Filter by invoice, account title, SKU code..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-2 pl-10 pr-4 text-xs font-mono text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                />
              </div>

              {/* Center filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-text-secondary uppercase mr-2 select-none">Dept:</label>
                  <select 
                    value={filterDept} 
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="bg-[#0d1c2d] border border-brand-outline text-text-primary text-xs font-mono py-1 px-3.5 rounded-lg focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="all">All Departments</option>
                    <option value="Finance">Finance</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-wider text-text-secondary uppercase mr-2 select-none">Clearing Status:</label>
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-[#0d1c2d] border border-brand-outline text-text-primary text-xs font-mono py-1 px-3.5 rounded-lg focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="cleared">Cleared</option>
                    <option value="pending">Pending</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
              </div>

              {/* Create Ledger entry button */}
              <button 
                id="open-add-tx-modal"
                onClick={() => setShowAddTxModal(true)}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-all shadow-[0_0_12px_rgba(124,58,237,0.3)] select-none cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Execute Capital Action</span>
              </button>
            </div>

            {/* TRANSACTION DATAGRID */}
            <div className="bg-surf-card rounded-xl border border-brand-outline overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-outline flex justify-between items-center bg-surf-card">
                <div>
                  <h2 className="text-sm font-semibold tracking-wider text-white uppercase font-mono">Secured ERP Journal</h2>
                  <p className="text-xs text-text-secondary font-mono mt-0.5">Showing {filteredTransactions.length} of {(erpData?.transactions || []).length} registered state modifications</p>
                </div>
                <div className="text-[11px] font-mono text-text-secondary bg-[#0d1c2d] py-1 px-3 rounded-md border border-brand-outline">
                  Live Audit State
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surf-lowest/40 border-b border-brand-outline">
                      <th className="py-3 px-5 text-[10px] font-mono tracking-widest text-[#4cd7f6] uppercase">Ledger ID</th>
                      <th className="py-3 px-5 text-[10px] font-mono tracking-widest text-text-secondary uppercase">Timestamp</th>
                      <th className="py-3 px-5 text-[10px] font-mono tracking-widest text-text-secondary uppercase">Account Context</th>
                      <th className="py-3 px-5 text-[10px] font-mono tracking-widest text-text-secondary uppercase">Center Dept</th>
                      <th className="py-3 px-5 text-[10px] font-mono tracking-widest text-text-secondary uppercase">Flow Direction</th>
                      <th className="py-3 px-5 text-[10px] font-mono tracking-widest text-text-secondary uppercase text-right">Aggregate Amount</th>
                      <th className="py-3 px-5 text-[10px] font-mono tracking-widest text-text-secondary uppercase text-center">Audit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(tx => (
                      <tr 
                        key={tx.id} 
                        className="border-b border-brand-outline/40 hover:bg-[#1c2b3c]/60 transition-all group"
                      >
                        <td className="py-3 px-5 font-mono text-xs font-semibold text-[#4cd7f6]">
                          {tx.id}
                        </td>
                        <td className="py-3 px-5 font-mono text-xs text-text-secondary">
                          {tx.date}
                        </td>
                        <td className="py-3 px-5">
                          <div className="font-semibold text-xs text-white tracking-wide">{tx.account}</div>
                          <div className="text-[11px] text-text-secondary truncate max-w-sm font-mono mt-0.5">{tx.description}</div>
                        </td>
                        <td className="py-3 px-5">
                          <span className="text-[11px] font-semibold font-mono tracking-wide px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary-dim border border-brand-primary/20">
                            {tx.department}
                          </span>
                        </td>
                        <td className="py-3 px-5">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold ${
                            tx.type === 'credit' ? 'text-brand-tertiary' : 'text-rose-400'
                          }`}>
                            {tx.type === 'credit' ? (
                              <>
                                <ArrowDownLeft className="w-3.5 h-3.5" /> Credit In
                              </>
                            ) : (
                              <>
                                <ArrowUpRight className="w-3.5 h-3.5" /> Debit Out
                              </>
                            )}
                          </span>
                        </td>
                        <td className={`py-3 px-5 text-right font-mono text-xs font-extrabold ${
                          tx.type === 'credit' ? 'text-brand-tertiary' : 'text-rose-400'
                        }`}>
                          {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                              tx.status === 'cleared' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                              tx.status === 'pending' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' :
                              'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                            }`} title={`Audit Status: ${tx.status}`} />
                            
                            <select
                              value={tx.status}
                              onChange={(e) => handleUpdateTxStatus(tx.id, e.target.value as any)}
                              className="bg-[#091424] text-[10px] text-text-secondary font-mono py-0.5 px-2.5 rounded border border-brand-outline hover:border-brand-primary hover:text-white cursor-pointer transition-all focus:outline-none focus:ring-1 focus:ring-brand-primary"
                            >
                              <option value="cleared">Cleared</option>
                              <option value="pending">Pending</option>
                              <option value="flagged">Flagged</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-text-secondary text-xs font-mono italic bg-surf-lowest/20">
                          Clear search markers. No ledger records mapped the current parameters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI COCKPIT DIRECT TELEMETRY WIDGET */}
            <div className="ai-glass-card rounded-xl p-6 relative overflow-hidden transition-all">
              <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
                <Sparkles className="w-32 h-32 text-brand-primary" />
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-brand-secondary-dim animate-pulse" />
                <span className="text-[11px] font-mono font-extrabold text-[#d2bbff] tracking-widest uppercase">AMDOX ENTERPRISE AI ORACLE</span>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2 tracking-tight">AI Cockpit Forecasting Inquiries</h2>
              <p className="text-xs text-text-secondary font-mono mb-6 max-w-2xl leading-relaxed">
                Connect dynamically with the Amdox prediction core to execute advanced cash flow evaluations or stockout risks against active operations ledger files.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left query submit form */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="relative">
                    <textarea 
                      placeholder="Input customized system queries (e.g. Determine current quarterly logistics strain risk vs cash buffers...)" 
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      rows={3}
                      className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-3 px-4 text-xs font-mono text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none"
                    />
                    <button 
                      onClick={() => queryAICockpit()}
                      disabled={aiLoading || !aiQuery.trim()}
                      className="absolute right-3.5 bottom-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-xs py-1.5 px-3 rounded-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:hover:bg-brand-primary"
                    >
                      {aiLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Synthesizing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Ask AI</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Built-in quick scenario query plays */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button 
                      onClick={() => {
                        setAiQuery("Synthesize general operational state, cash flow strength, and transatlantic delay bottlenecks.");
                        queryAICockpit("Synthesize general operational state, cash flow strength, and transatlantic delay bottlenecks.");
                      }}
                      className="text-[10px] font-mono bg-surf-lowest hover:bg-surf-high text-brand-secondary-dim border border-brand-outline hover:border-brand-secondary rounded px-2.5 py-1 transition-all"
                    >
                      ⚡ System-wide Health Status
                    </button>
                    <button 
                      onClick={() => {
                        setAiQuery("Assess direct cash holdings, pending accounts receivables, and liquidity safety thresholds.");
                        queryAICockpit("Assess direct cash holdings, pending accounts receivables, and liquidity safety thresholds.");
                      }}
                      className="text-[10px] font-mono bg-surf-lowest hover:bg-surf-high text-brand-secondary-dim border border-brand-outline hover:border-brand-secondary rounded px-2.5 py-1 transition-all"
                    >
                      ⚡ Treasury Liquidity Balance
                    </button>
                    <button 
                      onClick={() => {
                        setAiQuery("Inspect raw material inventory depots and identify high stock depletion alarm coordinates.");
                        queryAICockpit("Inspect raw material inventory depots and identify high stock depletion alarm coordinates.");
                      }}
                      className="text-[10px] font-mono bg-surf-lowest hover:bg-surf-high text-brand-secondary-dim border border-brand-outline hover:border-brand-secondary rounded px-2.5 py-1 transition-all"
                    >
                      ⚡ Logistics SKU Bottlenecks
                    </button>
                  </div>
                </div>

                {/* Right response telemetry board */}
                <div className="lg:col-span-4 bg-[#0d1c2d]/70 p-4 rounded-lg border border-brand-outline min-h-[170px] flex flex-col justify-between">
                  <div className="space-y-3 prose prose-invert max-w-none text-xs leading-relaxed text-text-primary font-mono max-h-[220px] overflow-y-auto pr-1">
                    {/* Render markdown style lines elegantly */}
                    {aiResponse.split('\n').map((line, idx) => {
                      if (line.startsWith('###')) {
                        return <h4 key={idx} className="text-white font-extrabold text-sm border-b border-brand-outline/50 pb-1 mt-3 mb-2">{line.replace('###', '')}</h4>;
                      }
                      if (line.startsWith('####')) {
                        return <h5 key={idx} className="text-brand-secondary-dim font-bold text-xs mt-3 mb-1">{line.replace('####', '')}</h5>;
                      }
                      if (line.startsWith('-')) {
                        return <div key={idx} className="flex items-start gap-1 pb-1 text-text-secondary"><span className="text-brand-primary mt-0.5">•</span><span>{line.substring(2)}</span></div>;
                      }
                      return <p key={idx} className="text-text-secondary">{line}</p>;
                    })}
                  </div>
                  <div className="border-t border-brand-outline/50 pt-2.5 mt-4 flex items-center justify-between text-[10px] font-mono text-text-muted">
                    <span>Target Sandbox API Channel</span>
                    <span className="text-brand-tertiary">Online</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SUPPLY & LOGISTICS COCKPIT */}
        {activeTab === 'logistics' && (
          <div className="space-y-6">
            
            {/* Top row: Inventory Grid + Active Shipments */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Warehouse Inventory Item Depot */}
              <div className="lg:col-span-7 bg-surf-card rounded-xl border border-brand-outline overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="px-5 py-4 border-b border-brand-outline bg-surf-card/30 flex justify-between items-center">
                    <div>
                      <h2 className="text-sm font-semibold tracking-wider text-white uppercase font-mono">Raw & Finished Material Stock Depots</h2>
                      <p className="text-xs text-text-secondary font-mono mt-0.5">Automated SKU safety tracking on 3 physical centers</p>
                    </div>
                    <span className="text-[10px] font-mono text-orange-400 bg-orange-400/10 border border-orange-400/20 py-0.5 px-2 rounded-full font-bold">
                      {(erpData?.inventory || []).filter(i => i.stockLevel < i.safetyStock).length} Depletion Alarms
                    </span>
                  </div>

                  <div className="divide-y divide-brand-outline/50">
                    {(erpData?.inventory || []).map(item => {
                      const percentage = Math.min(100, Math.round((item.stockLevel / item.safetyStock) * 100));
                      const isLow = item.stockLevel < item.safetyStock;
                      return (
                        <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surf-high/30 transition-all">
                          {/* Info section */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#4cd7f6]">{item.sku}</span>
                              <span className="text-xs font-semibold text-white">{item.name}</span>
                            </div>
                            <div className="text-[11px] text-text-secondary font-mono flex items-center gap-2 flex-wrap">
                              <span className="text-text-muted">{item.category}</span>
                              <span>•</span>
                              <span>{item.warehouse}</span>
                              <span>•</span>
                              <span className="text-brand-secondary-dim font-bold">${item.unitPrice.toFixed(2)}/unit</span>
                            </div>
                          </div>

                          {/* Gauge level bar section */}
                          <div className="flex items-center gap-4 w-full md:w-56 justify-between md:justify-end">
                            <div className="w-full max-w-[150px] space-y-1">
                              <div className="flex justify-between text-[11px] font-mono">
                                <span className={isLow ? "text-orange-400 font-bold" : "text-emerald-400"}>
                                  {item.stockLevel} / {item.safetyStock}
                                </span>
                                <span className="text-text-muted">{percentage}% limit</span>
                              </div>
                              <div className="w-full bg-[#122131] h-1.5 rounded-full overflow-hidden border border-brand-outline">
                                <div 
                                  className={`h-full rounded-full ${
                                    isLow ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                                  }`} 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>

                            {/* Intelligent procurement trigger button */}
                            <button 
                              onClick={() => handleRestock(item.sku, item.safetyStock - item.stockLevel + 500)}
                              className={`flex-shrink-0 flex items-center justify-center gap-1 text-[11px] font-mono font-bold py-1.5 px-3 rounded-lg transition-all ${
                                isLow 
                                  ? 'bg-amber-400 hover:bg-amber-300 text-stone-900 shadow-[0_0_8px_rgba(251,191,36,0.2)]'
                                  : 'border border-brand-outline hover:border-brand-primary text-text-secondary hover:text-white bg-[#0d1c2d]'
                              }`}
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>{isLow ? 'Procure' : 'Refill'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-surf-lowest/40 border-t border-brand-outline/80 text-[11px] text-text-secondary font-mono flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-brand-secondary-dim" />
                  <span>Restocking uses cash reserves capital and converts to inventory asset valuation instantly.</span>
                </div>
              </div>

              {/* Cargo Logistics Shipments Monitor */}
              <div className="lg:col-span-5 bg-surf-card rounded-xl border border-brand-outline overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="px-5 py-4 border-b border-brand-outline bg-surf-card/30 flex justify-between items-center">
                    <div>
                      <h2 className="text-sm font-semibold tracking-wider text-white uppercase font-mono">Freight Logistics Monitor</h2>
                      <p className="text-xs text-text-secondary font-mono mt-0.5">Real-time sea & air global corridors transit logs</p>
                    </div>
                    <button 
                      onClick={() => setShowAddShipmentModal(true)}
                      className="flex items-center gap-1 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-[11px] font-mono py-1 px-2.5 rounded-lg transition-all cursor-pointer shadow-[0_0_8px_rgba(124,58,237,0.3)]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Dispatch Line</span>
                    </button>
                  </div>

                  <div className="p-4 space-y-4">
                    {(erpData?.shipments || []).map(ship => (
                      <div key={ship.id} className="p-3 bg-[#0d1c2d]/70 rounded-lg border border-brand-outline space-y-2 hover:border-brand-primary/40 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-extrabold text-[#4cd7f6]">{ship.id}</span>
                              <span className="text-[11px] font-mono text-text-secondary">({ship.carrier})</span>
                            </div>
                            <p className="text-xs font-semibold text-white mt-1">
                              {ship.origin} <span className="text-text-muted font-mono">→</span> {ship.destination}
                            </p>
                          </div>

                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full select-none ${
                            ship.status === 'in-transit' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' :
                            ship.status === 'delayed' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/25 animate-pulse' :
                            'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          }`}>
                            {ship.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Cargo valuation & details */}
                        <div className="flex justify-between text-[11px] font-mono text-text-secondary pt-0.5 border-t border-brand-outline/30">
                          <span>Cargo Assets Val: <b className="text-white">${ship.cargoValue.toLocaleString()}</b></span>
                          <span>ETA: <b className="text-brand-secondary">{ship.eta}</b></span>
                        </div>

                        {/* Progress Bar indicator */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between items-center text-[10px] font-mono text-text-muted">
                            <span>Vessel Transit Progress</span>
                            <span>{ship.progress}% Complete</span>
                          </div>
                          
                          <div className="w-full bg-[#122131] h-1.5 rounded-full overflow-hidden border border-brand-outline/40">
                            <div 
                              className={`h-full rounded-full ${
                                ship.status === 'delayed' ? 'bg-rose-400' : 'bg-gradient-to-r from-brand-primary to-brand-secondary'
                              }`} 
                              style={{ width: `${ship.progress}%` }}
                            />
                          </div>

                          {ship.progress < 100 && (
                            <div className="flex justify-end pt-1">
                              <button 
                                onClick={() => handleExpediteShipment(ship.id)}
                                className="flex items-center gap-1 text-[9px] font-mono font-semibold tracking-wider uppercase text-brand-secondary-dim hover:text-white bg-[#0f2438] hover:bg-[#1a3854] border border-brand-outline hover:border-brand-secondary rounded px-2 py-1 transition-all cursor-pointer"
                              >
                                ⚡ Accelerate Corridor
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#0d1c2d]/40 border-t border-brand-outline/80">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-text-secondary">Tracked Cargo Asset Float Strength:</span>
                    <span className="text-white font-extrabold">
                      ${(erpData?.shipments || []).reduce((sum, s) => s.status !== 'cleared' ? sum + s.cargoValue : sum, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: AI SCENARIO PROJECTOR & CHARTS */}
        {activeTab === 'forecaster' && (
          <div className="space-y-6">
            
            {/* Top explanation */}
            <div className="bg-surf-card p-5 rounded-xl border border-brand-outline">
              <h2 className="text-md font-bold text-white mb-1 font-mono tracking-wide uppercase">Oracle Projection Sandbox Model</h2>
              <p className="text-xs text-text-secondary font-mono leading-relaxed max-w-3xl">
                Tweak live global macro stress factors on slider controls below. The interactive coordinates plot evaluates your synthetic ledger, adjusting predictive trends utilizing the Amdox simulation algorithm.
              </p>

              {/* STRESS CONTROLS SLIDERS CONTAINER */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 p-4 bg-[#0d1c2d]/70 rounded-lg border border-brand-outline">
                
                {/* Control 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono select-none">
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-brand-primary-dim" />
                      Client Sales Growth
                    </span>
                    <span className="text-brand-primary-dim">{simulationGrowth}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="-10" 
                    max="50" 
                    value={simulationGrowth}
                    onChange={(e) => setSimulationGrowth(parseInt(e.target.value))}
                    className="w-full accent-brand-primary cursor-pointer hover:accent-brand-primary-dim h-1.5 bg-surf-lowest rounded-lg border border-brand-outline"
                  />
                  <span className="text-[10px] text-text-muted font-mono block">Simulates quarterly inbound enterprise subscriptions.</span>
                </div>

                {/* Control 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono select-none">
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#00b5d3]" />
                      Logistics Transit Strain
                    </span>
                    <span className="text-[#00b5d3]">{simulationLogisticsStrain}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="90" 
                    value={simulationLogisticsStrain}
                    onChange={(e) => setSimulationLogisticsStrain(parseInt(e.target.value))}
                    className="w-full accent-[#00b5d3] cursor-pointer h-1.5 bg-surf-lowest rounded-lg border border-brand-outline"
                  />
                  <span className="text-[10px] text-text-muted font-mono block">Simulates route latency delays & customs bottlenecks.</span>
                </div>

                {/* Control 3 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono select-none">
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                      Raw Component Markup
                    </span>
                    <span className="text-emerald-400">{simulationRawMaterialCost}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="-20" 
                    max="50" 
                    value={simulationRawMaterialCost}
                    onChange={(e) => setSimulationRawMaterialCost(parseInt(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-surf-lowest rounded-lg border border-brand-outline"
                  />
                  <span className="text-[10px] text-text-muted font-mono block">Surcharge fluctuations on semiconductor silicon suppliers.</span>
                </div>

              </div>
            </div>

            {/* PREDICTIVE COORDINATES INTERACTIVE PLOT */}
            <div className="bg-surf-card p-6 rounded-xl border border-brand-outline space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-brand-outline/60 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Enterprise Revenue & Expense Trajectory (6-Month Out)</h3>
                  <p className="text-xs text-text-secondary font-mono mt-0.5">Continuous curves: Actual history. Dashed curves: AI model projections.</p>
                </div>

                {/* Chart Legends */}
                <div className="flex items-center gap-4 text-xs font-mono select-none flex-wrap">
                  <span className="flex items-center gap-1.5 text-white">
                    <span className="w-3 h-0.5 bg-brand-primary inline-block" /> Actuals
                  </span>
                  <span className="flex items-center gap-1.5 text-brand-secondary-dim">
                    <span className="w-3 h-0.5 border-t border-dashed border-[#00b5d3] inline-block" /> Forecast Trend
                  </span>
                </div>
              </div>

              {/* RENDER DYNAMIC SVG CHART WITH ADJUSTED DATA */}
              <div className="relative w-full overflow-x-auto">
                <div className="min-w-[650px] h-[300px]">
                  {/* Dynamic calculation of plotting coordinates based on simulated variables */}
                  {(() => {
                    const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
                    
                    // Historical actual revenue curves
                    const actualRevenues = [480000, 512000, 495000, 540000, 620000, 704200];
                    const actualExpenses = [320000, 345000, 310000, 335001, 390000, 421720];

                    // Project future based on sliders
                    // Base projections: [742000, 795000, 850000, 910000, 980000]
                    const simRevFactor = 1 + (simulationGrowth / 100);
                    const simExpFactor = 1 + ((simulationLogisticsStrain * 0.15 + simulationRawMaterialCost) / 100);

                    const projectedRevenues = [
                      742000 * simRevFactor,
                      795000 * simRevFactor,
                      850000 * simRevFactor,
                      910000 * simRevFactor,
                      980000 * simRevFactor
                    ];
                    const projectedExpenses = [
                      435000 * simExpFactor,
                      450000 * simExpFactor,
                      462000 * simExpFactor,
                      480000 * simExpFactor,
                      495000 * simExpFactor
                    ];

                    const combinedRevenues = [...actualRevenues, ...projectedRevenues];
                    const combinedExpenses = [...actualExpenses, ...projectedExpenses];

                    const maxVal = Math.max(...combinedRevenues) * 1.05;
                    const minVal = Math.min(...combinedExpenses) * 0.95;

                    const width = 760;
                    const height = 260;
                    const paddingLeft = 60;
                    const paddingRight = 20;
                    const paddingTop = 15;
                    const paddingBottom = 25;

                    const plotWidth = width - paddingLeft - paddingRight;
                    const plotHeight = height - paddingTop - paddingBottom;

                    const getX = (idx: number) => paddingLeft + (idx * (plotWidth / (months.length - 1)));
                    const getY = (val: number) => {
                      const scaleY = (val - minVal) / (maxVal - minVal);
                      return height - paddingBottom - (scaleY * plotHeight);
                    };

                    // Construct SVG path coordinates
                    const actualRevPoints = actualRevenues.map((v, i) => `${getX(i)},${getY(v)}`);
                    const actualExpPoints = actualExpenses.map((v, i) => `${getX(i)},${getY(v)}`);

                    // Construction of projected forecast path starting from last actual (May, index 5)
                    const projRevPoints = [actualRevenues[5], ...projectedRevenues].map((v, i) => `${getX(5 + i)},${getY(v)}`);
                    const projExpPoints = [actualExpenses[5], ...projectedExpenses].map((v, i) => `${getX(5 + i)},${getY(v)}`);

                    return (
                      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="font-mono text-[9px] text-text-muted overflow-visible">
                        {/* Horizontal Opacity Grid Lines (AmDox specification horizontal only, 5% white opacity) */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                          const val = minVal + (ratio * (maxVal - minVal));
                          const y = getY(val);
                          return (
                            <g key={idx}>
                              <line 
                                x1={paddingLeft} 
                                y1={y} 
                                x2={width - paddingRight} 
                                y2={y} 
                                stroke="#ffffff" 
                                strokeOpacity="0.05" 
                                strokeWidth="1"
                              />
                              <text x={paddingLeft - 8} y={y + 3} fill="#94a3b8" textAnchor="end">
                                ${Math.round(val / 1000)}k
                              </text>
                            </g>
                          );
                        })}

                        {/* Month labels along X axis */}
                        {months.map((m, idx) => {
                          const x = getX(idx);
                          return (
                            <text key={idx} x={x} y={height - 6} fill="#94a3b8" textAnchor="middle">
                              {m}
                            </text>
                          );
                        })}

                        {/* Vertical dotted boundary line dividing Actuals from Forecast */}
                        <line 
                          x1={getX(5)} 
                          y1={paddingTop} 
                          x2={getX(5)} 
                          y2={height - paddingBottom} 
                          stroke="#7c3aed" 
                          strokeDasharray="3,3" 
                          strokeOpacity="0.4"
                        />
                        <text x={getX(5) - 6} y={paddingTop + 10} fill="#7c3aed" textAnchor="end" className="text-[8px] font-bold">
                          ACTUAL MATRIX
                        </text>
                        <text x={getX(5) + 6} y={paddingTop + 10} fill="#00b5d3" textAnchor="start" className="text-[8px] font-bold">
                          AI FORECAST COCKPIT
                        </text>

                        {/* HISTORICAL ACTUAL REVENUE PATH (Solid Purple #7C3AED) */}
                        <polyline
                          fill="none"
                          stroke="#7c3aed"
                          strokeWidth="3"
                          strokeLinecap="round"
                          points={actualRevPoints.join(' ')}
                        />

                        {/* HISTORICAL ACTUAL EXPENSE PATH (Solid Dark Purple/Slate) */}
                        <polyline
                          fill="none"
                          stroke="#1c2b3c"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          points={actualExpPoints.join(' ')}
                        />

                        {/* FUTURE PROJECTED REVENUE PATH (Dashed Bright Cyan #00B5D3 / #4CD7F6) */}
                        <polyline
                          fill="none"
                          stroke="#00b5d3"
                          strokeWidth="3"
                          strokeDasharray="5,4"
                          strokeLinecap="round"
                          points={projRevPoints.join(' ')}
                        />

                        {/* FUTURE PROJECTED EXPENSE PATH (Dashed Grey/Purple) */}
                        <polyline
                          fill="none"
                          stroke="#94a3b8"
                          strokeWidth="2"
                          strokeDasharray="4,4"
                          strokeLinecap="round"
                          points={projExpPoints.join(' ')}
                        />

                        {/* CIRCLE MARKERS FOR HIGHLIGHT POINTS */}
                        {/* Current position (May index 5) */}
                        <circle cx={getX(5)} cy={getY(actualRevenues[5])} r="4" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.5" />
                        <circle cx={getX(5)} cy={getY(actualExpenses[5])} r="3" fill="#1c2b3c" stroke="#ffffff" strokeWidth="1.5" />
                        
                        {/* Target projections end node */}
                        <circle cx={getX(10)} cy={getY(projectedRevenues[4])} r="4" fill="#00b5d3" stroke="#051424" strokeWidth="2" />
                      </svg>
                    );
                  })()}
                </div>
              </div>

              {/* Stress Analysis Summary box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surf-lowest p-4 rounded-lg border border-brand-outline">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-brand-secondary font-extrabold uppercase tracking-wider block">HYPOTHETICAL OPERATIONAL METRICS</span>
                  <div className="text-xs text-text-secondary leading-relaxed font-mono">
                    Under Simulated Sales Growth at <b className="text-white">+{simulationGrowth}%</b> and Logistics Transit latency markup of <b className="text-white">+{simulationLogisticsStrain}%</b>, October 2026 baseline forecast models suggest:
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-2 border-t md:border-t-0 md:border-l border-brand-outline/65 md:pl-6 pt-3 md:pt-0">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-text-secondary">Predicted Liquid Profit Margins:</span>
                    <span className="text-brand-tertiary font-bold">+${(385000 * (1 + simulationGrowth/100)).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-text-secondary">Depletion Risk Index:</span>
                    <span className={`font-bold ${simulationLogisticsStrain > 55 ? "text-rose-400" : "text-amber-400"}`}>
                      {simulationLogisticsStrain > 55 ? "HIGH ALARM" : "NOMINAL POSTURE"} ({simulationLogisticsStrain}pt)
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: BALANCE SHEET ASSETS */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            
            {/* Balance sheet asset ledger summary */}
            <div className="bg-surf-card p-6 rounded-xl border border-brand-outline">
              <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-brand-outline/60 pb-3 mb-4">
                Enterprise Assets Breakdown Summary
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Math breakdown */}
                <div className="space-y-4">
                  <p className="text-xs text-text-secondary font-mono leading-relaxed">
                    Balance sheets on the Amdox Enterprise system are formulated using double-entry matching, strictly balancing active liquid ledger transactions against regional physical inventory logs.
                  </p>

                  <div className="space-y-2.5">
                    
                    {/* Item A */}
                    <div className="p-3 bg-[#0d1c2d] rounded-lg border border-brand-outline flex justify-between items-center font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="text-text-secondary">Cash reserves & cleared capitals</span>
                      </div>
                      <span className="text-white font-extrabold">${cashOnHand.toLocaleString()}</span>
                    </div>

                    {/* Item B */}
                    <div className="p-3 bg-[#0d1c2d] rounded-lg border border-brand-outline flex justify-between items-center font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-secondary" />
                        <span className="text-text-secondary">Outstanding pending raw billings</span>
                      </div>
                      <span className="text-white font-extrabold">${accountsReceivable.toLocaleString()}</span>
                    </div>

                    {/* Item C */}
                    <div className="p-3 bg-[#0d1c2d] rounded-lg border border-brand-outline flex justify-between items-center font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" />
                        <span className="text-text-secondary">Depoted physical warehouse stocks</span>
                      </div>
                      <span className="text-white font-extrabold">${inventoryValue.toLocaleString()}</span>
                    </div>

                    {/* Total formula item */}
                    <div className="p-3 bg-brand-primary/10 rounded-lg border border-brand-primary/30 flex justify-between items-center font-mono text-xs font-extrabold">
                      <span className="text-brand-primary-dim uppercase tracking-wider">AGGREGATE VERIFIABLE NET STRENGTH:</span>
                      <span className="text-brand-tertiary text-sm">${totalAssets.toLocaleString()}</span>
                    </div>

                  </div>
                </div>

                {/* Aesthetic visualization piece */}
                <div className="bg-[#010f1f] p-5 rounded-lg border border-brand-outline flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-brand-secondary font-extrabold tracking-widest uppercase block">AUDITING PRINCIPLE SYSTEM</span>
                    <h4 className="text-white text-xs font-bold leading-normal">System Cryptographic Verification Ledger</h4>
                    <p className="text-[11px] text-text-secondary font-mono leading-relaxed">
                      Every ledger injection creates a cryptographic balance stamp block. Under AmDox enterprise specifications, our decentralized sandbox keeps a synchronized trace on Cloud Run host nodes seamlessly.
                    </p>
                  </div>

                  {/* Tiny simulated telemetry dots for cockpit style */}
                  <div className="border-t border-brand-outline/60 pt-4 mt-6">
                    <div className="grid grid-cols-4 gap-2 font-mono text-[9px] text-center select-none text-text-muted">
                      <div className="bg-surf-card p-1.5 rounded border border-brand-outline">
                        <span className="text-brand-tertiary block font-bold">SHA-256</span>
                        <span>ALGO TIGHT</span>
                      </div>
                      <div className="bg-surf-card p-1.5 rounded border border-brand-outline">
                        <span className="text-brand-secondary block font-bold">100%</span>
                        <span>SYNCED</span>
                      </div>
                      <div className="bg-surf-card p-1.5 rounded border border-brand-outline">
                        <span className="text-brand-primary block font-bold">ACTIVE</span>
                        <span>SSL KEY</span>
                      </div>
                      <div className="bg-surf-card p-1.5 rounded border border-brand-outline">
                        <span className="text-brand-primary-dim block font-bold">0.06pt</span>
                        <span>LATENCY</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 5: HUMAN RESOURCES & TALENT */}
        {activeTab === 'hr' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* HR Top bar KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surf-card rounded-xl p-5 border border-brand-outline relative overflow-hidden transition-all hover:bg-surf-high/60">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono tracking-widest text-text-secondary uppercase">CORE TEAMS PERSONNEL</span>
                  <div className="p-1 rounded bg-brand-primary/10 text-brand-primary-dim">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-sans text-white tracking-tight">
                  {(erpData?.employees || []).length} Active Staff
                </h3>
                <p className="text-[11px] text-text-secondary font-mono mt-1">Sustaining operational cadence</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary opacity-60" />
              </div>

              <div className="bg-surf-card rounded-xl p-5 border border-brand-outline relative overflow-hidden transition-all hover:bg-surf-high/60">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono tracking-widest text-text-secondary uppercase">MONTHLY PAYROLL DEBIT</span>
                  <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-sans text-white tracking-tight">
                  ${(erpData?.employees || []).reduce((sum, e) => sum + e.salary, 0).toLocaleString()}
                </h3>
                <p className="text-[11px] text-text-secondary font-mono mt-1">Debited automatically via Finance</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-tertiary opacity-60" />
              </div>

              <div className="bg-surf-card rounded-xl p-5 border border-brand-outline relative overflow-hidden transition-all hover:bg-surf-high/60">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono tracking-widest text-text-secondary uppercase">PENDING ONBOARDING</span>
                  <div className="p-1 rounded bg-amber-500/10 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-sans text-white tracking-tight">
                  {(erpData?.employees || []).filter(e => e.status === 'pending').length} Architect{((erpData?.employees || []).filter(e => e.status === 'pending').length !== 1) ? 's' : ''}
                </h3>
                <p className="text-[11px] text-text-secondary font-mono mt-1">Requires credentials clearance</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 opacity-60" />
              </div>
            </div>

            {/* Flagged Ledger Transac Action Integration Banner */}
            {erpData?.transactions.some(tx => tx.id === 'TX-10476' && tx.status === 'flagged') && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5 animate-pulse">
                    <AlertTriangle className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-amber-300">SYSTEM RECONCILIATION AVAILABLE: FLAGGED HR RECRUITMENT COST</h4>
                    <p className="text-xs text-text-secondary leading-relaxed mt-1 font-mono">
                      Ledger ID <span className="font-mono text-white font-extrabold">TX-10476</span> (Recruiter Fees: WorkDay) for <span className="text-white font-semibold">$12,000</span> holds a "flagged" audit security state. Resolve this ledger barrier directly using your Human Resources audit clearance level.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleUpdateTxStatus('TX-10476', 'cleared')}
                  className="bg-[#ffa940] hover:bg-[#ffa940]/90 text-stone-950 text-xs font-bold py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-amber-500 whitespace-nowrap cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_12px_rgba(255,169,64,0.2)] font-mono"
                >
                  Clear Flag & Authorize Receipt
                </button>
              </div>
            )}

            {/* Staff directory and Actions */}
            <div className="bg-surf-card rounded-xl border border-brand-outline overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-outline flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surf-card">
                <div>
                  <h2 className="text-sm font-semibold tracking-wider text-white uppercase font-mono">Enterprise Talent Directory</h2>
                  <p className="text-xs text-text-secondary font-mono mt-0.5">Authoritative registry of onboarded business architects</p>
                </div>
                
                <button 
                  id="open-add-emp-modal"
                  onClick={() => setShowAddEmployeeModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-all shadow-[0_0_12px_rgba(124,106,255,0.3)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Onboard New Architect</span>
                </button>
              </div>

              <div className="overflow-x-auto border-t border-brand-outline/40">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0c0d14]/60 border-b border-brand-outline">
                      <th className="py-3 px-5 text-[10px] font-mono tracking-widest text-brand-secondary uppercase">Employee ID</th>
                      <th className="py-3 px-5 text-[10px] font-mono tracking-widest text-text-secondary uppercase">Full Name</th>
                      <th className="py-3 px-5 text-[10px] font-mono tracking-widest text-text-secondary uppercase">Title / Role</th>
                      <th className="py-3 px-5 text-[10px] font-mono tracking-widest text-text-secondary uppercase">Depart Center</th>
                      <th className="py-3 px-5 text-[10px] font-mono tracking-widest text-text-secondary uppercase text-right">Committed Salary</th>
                      <th className="py-3 px-5 text-[10px] font-mono tracking-widest text-text-secondary uppercase text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(erpData?.employees || []).map(emp => (
                      <tr key={emp.id} className="border-b border-brand-outline/20 hover:bg-[#161822] transition-all group">
                        <td className="py-3.5 px-5 font-mono text-xs font-bold text-brand-secondary">
                          {emp.id}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="font-semibold text-xs text-white tracking-wide block">{emp.name}</span>
                          <span className="text-[11px] text-[#7c8099] font-mono">{emp.email}</span>
                        </td>
                        <td className="py-3.5 px-5 font-medium text-xs text-text-secondary">
                          {emp.role}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="text-[10px] font-mono font-black tracking-wide px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary-dim border border-brand-primary/25">
                            {emp.department}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right font-mono text-xs font-bold text-white">
                          ${emp.salary.toLocaleString()}/mo
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                              emp.status === 'active' ? 'bg-[#52e5a3] shadow-[0_0_8px_rgba(82,229,163,0.5)]' :
                              emp.status === 'leave' ? 'bg-[#ffa940] shadow-[0_0_8px_rgba(255,169,64,0.5)]' :
                              'bg-[#ff4d6a] shadow-[0_0_8px_rgba(255,77,106,0.5)]'
                            }`} />
                            
                            <select
                              value={emp.status}
                              onChange={(e) => handleUpdateEmployeeStatus(emp.id, e.target.value as any)}
                              className="bg-[#0c0d14] text-[10px] text-text-secondary font-mono py-0.5 px-1.5 rounded border border-brand-outline hover:border-brand-primary hover:text-white cursor-pointer transition-all focus:outline-none"
                            >
                              <option value="active">Active</option>
                              <option value="leave">On Leave</option>
                              <option value="pending">Pending</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(erpData?.employees || []).length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-text-secondary font-mono italic text-xs">
                          No personnel registered in the enterprise directory.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* DETAILED CAPITAL ACTIONS MODAL PANEL (INSERT TR ENTRY) */}
      {showAddTxModal && (
        <div className="fixed inset-0 bg-[#010f1f]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#122131] border border-brand-outline p-6 rounded-xl w-full max-w-lg shadow-[0_0_24px_rgba(124,58,237,0.3)] space-y-4">
            
            <div className="flex justify-between items-center border-b border-brand-outline pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Execute Capital Accounting Action</h3>
                <p className="text-xs text-text-secondary font-mono mt-0.5">Write instant records securely directly to the ERP ledger database</p>
              </div>
              <button 
                onClick={() => {
                  setShowAddTxModal(false);
                  setTxError(null);
                }}
                className="text-text-secondary hover:text-white font-bold text-xs select-none p-1"
              >
                ✕
              </button>
            </div>

            {txError && (
              <div className="p-3 bg-rose-500/10 text-rose-300 text-xs font-mono rounded border border-rose-500/25">
                ⚠ {txError}
              </div>
            )}

            <form onSubmit={handleCreateTransaction} className="space-y-4 font-mono text-xs">
              
              {/* Account Title input */}
              <div className="space-y-1.5">
                <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Account Title / Vendor Target:</label>
                <input 
                  type="text" 
                  placeholder="e.g. Client Billing: Sony Corp, Semiconductor Order V2"
                  value={txForm.account}
                  onChange={(e) => setTxForm(prev => ({ ...prev, account: e.target.value }))}
                  required
                  className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-2 px-3 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Amount and Direction */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Cash Flow Direction:</label>
                  <select 
                    value={txForm.type}
                    onChange={(e) => setTxForm(prev => ({ ...prev, type: e.target.value as 'debit' | 'credit' }))}
                    className="w-full bg-[#0d1c2d] text-white border border-brand-outline rounded-lg py-2 px-3 focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="debit">Debit Out (Expense)</option>
                    <option value="credit">Credit In (Revenue)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Aggregate Value ($):</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 45000"
                    value={txForm.amount}
                    onChange={(e) => setTxForm(prev => ({ ...prev, amount: e.target.value }))}
                    min="1"
                    required
                    className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-2 px-3 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Department and Initial audit Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Department Center:</label>
                  <select 
                    value={txForm.department}
                    onChange={(e) => setTxForm(prev => ({ ...prev, department: e.target.value as any }))}
                    className="w-full bg-[#0d1c2d] text-white border border-brand-outline rounded-lg py-2 px-3 focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Initial Audit Stage:</label>
                  <select 
                    value={txForm.status}
                    onChange={(e) => setTxForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-[#0d1c2d] text-white border border-brand-outline rounded-lg py-2 px-3 focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="cleared">Cleared</option>
                    <option value="pending">Pending</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
              </div>

              {/* Descr */}
              <div className="space-y-1.5">
                <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Description / Reference notes:</label>
                <textarea 
                  placeholder="Reference notes or item SKUs logs..."
                  value={txForm.description}
                  onChange={(e) => setTxForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-2 px-3 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-brand-outline/65">
                <button 
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="bg-transparent hover:bg-surf-high/40 text-text-secondary hover:text-white px-4 py-2 rounded-lg border border-brand-outline transition-all select-none cursor-pointer"
                >
                  Discard Action
                </button>
                <button 
                  type="submit"
                  disabled={txSubmitting}
                  className="bg-brand-primary hover:bg-brand-primary/95 text-white font-bold px-4 py-2 rounded-lg transition-all shadow-[0_0_12px_rgba(124,58,237,0.3)] select-none cursor-pointer"
                >
                  {txSubmitting ? 'Verifying...' : 'Commit Ledger block'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* FREIGHT LOGISTICS MONITOR: DISPATCH NEW LINE MODAL */}
      {showAddShipmentModal && (
        <div className="fixed inset-0 bg-[#010f1f]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#122131] border border-brand-outline p-6 rounded-xl w-full max-w-lg shadow-[0_0_24px_rgba(124,58,237,0.3)] space-y-4">
            
            <div className="flex justify-between items-center border-b border-brand-outline pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Dispatch New Logistics Cargo Line</h3>
                <p className="text-xs text-text-secondary font-mono mt-0.5">Register global transport corridors and log active freight assets</p>
              </div>
              <button 
                onClick={() => {
                  setShowAddShipmentModal(false);
                  setShipmentError(null);
                }}
                className="text-text-secondary hover:text-white font-bold text-xs select-none p-1"
              >
                ✕
              </button>
            </div>

            {shipmentError && (
              <div className="p-3 bg-rose-500/10 text-rose-300 text-xs font-mono rounded border border-rose-500/25">
                ⚠ {shipmentError}
              </div>
            )}

            <form onSubmit={handleCreateShipment} className="space-y-4 font-mono text-xs">
              
              {/* Origin and Destination Corridor */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Corridor Origin:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Frankfurt Airport (FRA)"
                    value={shipmentForm.origin}
                    onChange={(e) => setShipmentForm(prev => ({ ...prev, origin: e.target.value }))}
                    required
                    className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-2 px-3 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Corridor Destination:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Austin Port Block C"
                    value={shipmentForm.destination}
                    onChange={(e) => setShipmentForm(prev => ({ ...prev, destination: e.target.value }))}
                    required
                    className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-2 px-3 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Carrier & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[#94a3b8] font-bold select-none text-[11px] tracking-wider uppercase block">Logistics Carrier Line:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. DHL Global Air Freight"
                    value={shipmentForm.carrier}
                    onChange={(e) => setShipmentForm(prev => ({ ...prev, carrier: e.target.value }))}
                    required
                    className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-2 px-3 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#94a3b8] font-bold select-none text-[11px] tracking-wider uppercase block">Cargo Asset Value ($):</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 185000"
                    value={shipmentForm.cargoValue}
                    onChange={(e) => setShipmentForm(prev => ({ ...prev, cargoValue: e.target.value }))}
                    min="1"
                    required
                    className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-2 px-3 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* ETA and Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[#94a3b8] font-bold select-none text-[11px] tracking-wider uppercase block">Target ETA Date:</label>
                  <input 
                    type="date" 
                    value={shipmentForm.eta}
                    onChange={(e) => setShipmentForm(prev => ({ ...prev, eta: e.target.value }))}
                    required
                    className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-2 px-3 text-white focus:outline-none focus:border-brand-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2.5 text-[#94a3b8] select-none">
                    <input 
                      type="checkbox" 
                      checked={shipmentForm.temperatureControlled}
                      onChange={(e) => setShipmentForm(prev => ({ ...prev, temperatureControlled: e.target.checked }))}
                      className="w-4 h-4 rounded border-brand-outline accent-brand-secondary bg-[#0d1c2d]"
                    />
                    <span className="text-[11px] tracking-wider uppercase block">Cold Chain Regulated</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-brand-outline/65">
                <button 
                  type="button"
                  onClick={() => setShowAddShipmentModal(false)}
                  className="bg-transparent hover:bg-surf-high/40 text-text-secondary hover:text-white px-4 py-2 rounded-lg border border-brand-outline transition-all select-none cursor-pointer"
                >
                  Cancel Logistics Line
                </button>
                <button 
                  type="submit"
                  disabled={shipmentSubmitting}
                  className="bg-brand-primary hover:bg-brand-primary/95 text-white font-bold px-4 py-2 rounded-lg transition-all shadow-[0_0_12px_rgba(124,58,237,0.3)] select-none cursor-pointer"
                >
                  {shipmentSubmitting ? 'Registering...' : 'Dispatch Corridor Cargo'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* HUMAN RESOURCES: ONBOARD ARCHITECT MODAL */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-[#010f1f]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#122131] border border-brand-outline p-6 rounded-xl w-full max-w-lg shadow-[0_0_24px_rgba(124,58,237,0.3)] space-y-4 animate-fade-in">
            
            <div className="flex justify-between items-center border-b border-brand-outline pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Onboard New Business Architect</h3>
                <p className="text-xs text-text-secondary font-mono mt-0.5">Register high-level personnel credentials into the Enterprise Directory</p>
              </div>
              <button 
                onClick={() => {
                  setShowAddEmployeeModal(false);
                  setEmpError(null);
                }}
                className="text-text-secondary hover:text-white font-bold text-xs select-none p-1"
              >
                ✕
              </button>
            </div>

            {empError && (
              <div className="p-3 bg-rose-500/10 text-rose-300 text-xs font-mono rounded border border-rose-500/25">
                ⚠ {empError}
              </div>
            )}

            <form onSubmit={handleCreateEmployee} className="space-y-4 font-mono text-xs">
              
              {/* Name & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Full Name:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Liam Sterling"
                    value={employeeForm.name}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-2 px-3 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Contact Email:</label>
                  <input 
                    type="email" 
                    placeholder="e.g. l.sterling@amdox.com"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-2 px-3 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Title / Role */}
              <div className="space-y-1.5">
                <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Title / Corporate Role:</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lead Devops Security Specialist"
                  value={employeeForm.role}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, role: e.target.value }))}
                  required
                  className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-2 px-3 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Department & Salary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Department Center:</label>
                  <select 
                    value={employeeForm.department}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, department: e.target.value as any }))}
                    className="w-full bg-[#0d1c2d] text-white border border-brand-outline rounded-lg py-2 px-3 focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Monthly Base Salary ($):</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 14500"
                    value={employeeForm.salary}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, salary: e.target.value }))}
                    min="1"
                    required
                    className="w-full bg-[#0d1c2d] border border-brand-outline rounded-lg py-2 px-3 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Initial active status */}
              <div className="space-y-1.5">
                <label className="text-text-secondary font-bold select-none text-[11px] tracking-wider uppercase block">Initial Credentials Status:</label>
                <select 
                  value={employeeForm.status}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full bg-[#0d1c2d] text-white border border-brand-outline rounded-lg py-2 px-3 focus:outline-none focus:border-brand-primary cursor-pointer"
                >
                  <option value="active">Active (Full Credentials)</option>
                  <option value="leave">On Leave (Suspended Access)</option>
                  <option value="pending">Pending Audit Verification</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-brand-outline/65">
                <button 
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="bg-transparent hover:bg-surf-high/40 text-text-secondary hover:text-white px-4 py-2 rounded-lg border border-brand-outline transition-all select-none cursor-pointer"
                >
                  Discard Profile
                </button>
                <button 
                  type="submit"
                  disabled={empSubmitting}
                  className="bg-brand-primary hover:bg-brand-primary/95 text-white font-bold px-4 py-2 rounded-lg transition-all shadow-[0_0_12px_rgba(124,58,237,0.3)] select-none cursor-pointer"
                >
                  {empSubmitting ? 'Onboarding...' : 'Register Candidate Block'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
