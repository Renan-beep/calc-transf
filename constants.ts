
// Fix: Added import to allow explicit typing of initial data constants to avoid type inference issues
import { Branch, Carrier } from './types';

export const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// Fix: Explicitly type INITIAL_BRANCHES as Branch[] to ensure consistency
export const INITIAL_BRANCHES: Branch[] = [
  { id: '1', code: '001', name: 'Matriz São Paulo' },
  { id: '2', code: '002', name: 'Filial Curitiba' }
];

// Fix: Explicitly type INITIAL_CARRIERS as Carrier[] to fix the error in database.ts regarding deliveryTimeUnit inference
export const INITIAL_CARRIERS: Carrier[] = [
  {
    id: '1',
    name: 'TransExpress',
    logoUrl: 'https://picsum.photos/seed/truck1/100/100',
    branchId: '1',
    regions: ['SP', 'RJ', 'MG'],
    costPerKg: 2.5,
    percentageOfValue: 0.8,
    minFreight: 50,
    deliveryTimeValue: 2,
    deliveryTimeUnit: 'dias',
    isCombined: false
  },
  {
    id: '2',
    name: 'Logística Rápida',
    logoUrl: 'https://picsum.photos/seed/truck2/100/100',
    branchId: '1',
    regions: ['SP', 'PR', 'SC'],
    costPerKg: 1.8,
    percentageOfValue: 1.2,
    minFreight: 45,
    deliveryTimeValue: 48,
    deliveryTimeUnit: 'horas',
    isCombined: true
  }
];
