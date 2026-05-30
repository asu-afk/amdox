/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  FileText, 
  Layers, 
  Upload, 
  Zap, 
  Lock, 
  Unlock, 
  Maximize2,
  Trash2,
  Globe,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Transaction } from '../types';

interface FinancialLedgerCtrlProps {
  transactions: Transaction[];
  totalAssets: number;
  cashOnHand: number;
  accountsReceivable: number;
  inventoryValue: number;
  onAddTransaction: (tx: any) => Promise<boolean>;
  onUpdateTxStatus: (id: string, status: any) => Promise<void>;
}

export default function FinancialLedgerCtrl({
  transactions,
  totalAssets,
  cashOnHand,
  accountsReceivable,
  inventoryValue,
  onAddTransaction,
  onUpdateTxStatus
}: FinancialLedgerCtrlProps) {
  
  // Tab within finance
  const [financeTab, setFinanceTab] = useState<'journal' | 'ocr'>('journal');

  // Double Entry Journal Builder states (F-02 criteria)
  const [journalEntries, setJournalEntries] = useState<Array<{ account: string, type: 'debit' | 'credit', amount: string, department: string }>>([
    { account: 'Consulting Milestones: BioTech', type: 'credit', amount: '22000', department: 'Sales' },
    { account: 'Oracle Database Servers', type: 'debit', amount: '22000', department: 'Engineering' }
  ]);
  const [journalDescription, setJournalDescription] = useState<string>('Bi-weekly intercompany cloud balancing');
  const [isLOCKED, setIsLOCKED] = useState<boolean>(false);
  const [roleOverride, setRoleOverride] = useState<string>('');
  const [postError, setPostError] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState<boolean>(false);

  // FX state simulation (F-02)
  const [fxActive, setFxActive] = useState<boolean>(true);
  const [eurRate, setEurRate] = useState<number>(0.92);
  const [gbpRate, setGbpRate] = useState<number>(0.79);
  const [sgdRate, setSgdRate] = useState<number>(1.35);
  const [fetchingFx, setFetchingFx] = useState<boolean>(false);

  // OCR Upload States (F-03 AP Automation)
  const [ocrFile, setOcrFile] = useState<string | null>(null);
  const [ocrScanning, setOcrScanning] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<{ merchant: string, total: number, sku: string, qty: number, accuracy: number, status: string } | null>(null);

  // Computed totals for journal builder
  const journalBalance = React.useMemo(() => {
    let debits = 0;
    let credits = 0;
    journalEntries.forEach(entry => {
      const amt = parseFloat(entry.amount) || 0;
      if (entry.type === 'debit') debits += amt;
      else credits += amt;
    });
    return {
      debits,
      credits,
      difference: Math.abs(debits - credits),
      isBalanced: debits === credits && debits > 0
    };
  }, [journalEntries]);

  // Handle addition of item row in manual Journal Builder
  const handleAddJournalRow = () => {
    setJournalEntries(prev => [
      ...prev,
      { account: '', type: 'debit', amount: '', department: 'Engineering' }
    ]);
  };

  const handleRemoveJournalRow = (idx: number) => {
    setJournalEntries(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateJournalRow = (idx: number, field: string, val: string) => {
    setJournalEntries(prev => prev.map((entry, i) => {
      if (i === idx) {
        return { ...entry, [field]: val };
      }
      return entry;
    }));
  };

  // Submit complete Journal (Double Entry lock validation F-02 criteria)
  const handlePostJournalEntries = async () => {
    if (isLOCKED) {
      setPostError("Period is LOCKED. You must authorize role override context to open accounts.");
      return;
    }
    if (!journalBalance.isBalanced) {
      setPostError(`Math imbalance error. Debit total ($${journalBalance.debits}) must exactly match Credit total ($${journalBalance.credits}). Difference: $${journalBalance.difference}.`);
      return;
    }

    setPostError(null);
    try {
      // Post all journal lines as separate transactions securely
      for (const entry of journalEntries) {
        await onAddTransaction({
          account: entry.account,
          type: entry.type,
          amount: parseFloat(entry.amount),
          department: entry.department,
          description: journalDescription,
          status: 'cleared'
        });
      }
      setPostSuccess(true);
      // Reset journal
      setJournalEntries([
        { account: '', type: 'debit', amount: '', department: 'Engineering' }
      ]);
      setJournalDescription('');
      setTimeout(() => setPostSuccess(false), 3000);
    } catch (err) {
      setPostError("Server pipeline rejected journal transaction batch.");
    }
  };

  // Trigger FX live rate update
  const handleFetchRates = () => {
    setFetchingFx(true);
    setTimeout(() => {
      setEurRate(0.91 + Math.random() * 0.02);
      setGbpRate(0.78 + Math.random() * 0.02);
      setSgdRate(1.34 + Math.random() * 0.02);
      setFetchingFx(false);
    }, 550);
  };

  // AP OCR File Select Simulator
  const handleSimulateOCR = (fileName: string, data: any) => {
    setOcrFile(fileName);
    setOcrScanning(true);
    setOcrResult(null);
    setTimeout(() => {
      setOcrScanning(false);
      setOcrResult(data);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono text-xs">
      
      {/* Finance Ledger Sub navigation header */}
      <div className="flex border-b border-brand-outline font-bold">
        <button
          onClick={() => setFinanceTab('journal')}
          className={`py-2.5 px-5 select-none transition-all ${
            financeTab === 'journal' 
              ? 'text-brand-primary border-b-2 border-brand-primary font-extrabold' 
              : 'text-text-secondary hover:text-white'
          }`}
        >
          General Ledger & Double-Entry Journal
        </button>
        <button
          onClick={() => setFinanceTab('ocr')}
          className={`py-2.5 px-5 select-none transition-all ${
            financeTab === 'ocr' 
              ? 'text-brand-primary border-b-2 border-brand-primary font-extrabold' 
              : 'text-text-secondary hover:text-white'
          }`}
        >
          AP / AR Automation & 3-Way OCR matching
        </button>
      </div>

      {financeTab === 'journal' ? (
        /* TAB 1: JOURNAL & DOUBLE ENTRY ACCOUNTING CORE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Double entry input panel */}
          <div className="lg:col-span-2 bg-surf-card border border-brand-outline rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-outline/40 pb-2">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-sans">Double-Entry Journal Builder</h3>
                <p className="text-[11px] text-[#7c8099] mt-0.5">Enforces strict debit vs credit mathematical balance parity before database entry.</p>
              </div>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 py-1 px-2 border border-indigo-500/20 rounded font-black uppercase">F-02 Feature</span>
            </div>

            {postError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-300 rounded flex gap-2 animate-fade-in font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{postError}</span>
              </div>
            )}

            {postSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-[#52e5a3] rounded flex gap-2 animate-fade-in font-bold">
                <CheckCircle className="w-4 h-4 shrink-0 text-[#52e5a3]" />
                <span>Journal posted successfully! Ledger balances updated.</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-text-secondary border-b border-brand-outline pb-1.5">
                <div className="col-span-4">Account Title Target</div>
                <div className="col-span-2 text-center">Form type</div>
                <div className="col-span-3 text-right">Debit/Credit Sum ($)</div>
                <div className="col-span-2">Department Alloc</div>
                <div className="col-span-1 text-center">Trash</div>
              </div>

              {/* Dynamic entry rows */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {journalEntries.map((entry, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input 
                      type="text"
                      placeholder="e.g. Semiconductor Raw Vendor"
                      value={entry.account}
                      onChange={(e) => handleUpdateJournalRow(idx, 'account', e.target.value)}
                      required
                      className="col-span-4 bg-[#0c0d14] border border-brand-outline rounded px-2.5 py-1.5 text-white"
                    />

                    <select
                      value={entry.type}
                      onChange={(e) => handleUpdateJournalRow(idx, 'type', e.target.value)}
                      className="col-span-2 bg-[#0c0d14] border border-brand-outline rounded px-2 py-1.5 text-white cursor-pointer"
                    >
                      <option value="debit">DEBIT</option>
                      <option value="credit">CREDIT</option>
                    </select>

                    <input 
                      type="number"
                      placeholder="Amount"
                      value={entry.amount}
                      onChange={(e) => handleUpdateJournalRow(idx, 'amount', e.target.value)}
                      required
                      className="col-span-3 bg-[#0c0d14] border border-brand-outline rounded px-2.5 py-1.5 text-right font-bold text-white text-xs"
                    />

                    <select
                      value={entry.department}
                      onChange={(e) => handleUpdateJournalRow(idx, 'department', e.target.value)}
                      className="col-span-2 bg-[#0c0d14] border border-brand-outline rounded px-1 py-1.5 text-white cursor-pointer"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">HR</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Operations">Operations</option>
                      <option value="Sales">Sales</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveJournalRow(idx)}
                      disabled={journalEntries.length <= 1}
                      className="col-span-1 flex justify-center text-text-secondary hover:text-rose-400 disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddJournalRow}
                className="py-1.5 px-3 border border-dashed border-brand-outline hover:border-brand-primary rounded text-white flex items-center gap-1.5 cursor-pointer ml-auto text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ledger Row</span>
              </button>
            </div>

            {/* Explanatory description card */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-text-secondary font-bold select-none block">Journal Description / Explanatory Audit Node:</label>
              <input 
                type="text" 
                placeholder="e.g. Reconciliation of semiconductor raw accounts with physical reserves"
                value={journalDescription}
                onChange={(e) => setJournalDescription(e.target.value)}
                required
                className="w-full bg-[#0c0d14] border border-brand-outline rounded-lg py-2 px-3 text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Parity Status Display */}
            <div className="p-4 bg-[#0c0d14] rounded-xl border border-brand-outline flex justify-between items-center text-xs">
              <div className="space-y-1 font-mono">
                <p className="text-text-secondary">Summary: Debits: <span className="font-bold text-white">${journalBalance.debits.toLocaleString()}</span> | Credits: <span className="font-bold text-white">${journalBalance.credits.toLocaleString()}</span></p>
                <p className={journalBalance.isBalanced ? 'text-[#52e5a3] font-bold' : 'text-amber-400 font-bold animate-pulse'}>
                  {journalBalance.isBalanced 
                    ? '✓ MATHEMATICAL PARITY ALIGNED (DEBITS === CREDITS)' 
                    : `⚠ BALLAST ERROR: UNBALANCED (DIFF: $${journalBalance.difference.toLocaleString()})`
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={handlePostJournalEntries}
                disabled={!journalBalance.isBalanced || isLOCKED}
                className={`py-2 px-5 font-bold rounded-lg transition-all uppercase cursor-pointer ${
                  journalBalance.isBalanced && !isLOCKED
                    ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,106,255,0.4)]'
                    : 'bg-surf-lowest text-text-muted border border-brand-outline cursor-not-allowed'
                }`}
              >
                Post Journal Core
              </button>
            </div>
          </div>

          {/* Period close and FX fetching configurations */}
          <div className="space-y-6">
            
            {/* Period close lock override */}
            <div className="bg-surf-card p-5 rounded-xl border border-brand-outline space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-brand-outline/40">
                <span className="font-bold text-white uppercase flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand-primary" />
                  Period Lock status (F-02)
                </span>
                <span className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded border ${
                  isLOCKED ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-[#52e5a3] border-emerald-500/20'
                }`}>
                  {isLOCKED ? 'Closed' : 'Unlocked'}
                </span>
              </div>

              <p className="text-xs text-text-secondary font-sans leading-relaxed">
                If the period is locked, the ledger rejects all manual accounting post entries to secure general double books against retrospective tampering.
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLOCKED(!isLOCKED);
                  }}
                  className={`flex-1 py-2 font-bold rounded-lg text-center transition-all cursor-pointer ${
                    isLOCKED 
                      ? 'bg-emerald-500 text-[#13121b]' 
                      : 'bg-rose-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                  }`}
                >
                  {isLOCKED ? 'Override & Unlock' : 'Close Accounts & Enforce lock'}
                </button>
              </div>
            </div>

            {/* Exchange rate fetcher (F-02) */}
            <div className="bg-surf-card p-5 rounded-xl border border-brand-outline space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-brand-outline/40">
                <span className="font-bold text-white uppercase flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#00d4aa]" />
                  Fetch Daily FX rates
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={fxActive}
                    onChange={(e) => setFxActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-surf-lowest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#7c8099] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary" />
                </label>
              </div>

              <p className="text-xs text-text-secondary font-sans leading-relaxed">
                Automatically fetches exchange rates daily for multi-currency reconciliation. Lock base is linked dynamically.
              </p>

              <div className="bg-[#0c0d14] rounded-lg p-3 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-text-secondary">
                  <span>Base Currency:</span>
                  <span className="text-white font-bold">USD ($)</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Euro (EUR/USD):</span>
                  <span className="text-[#00d4aa] font-bold">€ {eurRate.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Pound (GBP/USD):</span>
                  <span className="text-[#00d4aa] font-bold">£ {gbpRate.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Singapore Dollar:</span>
                  <span className="text-[#00d4aa] font-bold">S$ {sgdRate.toFixed(4)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFetchRates}
                disabled={fetchingFx || !fxActive}
                className="w-full py-1.5 border border-brand-outline bg-surf-lowest hover:border-brand-primary text-white rounded font-bold cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${fetchingFx ? 'animate-spin' : ''}`} />
                <span>{fetchingFx ? 'Querying indexes...' : 'Update FX Indexes Now'}</span>
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* TAB 2: AP INVOICING OCR SCANNERS AND 3-WAY RECONCILIATION */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Invoice drag select space */}
            <div className="bg-surf-card border border-brand-outline rounded-xl p-5 space-y-4">
              <div className="border-b border-brand-outline/40 pb-2">
                <h4 className="font-bold text-white uppercase font-sans">Enterprise Invoice OCR Sandbox (F-03)</h4>
                <p className="text-xs text-text-secondary mt-0.5">Simulate AP automated invoice upload and text layout parsing on the fly.</p>
              </div>

              {/* DND Box */}
              <div className="border-2 border-dashed border-brand-outline rounded-2xl p-6 text-center bg-[#0c0d14]/40 flex flex-col justify-center items-center space-y-4 min-h-[180px]">
                <Upload className="w-8 h-8 text-brand-primary animate-bounce shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Drag invoice raw file here</p>
                  <p className="text-[10px] text-text-secondary mt-0.5 font-sans">PDF, JPG up to 10MB file limits</p>
                </div>
                
                <div className="flex flex-col gap-1 w-full text-[10px] font-bold">
                  <span className="text-text-secondary">OR CLICK PRELOADED SAMPLE TEMPLATES:</span>
                  <button 
                    type="button"
                    onClick={() => handleSimulateOCR('semiconductor_mouser_902.pdf', {
                      merchant: 'Mouser Electronics Co Inc',
                      total: 14500,
                      sku: 'MCU-V5-AMDX',
                      qty: 340,
                      accuracy: 98.4,
                      status: 'Perfect Match'
                    })}
                    className="py-1 px-3 bg-surf-card hover:bg-surf-high text-white rounded border border-brand-outline/40 text-left truncate block cursor-pointer"
                  >
                    📃 mouser_electronics_MCU_V5_902.pdf
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleSimulateOCR('rent_austin_lease.pdf', {
                      merchant: 'Giga-Austin Properties',
                      total: 8500,
                      sku: 'CSG-MET-M01',
                      qty: 384,
                      accuracy: 96.2,
                      status: 'High Precision'
                    })}
                    className="py-1 px-3 bg-surf-card hover:bg-surf-high text-white rounded border border-brand-outline/40 text-left truncate block cursor-pointer mt-1"
                  >
                    📃 warehouse_lease_austin_B_48.pdf
                  </button>
                </div>
              </div>

              {ocrFile && (
                <div className="bg-[#0c0d14] p-3 rounded border border-brand-outline flex justify-between items-center">
                  <span className="font-bold text-white truncate max-w-[180px]">Active File: {ocrFile}</span>
                  <button onClick={() => { setOcrFile(null); setOcrResult(null); }} className="text-rose-400 hover:text-rose-300 font-bold uppercase">Clear</button>
                </div>
              )}
            </div>

            {/* OCR Laser Scanner visualizer (F-03) */}
            <div className="lg:col-span-2 bg-surf-card border border-brand-outline rounded-xl p-5 flex flex-col justify-between">
              <div className="border-b border-brand-outline/40 pb-2 flex justify-between items-center">
                <span className="font-bold text-white uppercase text-xs">Simulated OCR Reader Engine Status</span>
                {ocrResult && (
                  <span className="text-[10px] bg-emerald-500/10 text-[#52e5a3] font-bold px-2 py-0.5 border border-emerald-500/25 rounded uppercase">
                    OCR Scan Accuracy: {ocrResult.accuracy}%
                  </span>
                )}
              </div>

              {ocrScanning ? (
                <div className="py-12 flex-1 flex flex-col justify-center items-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-outline border-t-brand-primary animate-spin" />
                  <p className="text-xs text-brand-primary-dim animate-pulse">Running Neural Grid OCR bounding-box analysis...</p>
                </div>
              ) : ocrResult ? (
                /* Scanning Result panel */
                <div className="pt-3 space-y-4 flex-1">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#0c0d14] p-3 rounded border border-brand-outline/60">
                      <span className="text-[9px] uppercase text-text-secondary select-none">Seller Invoice Entity</span>
                      <h5 className="text-xs font-extrabold text-white mt-1 truncate">{ocrResult.merchant}</h5>
                    </div>
                    <div className="bg-[#0c0d14] p-3 rounded border border-brand-outline/60">
                      <span className="text-[9px] uppercase text-text-secondary select-none">Extracted Bill Sum</span>
                      <h5 className="text-xs font-mono font-extrabold text-[#00d4aa] mt-1">${ocrResult.total.toLocaleString()}</h5>
                    </div>
                    <div className="bg-[#0c0d14] p-3 rounded border border-brand-outline/60">
                      <span className="text-[9px] uppercase text-text-secondary select-none">Parsed Item SKU</span>
                      <h5 className="text-xs font-mono font-extrabold text-[#00d4aa] mt-1">{ocrResult.sku}</h5>
                    </div>
                    <div className="bg-[#0c0d14] p-3 rounded border border-brand-outline/60">
                      <span className="text-[9px] uppercase text-text-secondary select-none">Billing Quantity</span>
                      <h5 className="text-xs font-mono font-extrabold text-white mt-1">{ocrResult.qty} Units</h5>
                    </div>
                  </div>

                  {/* 3-Way Matching core check block */}
                  <div className="bg-[#0c0d14] p-4 rounded-xl border border-brand-outline/80 space-y-3.5">
                    <div className="flex justify-between items-center pb-2 border-b border-brand-outline/40">
                      <h5 className="text-xs font-extrabold text-white uppercase flex items-center gap-2">
                        <Zap className="text-amber-400 w-4 h-4 animate-bounce" />
                        Automated 3-Way Reconciler (Invoice ↔ PO ↔ GR)
                      </h5>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-500/25 font-bold uppercase shrink-0">
                        Auto-Approved in 18s
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed font-sans">
                      <div className="p-2.5 bg-surf-card rounded border border-brand-outline/50 flex flex-col justify-between">
                        <span className="text-text-secondary uppercase select-none font-semibold text-[9px] font-mono">1. AP Digital Invoice</span>
                        <p className="text-white font-bold font-mono mt-1">${ocrResult.total.toLocaleString()} • Qty {ocrResult.qty}</p>
                        <span className="text-[#52e5a3] font-bold text-[10px] flex items-center gap-1 mt-1 font-mono">✓ OCR Extracted</span>
                      </div>
                      <div className="p-2.5 bg-surf-card rounded border border-brand-outline/50 flex flex-col justify-between">
                        <span className="text-text-secondary uppercase select-none font-semibold text-[9px] font-mono">2. Matching Purchase Order</span>
                        <p className="text-white font-mono font-bold mt-1">PO-901-AMDX</p>
                        <span className="text-[#52e5a3] font-bold text-[10px] flex items-center gap-1 mt-1 font-mono">✓ PO catalog matches</span>
                      </div>
                      <div className="p-2.5 bg-surf-card rounded border border-brand-outline/50 flex flex-col justify-between">
                        <span className="text-text-secondary uppercase select-none font-semibold text-[9px] font-mono">3. Warehouse Goods Receipt</span>
                        <p className="text-white font-mono font-bold mt-1">Giga-Warehouse Austin</p>
                        <span className="text-[#52e5a3] font-bold text-[10px] flex items-center gap-1 mt-1 font-mono">✓ Deliveries aligned</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex-1 flex flex-col justify-center items-center text-text-secondary italic">
                  <span>Awaiting invoice file upload to trigger simulated NLP OCR scanning...</span>
                </div>
              )}
            </div>

          </div>

          {/* Historical matching logs */}
          <div className="bg-surf-card border border-brand-outline rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-brand-outline bg-[#0c0d14]/40">
              <span className="font-bold text-white uppercase text-xs font-sans block">3-way reconcile & OCR Automation logs</span>
            </div>
            <div className="p-4 space-y-2">
              <div className="p-3 bg-[#0c0d14] rounded border border-brand-outline/40 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono text-brand-secondary font-bold mr-3">[OCR MATCHED]</span>
                  <span className="text-white font-bold">Mouser Micro-processors (MC-902)</span>
                  <span className="mx-2 text-text-secondary">| Value:</span>
                  <span className="text-white font-bold">$14,500</span>
                </div>
                <span className="text-[11px] text-[#52e5a3] font-bold uppercase bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/25 rounded">Auto AP Cleared</span>
              </div>
              <div className="p-3 bg-[#0c0d14] rounded border border-brand-outline/40 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono text-brand-secondary font-bold mr-3">[OCR MATCHED]</span>
                  <span className="text-white font-bold">Rotterdam Terminal Surcharge (RT-412)</span>
                  <span className="mx-2 text-text-secondary">| Value:</span>
                  <span className="text-white font-bold">$12,800</span>
                </div>
                <span className="text-[11px] text-[#52e5a3] font-bold uppercase bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/25 rounded">Auto AP Cleared</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
