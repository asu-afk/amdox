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
import { AIPrediction, Transaction, InventoryItem, LogisticsShipment } from '../types';
import { jsPDF } from 'jspdf';

interface BiWorkbenchesProps {
  predictions: AIPrediction[];
  transactions: Transaction[];
  inventory?: InventoryItem[];
  shipments?: LogisticsShipment[];
  userEmail?: string;
}

export default function BiWorkbenches({ 
  predictions, 
  transactions,
  inventory,
  shipments,
  userEmail
}: BiWorkbenchesProps) {
  // Widget arrangement representation (F-08 Configurable builder saved as state JSON)
  const [visibleWidgets, setVisibleWidgets] = useState({
    growthLine: true,
    departmentBar: true,
    categoryPie: true,
    budgetUtilization: true
  });

  const [activeDrillDownFilter, setActiveDrillDownFilter] = useState<string>('all');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [budgetMetric, setBudgetMetric] = useState<'percent' | 'absolute'>('percent');
  const [forecastScenario, setForecastScenario] = useState<'Baseline' | 'Optimistic' | 'Conservative'>('Baseline');

  // Dynamically compute adjusted predictions based on currently activated scenario toggle
  const adjustedPredictions = React.useMemo(() => {
    return predictions.map(p => {
      let revenueMultiplier = 1;
      let expenseMultiplier = 1;

      if (forecastScenario === 'Optimistic') {
        revenueMultiplier = 1.15; // +15% revenue growth
        expenseMultiplier = 0.90;  // -10% operational cost optimization
      } else if (forecastScenario === 'Conservative') {
        revenueMultiplier = 0.85; // -15% market stress factor
        expenseMultiplier = 1.12;  // +12% inflation expense buffer
      }

      return {
        ...p,
        forecastRevenue: Math.round(p.forecastRevenue * revenueMultiplier),
        forecastExpense: Math.round(p.forecastExpense * expenseMultiplier),
      };
    });
  }, [predictions, forecastScenario]);

  // Compute forecasted deficit months (expenses exceed revenue by > 10%)
  const deficitPredictions = React.useMemo(() => {
    return adjustedPredictions.filter(p => p.forecastExpense > p.forecastRevenue * 1.10);
  }, [adjustedPredictions]);

  // Compute departmental budget utilization data dynamically
  const budgetData = React.useMemo(() => {
    const defaultBudgets: Record<string, number> = {
      Engineering: 200000,
      Operations: 150000,
      Finance: 75000,
      Logistics: 50000,
      HR: 40000,
      Sales: 20000,
    };

    const spentMap: Record<string, number> = {};
    Object.keys(defaultBudgets).forEach(dept => {
      spentMap[dept] = 0;
    });

    transactions.forEach(t => {
      if (t.type === 'debit' && spentMap[t.department] !== undefined) {
        spentMap[t.department] += t.amount;
      }
    });

    return Object.entries(defaultBudgets).map(([name, allocated]) => {
      const spent = spentMap[name] || 0;
      const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;
      return {
        name,
        allocated,
        spent,
        utilization: parseFloat(utilization.toFixed(1)),
      };
    });
  }, [transactions]);

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

  const triggerPdfDownload = () => {
    setDownloadSuccessMessage("Generating formatted PDF report analytics...");
    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Setup Document Styling Parameters
        const cPrimary = [124, 106, 255]; // Amdox purple: #7c6aff
        const cSecondary = [0, 212, 170]; // Amdox mint: #00d4aa
        const cDark = [11, 12, 19];      // #0b0c13
        const cGray = [124, 128, 153];    // #7c8099

        const drawHeaderFooter = (pNum: number) => {
          // Top elegant corporate stripes
          doc.setFillColor(cPrimary[0], cPrimary[1], cPrimary[2]);
          doc.rect(0, 0, 210, 8, 'F');
          doc.setFillColor(cSecondary[0], cSecondary[1], cSecondary[2]);
          doc.rect(0, 8, 210, 2, 'F');

          // Footer info
          doc.setDrawColor(220, 220, 225);
          doc.setLineWidth(0.3);
          doc.line(15, 282, 195, 282);

          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(cGray[0], cGray[1], cGray[2]);
          doc.text("AMDOX TECHNOGLOBAL - ERP INTELLIGENCE LEDGER REPORT", 15, 288);
          doc.text(`CONFIDENTIAL - PAGE ${pNum} OF 2`, 170, 288);
        };

        // --- PAGE 1: EXECUTIVE MODULE SUMMARY & FINANCIAL ANALYTICS ---
        drawHeaderFooter(1);

        // Core Corporate Title
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(cDark[0], cDark[1], cDark[2]);
        doc.text("AMDOX COGNITIVE ERP", 15, 25);

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
        doc.text(`INTELLIGENCE WORKBENCH REPORT -- [SCENARIO: ${forecastScenario.toUpperCase()}]`, 15, 31);

        // Metadata grid block right aligned or positioned nicely
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(cGray[0], cGray[1], cGray[2]);
        const datStr = new Date().toLocaleString();
        doc.text(`Generated: ${datStr} UTC`, 15, 38);
        doc.text(`Authorized Operator: ${userEmail || 'swainaasutosh@gmail.com'}`, 15, 43);
        doc.text("Compliance Classification: ISO 27001 Multitenant Ledger Parity", 15, 48);

        // Divider
        doc.setDrawColor(200, 200, 205);
        doc.setLineWidth(0.5);
        doc.line(15, 53, 195, 53);

        // --- SECTION 1: FINANCIAL KPI SCOREBOARD ---
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(cDark[0], cDark[1], cDark[2]);
        doc.text("1. FINANCIAL PERFORMANCE KEY PERFORMANCE INDICATORS", 15, 61);

        // Calculate metrics
        const creditTx = transactions.filter(t => t.type === 'credit');
        const debitTx = transactions.filter(t => t.type === 'debit');

        const totalInflow = creditTx.reduce((acc, current) => acc + current.amount, 0);
        const totalOutflow = debitTx.reduce((acc, current) => acc + current.amount, 0);
        const netCashFlow = totalInflow - totalOutflow;

        const clearedCount = transactions.filter(t => t.status === 'cleared').length;
        const pendingCount = transactions.filter(t => t.status === 'pending').length;
        const flaggedCount = transactions.filter(t => t.status === 'flagged').length;

        // Draw elegant metric boxes
        // Box 1: Total Inflow
        doc.setFillColor(242, 241, 249);
        doc.rect(15, 66, 56, 24, 'F');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(cGray[0], cGray[1], cGray[2]);
        doc.text("TOTAL INFLOWS (CREDIT)", 18, 72);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(0, 140, 90);
        doc.text(`$${totalInflow.toLocaleString()}`, 18, 83);

        // Box 2: Total Outflow
        doc.setFillColor(242, 241, 249);
        doc.rect(77, 66, 56, 24, 'F');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(cGray[0], cGray[1], cGray[2]);
        doc.text("TOTAL OUTFLOWS (DEBIT)", 80, 72);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(190, 40, 40);
        doc.text(`$${totalOutflow.toLocaleString()}`, 80, 83);

        // Box 3: Net Cash
        doc.setFillColor(242, 241, 249);
        doc.rect(139, 66, 56, 24, 'F');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(cGray[0], cGray[1], cGray[2]);
        doc.text("NET OPERATIONAL CAPITAL", 142, 72);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
        doc.text(`$${netCashFlow.toLocaleString()}`, 142, 83);

        // Financial summary description text
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(cDark[0], cDark[1], cDark[2]);
        const finLine = `Amdox automated double-entry ledger audits verify ${transactions.length} active logs. Out of these logs, ` +
          `${clearedCount} transactions are currently CLEARED, ${pendingCount} remain in state PENDING, and ${flaggedCount} ledger items are marked FLAGGED. ` +
          `Operational capital margins are tracking at an efficiency score of ${((totalInflow / (totalOutflow || 1)) * 100).toFixed(1)}%.`;
        const finSplit = doc.splitTextToSize(finLine, 180);
        doc.text(finSplit, 15, 98);

        // --- SECTION 2: FORECAST SCENARIO SUMMARY ---
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(cDark[0], cDark[1], cDark[2]);
        doc.text(`2. STRATEGIC GROWTH STABILITY - ${forecastScenario.toUpperCase()} MODEL`, 15, 116);

        // Text explanation
        let forecastExplanation = "";
        if (forecastScenario === 'Optimistic') {
          forecastExplanation = "The OPTIMISTIC scenario simulates a bullish market trend. This model applies a +15% revenue acceleration factor and -10% direct material cost optimizations, forecasting accelerated margins across global sectors.";
        } else if (forecastScenario === 'Conservative') {
          forecastExplanation = "The CONSERVATIVE scenario builds in severe market stress factors. Projections include a -15% macroeconomic discount factor across sales inflows, and a +12% cost inflation overlay buffer on logistical operations.";
        } else {
          forecastExplanation = "The BASELINE model evaluates raw raw operational run rates. No discount multipliers are applied, serving as a clean target benchmark of true ledger velocity and baseline metrics.";
        }
        const expSplit = doc.splitTextToSize(forecastExplanation, 180);
        doc.text(expSplit, 15, 122);

        // Draw Forecast Predictions Table
        let tableY = 135;
        doc.setFillColor(cPrimary[0], cPrimary[1], cPrimary[2]);
        doc.rect(15, tableY, 180, 7, 'F');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text("Forecast Target Period", 18, tableY + 5);
        doc.text("Projected Inflow ($)", 75, tableY + 5);
        doc.text("Projected Outflow ($)", 125, tableY + 5);
        doc.text("Confidence Score", 165, tableY + 5);

        adjustedPredictions.slice(0, 6).forEach((p, idx) => {
          let rowY = tableY + 7 + (idx * 7);
          // Zebra row shading
          if (idx % 2 === 0) {
            doc.setFillColor(248, 248, 251);
            doc.rect(15, rowY, 180, 7, 'F');
          }
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(cDark[0], cDark[1], cDark[2]);
          doc.text(p.period, 18, rowY + 5);
          doc.text(`$${p.forecastRevenue.toLocaleString()}`, 75, rowY + 5);
          doc.text(`$${p.forecastExpense.toLocaleString()}`, 125, rowY + 5);
          
          const confidencePct = Math.round(p.confidenceScore * 100);
          doc.text(`${confidencePct}% Accuracy`, 165, rowY + 5);
        });

        // --- SECTION 3: DEPUTY DEPARMENT BUDGET UTILIZATION ---
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(cDark[0], cDark[1], cDark[2]);
        doc.text("3. SECTOR EXPENDITURE BUDGET PARITY", 15, 192);

        // Quick overview metrics
        const depts = ['Engineering', 'Logistics', 'Finance', 'Operations', 'Sales', 'HR'];
        let budgetY = 199;
        doc.setFillColor(242, 241, 249);
        doc.rect(15, budgetY, 180, 6, 'F');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
        doc.text("Division Sector", 18, budgetY + 4.5);
        doc.text("Current Spent Total", 65, budgetY + 4.5);
        doc.text("Allocated Ceiling", 115, budgetY + 4.5);
        doc.text("Utilization Status", 160, budgetY + 4.5);

        depts.forEach((dept, idx) => {
          let rowY = budgetY + 6 + (idx * 6.5);
          const currentSpent = transactions
            .filter(t => t.department === dept && t.type === 'debit')
            .reduce((acc, curr) => acc + curr.amount, 0);
          
          const allocationCeiling = dept === 'Engineering' ? 120000 :
                                    dept === 'Logistics' ? 70000 :
                                    dept === 'Finance' ? 40000 :
                                    dept === 'Operations' ? 90000 :
                                    dept === 'Sales' ? 60000 : 30000;
          
          const utilPct = (currentSpent / allocationCeiling) * 100;

          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(cDark[0], cDark[1], cDark[2]);
          doc.text(dept, 18, rowY + 4.5);
          doc.text(`$${currentSpent.toLocaleString()}`, 65, rowY + 4.5);
          doc.text(`$${allocationCeiling.toLocaleString()}`, 115, rowY + 4.5);

          if (utilPct > 90) {
            doc.setFont('Helvetica', 'bold');
            doc.setTextColor(200, 50, 50);
            doc.text(`${utilPct.toFixed(1)}% OVER LIMIT`, 160, rowY + 4.5);
          } else {
            doc.setTextColor(0, 150, 100);
            doc.text(`${utilPct.toFixed(1)}% Clear`, 160, rowY + 4.5);
          }
        });


        // --- PAGE 2: DETAILED LEDGER REGISTRY & LOGISTICS OVERVIEW ---
        doc.addPage();
        drawHeaderFooter(2);

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(cDark[0], cDark[1], cDark[2]);
        doc.text("4. GLOBAL LOGISTICS & SUPPLY STOCK AUDIT", 15, 23);

        const currentInventory = inventory || [];

        const currentShipments = shipments || [];

        let logiText = "Supply chain metrics evaluate physical inventory product SKUs stored across primary fulfillment centers. " +
          `Active carrier schedules track global logistics freighters carrying carrying consolidated logistics cargo value structures.`;
        
        if (currentInventory.length > 0 && currentShipments.length > 0) {
          logiText = `Supply chain metrics evaluate ${currentInventory.length} distinct product SKUs stored across primary fulfillment centers. ` +
            `Active carrier schedules track ${currentShipments.length} global logistics freighters carrying a total consolidated cargo value of ` +
            `$${currentShipments.reduce((acc, curr) => acc + (curr.cargoValue || 0), 0).toLocaleString()} USD.`;
        }
        const logiSplit = doc.splitTextToSize(logiText, 180);
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(cDark[0], cDark[1], cDark[2]);
        doc.text(logiSplit, 15, 29);

        // Logistics mini-grid
        let logiY = 43;
        doc.setFillColor(cSecondary[0], cSecondary[1], cSecondary[2]);
        doc.rect(15, logiY, 180, 6, 'F');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(19, 18, 27);
        doc.text("CARRIER ID", 18, logiY + 4.5);
        doc.text("ROUTE SECTOR", 52, logiY + 4.5);
        doc.text("CARGO VAL", 112, logiY + 4.5);
        doc.text("TRANSIT STATUS", 152, logiY + 4.5);

        if (currentShipments.length > 0) {
          currentShipments.slice(0, 4).forEach((s, idx) => {
            let rowY = logiY + 6 + (idx * 6.5);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(cDark[0], cDark[1], cDark[2]);
            doc.text(s.id, 18, rowY + 4.5);
            doc.text(`${s.origin} -> ${s.destination}`, 52, rowY + 4.5);
            doc.text(`$${(s.cargoValue || 0).toLocaleString()}`, 112, rowY + 4.5);
            doc.setFont('Helvetica', 'bold');
            doc.text((s.status || '').toUpperCase(), 152, rowY + 4.5);
          });
        } else {
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(cGray[0], cGray[1], cGray[2]);
          doc.text("No active freight shipments tracking currently in-transit.", 18, logiY + 11);
        }

        // --- SECTION 5: MASTER TRANSACTION AUDIT TRIAL ---
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(cDark[0], cDark[1], cDark[2]);
        doc.text("5. INDEPENDENT ACCOUNT TRANSACTIONS LEDGER TRIAL", 15, 78);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(cDark[0], cDark[1], cDark[2]);
        doc.text("Below is the detailed list of corporate double-entry ledger inputs compiled inside Amdox high-security database modules:", 15, 84);

        // Master Ledger Table
        let ledY = 91;
        doc.setFillColor(cPrimary[0], cPrimary[1], cPrimary[2]);
        doc.rect(15, ledY, 180, 7, 'F');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text("Ledger ID", 18, ledY + 5);
        doc.text("Date", 38, ledY + 5);
        doc.text("Account Designation", 62, ledY + 5);
        doc.text("Division", 125, ledY + 5);
        doc.text("Sum", 152, ledY + 5);
        doc.text("Audit", 175, ledY + 5);

        const auditTrailSubset = filteredLedger.slice(0, 16);
        auditTrailSubset.forEach((t, idx) => {
          let rowY = ledY + 7 + (idx * 7.5);
          
          // Row highlight
          if (idx % 2 === 0) {
            doc.setFillColor(248, 248, 251);
            doc.rect(15, rowY, 180, 7.5, 'F');
          }

          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(cDark[0], cDark[1], cDark[2]);
          doc.text(t.id, 18, rowY + 5);
          doc.text(t.date, 38, rowY + 5);
          
          let shortenedAccount = t.account;
          if (shortenedAccount.length > 30) {
            shortenedAccount = shortenedAccount.substring(0, 28) + "...";
          }
          doc.text(shortenedAccount, 62, rowY + 5);
          doc.text(t.department, 125, rowY + 5);
          
          const isCredit = t.type === 'credit';
          doc.setFont('Helvetica', 'bold');
          if (isCredit) {
            doc.setTextColor(0, 140, 90);
            doc.text(`+$${t.amount.toLocaleString()}`, 152, rowY + 5);
          } else {
            doc.setTextColor(190, 40, 40);
            doc.text(`-$${t.amount.toLocaleString()}`, 152, rowY + 5);
          }

          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(cDark[0], cDark[1], cDark[2]);
          doc.text(t.status.toUpperCase(), 175, rowY + 5);
        });

        // Bottom certification seal
        let sealY = 230;
        doc.setFillColor(242, 241, 249);
        doc.rect(15, sealY, 180, 32, 'F');
        doc.setDrawColor(cPrimary[0], cPrimary[1], cPrimary[2]);
        doc.setLineWidth(0.4);
        doc.rect(15, sealY, 180, 32, 'D');

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
        doc.text("AMDOX COMPLIANCE ASSURANCE DEED", 20, sealY + 7);
        
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(cDark[0], cDark[1], cDark[2]);
        doc.text("This report was compiled under decentralized multitenant cryptotrust rules. Balance check parity satisfies", 25, sealY + 14);
        doc.text("the rigorous guidelines issued by Amdox Group corporate board in compliance with SOC-2 ledger standards.", 25, sealY + 18);
        
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(cGray[0], cGray[1], cGray[2]);
        doc.text("Deed Verified Hash Verification Block: SHA256-4AA9FF80DECC", 25, sealY + 26);

        // Trigger manual download
        doc.save(`amdox_erp_performance_report_${Date.now()}.pdf`);
        setDownloadSuccessMessage("Corporate PDF Ledger Report generated and downloaded successfully.");
      } catch (err) {
        console.error("PDF generation failed:", err);
        setDownloadSuccessMessage("Error generating PDF document. Check developer console for parity logs.");
      }
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
          <label className="flex items-center gap-2 text-white border border-brand-outline/40 px-3 py-1.5 rounded-lg bg-surf-lowest cursor-pointer hover:bg-surf-high/30">
            <input 
              type="checkbox" 
              checked={visibleWidgets.budgetUtilization}
              onChange={(e) => setVisibleWidgets(prev => ({ ...prev, budgetUtilization: e.target.checked }))}
              className="accent-brand-primary cursor-pointer w-3.5 h-3.5"
            />
            <span>Budget Util chart</span>
          </label>
        </div>
      </div>

      {/* Grid of charts depending on toggles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Widget 1: Forecast line chart */}
        {visibleWidgets.growthLine && (
          <div className="bg-surf-card border border-brand-outline rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-outline/40 pb-3 gap-2">
              <div className="space-y-0.5">
                <span className="font-bold text-white uppercase flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-primary" />
                  Revenue & Expenses Forecast Curves (F-06 / F-08)
                </span>
                <p className="text-[10px] text-zinc-400 font-mono">
                  {forecastScenario === 'Optimistic' ? '⚡ Scaled: +15% revenue projection, -10% cost optimization' :
                   forecastScenario === 'Conservative' ? '⚠️ Scaled: -15% stress revenue buffer, +12% inflation buffer' :
                   '✓ Unadjusted baseline operational predictions'}
                </p>
              </div>
              
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[10px] text-[#7c8099] uppercase font-bold tracking-wider">Scenario:</span>
                <div id="forecast-scenario-toggle" className="flex bg-[#0c0d14] rounded-lg p-0.5 border border-brand-outline/30 select-none">
                  {(['Optimistic', 'Baseline', 'Conservative'] as const).map((scenario) => (
                    <button
                      key={scenario}
                      type="button"
                      onClick={() => setForecastScenario(scenario)}
                      className={`px-2 py-1 rounded text-[9.5px] font-black uppercase transition-all whitespace-nowrap cursor-pointer ${
                        forecastScenario === scenario
                          ? 'bg-brand-primary text-white shadow-md font-extrabold shadow-amber-500/10'
                          : 'text-text-secondary hover:text-white'
                      }`}
                    >
                      {scenario}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="h-[250px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={adjustedPredictions} onClick={handleChartClick}>
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

        {/* Widget 4: Departmental Budget Utilization bar chart */}
        {visibleWidgets.budgetUtilization && (
          <div className="bg-surf-card border border-brand-outline rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-outline/40 pb-2">
              <span className="font-bold text-white uppercase flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#7c6aff]" />
                Departmental Budget Utilization (F-02 / F-08)
              </span>
              
              {/* Metric selector slider */}
              <div className="flex bg-[#0c0d14] rounded-lg p-0.5 border border-brand-outline/30">
                <button
                  type="button"
                  onClick={() => setBudgetMetric('percent')}
                  className={`px-2 py-1 rounded text-[9px] font-black uppercase transition-all whitespace-nowrap cursor-pointer ${
                    budgetMetric === 'percent'
                      ? 'bg-brand-primary text-white shadow-md font-extrabold'
                      : 'text-text-secondary hover:text-white'
                  }`}
                >
                  Rate %
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetMetric('absolute')}
                  className={`px-2 py-1 rounded text-[9px] font-black uppercase transition-all whitespace-nowrap cursor-pointer ${
                    budgetMetric === 'absolute'
                      ? 'bg-brand-primary text-white shadow-md font-extrabold'
                      : 'text-text-secondary hover:text-white'
                  }`}
                >
                  Cash $
                </button>
              </div>
            </div>

            <div className="h-[250px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData} onClick={handleChartClick}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#7c8099" fontSize={10} tickLine={false} />
                  <YAxis 
                    stroke="#7c8099" 
                    fontSize={10} 
                    tickLine={false} 
                    width={45} 
                    tickFormatter={(value) => budgetMetric === 'percent' ? `${value}%` : `$${(value / 1000)}k`} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#13151f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px' }}
                    formatter={(value: any, name: string) => {
                      if (name === "Spent Rate") return [`${value}%`, "Utilization Rate"];
                      if (name === "Allocated Budget") return [`$${value.toLocaleString()}`, "Budget Limit"];
                      if (name === "Actual Spent") return [`$${value.toLocaleString()}`, "Actual Spent"];
                      return [value, name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  
                  {budgetMetric === 'percent' ? (
                    <Bar dataKey="utilization" name="Spent Rate" fill="#7c6aff" radius={[4, 4, 0, 0]}>
                      {budgetData.map((entry, index) => {
                        const overrun = entry.utilization > 100;
                        const high = entry.utilization > 75;
                        const color = overrun ? '#ef4444' : high ? '#ffa940' : '#7c6aff';
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  ) : (
                    <>
                      <Bar dataKey="allocated" name="Allocated Budget" fill="rgba(255,255,255,0.12)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="spent" name="Actual Spent" radius={[4, 4, 0, 0]}>
                        {budgetData.map((entry, index) => {
                          const overrun = entry.spent > entry.allocated;
                          const high = entry.spent > entry.allocated * 0.75;
                          const color = overrun ? '#ef4444' : high ? '#ffa940' : '#00d4aa';
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-brand-outline/20">
              <div className="bg-surf-lowest/40 border border-brand-outline/20 rounded-lg p-2 flex flex-col justify-center">
                <span className="text-[9px] text-[#7c8099] uppercase font-bold">Max Utilization</span>
                <span className="text-xs font-extrabold text-white">
                  {Math.max(...budgetData.map(d => d.utilization))}%
                </span>
                <span className="text-[8px] text-[#7c8099]">
                  ({budgetData.reduce((max, curr) => curr.utilization > max.utilization ? curr : max, budgetData[0]).name})
                </span>
              </div>
              <div className="bg-surf-lowest/40 border border-brand-outline/20 rounded-lg p-2 flex flex-col justify-center">
                <span className="text-[9px] text-[#7c8099] uppercase font-bold">Over-Budget Units</span>
                <span className={`text-xs font-extrabold flex items-center gap-1 ${
                  budgetData.some(d => d.utilization > 100) ? "text-rose-400 font-extrabold animate-pulse" : "text-[#00d4aa]"
                }`}>
                  {budgetData.filter(d => d.utilization > 100).length} Departments
                </span>
                <span className="text-[8px] text-[#7c8099]">
                  {budgetData.some(d => d.utilization > 100) ? "Audit recommended" : "All limits normalized"}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-text-secondary leading-normal text-center">
              * Bars are color-coded: <span className="text-rose-400 font-bold">Over 100%</span>, <span className="text-[#ffa940] font-bold">75%-100%</span>, <span className="text-[#7c6aff] font-bold">Under 75%</span>. Click columns to filter.
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
            <button
              onClick={triggerPdfDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#7c6aff] hover:bg-[#7c6aff]/95 text-white text-[11px] font-bold py-1.5 px-3.5 rounded transition-all cursor-pointer shadow-md shadow-[#7c6aff]/15"
            >
              <Download className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Download PDF Report</span>
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
