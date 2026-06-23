/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  LayoutDashboard, 
  DollarSign, 
  Warehouse, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Terminal, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface OnboardingGuideProps {
  activeModule: 'analytics' | 'finance' | 'scm' | 'hr' | 'project' | 'compliance' | 'specs';
  setActiveModule: (module: 'analytics' | 'finance' | 'scm' | 'hr' | 'project' | 'compliance' | 'specs') => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingGuide({ 
  activeModule, 
  setActiveModule, 
  isOpen, 
  onClose 
}: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Guide Steps definition
  const steps = [
    {
      title: "Welcome to Amdox Vision ERP",
      shortTitle: "Intro",
      description: "Welcome to your Unified Vision ERP cockpit. This guide will walk you through our mission-critical enterprise modules. Let's explore each division of Amdox.",
      icon: <Sparkles className="w-8 h-8 text-[#00d4aa] animate-pulse" />,
      module: null,
      highlightText: "Press 'Next' to automatically navigate through each functional division in real-time."
    },
    {
      title: "BI Workbenches & Analytics",
      shortTitle: "BI Analytics",
      description: "Harness predictive AI scoring and dynamic data visualization. Here, you monitor active logistics corridors, macro performance index metrics, and supply demand shifts.",
      icon: <LayoutDashboard className="w-8 h-8 text-brand-primary" />,
      module: 'analytics' as const,
      highlightText: "Look behind this window — we have pre-rendered the business intelligence dashboards for you."
    },
    {
      title: "Double GL Ledger Controller",
      shortTitle: "GL Finance",
      description: "Review double-entry accounting transactions. Register manual manual journal entries with built-in asset preservation checks, value ledger postings, and audit clearing.",
      icon: <DollarSign className="w-8 h-8 text-emerald-400" />,
      module: 'finance' as const,
      highlightText: "Keep an eye on the audit states! Flagged transactions require risk remediation."
    },
    {
      title: "Supply Chain & SKU Logistics",
      shortTitle: "SCM SKU",
      description: "Ensure operational stability. Manage item stock levels, verify supplier contract conditions, and coordinate prompt reorders before warehouse limits trip alerts.",
      icon: <Warehouse className="w-8 h-8 text-[#00b5d3]" />,
      module: 'scm' as const,
      highlightText: "You can expedite global transit shipments to avoid interdepartmental delays."
    },
    {
      title: "HR Workspace & Core Payroll",
      shortTitle: "HR & 10k Payroll",
      description: "Empower your corporate teams. Onboard key architects, view salary aggregates, execute instant automated transfers, and manage security clearance tiers.",
      icon: <Users className="w-8 h-8 text-amber-400" />,
      module: 'hr' as const,
      highlightText: "Easily adjust active payroll balances or flag personnel leaves directly from here."
    },
    {
      title: "Milestones & Gantt Tracking",
      shortTitle: "Milestones",
      description: "Track epic timelines and cross-functional task states. Keep alignment on engineering sprints, core supply rollouts, and compliance targets.",
      icon: <Briefcase className="w-8 h-8 text-fuchsia-400" />,
      module: 'project' as const,
      highlightText: "Visualize your structural milestones to preempt bottleneck delays."
    },
    {
      title: "Audit & Regulatory Compliance",
      shortTitle: "Audit (F-09)",
      description: "Rest easy with automated audit parity tools. We cross-examine cryptographic ledger block hashes to detect security drift, anomalies, or system faults automatically.",
      icon: <ShieldCheck className="w-8 h-8 text-red-400" />,
      module: 'compliance' as const,
      highlightText: "Our real-time ledger verification ensures flawless compliance reports."
    },
    {
      title: "Developer Gateway & API Tech Specs",
      shortTitle: "OpenAPI Specs",
      description: "Integrate with the outside world. Explore complete technical schemas, test REST server routes directly of full-isolated databases, and securely connect webhooks.",
      icon: <Terminal className="w-8 h-8 text-purple-400" />,
      module: 'specs' as const,
      highlightText: "Explore our real-time developer endpoints and server responses inside the sandbox."
    },
    {
      title: "Ready for Deep Flight operations",
      shortTitle: "Complete",
      description: "Congratulations! You are officially validated for all systems in the Amdox Enterprise ecosystem. Use the floating 3D robot Ammy below for live AI consultation at any time.",
      icon: <Sparkles className="w-8 h-8 text-[#55fcd0]" />,
      module: null,
      highlightText: "Need this refresher again? Simply click the Help icon in the top right header."
    }
  ];

  // Drive active modules in background as the user proceeds in their guide steps
  useEffect(() => {
    if (!isOpen) return;
    const targetModule = steps[currentStep].module;
    if (targetModule) {
      setActiveModule(targetModule);
    }
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const current = steps[currentStep];
  const progressPercent = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="fixed inset-0 bg-[#06070c]/85 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      {/* Decorative backdrop mesh layout */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,106,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,106,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Main interactive card container */}
      <div className="relative max-w-lg w-full bg-[#11121d] border border-white/10 rounded-2xl p-6 md:p-7 shadow-[0_0_50px_rgba(124,106,255,0.18)] flex flex-col space-y-6 overflow-hidden animate-fade-in font-sans">
        
        {/* Glow corner accent */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-1 px-2.5 rounded bg-brand-primary/10 border border-brand-primary/20 text-brand-primary-dim text-[10px] font-mono uppercase font-black tracking-widest">
              SYSTEM ONBOARDER
            </div>
            <span className="text-stone-500 font-mono text-[10px] sm:inline hidden">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors p-1"
            title="Skip Guide & close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic visual slider */}
        <div className="flex items-start gap-4 z-10 py-2">
          <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl flex-shrink-0 shadow-inner">
            {current.icon}
          </div>
          <div className="space-y-1.5 flex-1 select-text">
            <h3 className="text-white font-bold text-base tracking-tight font-sans">
              {current.title}
            </h3>
            <p className="text-zinc-300 text-xs leading-relaxed font-sans font-normal">
              {current.description}
            </p>
          </div>
        </div>

        {/* Interactive Highlight/Action helper box */}
        <div className="p-3.5 bg-[#0a0b12] border border-white/5 rounded-xl flex items-start gap-2.5 z-10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
          <HelpCircle className="w-3.5 h-3.5 text-[#00d4aa] flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-[10px] font-mono text-zinc-550 uppercase font-bold tracking-wider">Interface Instruction</p>
            <p className="text-xs text-zinc-400 font-sans tracking-wide">
              {current.highlightText}
            </p>
          </div>
        </div>

        {/* Modular Step Navigation list */}
        <div className="hidden sm:flex items-center justify-between gap-1 py-1 z-10 overflow-x-auto no-scrollbar border-t border-b border-white/5">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`px-2 py-1 text-[9px] font-mono font-bold uppercase rounded border transition-all truncate ${
                idx === currentStep
                  ? 'bg-brand-primary border-brand-primary text-white shadow-[0_0_8px_rgba(124,106,255,0.2)]'
                  : 'bg-black/20 border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10'
              }`}
            >
              {s.shortTitle}
            </button>
          ))}
        </div>

        {/* High performance progress indicators */}
        <div className="space-y-2 z-10">
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-brand-primary to-[#00d4aa] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
            <span>START</span>
            <span>SYSTEM READY</span>
          </div>
        </div>

        {/* Navigation Action Buttons footer */}
        <div className="flex items-center justify-between pt-2 z-10">
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white text-xs font-mono font-bold uppercase transition-colors"
          >
            Skip Guide
          </button>
          
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg text-xs font-mono font-bold text-white uppercase transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 rounded-lg text-xs font-mono font-bold text-white uppercase transition-all hover:shadow-[0_0_12px_rgba(124,106,255,0.35)] cursor-pointer"
            >
              <span>{currentStep === steps.length - 1 ? "Get Started" : "Next"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
