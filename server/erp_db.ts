/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction, InventoryItem, LogisticsShipment, AIPrediction, Employee } from '../src/types';

// Establish initial database state
export let transactions: Transaction[] = [
  { id: 'TX-10492', date: '2026-05-27', account: 'Client Retainer: IntelCorp', type: 'credit', amount: 84200, description: 'Q2 enterprise software subscription delivery', department: 'Sales', status: 'cleared' },
  { id: 'TX-10491', date: '2026-05-26', account: 'Oracle Cloud License', type: 'debit', amount: 24500, description: 'Monthly DB orchestration cloud fees', department: 'Engineering', status: 'cleared' },
  { id: 'TX-10490', date: '2026-05-25', account: 'Freight-Corp Rotterdam', type: 'debit', amount: 12800, description: 'Customs release fees & freight dispatch', department: 'Logistics', status: 'cleared' },
  { id: 'TX-10489', date: '2026-05-24', account: 'Payroll: Singapore Core', type: 'debit', amount: 95000, description: 'Bi-weekly operations logistics salary pay', department: 'Operations', status: 'cleared' },
  { id: 'TX-10488', date: '2026-05-23', account: 'Client Billing: BioTech LLC', type: 'credit', amount: 142000, description: 'Supply chain automation consulting milestone 2', department: 'Sales', status: 'cleared' },
  { id: 'TX-10487', date: '2026-05-21', account: 'Semiconductor Raw Order', type: 'debit', amount: 62000, description: 'Direct purchase of IoT microcontrollers', department: 'Engineering', status: 'cleared' },
  { id: 'TX-10486', date: '2026-05-20', account: 'Warehouse Lease Austin', type: 'debit', amount: 8500, description: 'Rent payment Giga-Warehouse Block B', department: 'Logistics', status: 'cleared' },
  { id: 'TX-10485', date: '2026-05-20', account: 'Sales Kickoff Berlin', type: 'debit', amount: 15400, description: 'EMEA regional manager kickoff retreat', department: 'HR', status: 'cleared' },
  { id: 'TX-10484', date: '2026-05-18', account: 'Client Retainer: Sony Ltd', type: 'credit', amount: 76000, description: 'Enterprise operations integration support', department: 'Sales', status: 'cleared' },
  { id: 'TX-10483', date: '2026-05-17', account: 'HMRC Tax Quarterly', type: 'debit', amount: 45000, description: 'Corporate VAT remittance UK region', department: 'Finance', status: 'cleared' },
  { id: 'TX-10482', date: '2026-05-15', account: 'Draeger Calibration Inc', type: 'debit', amount: 5600, description: 'Annual factory environmental sensors test', department: 'Operations', status: 'pending' },
  { id: 'TX-10481', date: '2026-05-14', account: 'Stripe Merchant Fees', type: 'debit', amount: 3420, description: 'Processing surcharge for digital assets sales', department: 'Finance', status: 'cleared' },
  { id: 'TX-10480', date: '2026-05-12', account: 'Client Retainer: Siemens', type: 'credit', amount: 115000, description: 'Factory ERP upgrade implementation', department: 'Sales', status: 'cleared' },
  { id: 'TX-10479', date: '2026-05-10', account: 'Mouser Electronics Co', type: 'debit', amount: 14500, description: 'Prototype development components logistics', department: 'Engineering', status: 'cleared' },
  { id: 'TX-10478', date: '2026-05-08', account: 'Client Billing: Pfizer', type: 'credit', amount: 195000, description: 'Cold chain compliance tracking deliverable', department: 'Sales', status: 'cleared' },
  { id: 'TX-10477', date: '2026-05-05', account: 'AWS Cloud Hosting', type: 'debit', amount: 48900, description: 'Compute node auto-scaling & S3 storage', department: 'Engineering', status: 'cleared' },
  { id: 'TX-10476', date: '2026-05-03', account: 'Recruiter Fees: WorkDay', type: 'debit', amount: 12000, description: 'Staffing commission principal logistics architect', department: 'HR', status: 'flagged' },
  { id: 'TX-10475', date: '2026-05-01', account: 'Client Retainer: Tesla IT', type: 'credit', amount: 92000, description: 'In-vehicle telemetry integration advisory', department: 'Sales', status: 'cleared' }
];

export let inventory: InventoryItem[] = [
  { id: 'INV-SEM-89', name: 'Micro-Controller Core V5', sku: 'MCU-V5-AMDX', category: 'Raw Materials', stockLevel: 450, safetyStock: 1200, unitPrice: 42.50, warehouse: 'Giga-Warehouse Austin', reorderScheduled: true },
  { id: 'INV-SEN-12', name: 'Ambient Temp Sensor S1', sku: 'SEN-T1-COMP', category: 'Raw Materials', stockLevel: 2800, safetyStock: 2000, unitPrice: 8.90, warehouse: 'Rotterdam Hub A', reorderScheduled: false },
  { id: 'INV-FNG-41', name: 'Amdox Edge Edge Node X', sku: 'EDGE-NX-AMDX', category: 'Finished Goods', stockLevel: 140, safetyStock: 500, unitPrice: 380.00, warehouse: 'Giga-Warehouse Austin', reorderScheduled: true },
  { id: 'INV-SEM-32', name: 'Memory Flash Module 128G', sku: 'FLASH-128-IND', category: 'Raw Materials', stockLevel: 1100, safetyStock: 1500, unitPrice: 14.20, warehouse: 'Singapore Logistics Core', reorderScheduled: false },
  { id: 'INV-PKG-021', name: 'Reinforced Metal Casing M', sku: 'CSG-MET-M01', category: 'Packaging', stockLevel: 980, safetyStock: 800, unitPrice: 22.10, warehouse: 'Rotterdam Hub A', reorderScheduled: false },
  { id: 'INV-WIP-02', name: 'Unassembled Telemetry Loom', sku: 'WIP-TEL-L02', category: 'Work in Progress', stockLevel: 320, safetyStock: 300, unitPrice: 65.00, warehouse: 'Singapore Logistics Core', reorderScheduled: false }
];

export let shipments: LogisticsShipment[] = [
  { id: 'SH-48921', origin: 'Singapore Core', destination: 'Rotterdam Hub A', carrier: 'Maersk Line LLC', status: 'in-transit', progress: 68, temperatureControlled: true, cargoValue: 480000, eta: '2026-06-03' },
  { id: 'SH-48922', origin: 'Munich Airport', destination: 'Giga-Warehouse Austin', carrier: 'FedEx Express Cargo', status: 'delayed', progress: 40, temperatureControlled: false, cargoValue: 242000, eta: '2026-05-31' },
  { id: 'SH-48923', origin: 'Austin Port', destination: 'Intel Fab 12 Arizona', carrier: 'DDS Intermodal', status: 'cleared', progress: 100, temperatureControlled: false, cargoValue: 85000, eta: '2026-05-27' },
  { id: 'SH-48944', origin: 'Shanghai Factory B', destination: 'Singapore Core', carrier: 'DHL Global Forwarding', status: 'in-transit', progress: 15, temperatureControlled: true, cargoValue: 1200000, eta: '2026-06-08' }
];

export let predictions: AIPrediction[] = [
  { period: 'Dec 2025', actualRevenue: 480000, actualExpense: 320000, forecastRevenue: 475000, forecastExpense: 310000, confidenceScore: 100 },
  { period: 'Jan 2026', actualRevenue: 512000, actualExpense: 345000, forecastRevenue: 500000, forecastExpense: 350000, confidenceScore: 100 },
  { period: 'Feb 2026', actualRevenue: 495000, actualExpense: 310000, forecastRevenue: 490000, forecastExpense: 315000, confidenceScore: 100 },
  { period: 'Mar 2026', actualRevenue: 540000, actualExpense: 335001, forecastRevenue: 530000, forecastExpense: 340000, confidenceScore: 100 },
  { period: 'Apr 2026', actualRevenue: 620000, actualExpense: 390000, forecastRevenue: 600000, forecastExpense: 380000, confidenceScore: 100 },
  { period: 'May 2026', actualRevenue: 704200, actualExpense: 421720, forecastRevenue: 680000, forecastExpense: 410000, confidenceScore: 100 },
  // AI-Generated forecasts below the threshold
  { period: 'Jun 2026', forecastRevenue: 742000, forecastExpense: 435000, confidenceScore: 94 },
  { period: 'Jul 2026', forecastRevenue: 795000, forecastExpense: 450000, confidenceScore: 91 },
  { period: 'Aug 2026', forecastRevenue: 850000, forecastExpense: 462000, confidenceScore: 88 },
  { period: 'Sep 2026', forecastRevenue: 910000, forecastExpense: 480000, confidenceScore: 85 },
  { period: 'Oct 2026', forecastRevenue: 980000, forecastExpense: 495000, confidenceScore: 82 }
];

export function getBalanceSheet() {
  const cashOnHand = transactions.reduce((sum, tx) => {
    if (tx.type === 'credit') return sum + tx.amount;
    return sum - tx.amount;
  }, 450000); // 450k initial cash capital

  const inventoryValue = inventory.reduce((sum, item) => sum + (item.stockLevel * item.unitPrice), 0);
  const accountsReceivable = transactions.filter(t => t.status === 'pending' && t.type === 'credit').reduce((sum, tx) => sum + tx.amount, 125000);
  const totalAssets = cashOnHand + inventoryValue + accountsReceivable;

  return {
    totalAssets,
    cashOnHand,
    accountsReceivable,
    inventoryValue
  };
}

export function addTransaction(tx: Omit<Transaction, 'id' | 'date'>) {
  const newTx: Transaction = {
    ...tx,
    id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
    date: new Date().toISOString().split('T')[0]
  };
  transactions.unshift(newTx);
  return newTx;
}

export function updateStock(sku: string, adjustAmount: number) {
  const item = inventory.find(i => i.sku === sku);
  if (item) {
    item.stockLevel += adjustAmount;
    if (item.stockLevel < item.safetyStock) {
      item.reorderScheduled = true;
    }
    return item;
  }
}

export function setReorder(sku: string, state: boolean) {
  const item = inventory.find(i => i.sku === sku);
  if (item) {
    item.reorderScheduled = state;
    return item;
  }
}

export function updateTransactionStatus(id: string, status: 'cleared' | 'pending' | 'flagged') {
  const tx = transactions.find(t => t.id === id);
  if (tx) {
    tx.status = status;
    return tx;
  }
}

export function expediteShipment(id: string) {
  const ship = shipments.find(s => s.id === id);
  if (ship) {
    if (ship.progress < 100) {
      ship.progress = Math.min(100, ship.progress + 25);
      if (ship.progress === 100) {
        ship.status = 'cleared';
      } else if (ship.status === 'delayed') {
        ship.status = 'in-transit';
      }
    } else {
      ship.status = 'cleared';
    }
    return ship;
  }
}

export function addShipment(ship: Omit<LogisticsShipment, 'id' | 'progress'>) {
  const newShip: LogisticsShipment = {
    ...ship,
    id: `SH-${Math.floor(48000 + Math.random() * 9000)}`,
    progress: 0
  };
  shipments.unshift(newShip);
  return newShip;
}

export let employees: Employee[] = [
  { id: 'EMP-9021', name: 'Sarah Vance', role: 'Chief Financial Officer', department: 'Finance', email: 's.vance@amdox.com', salary: 18500, status: 'active' },
  { id: 'EMP-9022', name: 'Arthur Chen', role: 'Principal AI Infrastructure Architect', department: 'Engineering', email: 'a.chen@amdox.com', salary: 22000, status: 'active' },
  { id: 'EMP-9023', name: 'Elena Rostova', role: 'VP Cargo Routing & Logistics Flow', department: 'Logistics', email: 'e.rostova@amdox.com', salary: 14800, status: 'active' },
  { id: 'EMP-9024', name: 'David Kojo', role: 'Managing Director EMEA Subscriptions', department: 'Sales', email: 'd.kojo@amdox.com', salary: 16000, status: 'leave' },
  { id: 'EMP-9025', name: 'Marcus Vance', role: 'Senior Talent Acquisition Manager', department: 'HR', email: 'm.vance@amdox.com', salary: 9200, status: 'pending' }
];

export function addEmployee(emp: Omit<Employee, 'id'>) {
  const newEmp: Employee = {
    ...emp,
    id: `EMP-${Math.floor(9000 + Math.random() * 900)}`
  };
  employees.push(newEmp);
  return newEmp;
}

export function updateEmployeeStatus(id: string, status: 'active' | 'leave' | 'pending') {
  const emp = employees.find(e => e.id === id);
  if (emp) {
    emp.status = status;
    return emp;
  }
}


