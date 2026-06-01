/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceArea
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Sliders, 
  Layers, 
  CheckSquare, 
  Grid, 
  RefreshCw, 
  Filter, 
  ChevronRight, 
  DollarSign, 
  Award,
  ArrowUpRight,
  AlertTriangle
} from 'lucide-react';
import { AIPrediction, Transaction } from '../types';

interface BiWorkbenchesProps {
  predictions: AIPrediction[];
  transactions: Transaction[];
}

export default function BiWorkbenches({ predictions, transactions }: BiWorkbenchesProps) {
  // Widget arrangement representation (F-08 Configurable builder saved as state JSON)
  const [visibleWidgets, setVisibleWidgets] = useState({
    growthLine: true,
    departmentBar: true,
    categoryPie: true
  });

  const [activeDrillDownFilter, setActiveDrillDownFilter] = useState<string>('all');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // Compute forecasted deficit months (expenses exceed revenue by > 10%)
  const deficitPredictions = React.useMemo(() => {
    return predictions.filter(p => p.forecastExpense > p.forecastRevenue * 1.10);
  }, [predictions]);

  // Compute departmental sums for transaction-linked ledger
  const deptData = React.useMemo(() => {
    const map: Record<string, { name: string, debit: number, credit: number }> = {};
    const depts = ['Engineering', 'Logistics', 'Finance', 'Operations', 'Sales', 'HR'];
    depts.forEach(d => {
      map[d] = { name: d, debit: 0, credit: 0 };
    });

    transactions.forEach(t => {
      if (map[t.department]) {
        if (t.type === 'debit') {
          map[t.department].debit += t.amount;
        } else {
          map[t.department].credit += t.amount;
        }
      }
    });

    return Object.values(map);
  }, [transactions]);

  // Compute category share
  const catData = React.useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach(t => {
      const cat = t.type === 'credit' ? 'Inflows (Revenue)' : 'Outflows (Operations)';
      map[cat] = (map[cat] || 0) + t.amount;
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const COLORS = ['#7c6aff', '#00d4aa', '#ffa940', '#ef4444', '#3b82f6'];

  // Handle drill down clicking (F-08 criteria)
  const handleChartClick = (data: any) => {
    if (data && data.activeLabel) {
      setActiveDrillDownFilter(data.activeLabel);
    } else if (data && data.name) {
      setActiveDrillDownFilter(data.name);
    }
  };

  const handleResetDrilldown = () => {
    setActiveDrillDownFilter('all');
  };

  // Generate Excel report download mock (F-08 format criteria)
  const triggerExcelDownload = () => {
    setDownloadSuccessMessage("Synthesizing ledger CSV payload...");
    setTimeout(() => {
      const csvRows = [
        ['Amdox Technologies ERP - BI Export Ledger Ledger'],
        ['ID', 'Date', 'Account', 'Type', 'Amount', 'Department', 'Status']
      ];
      transactions.forEach(t => {
        csvRows.push([
          t.id,
          t.date,
          `"${t.account}"`,
          t.type,
          String(t.amount),
          t.department,
          t.status
        ]);
      });
      const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `amdox_erp_bi_ledger_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccessMessage("Excel/CSV Worksheet exported successfully.");
    }, 400);
  };

  // Filtered transactions based on interactive drill-down segment click (F-08 criteria)
  const filteredLedger = React.useMemo(() => {
    if (activeDrillDownFilter === 'all') return transactions;
    
    // Check if matching department of transactions
    const isDept = ['Engineering', 'Logistics', 'Finance', 'Operations', 'Sales', 'HR'].includes(activeDrillDownFilter);
    if (isDept) {
      return transactions.filter(t => t.department === activeDrillDownFilter);
    }

    // Check if matching types
    if (activeDrillDownFilter.includes('Inflows')) {
      return transactions.filter(t => t.type === 'credit');
    }
    if (activeDrillDownFilter.includes('Outflows')) {
      return transactions.filter(t => t.type === 'debit');
    }

    return transactions;
  }, [transactions, activeDrillDownFilter]);

  return (
    <div className="space-y-6 animate-fade-in text-xs font-mono">
      
      {/* BI Layout drag & configure header widget */}
      <div className="bg-surf-card p-4 rounded-xl border border-brand-outline flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white uppercase flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-primary" />
            <span>Interactive Drag & Toggle Widget Builder</span>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">Toggle live widget views. Order settings preserved as JSON in corporate state.</p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs font-bold font-mono">
          <label className="flex items-center gap-2 text-white border border-brand-outline/40 px-3 py-1.5 rounded-lg bg-surf-lowest cursor-pointer hover:bg-surf-high/30">
            <input 
              type="checkbox" 
              checked={visibleWidgets.growthLine}
              onChange={(e) => setVisibleWidgets(prev => ({ ...prev, growthLine: e.target.checked }))}
              className="accent-brand-primary cursor-pointer w-3.5 h-3.5"
            />
            <span>Forecast Curve</span>
          </label>
          <label className="flex items-center gap-2 text-white border border-brand-outline/40 px-3 py-1.5 rounded-lg bg-surf-lowest cursor-pointer hover:bg-surf-high/30">
            <input 
              type="checkbox" 
              checked={visibleWidgets.departmentBar}
              onChange={(e) => setVisibleWidgets(prev => ({ ...prev, departmentBar: e.target.checked }))}
              className="accent-brand-primary cursor-pointer w-3.5 h-3.5"
            />
            <span>Depart Debits</span>
          </label>
          <label className="flex items-center gap-2 text-white border border-brand-outline/40 px-3 py-1.5 rounded-lg bg-surf-lowest cursor-pointer hover:bg-surf-high/30">
            <input 
              type="checkbox" 
              checked={visibleWidgets.categoryPie}
              onChange={(e) => setVisibleWidgets(prev => ({ ...prev, categoryPie: e.target.checked }))}
              className="accent-brand-primary cursor-pointer w-3.5 h-3.5"
            />
            <span>Inflows vs Outflows share</span>
          </label>
        </div>
      </div>

      {/* Grid of charts depending on toggles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Widget 1: Forecast line chart */}
        {visibleWidgets.growthLine && (
          <div className="bg-surf-card border border-brand-outline rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-outline/40 pb-2">
              <span className="font-bold text-white uppercase flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-primary" />
                Revenue & Expenses Forecast Curves (F-06 / F-08)
              </span>
              <span className="text-[10px] bg-brand-primary/10 text-brand-primary-dim px-2 py-0.5 rounded uppercase font-black">Trend Model</span>
            </div>
            
            <div className="h-[250px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictions} onClick={handleChartClick}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="period" stroke="#7c8099" fontSize={10} tickLine={false} />
                  <YAxis stroke="#7c8099" fontSize={10} tickLine={false} width={45} />
                  <Tooltip contentStyle={{ backgroundColor: '#13151f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  {deficitPredictions.map(item => (
                    <ReferenceArea
                      {...({
                        key: item.period,
                        x1: item.period,
                        x2: item.period,
                        fill: "rgba(239, 68, 68, 0.12)",
                        stroke: "rgba(239, 68, 68, 0.35)",
                        strokeDasharray: "3 3"
                      } as any)}
                    />
                  ))}
                  <Line type="monotone" dataKey="forecastRevenue" name="Forecast Inflow" stroke="#7c6aff" strokeWidth={2.5} activeDot={{ r: 8 }} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="forecastExpense" name="Forecast Expense" stroke="#ffa940" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <p className="text-[10px] text-text-secondary leading-normal text-center">
              * Click on monthly nodes on the chart above to drill-down financial parameters. Redshaded bands denote heavy deficits.
            </p>

            {deficitPredictions.length > 0 && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 space-y-2 mt-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span>ALERT: FORECAST CRITICAL DEFICIT DETECTED (&gt; 10%)</span>
                </div>
                <p className="text-[10px] text-text-secondary leading-normal">
                  The system highlighted month(s) where forecasted expenses exceed forecasted revenues by more than 10% in red color. Highlighted on the chart:
                </p>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {deficitPredictions.map(item => {
                    const ratio = ((item.forecastExpense - item.forecastRevenue) / item.forecastRevenue) * 100;
                    return (
                      <div key={item.period} className="bg-[#1f171c] hover:bg-[#251b21] border border-rose-900/40 rounded px-2.5 py-1.5 flex flex-col gap-1 min-w-[120px] transition-all">
                        <span className="text-[#fca5a5] font-extrabold text-[11.5px] border-b border-rose-900/30 pb-0.5">{item.period}</span>
                        <div className="flex justify-between gap-4 text-[10px] text-text-secondary">
                          <span>Forecast Inflow:</span>
                          <span className="font-bold text-white">${item.forecastRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-[10px] text-text-secondary">
                          <span>Forecast Expense:</span>
                          <span className="font-bold text-rose-400">${item.forecastExpense.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-[10px] border-t border-rose-900/20 pt-0.5">
                          <span className="text-rose-400/80">Expense Excess:</span>
                          <span className="text-rose-400 font-black">+{ratio.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Widget 2: Department budget distribution bar chart */}
        {visibleWidgets.departmentBar && (
          <div className="bg-surf-card border border-brand-outline rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-outline/40 pb-2">
              <span className="font-bold text-white uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00d4aa]" />
                Committed Budgets per Business Unit Unit (F-08 Drill-Down)
              </span>
              <span className="text-[10px] bg-[#00d4aa]/10 text-brand-secondary-dim px-2 py-0.5 rounded uppercase font-black">Ledger Base</span>
            </div>

            <div className="h-[250px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} onClick={handleChartClick}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#7c8099" fontSize={10} tickLine={false} />
                  <YAxis stroke="#7c8099" fontSize={10} tickLine={false} width={45} />
                  <Tooltip contentStyle={{ backgroundColor: '#13151f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Bar dataKey="debit" name="Cash Debits (Outflow)" fill="#7c6aff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="credit" name="Claims Credit (Inflow)" fill="#00d4aa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-text-secondary leading-normal text-center">
              * Click on bar segments to filter transactions of that department.
            </p>
          </div>
        )}

        {/* Widget 3: Cash Inflows vs Outflows split */}
        {visibleWidgets.categoryPie && (
          <div className="bg-surf-card border border-brand-outline rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-outline/40 pb-2">
              <span className="font-bold text-white uppercase flex items-center gap-2">
                <Grid className="w-4 h-4 text-amber-400" />
                Income vs Expense Allocation Share (F-02 / F-08)
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded uppercase font-black text-center">Liquidity</span>
            </div>

            <div className="h-[250px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={catData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    onClick={(entry) => handleChartClick(entry)}
                  >
                    {catData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#13151f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', pt: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-text-secondary leading-normal text-center">
              * Click on pie slices to toggle matching inflow or outflow journal records.
            </p>
          </div>
        )}

      </div>

      {/* Drill-Down Interactive Filter Result Table (F-08 criteria) */}
      <div className="bg-surf-card border border-brand-outline rounded-xl overflow-hidden block">
        <div className="px-5 py-4 border-b border-brand-outline bg-[#0c0d14]/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-white font-bold uppercase tracking-wider text-xs font-sans">
                Drill-down Ledger Filtered Registry (F-08)
              </span>
              {activeDrillDownFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary-dim uppercase tracking-wider text-[9px] font-bold border border-brand-primary/20">
                  Segment: {activeDrillDownFilter}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#7c8099] mt-0.5">Click sections on the charts above to dynamically focus the records tree.</p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {activeDrillDownFilter !== 'all' && (
              <button
                onClick={handleResetDrilldown}
                className="bg-[#0c0d14] hover:bg-surf-high hover:text-white border border-brand-outline text-text-secondary font-bold font-mono py-1.5 px-3 rounded text-[11px] cursor-pointer"
              >
                Clear Filter Core
              </button>
            )}
            <button
              onClick={triggerExcelDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#00d4aa] hover:bg-[#00d4aa]/95 text-[#13121b] text-[11px] font-bold py-1.5 px-3.5 rounded transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel CSV</span>
            </button>
          </div>
        </div>

        {downloadSuccessMessage && (
          <div className="p-3 bg-emerald-500/15 text-[#52e5a3] font-bold truncate text-[11px] border-b border-brand-outline/40">
            ✓ {downloadSuccessMessage}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0c0d14] border-b border-brand-outline">
                <th className="p-3 font-bold text-text-secondary text-[9px] tracking-wider uppercase">Ledger ID</th>
                <th className="p-3 font-bold text-text-secondary text-[9px] tracking-wider uppercase">Date</th>
                <th className="p-3 font-bold text-text-secondary text-[9px] tracking-wider uppercase">Account</th>
                <th className="p-3 font-bold text-text-secondary text-[9px] tracking-wider uppercase text-center">Flow</th>
                <th className="p-3 font-bold text-text-secondary text-[9px] tracking-wider uppercase text-right">Sum Size</th>
                <th className="p-3 font-bold text-text-secondary text-[9px] tracking-wider uppercase text-center">Division</th>
                <th className="p-3 font-bold text-text-secondary text-[9px] tracking-wider uppercase text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLedger.slice(0, 8).map((tx) => (
                <tr key={tx.id} className="border-b border-brand-outline/25 hover:bg-[#161822]">
                  <td className="p-3 font-mono text-brand-secondary font-bold">{tx.id}</td>
                  <td className="p-3 text-text-secondary">{tx.date}</td>
                  <td className="p-3 font-bold text-white max-w-[140px] truncate">{tx.account}</td>
                  <td className="p-3 text-center text-[10px]">
                    <span className={`px-1.5 py-0.5 rounded font-black border tracking-wider uppercase text-[9px] ${
                      tx.type === 'credit' 
                        ? 'bg-emerald-500/10 text-[#52e5a3] border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-white">${tx.amount.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] bg-brand-primary/15 text-brand-primary-dim px-2 py-0.5 rounded uppercase font-bold border border-brand-primary/25">
                      {tx.department}
                    </span>
                  </td>
                  <td className="p-3 text-center text-[10px]">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      tx.status === 'cleared' ? 'bg-emerald-500/10 text-emerald-400' :
                      tx.status === 'flagged' ? 'bg-amber-400/15 text-amber-300 animate-pulse' :
                      'bg-indigo-500/10 text-indigo-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredLedger.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#7c8099] italic italic text-xs">
                    No ledger transactions found matching segment criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
