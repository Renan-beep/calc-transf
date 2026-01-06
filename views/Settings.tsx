
import React, { useState, useRef } from 'react';
import { Settings as SettingsIcon, Save, Image as ImageIcon, Building, CheckCircle2, Upload, X } from 'lucide-react';
import { SystemConfig } from '../types';

interface SettingsViewProps {
  config: SystemConfig;
  onUpdate: (config: SystemConfig) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ config, onUpdate }) => {
  const [tempConfig, setTempConfig] = useState<SystemConfig>(config);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(tempConfig);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempConfig({ ...tempConfig, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setTempConfig({ ...tempConfig, logoUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <SettingsIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Personalização do Sistema</h2>
              <p className="text-sm text-gray-500">Altere a identidade visual da sua plataforma logística.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Building size={16} className="text-gray-400" />
                  Nome da Empresa / Sistema
                </label>
                <input
                  type="text"
                  value={tempConfig.companyName}
                  onChange={e => setTempConfig({ ...tempConfig, companyName: e.target.value })}
                  placeholder="Ex: LogiCalc Brasil"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon size={16} className="text-gray-400" />
                  Logo da Empresa
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-4 transition-all bg-gray-50 hover:bg-blue-50/30 flex flex-col items-center justify-center min-h-[140px]"
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  {tempConfig.logoUrl ? (
                    <div className="relative">
                      <img src={tempConfig.logoUrl} alt="Preview" className="h-20 w-auto object-contain mb-2" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); clearLogo(); }} className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-gray-400 group-hover:text-blue-500 mb-2" size={32} />
                      <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600">Clique para upload</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
              <span className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Pré-visualização</span>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-gray-100 overflow-hidden">
                  {tempConfig.logoUrl ? (
                    <img src={tempConfig.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <SettingsIcon size={48} className="text-blue-100" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{tempConfig.companyName || 'Nome da Empresa'}</h3>
                  <p className="text-xs text-gray-400">Database: Local Instance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            {showSuccess && (
              <div className="flex items-center gap-2 text-green-600 font-medium animate-bounce">
                <CheckCircle2 size={20} />
                <span>Configurações salvas com sucesso!</span>
              </div>
            )}
            <button type="submit" className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-200 transition-all hover:scale-105">
              <Save size={20} />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsView;
