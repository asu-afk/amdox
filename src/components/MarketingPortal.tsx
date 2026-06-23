/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Layers, 
  Terminal, 
  TrendingUp, 
  ChevronRight, 
  Workflow, 
  LineChart, 
  Lock, 
  FileText, 
  Users, 
  Clock, 
  Database, 
  BookOpen,
  Boxes,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface MarketingPortalProps {
  onEnterSSO: () => void;
  userEmail: string;
}

export default function MarketingPortal({ onEnterSSO, userEmail }: MarketingPortalProps) {
  const displayName = userEmail && userEmail.includes('@')
    ? userEmail.split('@')[0].split(/[._-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'User';

  const designPatterns = [
    { title: 'Domain-Driven Design (DDD)', app: 'Bounded contexts configured separately for Finance, HR, and Supply Chain.' },
    { title: 'CQRS Architectural Segregation', app: 'Independent query structures for reporting & BI distinct from ledger write channels.' },
    { title: 'Outbox Delivery Pattern', app: 'SQL write commits accompanied by local outbox logs processed asynchronously via BullMQ.' },
    { title: 'Saga State Orchestration', app: 'Payroll batch loops structured in multi-tier sagas with rollback transaction buffers.' },
  ];

  return (
    <div className="min-h-screen bg-[#13121b] text-text-primary selection:bg-brand-primary/30 selection:text-white">
      {/* Dynamic Grid Background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Public Header */}
      <header className="sticky top-0 z-50 bg-[#13121b]/90 backdrop-blur-md border-b border-brand-outline">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-[#00d4aa] flex items-center justify-center shadow-[0_0_15px_rgba(124,106,255,0.4)]">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-sans font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-[#a78bfa] bg-clip-text text-transparent">
                AMDOX
              </span>
              <span className="ml-2 text-[10px] font-mono tracking-widest text-[#00d4aa] px-2 py-0.5 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 uppercase">
                ERP SUITE
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-xs text-text-secondary font-mono">
              SLA Status: <span className="text-[#00d4aa] font-bold">● 99.9% Certified</span>
            </div>
            <button 
              onClick={onEnterSSO}
              className="relative px-5 py-2 overflow-hidden rounded-lg bg-brand-primary text-white text-xs font-bold font-mono tracking-wider hover:bg-brand-primary/95 transition-all shadow-[0_0_15px_rgba(124,106,255,0.4)] group overflow-hidden cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch Live ERP Console <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-brand-primary-dim to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Showcase Center */}
      <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/25 rounded-full text-[11px] font-mono text-brand-primary-dim uppercase tracking-wider">
            <Zap className="w-3 h-3 animate-pulse text-[#00d4aa]" />
            Enterprise software with next-generation predictive intelligence
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Welcome, {displayName}! <br />
            <span className="bg-gradient-to-r from-[#a78bfa] via-[#00d4aa] to-[#52e5a3] bg-clip-text text-transparent">
              Your workspace is ready.
            </span>
          </h1>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button 
              onClick={onEnterSSO}
              className="bg-white hover:bg-white/95 text-[#13121b] text-xs font-bold py-3 px-8 rounded-lg transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] cursor-pointer hover:scale-[1.02]"
            >
              Sign In
            </button>
          </div>
        </div>

       {/* Dashboard Preview Interface Mock - Frameless */}
        <div className="mt-16 bg-surf-lowest border border-brand-outline rounded-xl p-3 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-5xl mx-auto overflow-hidden relative group">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-1.5 pb-4 border-b border-brand-outline/55">
            <div className="w-3 h-3 rounded-full bg-rose-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="ml-4 font-mono text-[10px] text-text-secondary select-none">
              https://amdox.secure.erp/interactive-cockpit
            </span>
          </div>
          
          <div className="pt-8 text-center text-text-secondary font-mono text-xs">
            Console ready. Sign in to boot Amdox Cognitive Ledger Engine.
          </div>
        </div>
      </section>

      <div className="py-8" />


      {/* Modern Compact Site Footer */}
      <footer className="bg-surf-lowest py-8 px-6 border-t border-brand-outline">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-text-secondary">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-primary" />
            <span>Amdox Technologies • Engineering Division • April 2026</span>
          </div>
          <div>
            Classification: <span className="text-white font-extrabold uppercase">Internal Corporate Distribution Node</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
