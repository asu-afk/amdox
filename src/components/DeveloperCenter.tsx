/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Terminal, 
  Database, 
  Send, 
  Activity, 
  Play, 
  Settings, 
  Plus, 
  BookOpen, 
  Code, 
  Layers, 
  ShieldCheck, 
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function DeveloperCenter() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/erp/state');
  const [selectedPayload, setSelectedPayload] = useState<string>('{}');
  const [stdout, setStdout] = useState<string>('Select an API endpoint and trigger "Send Sandbox Request" to inspect.');
  const [loading, setLoading] = useState<boolean>(false);

  // Webhooks States
  const [webhookUrl, setWebhookUrl] = useState<string>('https://enterprise.client.corp/webhooks/raw');
  const [webhookEvent, setWebhookEvent] = useState<string>('inventory.stock.critical');
  const [webhookLogs, setWebhookLogs] = useState<Array<{id: string, time: string, event: string, status: 'success' | 'failed', details: string}>>([
    { id: 'WH-502', time: '11:02:15 UTC', event: 'shipment.transit.delay', status: 'success', details: 'Delivered successfully with response HTTP 200 OK' },
    { id: 'WH-501', time: '10:14:22 UTC', event: 'ledger.transaction.flagged', status: 'success', details: 'Delivered successfully with response HTTP 201 Created' }
  ]);
  const [webhookSubmitting, setWebhookSubmitting] = useState<boolean>(false);

  const endpoints = {
    'GET /api/erp/state': {
      desc: 'Retrieves aggregated current ledger status, inventory products, shipments, AI predictions, and active employee profiles.',
      mimetype: 'application/json',
      schema: 'none',
      mockResponse: {
        success: true,
        managedAssetsStrength: 1045230,
        ledgerCount: 18,
        activeStaff: 5,
        warehouseIndices: ["Austin", "Rotterdam", "Singapore"]
      }
    },
    'POST /api/erp/transaction': {
      desc: 'Create or update accounting journal entries. Requires double-entry math criteria checks.',
      mimetype: 'application/json',
      schema: JSON.stringify({
        account: "Mouser Electronics Co",
        type: "debit",
        amount: 14500,
        department: "Engineering",
        description: "Prototype microcontrollers component logistics"
      }, null, 2),
      mockResponse: {
        success: true,
        action: "LEDGER_ENTRY_COMMITTED",
        transaction: {
          id: "TX-10493",
          date: "2026-05-30",
          account: "Mouser Electronics Co",
          type: "debit",
          amount: 14500,
          department: "Engineering",
          status: "cleared"
        }
      }
    },
    'POST /api/erp/inventory/reorder': {
      desc: 'Dispatches automated supplier raw microcontroller orders.',
      mimetype: 'application/json',
      schema: JSON.stringify({
        sku: "MCU-V5-AMDX",
        orderQty: 1000
      }, null, 2),
      mockResponse: {
        success: true,
        action: "REORDER_DISPATCH_TRIGGERED",
        sku: "MCU-V5-AMDX",
        orderedQuantity: 1000,
        supplierStatus: "acknowledged",
        dispatchChannel: "BullMQ Process Core"
      }
    },
    'POST /api/erp/hr/employee': {
      desc: 'Register a talent profile onboarding record inside the corporate employee master.',
      mimetype: 'application/json',
      schema: JSON.stringify({
        name: "Arthur Chen",
        role: "Principal AI Infrastructure Architect",
        department: "Engineering",
        email: "a.chen@amdox.com",
        salary: 22000,
        status: "active"
      }, null, 2),
      mockResponse: {
        success: true,
        employee: {
          id: "EMP-9022",
          name: "Arthur Chen",
          role: "Principal AI Infrastructure Architect",
          department: "Engineering",
          email: "a.chen@amdox.com",
          salary: 22000,
          status: "active"
        }
      }
    }
  };

  const handleSelectEndpoint = (key: string) => {
    setSelectedEndpoint(key);
    setSelectedPayload((endpoints as any)[key].schema);
  };

  const handleFireEndpoint = () => {
    setLoading(true);
    setStdout('Opening TLS interface, generating security JWT payload...\n\n');
    
    setTimeout(() => {
      const data = (endpoints as any)[selectedEndpoint].mockResponse;
      setStdout(prev => prev + `[HTTP 200 OK] Fetch complete in 12ms\n\nContent-Type: application/json\n\n` + JSON.stringify(data, null, 2));
      setLoading(false);
    }, 400);
  };

  const handleTestWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl) return;

    setWebhookSubmitting(true);
    
    setTimeout(() => {
      const newLog = {
        id: `WH-${Math.floor(500 + Math.random() * 400)}`,
        time: new Date().toISOString().replace('T', ' ').substring(11, 19) + ' UTC',
        event: webhookEvent,
        status: 'success' as const,
        details: 'Simulated Payload transmitted successfully with 200 OK closure.'
      };
      setWebhookLogs(prev => [newLog, ...prev]);
      setWebhookSubmitting(false);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono text-xs">
      
      {/* Top developer indicators banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surf-card p-4 rounded-xl border border-brand-outline flex justify-between items-center">
          <div>
            <span className="text-[10px] text-text-secondary uppercase">API Gateway REST Core</span>
            <h4 className="text-sm font-bold text-white mt-1">OpenAPI 3.1 Spec</h4>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 py-1 px-2 rounded font-bold uppercase border border-emerald-500/20">Published</span>
        </div>
        <div className="bg-surf-card p-4 rounded-xl border border-brand-outline flex justify-between items-center">
          <div>
            <span className="text-[10px] text-text-secondary uppercase">GraphQL Engine Status</span>
            <h4 className="text-sm font-bold text-white mt-1">Apollo v4 Router</h4>
          </div>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 py-1 px-2 rounded font-bold uppercase border border-indigo-500/20">Standby</span>
        </div>
        <div className="bg-surf-card p-4 rounded-xl border border-brand-outline flex justify-between items-center">
          <div>
            <span className="text-[10px] text-text-secondary uppercase">Outbox Message Queue</span>
            <h4 className="text-sm font-bold text-white mt-1">Redis 8 + BullMQ</h4>
          </div>
          <span className="text-[10px] text-[#00d4aa] bg-[#00d4aa]/10 py-1 px-2 rounded font-bold uppercase border border-[#00d4aa]/20">Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Playgound REST API Terminal sandbox */}
        <div className="bg-surf-card border border-brand-outline rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-brand-outline bg-[#0c0d14]/60 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-primary" />
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">REST API Gateway Playground</h3>
            </div>
            <span className="text-[10px] text-text-secondary uppercase font-semibold">Sandbox Console</span>
          </div>

          <div className="p-5 space-y-4 flex-1">
            <div className="space-y-1.5 subheader">
              <label className="text-[10px] uppercase text-text-secondary font-bold select-none tracking-widest">Select Resource Route:</label>
              <div className="flex flex-col gap-1 select-box-list max-h-32 overflow-y-auto pr-1">
                {Object.keys(endpoints).map((route) => (
                  <button
                    key={route}
                    type="button"
                    onClick={() => handleSelectEndpoint(route)}
                    className={`py-1.5 px-3 rounded text-left transition-all ${
                      selectedEndpoint === route 
                        ? 'bg-brand-primary text-white font-bold' 
                        : 'bg-surf-lowest text-text-secondary hover:text-white border border-brand-outline/40'
                    }`}
                  >
                    {route}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-text-secondary font-bold select-none tracking-widest">Route Endpoint Description:</label>
              <p className="text-[11px] text-text-secondary leading-normal font-sans">
                {(endpoints as any)[selectedEndpoint].desc}
              </p>
            </div>

            {selectedPayload !== 'none' && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-text-secondary font-bold select-none tracking-wider">JSON Input Template payload:</label>
                <textarea
                  value={selectedPayload}
                  onChange={(e) => setSelectedPayload(e.target.value)}
                  className="w-full bg-[#0c0d14] text-text-primary border border-brand-outline h-28 p-3 rounded-lg focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>
            )}

            <button
              onClick={handleFireEndpoint}
              disabled={loading}
              className="w-full py-2.5 bg-brand-primary text-white rounded-lg flex items-center justify-center gap-2.5 font-bold uppercase hover:bg-brand-primary/95 transition-all shadow-[0_0_12px_rgba(124,106,255,0.3)] cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Transmitting Data...' : 'Send Sandbox Request'}</span>
            </button>
          </div>
        </div>

        {/* API Response display */}
        <div className="bg-[#0c0d14] border border-brand-outline rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-brand-outline bg-[#030305] flex justify-between items-center">
            <span className="text-brand-secondary font-bold">STDOUT RECRUITMENT LOGS</span>
            <span className="text-[9px] bg-brand-secondary/10 text-brand-secondary px-2 py-0.5 rounded border border-brand-secondary/20">TLS v1.3</span>
          </div>
          <div className="p-5 flex-1 select-text selection:bg-brand-primary/45 selection:text-white h-[360px] overflow-y-auto block whitespace-pre z-0">
            {stdout}
          </div>
        </div>

      </div>

      {/* Webhook dispatcher setup section F-11 */}
      <div className="bg-surf-card rounded-xl border border-brand-outline overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-outline flex justify-between items-center bg-[#0c0d14]/30">
          <div>
            <h4 className="text-sm font-bold text-white uppercase font-sans">Custom Outbound Webhook Subscriptions</h4>
            <p className="text-xs text-[#7c8099] font-mono mt-0.5">Subscribe external third-party servers to dispatch-triggered real-time events</p>
          </div>
          <span className="text-[11px] font-bold text-brand-primary-dim uppercase tracking-wider font-mono">F-11 SPEC</span>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <form onSubmit={handleTestWebhook} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-text-secondary font-bold select-none block">Listener Destination Endpoint URL:</label>
              <input 
                type="url" 
                placeholder="https://company-server.corp/incoming-hook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                required
                className="w-full bg-[#0c0d14] border border-brand-outline rounded-lg py-2 px-3 text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-text-secondary font-bold select-none block font-mono">Event Trigger Category:</label>
                <select 
                  value={webhookEvent}
                  onChange={(e) => setWebhookEvent(e.target.value)}
                  className="w-full bg-[#0c0d14] text-white border border-brand-outline rounded-lg py-2 px-3 focus:outline-none focus:border-brand-primary cursor-pointer font-bold"
                >
                  <option value="inventory.stock.critical">inventory.stock.critical (Low stock warn)</option>
                  <option value="shipment.transit.delay">shipment.transit.delay (Logistics disruption)</option>
                  <option value="ledger.transaction.flagged">ledger.transaction.flagged (Auditors alert)</option>
                  <option value="payroll.cycle.initiated">payroll.cycle.initiated (HR compensation audit)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-text-secondary font-bold select-none block font-mono">Signature Hash Method:</label>
                <div className="bg-[#0c0d14] border border-brand-outline rounded-lg py-2 px-3 text-text-secondary select-none font-bold">
                  HMAC-SHA256 (Signed)
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={webhookSubmitting}
              className="w-full bg-transparent hover:bg-brand-primary/10 hover:text-white border border-brand-primary text-brand-primary-dim py-2 px-4 rounded-lg font-bold uppercase transition-all select-none cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{webhookSubmitting ? 'Transmitting webhook...' : 'Simulate Outbound Event dispatch'}</span>
            </button>
          </form>

          {/* Weblogs table */}
          <div className="space-y-3">
            <h5 className="text-[10px] uppercase text-text-secondary tracking-widest font-extrabold select-none">Webhooks Dispatch History Log</h5>
            <div className="border border-brand-outline/65 rounded-lg overflow-hidden">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="bg-[#030305] border-b border-brand-outline">
                    <th className="p-2 py-1.5 text-[9px] text-[#7c8099] uppercase">ID</th>
                    <th className="p-2 py-1.5 text-[9px] text-[#7c8099] uppercase">Timestamp</th>
                    <th className="p-2 py-1.5 text-[9px] text-[#7c8099] uppercase">Event Trigger</th>
                    <th className="p-2 py-1.5 text-[9px] text-[#7c8099] uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {webhookLogs.map((log) => (
                    <tr key={log.id} className="border-b border-brand-outline/20 hover:bg-[#161822]">
                      <td className="p-2 text-brand-secondary font-bold">{log.id}</td>
                      <td className="p-2 text-[#7c8099]">{log.time}</td>
                      <td className="p-2 text-white font-bold">{log.event}</td>
                      <td className="p-2 text-center text-[10px]">
                        <span className="bg-[#52e5a3]/10 text-[#52e5a3] rounded-full px-2 py-0.5 border border-[#52e5a3]/20 uppercase font-black tracking-wide">
                          SUCCESS
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
