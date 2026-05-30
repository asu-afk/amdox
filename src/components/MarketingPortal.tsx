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
  const [activePlanWeek, setActivePlanWeek] = useState<number>(1);

  const nfrCards = [
    { cat: 'Availability', target: '99.9% Uptime', test: 'UptimeRobot + PagerDuty', desc: 'Continuous multi-region fallback redundancy.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { cat: 'API Latency', target: '< 300ms P95', test: 'Prometheus + Grafana', desc: 'Fast client requests via NestJS & Prisma DB index.', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { cat: 'Throughput', target: '>= 2,000 active users', test: 'k6 performance test', desc: 'Stateless server cluster scaled horizontally.', color: 'text-[#00d4aa] bg-[#00d4aa]/10 border-[#00d4aa]/20' },
    { cat: 'Data Durability', target: 'RPO < 15m, RTO < 60m', test: 'DR runbook verification', desc: 'Point-in-time recovery via PostgreSQL WAL archives.', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { cat: 'Security Standards', target: 'OWASP + SOC 2 Type II', test: 'Quarterly pen-tests', desc: 'Hardware MFA keys and OIDC access protocol.', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  ];

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
                Enterprise Suite
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
            Consolidate Workflows. <br />
            <span className="bg-gradient-to-r from-[#a78bfa] via-[#00d4aa] to-[#52e5a3] bg-clip-text text-transparent">
              Orchestrate Enterprise Value.
            </span>
          </h1>

          <p className="text-sm md:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto font-sans">
            A secure cloud-native ERP platform synthesizing real-time financial ledger analytics, predictive supply chains, talent lifecycle processing, and self-serve business intelligence in a unified secure dashboard.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button 
              onClick={onEnterSSO}
              className="bg-white hover:bg-white/95 text-[#13121b] text-xs font-bold py-3 px-8 rounded-lg transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] cursor-pointer hover:scale-[1.02]"
            >
              Sign In with Multi-Tenant SSO
            </button>
            <a 
              href="#execution-plan"
              className="bg-surf-card hover:bg-surf-high/80 text-text-primary text-xs font-semibold py-3 px-8 rounded-lg border border-brand-outline transition-all cursor-pointer"
            >
              Examine 28-Day Execution Plan
            </a>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
            <div className="bg-surf-card p-4 rounded-lg border border-brand-outline/80">
              <span className="text-[10px] font-mono tracking-widest text-[#00d4aa] uppercase">FINANCIAL LEDGER (GL)</span>
              <h3 className="text-lg font-bold text-white mt-1">AP/AR Double-Entry Core</h3>
              <p className="text-xs text-text-secondary mt-1 font-sans">
                Parity verified ledger logs preventing unbalanced transaction book adjustments.
              </p>
            </div>
            <div className="bg-surf-card p-4 rounded-lg border border-brand-outline/80">
              <span className="text-[10px] font-mono tracking-widest text-[#a78bfa] uppercase">AI DEMAND FORECASTING</span>
              <h3 className="text-lg font-bold text-white mt-1">Prophet + LSTM ML Model</h3>
              <p className="text-xs text-text-secondary mt-1 font-sans">
                Predictive telemetry analytics with confidence thresholds optimized weekly.
              </p>
            </div>
            <div className="bg-surf-card p-4 rounded-lg border border-brand-outline/80">
              <span className="text-[10px] font-mono tracking-widest text-[#ffa940] uppercase">GLOBAL SCM & INVENTORY</span>
              <h3 className="text-lg font-bold text-white mt-1">Auto-Demand Pull Engine</h3>
              <p className="text-xs text-text-secondary mt-1 font-sans">
                Threshold-triggered raw microcontroller procurement dispatches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target User Matrices section */}
      <section className="bg-surf-lowest py-20 px-6 border-y border-brand-outline">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Target User Roles & Contexts</h2>
            <p className="text-sm text-text-secondary font-sans">
              Designed to serve specialized tactical business functions in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-surf-card p-6 rounded-xl border border-brand-outline">
              <h3 className="text-[#a78bfa] text-xs font-bold font-mono tracking-widest uppercase mb-1">C-SUITE DIRECTORS</h3>
              <h4 className="text-lg font-bold text-white mb-2">Real-Time Core KPI Dials</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                Executive reporting tools displaying real-time asset strength, consolidated cash holdings, and risk margins.
              </p>
            </div>
            <div className="bg-surf-card p-6 rounded-xl border border-brand-outline">
              <h3 className="text-[#00d4aa] text-xs font-bold font-mono tracking-widest uppercase mb-1">FINANCIAL TEAMS</h3>
              <h4 className="text-lg font-bold text-white mb-2">General Ledger & Reconciliation</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                Automated multi-currency rate tracking, ledger close routines, payment runs, and automated AP billing tasks.
              </p>
            </div>
            <div className="bg-surf-card p-6 rounded-xl border border-brand-outline">
              <h3 className="text-amber-400 text-xs font-bold font-mono tracking-widest uppercase mb-1">HR & TALENT PARITY</h3>
              <h4 className="text-lg font-bold text-white mb-2">Lifecycle & Payroll Compliance</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                Staff candidate registries, double-tier tax calculations, leave track workflows, and bulk payroll runs.
              </p>
            </div>
            <div className="bg-surf-card p-6 rounded-xl border border-brand-outline">
              <h3 className="text-teal-400 text-xs font-bold font-mono tracking-widest uppercase mb-1">SUPPLY CHAIN CONTROL</h3>
              <h4 className="text-lg font-bold text-white mb-2">Inventory Levels & Reorder Schedules</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                Stock replenishment dispatch limits, automated vendor correspondence, and temperature chain cargo logging.
              </p>
            </div>
            <div className="bg-surf-card p-6 rounded-xl border border-brand-outline">
              <h3 className="text-sky-400 text-xs font-bold font-mono tracking-widest uppercase mb-1">PROJECT MANAGERS</h3>
              <h4 className="text-lg font-bold text-white mb-2">Gantt Track & Resource Assignment</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                Milestone deadline alerts, staff task bandwidth trackers, and 10% budget overflow warning matrices.
              </p>
            </div>
            <div className="bg-surf-card p-6 rounded-xl border border-brand-outline">
              <h3 className="text-rose-400 text-xs font-bold font-mono tracking-widest uppercase mb-1">IT ADMINISTRATORS</h3>
              <h4 className="text-lg font-bold text-white mb-2">Isolation Audit & Spec Portals</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                Multi-tenant SSO settings, immutable security logs, real-time API specifications, and database health monitors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Non-Functional SLA Targets */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">System Performance SLAs & Safety Controls</h2>
          <p className="text-sm text-text-secondary font-sans leading-relaxed">
            Meets rigid multi-regional transaction thresholds, compliant with GDPR and SOC 2 Type II controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {nfrCards.map((nfr, i) => (
            <div key={i} className="bg-surf-card p-5 rounded-xl border border-brand-outline flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-text-secondary uppercase select-noneBlock block mb-1">
                  {nfr.cat}
                </span>
                <h3 className="text-lg font-extrabold text-white font-mono">{nfr.target}</h3>
              </div>
              <p className="text-xs text-text-secondary font-sans leading-relaxed">
                {nfr.desc}
              </p>
              <div className={`text-[10px] font-mono px-2 py-1 rounded inline-block text-center border font-bold ${nfr.color}`}>
                Target verified: {nfr.test}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture layers section */}
      <section className="bg-surf-lowest py-20 px-6 border-t border-brand-outline">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-white">Advanced System Design Patterns</h2>
            <p className="text-sm text-text-secondary leading-relaxed font-sans">
              To withstand demanding concurrent enterprise transactions, Amdox Core is engineered with premium clean-coding architectures. We isolate state mutations, structure parallel transactional sagas, and maintain clean domain boundaries.
            </p>
            
            <div className="space-y-4">
              {designPatterns.map((pat, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-primary/15 text-[#a78bfa] flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-[10px]">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{pat.title}</h4>
                    <p className="text-xs text-text-secondary mt-1 font-sans">{pat.app}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-surf-card p-6 rounded-2xl border border-brand-outline space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-[#00d4aa] uppercase">SYSTEM LAYERS STACK</h3>
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 bg-surf-lowest rounded border border-brand-outline flex justify-between items-center">
                <span className="text-white font-bold">CLIENT CORE VIEW</span>
                <span className="text-brand-primary-dim text-[10px] bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20">Next.js 15 SPA</span>
              </div>
              <div className="p-3 bg-surf-lowest rounded border border-brand-outline flex justify-between items-center">
                <span className="text-white font-bold">MUTATION CONTROLLER</span>
                <span className="text-indigo-400 text-[10px] bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">NestJS 11 Gateway</span>
              </div>
              <div className="p-3 bg-surf-lowest rounded border border-brand-outline flex justify-between items-center">
                <span className="text-white font-bold">PREDICTIVE ANALYTICS</span>
                <span className="text-amber-400 text-[10px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Python + Prophet + LSTM</span>
              </div>
              <div className="p-3 bg-surf-lowest rounded border border-brand-outline flex justify-between items-center">
                <span className="text-white font-bold">DATABASE LAYER</span>
                <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">PostgreSQL + Prisma ORM</span>
              </div>
              <div className="p-3 bg-surf-lowest rounded border border-brand-outline flex justify-between items-center">
                <span className="text-white font-bold">CACHING & MESSAGING</span>
                <span className="text-rose-400 text-[10px] bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Redis 8 + BullMQ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chronological 28-Day Execution Roadmap (Section 4) */}
      <section id="execution-plan" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Granular 28-Day Launch Roadmap</h2>
          <p className="text-sm text-text-secondary font-sans leading-relaxed">
            Chronological blueprint detailing platform architectural phases from discovery to global QA release.
          </p>

          {/* Week tab selectors */}
          <div className="flex justify-center gap-1.5 pt-4">
            {[1, 2, 3, 4].map((w) => (
              <button
                key={w}
                onClick={() => setActivePlanWeek(w)}
                className={`py-1.5 px-4 rounded text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  activePlanWeek === w 
                    ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(124,106,255,0.3)]'
                    : 'text-text-secondary bg-surf-card hover:bg-surf-high/60 border border-brand-outline'
                }`}
              >
                Week {w} {w === 1 && '• Core'} {w === 2 && '• Modules'} {w === 3 && '• AI & BI'} {w === 4 && '• Operations'}
              </button>
            ))}
          </div>
        </div>

        {/* Roadmap Steps */}
        <div className="bg-surf-card border border-brand-outline rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
          {activePlanWeek === 1 && (
            <div className="space-y-6">
              <h3 className="text-[#a78bfa] font-mono text-xs font-bold uppercase tracking-wider">WEEK 1: FOUNDATION, DYNAMIC ARCHITECTURE & AUTH</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                <div className="space-y-2 border-l-2 border-brand-primary/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-brand-primary" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 1 - Discovery & Planning</h4>
                  <ul className="text-xs text-text-secondary list-disc pl-4 space-y-1 font-sans">
                    <li>Execute stakeholder workshops (Finance, Logistics, IT).</li>
                    <li>Conduct competitor analysis matrices (SAP S/4HANA vs NetSuite).</li>
                    <li>Define MVP criteria & scope boundary parameters.</li>
                  </ul>
                </div>
                <div className="space-y-2 border-l-2 border-brand-primary/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-brand-primary" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 2 - Architecture Design</h4>
                  <ul className="text-xs text-text-secondary list-disc pl-4 space-y-1 font-sans">
                    <li>Map domain boundaries and model database relations.</li>
                    <li>Design C4 container schemas and parameter mapping indexes.</li>
                  </ul>
                </div>
                <div className="space-y-2 border-l-2 border-brand-primary/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-brand-primary" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 4 - Multi-Tenant Authentication</h4>
                  <ul className="text-xs text-text-secondary list-disc pl-4 space-y-1 font-sans">
                    <li>Keycloak cluster configurations with SAML / OIDC routing.</li>
                    <li>Implement tenant context middlewares and Role-Based safeguards.</li>
                  </ul>
                </div>
                <div className="space-y-2 border-l-2 border-brand-primary/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-brand-primary" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 6 - Base API Gateways</h4>
                  <ul className="text-xs text-text-secondary list-disc pl-4 space-y-1 font-sans">
                    <li>Configure NestJS pipeline exception interceptors and Swagger specs.</li>
                    <li>Integrate health endpoints (`/health/live`, `/health/db`).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activePlanWeek === 2 && (
            <div className="space-y-6">
              <h3 className="text-[#00d4aa] font-mono text-xs font-bold uppercase tracking-wider">WEEK 2: CORE ENTERPRISE OPERATIONS MODULES</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                <div className="space-y-2 border-l-2 border-[#00d4aa]/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-[#00d4aa]" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 8-9 - Ledger System & AP/AR</h4>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    Deploy math parity validators for general ledger inputs. Conduct automatic multi-currency conversion queries and period locking logic.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-[#00d4aa]/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-[#00d4aa]" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 10 - HR Lifecycle Core</h4>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    Set up employee master databases, tracking recursive hierarchy directories alongside leave state machines.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-[#00d4aa]/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-[#00d4aa]" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 11 - Payroll Saga Builder</h4>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    Build gross-to-net tax engines, processing batch runs through BullMQ with async compensators on any failure.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-[#00d4aa]/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-[#00d4aa]" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 12-13 - Supply Chain Flow</h4>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    Configure vendor profile catalog interfaces. Deploy reorder dispatches that trigger automatically when stock drops below safety limits.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePlanWeek === 3 && (
            <div className="space-y-6">
              <h3 className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">WEEK 3: ML DEMAND MODEL, BI DASHBOARDS & EVENT GATE</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                <div className="space-y-2 border-l-2 border-amber-400/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-amber-400" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 15-16 - Demand ML Microservice</h4>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    Integrate Prophet & LSTM sku forecasting. Cache prediction vectors in Redis, retraining predictive algorithms on weekly crons.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-amber-400/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-amber-400" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 17 - Analytics & Drilldowns</h4>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    Mount custom Recharts widgets matching transactional database segments. Trigger automatic ledger filtering upon category chart clicks.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-amber-400/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-amber-400" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 18 - Project Management Gantt</h4>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    Render interactive progress Gantt views, mapping project milestones, resource allocation density, and budget variance limits.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-amber-400/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-amber-400" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 20 - Compliance & Security</h4>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    Harden system headers using Helmet.js. Sanitize input variables via Zod to avoid malicious SQL injections.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePlanWeek === 4 && (
            <div className="space-y-6">
              <h3 className="text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">WEEK 4: CONTAINERIZATION, CLOUD DISPATCH & OBSERVE</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                <div className="space-y-2 border-l-2 border-rose-400/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-rose-400" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 22 - Distroless Docker Build</h4>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    Set up multi-stage secure Docker images for services. Check image integrity using scanners before continuous deployment steps.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-rose-400/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-rose-400" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 25 - Production Cloud Run</h4>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    Launch staging environments on cloud pipelines. Link Postgres replicas with continuous read-write segregation support.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-rose-400/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-rose-400" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 26 - OpenTelemetry Logs</h4>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    Deploy metric scrapers and trace collectors. Configure real-time anomaly thresholds on Prometheus coupled with alert channels.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-rose-400/40 pl-4 relative">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-rose-400" />
                  <h4 className="text-xs font-mono font-bold text-white">Day 28 - Final QA Validation</h4>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    Execute automated cross-browser checks. Verify responsiveness and accessibility limits compliant with international specifications.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

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
