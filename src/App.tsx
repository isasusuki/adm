import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { TeacherPanel } from './components/TeacherPanel';
import { AdminPanel } from './components/AdminPanel';
import { InstructionGuideModal } from './components/InstructionGuideModal';

const MainContent: React.FC = () => {
  const { currentUser } = useSchool();

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-slate-100 flex flex-col justify-between">
        <Header />
        <LoginScreen />
        <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
          Sistema de Pré-Conselho de Classe • Escola Estadual do Campo Frei Graciano Droessler
        </footer>
        <InstructionGuideModal />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      <Header />
      <main className="flex-1 pb-16">
        {currentUser.role === 'admin' ? <AdminPanel /> : <TeacherPanel />}
      </main>
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        Sistema de Pré-Conselho de Classe • Escola Estadual do Campo Frei Graciano Droessler
      </footer>
      <InstructionGuideModal />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainContent />
    </SchoolProvider>
  );
}
