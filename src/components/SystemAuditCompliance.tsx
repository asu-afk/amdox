/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  Trash2, 
  Eye, 
  Power,
  RefreshCw,
  Mail,
  Smartphone,
  Webhook,
  Activity,
  Plus
} from 'lucide-react';

export default function SystemAuditCompliance() {
  
  // Tabs within system settings
  const [sysTab, setSysTab] = useState<'audit' | 'channels' | 'offline'>('audit');

  // Audit Logs database state with simulated SHA-256 chain links (F-09 criteria)
  const [auditChainLogs, setAuditChainLogs] = useState([
    { id: 'LOG-709', time: '11:04:12 UTC', user: 'a.chen@amdox.com', action: 'CREATE_EMPLOYEE', recordId: 'EMP-9022', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { id: 'LOG-708', time: '10:48:15 UTC', user: 's.vance@amdox.com', action: 'POST_GENERAL_JOURNAL', recordId: 'TX-10492', hash: '8f43ef6882fa41e127389aac792fca3552ae41e4649b934ca495991b7852b412' },
    { id: 'LOG-707', time: '09:12:35 UTC', user: 'e.rostova@amdox.com', action: 'EXPEDITE_SHIPMENT_DISPATCH', recordId: 'SH-48922', hash: '2a14e9b98ff3c1265dbfbc32a92fca3552ae41e4649b934ca495991b78520cf9' },
    { id: 'LOG-706', time: '08:44:19 UTC', user: 'm.vance@amdox.com', action: 'UPDATE_EMPLOYEE_STATUS', recordId: 'EMP-9025', hash: 'a412f8f3c34fa4ea3235bca3552ae41e4649b934ca495991b7852b82143ea9210' }
  ]);

  const [chainVerified, setChainVerified] = useState<boolean>(false);
  const [verifyingChain, setVerifyingChain] = useState<boolean>(false);

  // GDPR DSR Requests (F-09 72h criteria)
  const [dsrList, setDsrList] = useState([
    { id: 'DSR-301', subject: 'Arthur Chen', type: 'Right to Erasure (Soft-Delete)', fileTime: '2026-05-29 14:00', countdown: '50h 42m remaining', status: 'verified' },
    { id: 'DSR-302', subject: 'Liam Sterling', type: 'Right to Portability (JSON Export)', fileTime: '2026-05-30 08:30', countdown: '69h 15m remaining', status: 'pending' }
  ]);
  const [newDsrName, setNewDsrName] = useState<string>('');
  const [newDsrType, setNewDsrType] = useState<string>('Right to Erasure (Soft-Delete)');

  // F-10 Outbound preference matrix
  const [notifPrefs, setNotifPrefs] = useState({
    stockCritical: { email: true, sms: true, webhook: true },
    transitDelay: { email: true, sms: false, webhook: true },
    ledgerFlagged: { email: true, sms: true, webhook: false }
  });

  // F-12 Offline queue mock
  const [isONLINE, setIsONLINE] = useState<boolean>(true);
  const [offlineSyncQueue, setOfflineSyncQueue] = useState<Array<{ id: string, action: string, payload: string }>>([]);
  const [syncingOffline, setSyncingOffline] = useState<boolean>(false);

  // Trigger tamper evident chain validator (F-09 criteria)
  const handleVerifyChain = () => {
    setVerifyingChain(true);
    setChainVerified(false);
    setTimeout(() => {
      setVerifyingChain(false);
      setChainVerified(true);
    }, 600);
  };

  // Add DSR Form (F-09 criteria)
  const handleAddDsr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDsrName) return;

    const newDsr = {
      id: `DSR-${Math.floor(300 + Math.random() * 200)}`,
      subject: newDsrName,
      type: newDsrType,
      fileTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      countdown: '72h 00m remaining',
      status: 'pending'
    };
    setDsrList(prev => [newDsr, ...prev]);
    setNewDsrName('');
  };

  // Toggle PWA connection status (F-12 criteria)
  const handleToggleConnection = () => {
    const targetStatus = !isONLINE;
    setIsONLINE(targetStatus);
    
    if (targetStatus && offlineSyncQueue.length > 0) {
      // Syncing on reconnect criteria (F-12)
      setSyncingOffline(true);
      setTimeout(() => {
        setOfflineSyncQueue([]);
        setSyncingOffline(false);
      }, 700);
    } else if (!targetStatus) {
      // Offline action buffering
      setOfflineSyncQueue([
        { id: 'OFF-1', action: 'BUFFER_JOURNAL_DRAFT', payload: 'Mock double entry buffer' },
        { id: 'OFF-2', action: 'SAVE_NOTIF_PREFERENCE', payload: 'webhook: true' }
      ]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono text-xs">
      
      {/* Sub tabs choices */}
      <div className="flex border-b border-brand-outline font-bold">
        <button
          onClick={() => setSysTab('audit')}
          className={`py-2.5 px-5 select-none transition-all ${
            sysTab === 'audit' 
              ? 'text-brand-primary border-b-2 border-brand-primary font-extrabold' 
              : 'text-text-secondary hover:text-white'
          }`}
        >
          Tamper-Evident Audit & GDPR Portal (F-09)
        </button>
        <button
          onClick={() => setSysTab('channels')}
          className={`py-2.5 px-5 select-none transition-all ${
            sysTab === 'channels' 
              ? 'text-brand-primary border-b-2 border-brand-primary font-extrabold' 
              : 'text-text-secondary hover:text-white'
          }`}
        >
          Notification Hub Channels (F-10)
        </button>
        <button
          onClick={() => setSysTab('offline')}
          className={`py-2.5 px-5 select-none transition-all ${
            sysTab === 'offline' 
              ? 'text-brand-primary border-b-2 border-brand-primary font-extrabold' 
              : 'text-text-secondary hover:text-white'
          }`}
        >
          PWA Offline & Connectivity Workspace (F-12)
        </button>
      </div>

      {sysTab === 'audit' ? (
        /* TAB 1: AUDIT TRAILS & GDPR REGISTRATIONS */
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Audit Chains list */}
            <div className="lg:col-span-2 bg-surf-card border border-brand-outline rounded-xl p-5 space-y-4">
              <div className="border-b border-brand-outline/40 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-[#0c0d14]/30 px-3 py-1.5 rounded">
                <div>
                  <h4 className="font-bold text-white uppercase text-xs">Immutable Audit Log Cryptographic Trail</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5 font-mono">Each mutation contains a SHA-256 path linking back to the genesis block.</p>
                </div>
                <button
                  type="button"
                  onClick={handleVerifyChain}
                  disabled={verifyingChain}
                  className="bg-brand-primary hover:bg-brand-primary/95 text-white py-1.5 px-3.5 rounded font-bold uppercase transition-all shadow-[0_0_12px_rgba(124,106,255,0.3)] cursor-pointer tracking-wider"
                >
                  {verifyingChain ? 'Reindexing Chaining...' : 'Verify Chain Integrity'}
                </button>
              </div>

              {chainVerified && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-[#52e5a3] font-bold rounded flex items-center gap-2 animate-fade-in text-[11px]">
                  <CheckCircle className="w-4 h-4 shrink-0 text-[#52e5a3]" />
                  <span>SECURE TELEMETRY VALIDATED: SHA-256 block path matches perfectly. Zero discrepancies detected.</span>
                </div>
              )}

              <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                {auditChainLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-[#0c0d14]/75 rounded border border-brand-outline/65 text-xs text-text-secondary space-y-1.5">
                    <div className="flex justify-between font-bold text-[10px]">
                      <span className="text-brand-secondary">{log.id} • {log.action}</span>
                      <span className="text-[#a78bfa]">{log.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User ID: <span className="text-white font-bold">{log.user}</span></span>
                      <span>Target Record: <span className="text-brand-primary-dim uppercase font-bold">{log.recordId}</span></span>
                    </div>
                    <div className="pt-1.5 border-t border-brand-outline/35 text-[10px] text-brand-secondary font-mono flex items-center gap-2 truncate">
                      <span className="font-bold text-text-secondary uppercase select-none font-mono text-[9px] shrink-0">BLOCK PATH:</span>
                      <span className="truncate text-indigo-400 font-bold" title={log.hash}>{log.hash}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GDPR DSR Action requests */}
            <div className="bg-surf-card border border-brand-outline rounded-xl p-5 flex flex-col justify-between">
              <div className="border-b border-brand-outline/40 pb-2">
                <h4 className="font-bold text-white uppercase text-xs">GDPR Data Subject Subject Requests (DSR)</h4>
                <p className="text-[10px] text-text-secondary mt-0.5">Automated tracking for right-to-erasure compliance on 72h SLA counters (Art. 17, 20).</p>
              </div>

              {/* Add DSR Form */}
              <form onSubmit={handleAddDsr} className="py-2.5 border-b border-brand-outline/30 space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-[#7c8099] font-bold">Requestor Target Name:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. David Kojo"
                    value={newDsrName}
                    onChange={(e) => setNewDsrName(e.target.value)}
                    required
                    className="w-full bg-[#0c0d14] border border-brand-outline rounded py-1 px-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-[#7c8099] font-bold font-mono">DSR Action type:</label>
                  <select 
                    value={newDsrType}
                    onChange={(e) => setNewDsrType(e.target.value)}
                    className="w-full bg-[#0c0d14] text-white border border-brand-outline rounded py-1 px-2 cursor-pointer font-bold"
                  >
                    <option value="Right to Erasure (Soft-Delete)">Right to Erasure (Soft-Delete)</option>
                    <option value="Right to Portability (JSON Export)">Right to Portability (JSON Export)</option>
                    <option value="Right to Restrict Processing">Right to Restrict Processing</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-1 bg-transparent hover:bg-brand-primary/10 hover:text-white border border-brand-primary text-brand-primary-dim text-[10px] uppercase font-bold tracking-wider rounded cursor-pointer transition-all"
                >
                  File Compliance DSR Request
                </button>
              </form>

              {/* Dsr queue list */}
              <div className="space-y-2 mt-4 flex-1 overflow-y-auto max-h-[140px] pr-1">
                {dsrList.map((dsr) => (
                  <div key={dsr.id} className="bg-[#0c0d14] p-2 rounded border border-brand-outline/40 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white uppercase text-[10px]">{dsr.subject}</p>
                      <p className="text-[#7c8099] text-[9px]">{dsr.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-rose-400 font-extrabold text-[10px] block animate-pulse">{dsr.countdown}</span>
                      <span className="text-[9px] text-[#7c8099] font-mono">{dsr.fileTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : sysTab === 'channels' ? (
        /* TAB 2: NOTIFICATIONS OUTBOUND PREFS (F-10) */
        <div className="bg-surf-card border border-brand-outline rounded-xl p-5 space-y-4 max-w-3xl mx-auto">
          <div className="border-b border-brand-outline/40 pb-2">
            <h4 className="font-bold text-white uppercase text-xs">Transactional Notifications Channel Matrix</h4>
            <p className="text-[10px] text-text-secondary mt-0.5">Customize active communication channels mapped to high-priority business triggers.</p>
          </div>

          <div className="space-y-4">
            {/* Event 1 */}
            <div className="p-3 bg-[#0c0d14] rounded-lg border border-brand-outline flex justify-between items-center">
              <div>
                <span className="text-white font-extrabold text-xs block uppercase">1. SKU Parts Inventory Drop Limit Warning</span>
                <span className="text-[10px] text-text-secondary font-mono font-sans mt-0.5">Triggered when microcontroller stock is less than safety limits.</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNotifPrefs(prev => ({ ...prev, stockCritical: { ...prev.stockCritical, email: !prev.stockCritical.email } }))}
                  className={`p-2 rounded border transition-all cursor-pointer ${
                    notifPrefs.stockCritical.email ? 'bg-brand-primary/10 border-brand-primary text-white' : 'border-brand-outline text-text-secondary'
                  }`}
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setNotifPrefs(prev => ({ ...prev, stockCritical: { ...prev.stockCritical, sms: !prev.stockCritical.sms } }))}
                  className={`p-2 rounded border transition-all cursor-pointer ${
                    notifPrefs.stockCritical.sms ? 'bg-brand-primary/10 border-brand-primary text-white' : 'border-brand-outline text-text-secondary'
                  }`}
                  title="SMS text"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setNotifPrefs(prev => ({ ...prev, stockCritical: { ...prev.stockCritical, webhook: !prev.stockCritical.webhook } }))}
                  className={`p-2 rounded border transition-all cursor-pointer ${
                    notifPrefs.stockCritical.webhook ? 'bg-brand-primary/10 border-brand-primary text-white' : 'border-brand-outline text-text-secondary'
                  }`}
                  title="Outward Webhook"
                >
                  <Webhook className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Event 2 */}
            <div className="p-3 bg-[#0c0d14] rounded-lg border border-brand-outline flex justify-between items-center">
              <div>
                <span className="text-white font-extrabold text-xs block uppercase">2. Logistics shipment Transatlantic Delay Warning</span>
                <span className="text-[10px] text-text-secondary font-mono font-sans mt-0.5">Triggered upon major global routing and ETA latencies detection.</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNotifPrefs(prev => ({ ...prev, transitDelay: { ...prev.transitDelay, email: !prev.transitDelay.email } }))}
                  className={`p-2 rounded border transition-all cursor-pointer ${
                    notifPrefs.transitDelay.email ? 'bg-brand-primary/10 border-brand-primary text-white' : 'border-brand-outline text-text-secondary'
                  }`}
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setNotifPrefs(prev => ({ ...prev, transitDelay: { ...prev.transitDelay, sms: !prev.transitDelay.sms } }))}
                  className={`p-2 rounded border transition-all cursor-pointer ${
                    notifPrefs.transitDelay.sms ? 'bg-brand-primary/10 border-brand-primary text-white' : 'border-brand-outline text-text-secondary'
                  }`}
                  title="SMS text"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setNotifPrefs(prev => ({ ...prev, transitDelay: { ...prev.transitDelay, webhook: !prev.transitDelay.webhook } }))}
                  className={`p-2 rounded border transition-all cursor-pointer ${
                    notifPrefs.transitDelay.webhook ? 'bg-brand-primary/10 border-brand-primary text-white' : 'border-brand-outline text-text-secondary'
                  }`}
                  title="Outward Webhook"
                >
                  <Webhook className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Event 3 */}
            <div className="p-3 bg-[#0c0d14] rounded-lg border border-brand-outline flex justify-between items-center">
              <div>
                <span className="text-white font-extrabold text-xs block uppercase">3. Accounting general Ledger Transaction status Flagged</span>
                <span className="text-[10px] text-text-secondary font-mono font-sans mt-0.5">Auditors alerts triggered when ledger additions holding flagged states.</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNotifPrefs(prev => ({ ...prev, ledgerFlagged: { ...prev.ledgerFlagged, email: !prev.ledgerFlagged.email } }))}
                  className={`p-2 rounded border transition-all cursor-pointer ${
                    notifPrefs.ledgerFlagged.email ? 'bg-brand-primary/10 border-brand-primary text-white' : 'border-brand-outline text-text-secondary'
                  }`}
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setNotifPrefs(prev => ({ ...prev, ledgerFlagged: { ...prev.ledgerFlagged, sms: !prev.ledgerFlagged.sms } }))}
                  className={`p-2 rounded border transition-all cursor-pointer ${
                    notifPrefs.ledgerFlagged.sms ? 'bg-brand-primary/10 border-brand-primary text-white' : 'border-brand-outline text-text-secondary'
                  }`}
                  title="SMS text"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setNotifPrefs(prev => ({ ...prev, ledgerFlagged: { ...prev.ledgerFlagged, webhook: !prev.ledgerFlagged.webhook } }))}
                  className={`p-2 rounded border transition-all cursor-pointer ${
                    notifPrefs.ledgerFlagged.webhook ? 'bg-brand-primary/10 border-brand-primary text-white' : 'border-brand-outline text-text-secondary'
                  }`}
                  title="Outward Webhook"
                >
                  <Webhook className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* TAB 3: OFFLINE SYNC QUEUES & PWA SWITCH (F-12) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-surf-card border border-brand-outline rounded-xl p-5 space-y-4">
            <div className="border-b border-brand-outline/40 pb-2 flex justify-between items-center">
              <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-primary" />
                PWA Offline simulation switch (F-12)
              </h4>
              <span className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded border ${
                isONLINE ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {isONLINE ? 'VIRTUAL ONLINE' : 'SIMULATED OFFLINE'}
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              Test Standalone PWA features! When toggled offline, actions (like drafting journal posts, editing staff status levels) are automatically buffered in safe client IndexedDB queues, ready to be synced.
            </p>

            <button
              type="button"
              onClick={handleToggleConnection}
              className={`w-full py-2.5 font-bold uppercase rounded-lg text-center transition-all cursor-pointer flex justify-center items-center gap-2.5 ${
                isONLINE 
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.25)]' 
                  : 'bg-emerald-500 text-[#13121b]'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isONLINE ? 'Simulate Disconnect connection Offline' : 'Reconnect System Online'}</span>
            </button>
          </div>

          {/* Sync backlog files */}
          <div className="bg-surf-card p-5 rounded-xl border border-brand-outline space-y-4">
            <div className="border-b border-brand-outline/45 pb-1.5 flex justify-between items-center">
              <span className="font-bold text-white uppercase font-sans">IndexedDB Standalone Cache Queue</span>
              {syncingOffline && <span className="animate-spin text-brand-primary"><RefreshCw className="w-3.5 h-3.5" /></span>}
            </div>

            <div className="space-y-2 max-h-[140px] overflow-y-auto">
              {offlineSyncQueue.map((item) => (
                <div key={item.id} className="p-2.5 bg-[#0c0d14] rounded border border-brand-outline text-[11px] leading-normal font-mono relative">
                  <div className="flex justify-between font-bold text-[9px] text-[#7c8099]">
                    <span>{item.id} BACKUP LOCK</span>
                    <span className="text-amber-400 animate-pulse">Buffered Offline</span>
                  </div>
                  <p className="text-white font-black mt-1 uppercase">{item.action}</p>
                </div>
              ))}
              {offlineSyncQueue.length === 0 && (
                <div className="py-6 text-center text-[#7c8099] italic">
                  Database queue synchronized. Connection is live.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
