
import { Carrier, CalculationInput, CalculationResult } from '../types';

export const calculateFreight = (carrier: Carrier, input: CalculationInput): CalculationResult => {
  const weightFreight = carrier.costPerKg * input.totalWeight;
  const percentageFreight = (carrier.percentageOfValue / 100) * input.invoiceValue;
  const minFreight = carrier.minFreight;

  let chargedFreight = 0;

  if (carrier.isCombined) {
    // Combined: (Weight + Percentage) or Min Freight
    const combined = weightFreight + percentageFreight;
    chargedFreight = Math.max(combined, minFreight);
  } else {
    // Not Combined: Max(Weight, Percentage, Min)
    chargedFreight = Math.max(weightFreight, percentageFreight, minFreight);
  }

  const freightToInvoiceRatio = (chargedFreight / input.invoiceValue) * 100;

  return {
    carrier,
    weightFreight,
    percentageFreight,
    minFreight,
    chargedFreight,
    freightToInvoiceRatio
  };
};

export const findBestResult = (results: CalculationResult[]): CalculationResult | null => {
  if (results.length === 0) return null;
  return results.reduce((prev, current) => 
    prev.chargedFreight < current.chargedFreight ? prev : current
  );
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};
