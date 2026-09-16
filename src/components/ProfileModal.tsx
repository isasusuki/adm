import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { UserCheck, KeyRound, Check, X, Shield, BookOpen, User as UserIcon } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUser, schoolConfig } = useSchool();

  const [name, setName] = useState(currentUser?.name || '');
  const [component, setComponent] = useState(currentUser?.component || schoolConfig.componentes[0] || 'Língua Portuguesa');
  const [customComponent, setCustomComponent] = useState('');
  const [useCustomComponent, setUseCustomComponent] = useState(
    Boolean(currentUser?.component && !schoolConfig.componentes.includes(currentUser.component))
  );
  const [accessCode, setAccessCode] = useState(currentUser?.accessCode || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanName = name.trim();
    const cleanCode = accessCode.trim().toUpperCase();
    const finalComponent = useCustomComponent ? customComponent.trim() : component;

    if (!cleanName) {
      setErrorMessage('Por favor, digite o seu nome.');
      return;
    }

    if (!cleanCode) {
      setErrorMessage('Por favor, defina a sua chave de acesso (código).');
      return;
    }

    if (currentUser.role === 'professor' && !finalComponent) {
      setErrorMessage('Por favor, informe a sua disciplina / componente curricular.');
      return;
    }

    updateUser(currentUser.id, {
      name: cleanName,
      accessCode: cleanCode,
      component: currentUser.role === 'professor' ? finalComponent : undefined,
      email: email.trim() || undefined
    });

    setSuccessMessage('Perfil atualizado com sucesso!');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Cabeçalho do Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {currentUser.role === 'professor' ? 'Meu Perfil de Professor(a)' : 'Meu Perfil Administrativo'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Altere seu nome, disciplina e sua chave de acesso pessoal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-2 font-bold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Seu Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Profa. Maria Silva"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Esse nome constará nas fichas de avaliação impressas e no mural dos colegas.
            </p>
          </div>

          {/* Chave de Acesso / Código */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sua Chave de Acesso (Código para entrar no site)</span>
            </label>
            <input
              type="text"
              value={accessCode}
              onChange={e => setAccessCode(e.target.value.toUpperCase())}
              placeholder="Ex: PROF2026, CARLOS10, MATEMATICA"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-bold"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Toda vez que você entrar no site, precisará digitar esta chave de acesso. Guarde-a com você.
            </p>
          </div>

          {/* Componente Curricular (Apenas para professores) */}
          {currentUser.role === 'professor' && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Componente Curricular Principal
              </label>

              {!useCustomComponent ? (
                <div className="space-y-2">
                  <select
                    value={component}
                    onChange={e => setComponent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                  >
                    {schoolConfig.componentes.map(comp => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomComponent(true);
                      setCustomComponent(component);
                    }}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold underline"
                  >
                    + Digitar outro componente curricular não listado
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customComponent}
                    onChange={e => setCustomComponent(e.target.value)}
                    placeholder="Ex: Filosofia, Projeto de Vida, Robótica..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setUseCustomComponent(false)}
                    className="text-[11px] text-slate-600 hover:text-slate-800 underline"
                  >
                    Voltar para lista padrão de disciplinas
                  </button>
                </div>
              )}
            </div>
          )}

          {/* E-mail (Opcional) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              E-mail de Contato (Opcional)
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Ex: seu.nome@escola.gov.br"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
