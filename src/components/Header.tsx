import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Shield, UserCheck, LogOut, Users, School, UserCog, Lock, Download } from 'lucide-react';
import { ProfileModal } from './ProfileModal';
import { AccessKeyModal } from './AccessKeyModal';
import { User } from '../types';

interface HeaderProps {
  onOpenPrint?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPrint, activeTab, onTabChange }) => {
  const { currentUser, logout, schoolConfig, users } = useSchool();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedUserToSwitch, setSelectedUserToSwitch] = useState<User | null>(null);

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

  return (
    <>
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-30">
        {/* Barra superior de identidade da Escola */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/90 text-white flex items-center justify-center font-bold shadow-inner ring-2 ring-emerald-400/30 flex-shrink-0">
                <School className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {schoolConfig.schoolSubtitle}
                  </span>
                  <span className="text-xs text-slate-400">Pré-Conselho Online</span>
                </div>
                <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight leading-snug">
                  {schoolConfig.schoolName}
                </h1>
              </div>
            </div>

            {/* Área do Usuário Autenticado */}
            {currentUser ? (
              <div className="flex items-center flex-wrap gap-2.5 justify-end">
                {/* Botão para visualizar e editar o próprio perfil */}
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/80 hover:border-emerald-500/50 transition-colors text-left group"
                  title="Clique para editar seu perfil, nome, disciplina e chave de acesso"
                >
                  {currentUser.role === 'admin' ? (
                    <Shield className="w-4 h-4 text-amber-400" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  )}
                  <div className="text-left">
                    <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                      <span className="group-hover:text-emerald-300 transition-colors">{currentUser.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          currentUser.role === 'admin'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                        }`}
                      >
                        {currentUser.role === 'admin' ? 'Administrador' : 'Professor'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      {currentUser.component && <span>{currentUser.component}</span>}
                      <span className="text-emerald-400 group-hover:underline flex items-center gap-1">
                        <UserCog className="w-3 h-3" /> Editar Perfil
                      </span>
                    </div>
                  </div>
                </button>

                {/* Botão de Troca de Perfil - Exige Chave de Acesso */}
                <div className="relative group">
                  <button
                    type="button"
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                    title="Trocar de Professor ou Administrador (exige a chave de acesso do perfil)"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline">Alternar Perfil</span>
                  </button>
                  <div className="hidden group-hover:block absolute right-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700 mb-1 flex items-center justify-between">
                      <span>Trocar Perfil</span>
                      <span className="text-[9px] text-amber-400 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> Exige Chave
                      </span>
                    </div>
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedUserToSwitch(u)}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-700 transition-colors ${
                          currentUser.id === u.id ? 'bg-slate-700/60 font-semibold text-emerald-300' : 'text-slate-200'
                        }`}
                      >
                        <div className="truncate">
                          <div>{u.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {u.role === 'admin' ? 'Administrador' : u.component}
                          </div>
                        </div>
                        {currentUser.id === u.id ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 ml-2"></span>
                        ) : (
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5 text-slate-400" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botão Baixar Arquivo Único index.html */}
                <button
                  type="button"
                  onClick={handleDownloadStandalone}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  title="Baixar todo o sistema em arquivo único index.html autônomo (roda com 2 cliques em qualquer navegador)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Baixar index.html</span>
                </button>

                {/* Botão de Logout */}
                <button
                  onClick={logout}
                  className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg text-xs font-medium border border-rose-800/40 transition-colors flex items-center gap-1"
                  title="Sair do Sistema"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleDownloadStandalone}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  title="Baixar todo o sistema em arquivo único index.html autônomo (roda com 2 cliques em qualquer navegador)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar index.html Autônomo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Edição do Próprio Perfil */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* Modal que exige a chave de acesso do perfil selecionado */}
      <AccessKeyModal
        targetUser={selectedUserToSwitch}
        isOpen={Boolean(selectedUserToSwitch)}
        onClose={() => setSelectedUserToSwitch(null)}
        titlePrefix="Trocar para o Perfil"
      />
    </>
  );
};
