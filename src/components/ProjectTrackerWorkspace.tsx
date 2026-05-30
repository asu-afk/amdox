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
  Clock, 
  TrendingUp, 
  Zap, 
  Maximize2,
  ListTodo,
  Calendar,
  Layers,
  Activity
} from 'lucide-react';
import { Employee } from '../types';

interface ProjectTrackerWorkspaceProps {
  employees: Employee[];
}

export default function ProjectTrackerWorkspace({ employees }: ProjectTrackerWorkspaceProps) {
  
  // Tasks mapping (Gantt representation)
  const [ganttTasks, setGanttTasks] = useState([
    { id: 'T-100', name: 'Multi-Tenant Auth Setup (F-01)', week: 'Week 1', progress: 100, assignee: 'EMP-9022', budget: 15000, actual: 14500 },
    { id: 'T-101', name: 'Financial Ledger Parity Form (F-02)', week: 'Week 2', progress: 100, assignee: 'EMP-9021', budget: 32000, actual: 36200 }, // Actual > Budget by 13% -> Triggers warning!
    { id: 'T-102', name: 'Weekly AI Demand Model (F-06)', week: 'Week 3', progress: 65, assignee: 'EMP-9022', budget: 45000, actual: 44000 },
    { id: 'T-103', name: 'Interactive BI Dashboards (F-08)', week: 'Week 3', progress: 20, assignee: 'EMP-9021', budget: 28000, actual: 21000 },
    { id: 'T-104', name: 'Loki/Prometheus Observability', week: 'Week 4', progress: 0, assignee: 'EMP-9023', budget: 18000, actual: 18000 }
  ]);

  const handleUpdateBudget = (taskId: string, field: 'budget' | 'actual', val: string) => {
    const num = parseFloat(val) || 0;
    setGanttTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, [field]: num };
      }
      return t;
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono text-xs">
      
      {/* Budget Variance Alert Center F-07 criteria */}
      <div className="space-y-3">
        <h4 className="text-[10px] uppercase text-text-secondary tracking-widest font-extrabold select-none">
          Active Budget Variance Warnings Center (F-07)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ganttTasks.map((task) => {
            const variancePercent = task.actual > task.budget ? ((task.actual - task.budget) / task.budget) * 100 : 0;
            const isWarn = variancePercent >= 10;

            if (!isWarn) return null;

            return (
              <div key={task.id} className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-rose-500/25 text-rose-300 rounded shrink-0 animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-rose-300 uppercase tracking-widest text-[10px]">PROJECT EXPENDITURE VARIANCE ALERT (&gt;10%)</h5>
                    <p className="text-xs text-text-secondary mt-1 font-sans">
                      Task <span className="text-white font-extrabold">{task.name}</span> holds actual cost of <span className="text-white font-bold">${task.actual.toLocaleString()}</span> vs planned budget of <span className="text-[#00d4aa] font-bold">${task.budget.toLocaleString()}</span> ({variancePercent.toFixed(1)}% overflow).
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {ganttTasks.every(t => {
            const varP = t.actual > t.budget ? ((t.actual - t.budget) / t.budget) * 100 : 0;
            return varP < 10;
          }) && (
            <div className="col-span-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-[#52e5a3] font-bold rounded flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#52e5a3]" />
              <span>All active modules budgets are aligned and verified within statutory 10% variance targets.</span>
            </div>
          )}
        </div>
      </div>

      {/* Gantt Bar chart representation (renders in <1s - F-07 criteria) */}
      <div className="bg-surf-card border border-brand-outline rounded-xl p-5 space-y-4">
        <div className="border-b border-brand-outline/40 pb-2 flex justify-between items-center bg-[#0c0d14]/30 px-3 py-1.5 rounded">
          <span className="font-bold text-white uppercase flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-primary" />
            Milestone Gantt Chronology chart
          </span>
          <span className="text-[10px] bg-brand-primary/10 text-brand-primary-dim px-2.5 py-0.5 rounded border border-brand-primary/20 uppercase font-black">Renders &lt; 1s</span>
        </div>

        <div className="space-y-4 pt-2">
          {ganttTasks.map((task) => (
            <div key={task.id} className="grid grid-cols-12 gap-4 items-center border-b border-brand-outline/20 pb-2">
              <div className="col-span-3 text-white font-bold truncate">{task.name}</div>
              <div className="col-span-1 text-text-secondary text-center">{task.week}</div>
              
              {/* Progress visual bar */}
              <div className="col-span-5">
                <div className="w-full bg-surf-lowest h-4 rounded overflow-hidden border border-brand-outline/40 flex relative">
                  <div className="h-full bg-gradient-to-r from-brand-primary to-[#00d4aa] transition-all" style={{ width: `${task.progress}%` }} />
                  <span className="absolute inset-0 text-[10px] text-white font-bold flex items-center justify-center font-mono">
                    {task.progress}% Completed
                  </span>
                </div>
              </div>

              {/* Budget / Actual override input box */}
              <div className="col-span-3 flex gap-2 justify-end">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase text-text-secondary select-none font-bold">Limit Plan BUDGET ($)</span>
                  <input 
                    type="number" 
                    value={task.budget}
                    onChange={(e) => handleUpdateBudget(task.id, 'budget', e.target.value)}
                    className="w-20 bg-[#0c0d14] text-white border border-brand-outline rounded py-0.5 px-1.5 font-bold text-right"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase text-text-secondary select-none font-bold">Actual Exp ($)</span>
                  <input 
                    type="number" 
                    value={task.actual}
                    onChange={(e) => handleUpdateBudget(task.id, 'actual', e.target.value)}
                    className="w-20 bg-[#0c0d14] text-white border border-brand-outline rounded py-0.5 px-1.5 font-bold text-right text-rose-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Alloc Heatmap Allocation matrix */}
      <div className="bg-surf-card border border-brand-outline rounded-xl overflow-hidden block">
        <div className="px-5 py-3 border-b border-brand-outline bg-[#0c0d14]/40">
          <span className="font-bold text-white uppercase text-xs font-sans block">Resource Allocation Capacity Heatmap</span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          {employees.map((emp) => {
            // Find total tasks assigned
            const assigned = ganttTasks.filter(t => t.assignee === emp.id);
            const loadFactor = assigned.length * 35 + 15; // Simulated load level %

            return (
              <div key={emp.id} className="bg-[#0c0d14]/60 p-4 rounded-xl border border-brand-outline/80 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-white font-extrabold text-sm">{emp.name}</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">{emp.role}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold">
                    <span>Allocated Bandwidth:</span>
                    <span className={loadFactor >= 80 ? 'text-rose-400 font-extrabold animate-pulse' : 'text-[#00d4aa]'}>
                      {loadFactor}% LOAD
                    </span>
                  </div>
                  <div className="w-full bg-surf-lowest h-2 rounded overflow-hidden">
                    <div className={`h-full ${
                      loadFactor >= 80 ? 'bg-rose-500' :
                      loadFactor >= 50 ? 'bg-amber-400' :
                      'bg-[#00d4aa]'
                    }`} style={{ width: `${loadFactor}%` }} />
                  </div>
                </div>

                <div className="font-mono text-[10px] leading-relaxed text-[#7c8099] border-t border-brand-outline/40 pt-2 font-sans">
                  Current Targets: {assigned.map(t => t.week).join(', ') || 'No active schedules'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
