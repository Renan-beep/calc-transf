
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Search, 
  Info,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';
import { Carrier, Branch, DeliveryUnit } from '../types';
import { BRAZIL_STATES } from '../constants';

interface CarriersViewProps {
  carriers: Carrier[];
  branches: Branch[];
  onUpdate: (carriers: Carrier[]) => void;
}

const CarriersView: React.FC<CarriersViewProps> = ({ carriers, branches, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCarrierId, setEditingCarrierId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Omit<Carrier, 'id'>>({
    name: '',
    logoUrl: 'https://picsum.photos/seed/truck/100/100',
    branchId: '',
    regions: [],
    costPerKg: 0,
    percentageOfValue: 0,
    minFreight: 0,
    deliveryTimeValue: 0,
    deliveryTimeUnit: 'dias',
    isCombined: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCarrierId) {
      // Update existing
      const updatedCarriers = carriers.map(c => 
        c.id === editingCarrierId ? { ...formData, id: editingCarrierId } : c
      );
      onUpdate(updatedCarriers);
    } else {
      // Create new
      const newCarrier: Carrier = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9)
      };
      onUpdate([...carriers, newCarrier]);
    }

    setIsAdding(false);
    setEditingCarrierId(null);
    resetForm();
  };

  const handleEdit = (carrier: Carrier) => {
    setEditingCarrierId(carrier.id);
    setFormData({
      name: carrier.name,
      logoUrl: carrier.logoUrl,
      branchId: carrier.branchId,
      regions: carrier.regions,
      costPerKg: carrier.costPerKg,
      percentageOfValue: carrier.percentageOfValue,
      minFreight: carrier.minFreight,
      deliveryTimeValue: carrier.deliveryTimeValue,
      deliveryTimeUnit: carrier.deliveryTimeUnit,
      isCombined: carrier.isCombined
    });
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      logoUrl: 'https://picsum.photos/seed/truck/100/100',
      branchId: '',
      regions: [],
      costPerKg: 0,
      percentageOfValue: 0,
      minFreight: 0,
      deliveryTimeValue: 0,
      deliveryTimeUnit: 'dias',
      isCombined: false
    });
  };

  const toggleRegion = (state: string) => {
    setFormData(prev => ({
      ...prev,
      regions: prev.regions.includes(state) 
        ? prev.regions.filter(r => r !== state)
        : [...prev.regions, state]
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir esta transportadora?')) {
      onUpdate(carriers.filter(c => c.id !== id));
    }
  };

  const filteredCarriers = carriers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar transportadoras..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {!isAdding && (
          <button
            onClick={() => {
              resetForm();
              setEditingCarrierId(null);
              setIsAdding(true);
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-all"
          >
            <Plus size={20} />
            Nova Transportadora
          </button>
        )}
      </div>

      {/* Add/Edit Form Section */}
      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 animate-slideDown overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {editingCarrierId ? 'Editar Transportadora' : 'Nova Transportadora'}
            </h3>
            <button 
              onClick={() => {
                setIsAdding(false);
                setEditingCarrierId(null);
              }} 
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome da Transportadora</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Transportes Brasil S.A."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filial Atendida</label>
                <select
                  required
                  value={formData.branchId}
                  onChange={e => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Selecione...</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">R$ por kg</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={formData.costPerKg || ''}
                  onChange={e => setFormData({ ...formData, costPerKg: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">% sobre valor NF</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={formData.percentageOfValue || ''}
                  onChange={e => setFormData({ ...formData, percentageOfValue: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Frete Mínimo (R$)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={formData.minFreight || ''}
                  onChange={e => setFormData({ ...formData, minFreight: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prazo de Entrega</label>
                <div className="flex gap-2">
                  <input
                    required
                    type="number"
                    value={formData.deliveryTimeValue || ''}
                    onChange={e => setFormData({ ...formData, deliveryTimeValue: parseInt(e.target.value) })}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <select
                    value={formData.deliveryTimeUnit}
                    onChange={e => setFormData({ ...formData, deliveryTimeUnit: e.target.value as DeliveryUnit })}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                  >
                    <option value="dias">Dias</option>
                    <option value="horas">Horas</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
              <input
                type="checkbox"
                id="isCombined"
                checked={formData.isCombined}
                onChange={e => setFormData({ ...formData, isCombined: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isCombined" className="text-sm font-medium text-blue-900 cursor-pointer select-none">
                <span className="font-bold">Frete Combinado:</span> A transportadora cobra a soma do valor por peso + percentual.
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MapPin size={16} />
                Regiões Atendidas (Estados)
              </label>
              <div className="flex flex-wrap gap-2">
                {BRAZIL_STATES.map(state => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => toggleRegion(state)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                      formData.regions.includes(state)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-500 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => {
                  setIsAdding(false);
                  setEditingCarrierId(null);
                }} 
                className="px-6 py-2.5 font-semibold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg transition-all">
                {editingCarrierId ? 'Atualizar Transportadora' : 'Salvar Transportadora'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Carriers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCarriers.map(carrier => (
          <div key={carrier.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md">
            <div className="p-5 flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-50 border flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img src={carrier.logoUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 leading-tight">{carrier.name}</h4>
                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md inline-block mt-1">
                      {branches.find(b => b.id === carrier.branchId)?.name || 'Filial não encontrada'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(carrier)} 
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(carrier.id)} 
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-gray-100">
              <div className="p-4 border-r border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Custo Base</p>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">R$ p/ kg:</span>
                    <span className="font-bold text-gray-800">R$ {carrier.costPerKg.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">% s/ NF:</span>
                    <span className="font-bold text-gray-800">{carrier.percentageOfValue}%</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Logística</p>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Mínimo:</span>
                    <span className="font-bold text-gray-800">R$ {carrier.minFreight.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Prazo:</span>
                    <span className="font-bold text-gray-800">{carrier.deliveryTimeValue} {carrier.deliveryTimeUnit}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 flex flex-wrap gap-1.5 border-t border-gray-100">
              {carrier.isCombined && (
                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Combinado</span>
              )}
              {carrier.regions.map(r => (
                <span key={r} className="text-[10px] font-bold text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded">{r}</span>
              ))}
              {carrier.regions.length === 0 && <span className="text-[10px] text-gray-400">Nenhuma região informada</span>}
            </div>
          </div>
        ))}
      </div>

      {filteredCarriers.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">Nenhuma transportadora disponível.</p>
          <button 
            onClick={() => {
              resetForm();
              setEditingCarrierId(null);
              setIsAdding(true);
            }} 
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            Cadastrar Agora
          </button>
        </div>
      )}
    </div>
  );
};

export default CarriersView;
