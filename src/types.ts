/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  date: string;
  account: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  department: 'Operations' | 'Finance' | 'Engineering' | 'Logistics' | 'Sales' | 'HR';
  status: 'cleared' | 'pending' | 'flagged';
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: 'Raw Materials' | 'Work in Progress' | 'Finished Goods' | 'Packaging';
  stockLevel: number;
  safetyStock: number;
  unitPrice: number;
  warehouse: 'Giga-Warehouse Austin' | 'Rotterdam Hub A' | 'Singapore Logistics Core';
  reorderScheduled: boolean;
}

export interface LogisticsShipment {
  id: string;
  origin: string;
  destination: string;
  carrier: string;
  status: 'in-transit' | 'docked' | 'delayed' | 'cleared';
  progress: number; // Percentage
  temperatureControlled: boolean;
  cargoValue: number;
  eta: string;
}

export interface AIPrediction {
  period: string; // e.g. "Jun 2026", "Jul 2026", etc.
  actualRevenue?: number;
  actualExpense?: number;
  forecastRevenue: number;
  forecastExpense: number;
  confidenceScore: number;
}

export interface ERPDataState {
  balanceSheet: {
    totalAssets: number;
    cashOnHand: number;
    accountsReceivable: number;
    inventoryValue: number;
  };
  transactions: Transaction[];
  inventory: InventoryItem[];
  shipments: LogisticsShipment[];
  predictions: AIPrediction[];
  employees?: Employee[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: 'Operations' | 'Finance' | 'Engineering' | 'Logistics' | 'Sales' | 'HR';
  email: string;
  salary: number;
  status: 'active' | 'leave' | 'pending';
}
