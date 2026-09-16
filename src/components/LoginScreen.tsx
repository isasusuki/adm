import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Shield, KeyRound, ArrowRight, UserCheck, School, Lock, Eye, AlertCircle, Users, Download } from 'lucide-react';
import { User } from '../types';
import { AccessKeyModal } from './AccessKeyModal';

export const LoginScreen: React.FC = () => {
  const { login, users, schoolConfig } = useSchool();
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedUserForLogin, setSelectedUserForLogin] = useState<User | null>(null);

  const handleDownloadStandalone = async () => {
    try {
      const res = await fetch('/pre-conselho.html');
      const htmlText = await res.text();
      const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'index.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      window.open('/pre-conselho.html', '_blank');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = login(code);
    if (!res.success) {
      setErrorMessage(res.message || 'Código de acesso incorreto.');
    }
  };

  const handleSelectProfile = (user: User) => {
    setErrorMessage('');
    setSelectedUserForLogin(user);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Painel Esquerdo: Explicação Institucional e Regras */}
        <div className="md:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <School className="w-3.5 h-3.5 text-emerald-600" />
            <span>{schoolConfig.schoolSubtitle}</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {schoolConfig.schoolName}
            </h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Plataforma Digital da Ficha Individual do Pré-Conselho de Classe
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/90 shadow-sm">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 flex-shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Entrada Obrigatória com Chave de Acesso</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Toda vez que o professor entra, é solicitado digitar sua chave de acesso pessoal exclusiva. Isso garante a proteção integral da conta.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/90 shadow-sm">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-700 flex-shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Personalização do Próprio Perfil</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Cada professor pode digitar e alterar seu próprio perfil (nome completo, componente curricular e definir a sua própria chave de acesso).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/90 shadow-sm">
              <div className="p-2 rounded-lg bg-sky-50 text-sky-700 flex-shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Visualização Coletiva (Somente Leitura)</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Consulte o mural das turmas para ver as notas dos colegas de outras matérias, sem que ninguém possa alterar ou apagar o texto de outro.
                </p>
              </div>
            </div>

            {/* Caixa de Download do index.html Autônomo */}
            <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-xs">
                <Download className="w-4 h-4 text-emerald-700" />
                <span>Usar Offline / No Navegador sem Instalação</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Para rodar direto no seu computador sem terminal, sem Node.js e sem erros de package-lock, baixe o arquivo único <strong>index.html</strong> pronto para abrir em qualquer navegador com 2 cliques.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadStandalone}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar index.html Autônomo</span>
                </button>
                <a
                  href="/pre-conselho.html"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-colors"
                >
                  Testar Versão Autônoma
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Painel Direito: Cartão de Login */}
        <div className="md:col-span-6 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <KeyRound className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Entrar com Chave de Acesso</h3>
            <p className="text-xs text-slate-500 mt-1">
              Digite a sua chave de acesso pessoal para carregar seu perfil individual
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Sua Chave de Acesso Pessoal
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="Ex: PROF101 ou sua chave personalizada"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 font-mono text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all uppercase"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Entrar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                Cada professor utiliza sua chave exclusiva para entrar. Dentro do painel, você pode editar e personalizar o seu próprio perfil.
              </p>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>

          {/* Perfis Cadastrados - Exigem Chave de Acesso */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Entrar por Perfil Cadastrado</span>
              </span>
              <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Exige Chave de Acesso</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Clique no seu perfil para digitar a sua chave de acesso correspondente:
            </p>

            <div className="space-y-2">
              {/* Administrador */}
              {users
                .filter(u => u.role === 'admin')
                .map(adminUser => (
                  <button
                    key={adminUser.id}
                    type="button"
                    onClick={() => handleSelectProfile(adminUser)}
                    className="w-full p-2.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-left transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-amber-950 group-hover:text-amber-900">
                          {adminUser.name}
                        </div>
                        <div className="text-[10px] text-amber-700 font-medium">
                          Coordenação Pedagógica / Direção
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 group-hover:text-amber-950 px-2 py-1 bg-amber-200/70 rounded-lg">
                      <Lock className="w-3 h-3 text-amber-700" />
                      <span>Digitar Chave</span>
                    </span>
                  </button>
                ))}

              {/* Professores Cadastrados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {users
                  .filter(u => u.role === 'professor')
                  .map(prof => (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => handleSelectProfile(prof)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-colors group flex items-center justify-between"
                    >
                      <div className="truncate pr-1">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-950 truncate flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="truncate">{prof.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 group-hover:text-emerald-700 truncate pl-4.5">
                          {prof.component}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-1 bg-slate-200/80 group-hover:bg-emerald-200 text-slate-700 group-hover:text-emerald-900 rounded-lg flex-shrink-0">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Entrar</span>
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal que exige a chave de acesso do perfil selecionado */}
      <AccessKeyModal
        targetUser={selectedUserForLogin}
        isOpen={Boolean(selectedUserForLogin)}
        onClose={() => setSelectedUserForLogin(null)}
        titlePrefix="Entrar no Perfil"
      />
    </div>
  );
};
