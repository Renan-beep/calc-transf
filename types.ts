
export type DeliveryUnit = 'dias' | 'horas';

export interface Branch {
  id: string;
  code: string;
  name: string;
}

export interface Carrier {
  id: string;
  name: string;
  logoUrl: string;
  branchId: string;
  regions: string[];
  costPerKg: number;
  percentageOfValue: number;
  minFreight: number;
  deliveryTimeValue: number;
  deliveryTimeUnit: DeliveryUnit;
  isCombined: boolean;
}

export interface CalculationInput {
  invoiceValue: number;
  totalWeight: number;
  branchId: string;
}

export interface CalculationResult {
  carrier: Carrier;
  weightFreight: number;
  percentageFreight: number;
  minFreight: number;
  chargedFreight: number;
  freightToInvoiceRatio: number;
}

export interface HistoryEntry {
  id: string;
  date: string;
  invoiceValue: number;
  totalWeight: number;
  bestCarrierName: string;
  bestFreightValue: number;
  branchName: string;
}

export interface SystemConfig {
  companyName: string;
  logoUrl: string;
}
