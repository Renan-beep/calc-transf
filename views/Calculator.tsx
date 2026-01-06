
import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  AlertCircle,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { Branch, Carrier, CalculationInput, CalculationResult, HistoryEntry } from '../types';
import { calculateFreight, findBestResult, formatCurrency } from '../utils/calculations';

interface CalculatorProps {
  branches: Branch[];
  carriers: Carrier[];
  onSaveHistory: (entry: HistoryEntry) => void;
}

const CalculatorView: React.FC<CalculatorProps> = ({ branches, carriers, onSaveHistory }) => {
  const [input, setInput] = useState<CalculationInput>({
    invoiceValue: 0,
    totalWeight: 0,
    branchId: ''
  });
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [bestOption, setBestOption] = useState<CalculationResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.branchId || input.invoiceValue <= 0 || input.totalWeight <= 0) return;

    const eligibleCarriers = carriers.filter(c => c.branchId === input.branchId);
    const calculatedResults = eligibleCarriers.map(c => calculateFreight(c, input));
    
    const sortedResults = calculatedResults.sort((a, b) => a.chargedFreight - b.chargedFreight);
    const best = findBestResult(calculatedResults);
    
    setResults(sortedResults);
    setBestOption(best);

    if (best) {
      const branch = branches.find(b => b.id === input.branchId);
      onSaveHistory({
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        invoiceValue: input.invoiceValue,
        totalWeight: input.totalWeight,
        bestCarrierName: best.carrier.name,
        bestFreightValue: best.chargedFreight,
        branchName: branch?.name || 'N/A'
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Calculator Form */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Search size={20} className="text-blue-600" />
          Simular Novo Frete
        </h2>
        <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor da NF (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              value={input.invoiceValue || ''}
              onChange={e => setInput({ ...input, invoiceValue: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: 2500,00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Peso Total (kg)</label>
            <input
              type="number"
              step="0.1"
              required
              value={input.totalWeight || ''}
              onChange={e => setInput({ ...input, totalWeight: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: 12.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filial de Origem</label>
            <select
              required
              value={input.branchId}
              onChange={e => setInput({ ...input, branchId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Selecione...</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all"
          >
            Calcular Frete
            <ArrowRight size={18} />
          </button>
        </form>
      </section>

      {/* Results Section */}
      {results.length > 0 ? (
        <>
          {bestOption && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute right-0 top-0 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Trophy size={200} />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                    Melhor Opção Identificada
                  </div>
                  <h3 className="text-3xl font-bold">{bestOption.carrier.name}</h3>
                  <p className="opacity-90">Transportadora ideal para este cenário.</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full md:w-auto">
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-sm opacity-80 mb-1">Valor do Frete</p>
                    <p className="text-2xl font-bold">{formatCurrency(bestOption.chargedFreight)}</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-sm opacity-80 mb-1">Impacto na NF</p>
                    <p className="text-2xl font-bold">{bestOption.freightToInvoiceRatio.toFixed(2)}%</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm col-span-2 sm:col-span-1">
                    <p className="text-sm opacity-80 mb-1">Prazo</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                      <Clock size={20} />
                      {bestOption.carrier.deliveryTimeValue} {bestOption.carrier.deliveryTimeUnit}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Tabela Comparativa</h3>
              <span className="text-xs text-gray-500">{results.length} transportadoras elegíveis</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Transportadora</th>
                    <th className="px-6 py-4 font-medium">Por Peso</th>
                    <th className="px-6 py-4 font-medium">Percentual</th>
                    <th className="px-6 py-4 font-medium">Mínimo</th>
                    <th className="px-6 py-4 font-medium text-blue-700">Cobrado</th>
                    <th className="px-6 py-4 font-medium">% s/ NF</th>
                    <th className="px-6 py-4 font-medium">Prazo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((res, idx) => (
                    <tr 
                      key={res.carrier.id} 
                      className={`hover:bg-gray-50 transition-colors ${idx === 0 ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={res.carrier.logoUrl} alt="" className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 object-cover" />
                          <div>
                            <span className="font-semibold text-gray-900 block">{res.carrier.name}</span>
                            {idx === 0 && <span className="text-[10px] text-blue-600 font-bold uppercase">Melhor Escolha</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{formatCurrency(res.weightFreight)}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{formatCurrency(res.percentageFreight)}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{formatCurrency(res.minFreight)}</td>
                      <td className="px-6 py-4 font-bold text-blue-700">{formatCurrency(res.chargedFreight)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-sm font-medium ${
                          res.freightToInvoiceRatio > 5 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                        }`}>
                          {res.freightToInvoiceRatio.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock size={14} />
                          {res.carrier.deliveryTimeValue} {res.carrier.deliveryTimeUnit}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
          <AlertCircle size={48} className="mb-4 text-gray-300" />
          <p className="text-lg font-medium">Inicie uma simulação acima</p>
          <p className="text-sm">Os resultados aparecerão aqui e serão salvos no histórico.</p>
        </div>
      )}
    </div>
  );
};

export default CalculatorView;
