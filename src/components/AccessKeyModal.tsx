import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { KeyRound, Shield, UserCheck, X, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

interface AccessKeyModalProps {
  targetUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  titlePrefix?: string;
}

export const AccessKeyModal: React.FC<AccessKeyModalProps> = ({
  targetUser,
  isOpen,
  onClose,
  titlePrefix = 'Acesso ao Perfil'
}) => {
  const { loginForUser } = useSchool();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showKeyHint, setShowKeyHint] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError('');
      setShowKeyHint(false);
    }
  }, [isOpen, targetUser]);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = loginForUser(targetUser.id, code);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Chave de acesso incorreta.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-xs ${
                targetUser.role === 'admin'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {targetUser.role === 'admin' ? (
                <Shield className="w-5 h-5" />
              ) : (
                <UserCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {titlePrefix}: {targetUser.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                {targetUser.role === 'admin'
                  ? 'Acesso Administrativo / Coordenação'
                  : `Componente: ${targetUser.component || 'Multidisciplinar'}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo / Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center pb-1">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-700 mb-2">
              <Lock className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Digite a Chave de Acesso deste Perfil
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Para entrar no ambiente individual de <strong>{targetUser.name}</strong>, informe a chave cadastrada:
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Chave de Acesso Pessoal
            </label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder={`Chave de ${targetUser.name.split(' ')[0]}`}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all uppercase font-bold text-center"
                autoFocus
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Dica para demonstração / testes sem travar o usuário */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>Precisa lembrar a chave?</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setCode(targetUser.accessCode);
                setShowKeyHint(true);
              }}
              className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
            >
              {showKeyHint ? `Código: ${targetUser.accessCode}` : 'Preencher Chave de Teste'}
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Confirmar e Entrar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
