import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { QuestionDefinition, User, EvaluationRecord } from '../types';
import {
  HelpCircle,
  Users,
  LayoutGrid,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RotateCcw,
  Printer,
  Download,
  Upload,
  BookOpen,
  Filter,
  Eye,
  ShieldAlert,
  Search,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { PrintableSheet } from './PrintableSheet';

export const AdminPanel: React.FC = () => {
  const {
    currentUser,
    users,
    questions,
    sections,
    evaluations,
    schoolConfig,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    restoreDefaultQuestions,
    addUser,
    updateUser,
    deleteUser,
    updateSchoolConfig,
    resetAllData,
    exportDataJson,
    importDataJson
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'questions' | 'teachers' | 'board' | 'settings'>('questions');
  const [selectedEvaluationForPrint, setSelectedEvaluationForPrint] = useState<EvaluationRecord | null>(null);

  // Question Form State
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qSectionId, setQSectionId] = useState(sections[0]?.id || 'sec_1');
  const [qTitle, setQTitle] = useState('');
  const [qSubtitle, setQSubtitle] = useState('');
  const [qPlaceholder, setQPlaceholder] = useState('');
  const [qRequired, setQRequired] = useState(true);

  // Teacher Form State
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [tName, setTName] = useState('');
  const [tComponent, setTComponent] = useState(schoolConfig.componentes[0] || 'Língua Portuguesa');
  const [tCode, setTCode] = useState('');
  const [tEmail, setTEmail] = useState('');

  // Conselho Filter State
  const [boardTurma, setBoardTurma] = useState(schoolConfig.turmas[0] || '6º Ano A');

  // School Config Edit State
  const [cfgSchoolName, setCfgSchoolName] = useState(schoolConfig.schoolName);
  const [cfgSchoolSubtitle, setCfgSchoolSubtitle] = useState(schoolConfig.schoolSubtitle);
  const [cfgDocumentTitle, setCfgDocumentTitle] = useState(schoolConfig.documentTitle);
  const [cfgPedagoga, setCfgPedagoga] = useState(schoolConfig.pedagogaName);
  const [cfgDiretora, setCfgDiretora] = useState(schoolConfig.diretoraName);
  const [newTurmaName, setNewTurmaName] = useState('');
  const [newComponenteName, setNewComponenteName] = useState('');
  const [configSavedToast, setConfigSavedToast] = useState(false);

  // QUESTION HANDLERS
  const openNewQuestionModal = (defaultSectionId?: string) => {
    setEditingQuestionId(null);
    setQSectionId(defaultSectionId || sections[0]?.id || 'sec_1');
    setQTitle('');
    setQSubtitle('');
    setQPlaceholder('');
    setQRequired(true);
    setIsQuestionModalOpen(true);
  };

  const openEditQuestionModal = (q: QuestionDefinition) => {
    setEditingQuestionId(q.id);
    setQSectionId(q.sectionId);
    setQTitle(q.title);
    setQSubtitle(q.subtitle || '');
    setQPlaceholder(q.placeholder || '');
    setQRequired(q.isRequired !== false);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle.trim()) return;

    if (editingQuestionId) {
      updateQuestion(editingQuestionId, {
        sectionId: qSectionId,
        title: qTitle.trim(),
        subtitle: qSubtitle.trim() || undefined,
        placeholder: qPlaceholder.trim() || undefined,
        isRequired: qRequired
      });
    } else {
      addQuestion({
        sectionId: qSectionId,
        title: qTitle.trim(),
        subtitle: qSubtitle.trim() || undefined,
        placeholder: qPlaceholder.trim() || undefined,
        isRequired: qRequired,
        type: 'textarea',
        active: true
      });
    }
    setIsQuestionModalOpen(false);
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Deseja realmente remover esta pergunta do formulário?')) {
      deleteQuestion(id);
    }
  };

  // TEACHER HANDLERS
  const openNewTeacherModal = () => {
    setEditingTeacherId(null);
    setTName('');
    setTComponent(schoolConfig.componentes[0] || 'Língua Portuguesa');
    // Generate a random 4-digit PIN e.g. PROF304
    const randomCode = 'PROF' + Math.floor(100 + Math.random() * 900);
    setTCode(randomCode);
    setTEmail('');
    setIsTeacherModalOpen(true);
  };

  const openEditTeacherModal = (user: User) => {
    setEditingTeacherId(user.id);
    setTName(user.name);
    setTComponent(user.component || schoolConfig.componentes[0] || '');
    setTCode(user.accessCode);
    setTEmail(user.email || '');
    setIsTeacherModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tCode.trim()) return;

    if (editingTeacherId) {
      updateUser(editingTeacherId, {
        name: tName.trim(),
        component: tComponent,
        accessCode: tCode.trim().toUpperCase(),
        email: tEmail.trim() || undefined
      });
    } else {
      addUser({
        name: tName.trim(),
        component: tComponent,
        accessCode: tCode.trim().toUpperCase(),
        email: tEmail.trim() || undefined,
        role: 'professor',
        active: true
      });
    }
    setIsTeacherModalOpen(false);
  };

  const handleDeleteTeacher = (id: string) => {
    if (window.confirm('Tem certeza de que deseja remover o cadastro deste professor?')) {
      deleteUser(id);
    }
  };

  const handleSaveSchoolConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolConfig({
      schoolName: cfgSchoolName,
      schoolSubtitle: cfgSchoolSubtitle,
      documentTitle: cfgDocumentTitle,
      pedagogaName: cfgPedagoga,
      diretoraName: cfgDiretora
    });
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 3000);
  };

  const handleAddTurma = () => {
    if (!newTurmaName.trim()) return;
    if (!schoolConfig.turmas.includes(newTurmaName.trim())) {
      updateSchoolConfig({
        turmas: [...schoolConfig.turmas, newTurmaName.trim()]
      });
    }
    setNewTurmaName('');
  };

  const handleRemoveTurma = (name: string) => {
    if (schoolConfig.turmas.length <= 1) {
      alert('É necessário manter pelo menos uma turma cadastrada.');
      return;
    }
    updateSchoolConfig({
      turmas: schoolConfig.turmas.filter(t => t !== name)
    });
  };

  const handleAddComponente = () => {
    if (!newComponenteName.trim()) return;
    if (!schoolConfig.componentes.includes(newComponenteName.trim())) {
      updateSchoolConfig({
        componentes: [...schoolConfig.componentes, newComponenteName.trim()]
      });
    }
    setNewComponenteName('');
  };

  const handleRemoveComponente = (name: string) => {
    if (schoolConfig.componentes.length <= 1) {
      alert('É necessário manter pelo menos um componente curricular cadastrado.');
      return;
    }
    updateSchoolConfig({
      componentes: schoolConfig.componentes.filter(c => c !== name)
    });
  };

  const handleExportBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_pre_conselho_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDataJson(content);
        if (ok) {
          alert('Backup importado com sucesso!');
        } else {
          alert('Arquivo de backup inválido.');
        }
      }
    };
    reader.readAsText(file);
  };

  if (selectedEvaluationForPrint) {
    return (
      <PrintableSheet
        evaluation={selectedEvaluationForPrint}
        onBack={() => setSelectedEvaluationForPrint(null)}
      />
    );
  }

  // Filtragem de avaliações da turma selecionada
  const turmaEvaluations = evaluations.filter(e => e.turma === boardTurma);
  const teachersList = users.filter(u => u.role === 'professor');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header do Painel de Administração */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-block mb-1.5">
            Gestão Institucional e Pedagógica
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Painel do Administrador & Coordenação
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Gerencie o banco de perguntas do formulário, cadastre os professores com código de segurança e acompanhe o conselho.
          </p>
        </div>

        {/* Abas Administrativas */}
        <div className="inline-flex p-1 bg-slate-200/80 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'questions'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Perguntas do Formulário ({questions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'teachers'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-amber-600" />
            <span>Professores & Acessos ({teachersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'board'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-sky-600" />
            <span>Quadro do Conselho</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Configurações</span>
          </button>
        </div>
      </div>

      {/* ABA 1: GERENCIADOR DE PERGUNTAS */}
      {activeTab === 'questions' && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Perguntas da Ficha de Avaliação (Pré-Conselho)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Aqui você pode cadastrar novas perguntas, alterar textos ou remover itens. Os professores respondem a essas perguntas dinamicamente.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={restoreDefaultQuestions}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Restaura as 9 perguntas originais digitalizadas da ficha de papel"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Originais</span>
              </button>

              <button
                type="button"
                onClick={() => openNewQuestionModal()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Pergunta</span>
              </button>
            </div>
          </div>

          {/* Listagem de Perguntas Agrupadas pelas 5 Seções do Papel */}
          <div className="space-y-6">
            {sections.map(sec => {
              const secQuestions = questions
                .filter(q => q.sectionId === sec.id)
                .sort((a, b) => a.order - b.order);

              return (
                <div
                  key={sec.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        {sec.title}
                      </h4>
                      {sec.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {sec.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => openNewQuestionModal(sec.id)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Adicionar nesta seção</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {secQuestions.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        Nenhuma pergunta cadastrada para esta seção.
                      </div>
                    ) : (
                      secQuestions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                        >
                          <div className="space-y-1 max-w-3xl">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400 font-mono">
                                #{idx + 1}
                              </span>
                              <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                                {q.title}
                              </h5>
                              {q.isDefault && (
                                <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">
                                  Oficial
                                </span>
                              )}
                              {!q.active && (
                                <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold uppercase">
                                  Oculta
                                </span>
                              )}
                            </div>
                            {q.subtitle && (
                              <p className="text-xs text-slate-500 italic pl-5">
                                {q.subtitle}
                              </p>
                            )}
                            {q.placeholder && (
                              <p className="text-[11px] text-slate-400 pl-5 truncate">
                                Dica/Exemplo: "{q.placeholder}"
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                            <button
                              onClick={() => updateQuestion(q.id, { active: !q.active })}
                              className={`text-[11px] font-semibold px-2 py-1 rounded-lg border transition-colors ${
                                q.active
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              }`}
                              title="Ocultar ou exibir pergunta aos professores"
                            >
                              {q.active ? 'Ativa' : 'Inativa'}
                            </button>
                            <button
                              onClick={() => openEditQuestionModal(q)}
                              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200"
                              title="Modificar texto da pergunta"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
                              title="Remover pergunta"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 2: CADASTRO DE PROFESSORES E CÓDIGOS DE LOGIN */}
      {activeTab === 'teachers' && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Corpo Docente & Códigos de Segurança
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cada professor utiliza seu próprio código exclusivo para acessar seu espaço e preencher suas avaliações.
              </p>
            </div>
            <button
              type="button"
              onClick={openNewTeacherModal}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Professor</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-3.5">Nome do Professor</th>
                    <th className="px-6 py-3.5">Componente Curricular</th>
                    <th className="px-6 py-3.5">Código de Segurança</th>
                    <th className="px-6 py-3.5">Fichas Preenchidas</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {teachersList.map(teacher => {
                    const teacherEvals = evaluations.filter(e => e.professorId === teacher.id);

                    return (
                      <tr key={teacher.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {teacher.name}
                          </div>
                          {teacher.email && (
                            <div className="text-[11px] text-slate-400 font-normal">
                              {teacher.email}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-semibold text-[11px]">
                            {teacher.component || 'Multidisciplinar'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-1.5 font-mono font-bold text-xs bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                            <span>{teacher.accessCode}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-700">
                            {teacherEvals.length} avaliação(ões)
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              teacher.active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {teacher.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => openEditTeacherModal(teacher)}
                              className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors border border-slate-200"
                              title="Editar professor ou alterar código"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTeacher(teacher.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
                              title="Remover professor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: QUADRO GERAL DO CONSELHO DE CLASSE */}
      {activeTab === 'board' && (
        <div className="mt-6 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Quadro de Acompanhamento das Turmas para o Conselho
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Consulte as avaliações entregues por cada componente e imprima a ficha de qualquer docente.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Turma:</label>
              <select
                value={boardTurma}
                onChange={e => setBoardTurma(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500"
              >
                {schoolConfig.turmas.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resumo da Turma */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Fichas Preenchidas
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {turmaEvaluations.length} / {schoolConfig.componentes.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                componentes curriculares com registro no {boardTurma}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Finalizadas
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {turmaEvaluations.filter(e => e.status === 'completed').length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                prontas para a mesa do Conselho de Classe
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Rascunhos em Andamento
              </div>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {turmaEvaluations.filter(e => e.status === 'draft').length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                ainda em edição pelos professores
              </p>
            </div>
          </div>

          {/* Tabela de Avaliações da Turma */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Fichas Registradas para {boardTurma}
              </h4>
            </div>

            {turmaEvaluations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Nenhum professor cadastrou ficha para esta turma ainda.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {turmaEvaluations.map(ev => (
                  <div
                    key={ev.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {ev.componente}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            ev.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ev.status === 'completed' ? 'Finalizada' : 'Rascunho'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Docente: <span className="font-semibold text-slate-700">{ev.professorName}</span> • Data: {new Date(ev.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedEvaluationForPrint(ev)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Imprimir Ficha Oficial</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 4: CONFIGURAÇÕES DA ESCOLA & BACKUP */}
      {activeTab === 'settings' && (
        <div className="mt-6 space-y-6">
          {/* Dados Institucionais */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Identificação da Instituição de Ensino
            </h3>

            {configSavedToast && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Configurações salvas com sucesso!</span>
              </div>
            )}

            <form onSubmit={handleSaveSchoolConfig} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome da Escola (Cabeçalho Oficial)
                  </label>
                  <input
                    type="text"
                    value={cfgSchoolName}
                    onChange={e => setCfgSchoolName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subtítulo / Modalidade de Ensino
                  </label>
                  <input
                    type="text"
                    value={cfgSchoolSubtitle}
                    onChange={e => setCfgSchoolSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome da Pedagoga(o) Responsável
                  </label>
                  <input
                    type="text"
                    value={cfgPedagoga}
                    onChange={e => setCfgPedagoga(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome da Diretora(o)
                  </label>
                  <input
                    type="text"
                    value={cfgDiretora}
                    onChange={e => setCfgDiretora(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Salvar Alterações Institucionais
                </button>
              </div>
            </form>
          </div>

          {/* Gerenciamento de Turmas e Componentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Turmas */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Turmas Cadastradas
              </h4>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: 8º Ano B"
                  value={newTurmaName}
                  onChange={e => setNewTurmaName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddTurma}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Adicionar
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {schoolConfig.turmas.map(turma => (
                  <span
                    key={turma}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-200"
                  >
                    <span>{turma}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTurma(turma)}
                      className="text-slate-400 hover:text-rose-600 font-bold ml-1"
                      title="Remover turma"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Componentes Curriculares */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Componentes Curriculares
              </h4>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Filosofia ou Robótica"
                  value={newComponenteName}
                  onChange={e => setNewComponenteName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddComponente}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Adicionar
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {schoolConfig.componentes.map(comp => (
                  <span
                    key={comp}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-200"
                  >
                    <span>{comp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveComponente(comp)}
                      className="text-slate-400 hover:text-rose-600 font-bold ml-1"
                      title="Remover componente"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Backup e Restauração */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Segurança, Backup e Exportação
            </h4>
            <p className="text-xs text-slate-500">
              Exporte todos os registros, professores e perguntas em um arquivo JSON seguro ou restaure em outro computador.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Backup (JSON)</span>
              </button>

              <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300">
                <Upload className="w-4 h-4" />
                <span>Importar Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Atenção: Isso restaurará todos os dados para o padrão de fábrica. Deseja continuar?')) {
                    resetAllData();
                  }
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ml-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restaurar Dados Iniciais</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRAR / EDITAR PERGUNTA */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingQuestionId ? 'Modificar Pergunta do Formulário' : 'Cadastrar Nova Pergunta'}
              </h3>
              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seção do Formulário *
                </label>
                <select
                  value={qSectionId}
                  onChange={e => setQSectionId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                >
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enunciado da Pergunta *
                </label>
                <textarea
                  rows={3}
                  required
                  value={qTitle}
                  onChange={e => setQTitle(e.target.value)}
                  placeholder="Ex: Como você avalia a autonomia dos alunos nos trabalhos em grupo?"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Orientações ou Subtítulo (Opcional)
                </label>
                <input
                  type="text"
                  value={qSubtitle}
                  onChange={e => setQSubtitle(e.target.value)}
                  placeholder="Ex: Em poucas linhas, destaque os pontos de atenção..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Texto de Ajuda / Exemplo (Placeholder)
                </label>
                <input
                  type="text"
                  value={qPlaceholder}
                  onChange={e => setQPlaceholder(e.target.value)}
                  placeholder="Ex: Descreva aspectos observados durante o bimestre..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="q_req"
                  checked={qRequired}
                  onChange={e => setQRequired(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <label htmlFor="q_req" className="text-xs font-semibold text-slate-700">
                  Preenchimento obrigatório pelo professor
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  {editingQuestionId ? 'Salvar Alterações' : 'Cadastrar Pergunta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRAR / EDITAR PROFESSOR */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingTeacherId ? 'Editar Professor' : 'Cadastrar Novo Professor'}
              </h3>
              <button
                onClick={() => setIsTeacherModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome Completo do Docente *
                </label>
                <input
                  type="text"
                  required
                  value={tName}
                  onChange={e => setTName(e.target.value)}
                  placeholder="Ex: Profa. Fernanda Lima"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Componente Curricular *
                </label>
                <select
                  value={tComponent}
                  onChange={e => setTComponent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                >
                  {schoolConfig.componentes.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Código de Segurança / Login Seguro *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={tCode}
                    onChange={e => setTCode(e.target.value)}
                    placeholder="Ex: PROF205"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setTCode('PROF' + Math.floor(100 + Math.random() * 900))}
                    className="absolute right-2 top-1.5 bottom-1.5 px-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded"
                    title="Gerar código aleatório"
                  >
                    Gerar Novo
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Este código é usado pelo professor para autenticar de forma segura no sistema.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-mail institucional (Opcional)
                </label>
                <input
                  type="email"
                  value={tEmail}
                  onChange={e => setTEmail(e.target.value)}
                  placeholder="docente@escola.gov.br"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  {editingTeacherId ? 'Salvar Professor' : 'Cadastrar Professor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
