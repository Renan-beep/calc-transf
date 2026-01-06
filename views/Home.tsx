
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Building2, 
  Truck, 
  Activity,
  Calendar,
  Filter
} from 'lucide-react';
import { HistoryEntry } from '../types';
import { formatCurrency } from '../utils/calculations';

interface HomeViewProps {
  branchesCount: number;
  carriersCount: number;
  history: HistoryEntry[];
}

const HomeView: React.FC<HomeViewProps> = ({ branchesCount, carriersCount, history }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Derive available months from history for the filter
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    history.forEach(entry => {
      const date = new Date(entry.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(key);
    });
    return Array.from(months).sort().reverse(); // Newest first
  }, [history]);

  // Filter history based on selection
  const filteredHistory = useMemo(() => {
    if (selectedMonth === 'all') return history;
    return history.filter(entry => {
      const date = new Date(entry.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return key === selectedMonth;
    });
  }, [history, selectedMonth]);

  const totalSimulations = filteredHistory.length;
  const totalInvoiceValue = filteredHistory.reduce((acc, curr) => acc + curr.invoiceValue, 0);
  const totalFreightValue = filteredHistory.reduce((acc, curr) => acc + curr.bestFreightValue, 0);
  const avgFreightPercent = totalSimulations > 0 ? (totalFreightValue / totalInvoiceValue) * 100 : 0;

  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between transition-transform hover:scale-[1.02]">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend !== undefined && (
          <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${trend > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
            <Activity size={12} />
            <span>{selectedMonth === 'all' ? 'Total Histórico' : 'No Período'}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 text-gray-700">
          <Filter size={20} className="text-blue-600" />
          <span className="font-semibold">Filtrar Visão:</span>
        </div>
        <div className="relative w-full sm:w-64">
          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none"
          >
            <option value="all">Todos os meses</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>{formatMonthLabel(m)}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Filiais" 
          value={branchesCount} 
          icon={Building2} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Transportadoras" 
          value={carriersCount} 
          icon={Truck} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Simulações" 
          value={totalSimulations} 
          icon={BarChart3} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Média de Frete" 
          value={`${avgFreightPercent.toFixed(2)}%`} 
          icon={TrendingUp} 
          color="bg-amber-500" 
          trend={avgFreightPercent}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">
              {selectedMonth === 'all' ? 'Atividade Recente' : `Atividade em ${formatMonthLabel(selectedMonth)}`}
            </h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {filteredHistory.length} movimentações
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-3">Data</th>
                  <th className="px-6 py-3">Origem</th>
                  <th className="px-6 py-3">Transportadora</th>
                  <th className="px-6 py-3 text-right">Frete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredHistory.slice(0, 15).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">{item.branchName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span className="text-sm font-semibold text-gray-800">{item.bestCarrierName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-blue-600">{formatCurrency(item.bestFreightValue)}</span>
                    </td>
                  </tr>
                ))}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm italic">
                      Nenhuma movimentação registrada para este período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals & Insights */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Volume {selectedMonth === 'all' ? 'Acumulado' : 'Mensal'}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Valor Total NFs</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalInvoiceValue)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Investimento em Frete</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(totalFreightValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-sm text-white">
            <h3 className="font-bold mb-2">Relatórios Gerenciais</h3>
            <p className="text-sm text-slate-300 mb-6">Filtre por meses anteriores para comparar sazonalidade e eficiência das transportadoras parceiras.</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <div className="p-2 bg-blue-500 rounded-lg">
                   <Calendar size={16} />
                 </div>
                 <span className="text-xs font-semibold text-slate-300 uppercase">Visão Analítica</span>
              </div>
              <Activity className="text-blue-400 opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
