/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { 
  transactions, 
  inventory, 
  shipments, 
  predictions, 
  getBalanceSheet, 
  addTransaction, 
  updateStock, 
  setReorder,
  updateTransactionStatus,
  expediteShipment,
  addShipment,
  employees,
  addEmployee,
  updateEmployeeStatus
} from './server/erp_db.js';

dotenv.config();

const resolvedFilename = typeof __filename !== 'undefined' ? __filename : (typeof import.meta !== 'undefined' && import.meta.url ? fileURLToPath(import.meta.url) : '');
const resolvedDirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(resolvedFilename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gemini SDK server-side securely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log('Gemini API initialized successfully in full-stack backend server.');
  } catch (err) {
    console.error('Error initializing Gemini client: ', err);
  }
} else {
  console.log('Gemini API Key missing or default placeholder found. Falling back to high-grade Local Heuristics Mock AI Generator.');
}

// ==========================================
// API REST ENDPOINTS FOR ERP OPERATIONS
// ==========================================

// Get entire ERP Aggregated cockpit state
app.get('/api/erp/state', (req, res) => {
  try {
    const assets = getBalanceSheet();
    res.json({
      balanceSheet: assets,
      transactions,
      inventory,
      shipments,
      predictions,
      employees
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to extract ERP ledger state', details: err.message });
  }
});

// Insert new transaction entry to the ledger
app.post('/api/erp/transaction', (req, res) => {
  try {
    const { account, type, amount, description, department, status } = req.body;
    if (!account || !type || !amount || !department) {
      return res.status(400).json({ error: 'Missing critical ledger fields (account, type, amount, department)' });
    }
    const newTx = addTransaction({
      account,
      type: type as 'debit' | 'credit',
      amount: Number(amount),
      description: description || 'Direct ledger journal modification',
      department,
      status: status || 'cleared'
    });
    res.json({ success: true, transaction: newTx, balanceSheet: getBalanceSheet() });
  } catch (err: any) {
    res.status(500).json({ error: 'Ledger insertion failed', details: err.message });
  }
});

// Trigger shipment dispatch / safety stock reorder
app.post('/api/erp/inventory/reorder', (req, res) => {
  try {
    const { sku, orderQty } = req.body;
    if (!sku) {
      return res.status(400).json({ error: 'Missing item SKU identifier' });
    }
    const updated = updateStock(sku, orderQty || 1000);
    if (!updated) {
      return res.status(404).json({ error: 'SKU not found in catalog' });
    }
    setReorder(sku, false);
    res.json({ success: true, item: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Replenishment order failed', details: err.message });
  }
});

// Update transaction audit status
app.post('/api/erp/transaction/status', (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ error: 'Missing transaction id or target status' });
    }
    const updated = updateTransactionStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Transaction record not found' });
    }
    res.json({ success: true, transaction: updated, balanceSheet: getBalanceSheet() });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update ledger status', details: err.message });
  }
});

// Expedite active cargo shipment
app.post('/api/erp/shipment/expedite', (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Missing shipment id parameter' });
    }
    const updated = expediteShipment(id);
    if (!updated) {
      return res.status(404).json({ error: 'Logistics cargo reference not found' });
    }
    res.json({ success: true, shipment: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Expedition dispatch failed', details: err.message });
  }
});

// Dispatch a brand new logistics freight cargo line
app.post('/api/erp/shipment/create', (req, res) => {
  try {
    const { origin, destination, carrier, cargoValue, eta, temperatureControlled } = req.body;
    if (!origin || !destination || !carrier || !cargoValue || !eta) {
      return res.status(400).json({ error: 'all freight fields are required (origin, destination, carrier, cargoValue, eta)' });
    }
    const newShipment = addShipment({
      origin,
      destination,
      carrier,
      cargoValue: Number(cargoValue),
      eta,
      temperatureControlled: Boolean(temperatureControlled),
      status: 'in-transit'
    });
    res.json({ success: true, shipment: newShipment });
  } catch (err: any) {
    res.status(500).json({ error: 'Cargo dispatch order rejected by database', details: err.message });
  }
});

// Create a new enterprise employee
app.post('/api/erp/hr/employee', (req, res) => {
  try {
    const { name, role, department, email, salary, status } = req.body;
    if (!name || !role || !department || !email || !salary) {
      return res.status(400).json({ error: 'Missing critical personnel registry fields.' });
    }
    const newEmp = addEmployee({
      name,
      role,
      department,
      email,
      salary: Number(salary),
      status: status || 'pending'
    });
    res.json({ success: true, employee: newEmp });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to onboard talent', details: err.message });
  }
});

// Update employee status
app.post('/api/erp/hr/status', (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ error: 'Missing employee identification or status payload.' });
    }
    const updated = updateEmployeeStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Staff member record not mapped.' });
    }
    res.json({ success: true, employee: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Status revision compromised', details: err.message });
  }
});


// AI Intelligence Vision Synthesis (Gemini AI Endpoint)
app.post('/api/erp/ai/query', async (req, res) => {
  try {
    const { userPrompt, currentFocus } = req.body;
    
    // Construct rich operational context
    const assets = getBalanceSheet();
    const activeAlerts = inventory.filter(i => i.stockLevel < i.safetyStock);
    const delayedShipments = shipments.filter(s => s.status === 'delayed');
    
    const contextStr = `
====== AMDOX CORE ENTERPRISE LEDGER ASSETS ======
- Cash on Hand: $${assets.cashOnHand.toLocaleString()}
- Accounts Receivable: $${assets.accountsReceivable.toLocaleString()}
- Current Inventory Asset Value: $${assets.inventoryValue.toLocaleString()}
- Total Managed Assets: $${assets.totalAssets.toLocaleString()}

====== HIGH ALERTS & CONSTRAINTS ======
- Out-of-Stock/Low Stock SKU Alerts: ${activeAlerts.length > 0 ? activeAlerts.map(i => `${i.name} (SKU: ${i.sku} is at ${i.stockLevel}/${i.safetyStock} in ${i.warehouse})`).join(', ') : 'None'}
- Logistics Disruption Shipment Alerts: ${delayedShipments.length > 0 ? delayedShipments.map(s => `Shipment from ${s.origin} to ${s.destination} is DELAYED via carrier ${s.carrier}. ETA ${s.eta}. Cargo Value: $${s.cargoValue}`).join(', ') : 'None'}

====== RECENT LEDGER TRANSACTIONS (Top 8) ======
${transactions.slice(0, 8).map(t => `- [${t.date}] ${t.id}: ${t.account} (${t.type.toUpperCase()}) | $${t.amount.toLocaleString()} | Dept: ${t.department} | Status: ${t.status}`).join('\n')}

====== SYSTEM DIRECTIVE ======
You are the Amdox Enterprise AI Synthesizer, an engineering-grade business forecasting oracle. 
Respond to user queries with extreme numerical precision, analytical rigor, and highly executive summaries.
Include three structured segments:
1. Operational Synthesis (A 2-sentence crisp high-level status outline).
2. Advanced AI Intelligence Actions (3 concrete recommendations or mathematical conclusions based on the active ledger/supply logs).
3. Risk Score Matrix (Assess risk from 1 to 10 for Cash Flow, Fulfillment, and Global Logistics based on the data).
Always keep answers clean, strictly professional, direct, and formatted in clean markdown bullets. Do not use generic introductions or fluffy salutations.
`;

    let aiResultText = '';

    if (ai) {
      try {
        const fullPrompt = `${contextStr}\n\nUSER COCKPIT INPUT QUERY FOCUS:\n"${userPrompt || 'Synthesize general business state, treasury forecasting and warehouse safety limits.'}"`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: fullPrompt,
          config: {
            systemInstruction: "You are the primary intelligence unit for Amdox enterprise systems. Do not reference mock variables. Give realistic numbers.",
            temperature: 0.2,
          }
        });

        if (response && response.text) {
          aiResultText = response.text;
        } else {
          throw new Error('Gemini returned an empty text payload');
        }
      } catch (geminiError: any) {
        console.error('Gemini API model execution failed, backing up to high-fidelity simulated local analysis:', geminiError);
        aiResultText = generateFallbackAIResponse(userPrompt, assets, activeAlerts, delayedShipments);
      }
    } else {
      aiResultText = generateFallbackAIResponse(userPrompt, assets, activeAlerts, delayedShipments);
    }

    res.json({
      success: true,
      insight: aiResultText,
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    res.status(500).json({ error: 'AI Synthesis Engine failed', details: err.message });
  }
});

// Helper to provide robust, deeply integrated simulated AI response if Gemini Key isn't provided
function generateFallbackAIResponse(
  userQuery: string, 
  assets: any, 
  activeAlerts: any[], 
  delayedShipments: any[]
): string {
  const isTreasuryFocus = userQuery?.toLowerCase().includes('cash') || userQuery?.toLowerCase().includes('treasury') || userQuery?.toLowerCase().includes('finance') || userQuery?.toLowerCase().includes('ledger');
  const isLogisticsFocus = userQuery?.toLowerCase().includes('ship') || userQuery?.toLowerCase().includes('inventory') || userQuery?.toLowerCase().includes('warehouse') || userQuery?.toLowerCase().includes('sku');
  
  if (isTreasuryFocus) {
    return `### AI INSIGHT: TREASURY CORE SUMMARY
AmDox synthesis confirms solid liquidity capital structure backed by **$${assets.cashOnHand.toLocaleString()}** in liquid reserves. Ledger transactions exhibit robust operational inbound sales velocity ($320k credits clearing over peak days).

#### RECOMMENDED COCKPIT ACTIONS:
- **Capital Optimization**: Remit outstanding accounts receivable ($${assets.accountsReceivable.toLocaleString()}) within 5 working days to establish maximal treasury liquidity posture prior to Q3 taxation cycles.
- **OpEx Control**: Review high-frequency engineering hosting overheads (Oracle Cloud $24.5K + AWS Cloud $48.9K) which consume ~10.4% of cash capital reserves.
- **Liquidity Buffer**: Maintain a cash-on-hand threshold of $350k to buffer raw semiconductor restocking queues.

#### RISK SCORE MATRIX:
- Cash Flow Volatility: **2 / 10** (Extremely stable inbound receivables)
- Fulfillment Buffer: **4 / 10** (Minor bottleneck present in MCU inventory reserves)
- Regional Logistics Disruptions: **5 / 10** (Delays in central European transshipments)`;
  }

  if (isLogisticsFocus) {
    const alertCount = activeAlerts.length;
    return `### AI INSIGHT: LOGISTICS & SUPPLY CHAIN ALIGNMENT
Critical SKU deficits detected in **${alertCount}** raw material components, primarily driven by under-stocked **Micro-Controller Core V5** (SKU: MCU-V5-AMDX). One heavy disrupted route flagged on Carrier: Fedex Express.

#### RECOMMENDED COCKPIT ACTIONS:
- **Deploy Supply Buffer**: Trigger immediate procurement schedule of 1,200 units of MCU-V5-AMDX to Giga-Warehouse Austin. Prioritize air freight over ocean transport to reconcile the current stock level of ${activeAlerts.find(i => i.sku === 'MCU-V5-AMDX')?.stockLevel || '450'} units.
- **Logistics Interdiction**: Reroute delayed shipment **SH-48922** ($242k value) through Rotterdam Hub A as a failover channel to mitigate Giga-Warehouse Austin docking congestion.
- **Stock Rotation**: Repurpose 15% of Work in Progress materials to accelerate completion of Amdox Edge Node X Finished Goods.

#### RISK SCORE MATRIX:
- Cash Flow Volatility: **3 / 10** (Low direct systemic risk)
- Fulfillment Buffer: **8 / 10** (High risk of delivery lag due to component depletion)
- Regional Logistics Disruptions: **7 / 10** (Disruptions on active transatlantic freight avenues)`;
  }

  return `### AI INSIGHT: SYSTEM-WIDE OPERATIONAL SYNTHESIS
Amdox Enterprise Engines status is **optimal**, registering managed asset strength at **$${assets.totalAssets.toLocaleString()}**. Global distribution metrics indicate mild bottlenecks in microelectronic component inventory levels with a corresponding logistical delay in Munich-to-Austin lines.

#### RECOMMENDED COCKPIT ACTIONS:
- **Reorder MCU Core V5**: Order immediately to restore baseline operations. This will unlock delayed Edge Node X orders for BioTech LLC and IntelCorp.
- **Treasury Dispatch**: Leverage the high $${assets.cashOnHand.toLocaleString()} cash cushion to fully prepay inbound supply lines, capturing a 3% early-settlement wholesale discount.
- **Customs Intervention**: Expedite delayed flight SH-48922 ($242,000 value) which contains urgent calibration equipment for Austin Assembly Block B.

#### RISK SCORE MATRIX:
- Cash Flow Volatility: **2.5 / 10** (Highly secure balance sheet position)
- Fulfillment Buffer: **6.0 / 10** (Action required on semiconductor microcontrollers)
- Regional Logistics Disruptions: **5.5 / 10** (Moderate transatlantic transit deviation)`;
}

// ==========================================
// STATIC FRONTEND ASSET ROUTING & VITE MIDDLEWARE
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware injection loaded.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production builds statically from dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Amdox Enterprise Vision custom server is operating on port ${PORT}`);
  });
}

startServer();
