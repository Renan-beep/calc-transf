
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Search } from 'lucide-react';
import { Branch } from '../types';

interface BranchesViewProps {
  branches: Branch[];
  onUpdate: (branches: Branch[]) => void;
}

const BranchesView: React.FC<BranchesViewProps> = ({ branches, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Omit<Branch, 'id'>>({
    code: '',
    name: ''
  });

  const handleAdd = () => {
    if (!formData.code || !formData.name) return;
    const newBranch: Branch = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9)
    };
    onUpdate([...branches, newBranch]);
    setFormData({ code: '', name: '' });
    setIsAdding(false);
  };

  const handleEdit = (branch: Branch) => {
    onUpdate(branches.map(b => b.id === branch.id ? branch : b));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta filial?')) {
      onUpdate(branches.filter(b => b.id !== id));
    }
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar filiais..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-all"
        >
          <Plus size={20} />
          Nova Filial
        </button>
      </div>

      {/* Add Form Modal/Section */}
      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 animate-slideDown">
          <h3 className="text-lg font-semibold mb-4">Cadastrar Filial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
              <input
                type="text"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: 001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Filial</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: Filial São Paulo"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button 
              onClick={() => setIsAdding(false)} 
              className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancelar
            </button>
            <button 
              onClick={handleAdd} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm"
            >
              Salvar Filial
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map(branch => (
          <div 
            key={branch.id} 
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative"
          >
            {editingId === branch.id ? (
              <div className="space-y-4">
                <input
                  autoFocus
                  className="w-full px-2 py-1 border rounded"
                  value={branch.code}
                  onChange={e => handleEdit({ ...branch, code: e.target.value })}
                />
                <input
                  className="w-full px-2 py-1 border rounded"
                  value={branch.name}
                  onChange={e => handleEdit({ ...branch, name: e.target.value })}
                />
                <button 
                  onClick={() => setEditingId(null)}
                  className="w-full bg-green-500 text-white py-1 rounded"
                >
                  OK
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">
                    #{branch.code}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingId(branch.id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(branch.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-800">{branch.name}</h4>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredBranches.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Nenhuma filial cadastrada ou encontrada.
        </div>
      )}
    </div>
  );
};

export default BranchesView;
