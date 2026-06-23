/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Mail, Database, BookOpen } from 'lucide-react';

interface TopBarProps {
  userEmail: string;
  totalAssets: number;
  onOpenGuide: () => void;
}

export default function TopBar({ userEmail, totalAssets, onOpenGuide }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-[56px] bg-[#010f1f] border-b border-brand-outline z-50 flex items-center justify-between px-6">
      {/* Brand Side */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.3)]">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="font-sans font-bold text-lg tracking-tight bg-gradient-to-r from-white to-brand-primary-dim bg-clip-text text-transparent">
            AMDOX
          </span>
          <span className="hidden sm:inline-block ml-2 text-[10px] font-mono tracking-widest text-[#00b5d3] px-1.5 py-0.5 rounded-full bg-brand-secondary/10 border border-brand-secondary/20">
            VISION ERP
          </span>
        </div>
      </div>

      {/* Center Asset Indicator */}
      <div className="hidden md:flex items-center gap-2 bg-[#0d1c2d] border border-brand-outline rounded-lg px-3 py-1 text-xs">
        <Database className="w-3.5 h-3.5 text-brand-primary" />
        <span className="text-text-secondary font-mono">Managed Assets Strength:</span>
        <span className="text-brand-tertiary font-mono font-bold">
          ${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Right User & Utility Controls */}
      <div className="flex items-center gap-4">
        {/* UTC Time */}
        <div className="hidden lg:block font-mono text-xs text-brand-secondary-dim bg-[#0d1c2d]/50 px-3 py-1 rounded-md border border-brand-outline">
          {currentTime || 'Synchronizing...'}
        </div>

        {/* Onboarding Interactive System Guide Relauncher */}
        <button
          type="button"
          onClick={onOpenGuide}
          className="flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 hover:bg-brand-primary/25 border border-brand-primary/30 hover:border-brand-primary/50 text-brand-primary-dim hover:text-white transition-all text-xs font-mono font-bold rounded-lg cursor-pointer uppercase"
          title="Relaunch ERP interactive onboarding system guide"
        >
          <BookOpen className="w-3.5 h-3.5 text-brand-primary-dim animate-pulse" />
          <span className="hidden md:inline">Quick Guide</span>
        </button>

        {/* User Session Profile */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg border border-brand-outline bg-[#0d1c2d]/40">
          <Mail className="w-3.5 h-3.5 text-brand-primary-dim" />
          <span className="text-xs text-text-primary max-w-[150px] truncate" title={userEmail}>
            {userEmail}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-tertiary animate-pulse" />
        </div>
      </div>
    </header>
  );
}
