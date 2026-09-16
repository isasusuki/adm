import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { EvaluationRecord } from '../types';
import {
  FileText,
  Users,
  Printer,
  Plus,
  Save,
  CheckCircle,
  Eye,
  Lock,
  Clock,
  Trash2,
  Edit3,
  Filter,
  Sparkles,
  AlertCircle,
  ChevronRight,
  BookOpen,
  UserCog
} from 'lucide-react';
import { PrintableSheet } from './PrintableSheet';
import { ProfileModal } from './ProfileModal';

export const TeacherPanel: React.FC = () => {
  const {
    currentUser,
    evaluations,
    questions,
    sections,
    schoolConfig,
    saveEvaluation,
    deleteEvaluation
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'my_evaluations' | 'peer_board' | 'editor'>('my_evaluations');
  const [selectedEvaluationForPrint, setSelectedEvaluationForPrint] = useState<EvaluationRecord | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Form Editor State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTurma, setSelectedTurma] = useState<string>(schoolConfig.turmas[0] || '6º Ano A');
  const [selectedComponente, setSelectedComponente] = useState<string>(currentUser?.component || schoolConfig.componentes[0] || 'Língua Portuguesa');
  const [evaluationDate, setEvaluationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saveStatusMessage, setSaveStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Peer Board Filter State
  const [boardTurmaFilter, setBoardTurmaFilter] = useState<string>(schoolConfig.turmas[0] || '6º Ano A');
  const [boardSectionFilter, setBoardSectionFilter] = useState<string>('all');

  // Teacher's own evaluations
  const myEvaluations = evaluations.filter(e => e.professorId === currentUser?.id);

  // Filtered peer evaluations for the mural
  const boardEvaluations = evaluations.filter(e => e.turma === boardTurmaFilter);

  const startNewEvaluation = () => {
    setEditingId(null);
    setSelectedTurma(schoolConfig.turmas[0] || '6º Ano A');
    setSelectedComponente(currentUser?.component || schoolConfig.componentes[0] || 'Língua Portuguesa');
    setEvaluationDate(new Date().toISOString().split('T')[0]);
    setAnswers({});
    setSaveStatusMessage(null);
    setActiveTab('editor');
  };

  const startEditEvaluation = (record: EvaluationRecord) => {
    // Check permission: teacher can only edit their own evaluation!
    if (record.professorId !== currentUser?.id) {
      alert('Atenção: Você só pode editar as suas próprias avaliações.');
      return;
    }
    setEditingId(record.id);
    setSelectedTurma(record.turma);
    setSelectedComponente(record.componente);
    setEvaluationDate(record.date);
    setAnswers({ ...record.answers });
    setSaveStatusMessage(null);
    setActiveTab('editor');
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSave = (status: 'draft' | 'completed') => {
    if (!currentUser) return;
    setSaveStatusMessage(null);

    const result = saveEvaluation({
      id: editingId || undefined,
      professorId: currentUser.id,
      professorName: currentUser.name,
      turma: selectedTurma,
      componente: selectedComponente,
      date: evaluationDate,
      status,
      answers
    });

    if (result.success) {
      setEditingId(result.id);
      setSaveStatusMessage({
        type: 'success',
        text: status === 'completed'
          ? 'Ficha de avaliação finalizada com sucesso para o Pré-Conselho!'
          : 'Rascunho salvo com sucesso em seu espaço seguro!'
      });
      setTimeout(() => {
        setSaveStatusMessage(null);
      }, 4000);
    } else {
      setSaveStatusMessage({
        type: 'error',
        text: result.error || 'Erro ao salvar avaliação.'
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza de que deseja excluir esta ficha de avaliação?')) {
      const res = deleteEvaluation(id);
      if (!res.success && res.error) {
        alert(res.error);
      }
    }
  };

  // Se o usuário solicitou impressão de uma ficha
  if (selectedEvaluationForPrint) {
    return (
      <PrintableSheet
        evaluation={selectedEvaluationForPrint}
        onBack={() => setSelectedEvaluationForPrint(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Barra de Navegação Interna do Docente */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block mb-1.5">
            Espaço Individual do Docente
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Painel do Professor: {currentUser?.name}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Preencha sua ficha individual e consulte as contribuições dos demais docentes para a turma.
          </p>
        </div>

        {/* Abas */}
        <div className="inline-flex p-1 bg-slate-200/80 rounded-xl">
          <button
            onClick={() => setActiveTab('my_evaluations')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'my_evaluations'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Minhas Fichas ({myEvaluations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('peer_board')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'peer_board'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-sky-600" />
            <span>Mural Coletivo (Colegas)</span>
          </button>

          <button
            onClick={startNewEvaluation}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'editor'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-600/90 text-white hover:bg-emerald-600'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Preencher Ficha</span>
          </button>

          <button
            onClick={() => setIsProfileOpen(true)}
            className="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 hover:bg-white/80"
            title="Editar Meu Perfil e Chave de Acesso"
          >
            <UserCog className="w-4 h-4 text-emerald-600" />
            <span>Meu Perfil</span>
          </button>
        </div>
      </div>

      {/* Mensagem de Status / Feedback */}
      {saveStatusMessage && (
        <div
          className={`mt-4 p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            saveStatusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{saveStatusMessage.text}</span>
        </div>
      )}

      {/* ABA 1: MINHAS FICHAS */}
      {activeTab === 'my_evaluations' && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Suas Fichas de Avaliação Cadastradas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Somente você e a coordenação têm permissão para editar estas fichas. Os colegas apenas visualizam.
              </p>
            </div>
            <button
              onClick={startNewEvaluation}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Ficha de Pré-Conselho</span>
            </button>
          </div>

          {myEvaluations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Nenhuma ficha preenchida ainda
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Inicie o preenchimento da ficha de Pré-Conselho para suas turmas. Suas respostas são salvas automaticamente em seu perfil individual.
              </p>
              <button
                onClick={startNewEvaluation}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Começar a Preencher Agora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myEvaluations.map(record => {
                const answeredCount = Object.keys(record.answers).filter(
                  k => record.answers[k] && record.answers[k].trim() !== ''
                ).length;
                const totalActiveQuestions = questions.filter(q => q.active).length;

                return (
                  <div
                    key={record.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md font-extrabold text-xs">
                          {record.turma}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            record.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {record.status === 'completed' ? 'Finalizada' : 'Rascunho'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">
                        {record.componente}
                      </h4>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Data: {new Date(record.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                          <span>Itens respondidos:</span>
                          <span className="font-bold text-slate-900">
                            {answeredCount} / {totalActiveQuestions}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-1.5 rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((answeredCount / (totalActiveQuestions || 1)) * 100)
                              )}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedEvaluationForPrint(record)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 border border-slate-200"
                        title="Imprimir Ficha Oficial em formato A4"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Imprimir</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => startEditEvaluation(record)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Excluir Ficha"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 2: MURAL COLETIVO DO PRÉ-CONSELHO (COLEGAS - READ ONLY) */}
      {activeTab === 'peer_board' && (
        <div className="mt-6 space-y-6">
          {/* Informação e Filtros do Mural */}
          <div className="bg-sky-950 text-white rounded-2xl p-6 shadow-md border border-sky-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-400/30 mb-2">
                  <Lock className="w-3 h-3" />
                  <span>Ambiente Protegido: Visualização Somente Leitura</span>
                </div>
                <h3 className="text-lg font-extrabold tracking-tight">
                  Mural Interdisciplinar do Pré-Conselho
                </h3>
                <p className="text-xs text-sky-200 max-w-2xl mt-1">
                  Veja o que os professores de outros componentes curriculares registraram sobre a turma. 
                  As contribuições dos colegas são protegidas e <strong>não podem ser modificadas por você</strong>.
                </p>
              </div>

              {/* Filtro de Turma */}
              <div className="flex items-center gap-3 bg-sky-900/60 p-2.5 rounded-xl border border-sky-800/80">
                <Filter className="w-4 h-4 text-sky-300" />
                <div>
                  <label className="block text-[10px] uppercase font-bold text-sky-300">
                    Selecione a Turma:
                  </label>
                  <select
                    value={boardTurmaFilter}
                    onChange={e => setBoardTurmaFilter(e.target.value)}
                    className="bg-sky-950 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 border border-sky-700 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  >
                    {schoolConfig.turmas.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Fichas da Turma Selecionada */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold">
                Registros disponíveis para a turma <strong className="text-slate-900">{boardTurmaFilter}</strong>: {boardEvaluations.length} componente(s)
              </span>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                Atualizado em tempo real
              </span>
            </div>

            {boardEvaluations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">
                  Nenhum registro ainda para o {boardTurmaFilter}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Seja o primeiro a preencher a avaliação para esta turma clicando em "Preencher Ficha".
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Visualização Pergunta a Pergunta para Comparação Interdisciplinar */}
                {sections.map(sec => {
                  const secQuestions = questions
                    .filter(q => q.sectionId === sec.id && q.active)
                    .sort((a, b) => a.order - b.order);

                  if (secQuestions.length === 0) return null;

                  return (
                    <div
                      key={sec.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                    >
                      <div className="bg-slate-100/90 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                            {sec.title}
                          </h4>
                          {sec.description && (
                            <p className="text-[11px] text-slate-500">
                              {sec.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {secQuestions.map(q => (
                          <div key={q.id} className="p-5 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                                {q.title}
                              </h5>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Item {q.order}
                              </span>
                            </div>

                            {/* Cards de cada professor respondendo a essa pergunta */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                              {boardEvaluations.map(ev => {
                                const ans = ev.answers[q.id];
                                const isMe = ev.professorId === currentUser?.id;

                                return (
                                  <div
                                    key={ev.id}
                                    className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between space-y-2 transition-colors ${
                                      isMe
                                        ? 'bg-emerald-50/50 border-emerald-200'
                                        : 'bg-slate-50 border-slate-200'
                                    }`}
                                  >
                                    <div>
                                      <div className="flex items-center justify-between gap-1 mb-1.5">
                                        <div className="font-extrabold text-slate-900 truncate">
                                          {ev.componente}
                                        </div>
                                        {isMe ? (
                                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                                            Sua Resposta
                                          </span>
                                        ) : (
                                          <span className="text-[9px] bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                            <Lock className="w-2.5 h-2.5" /> Leitura
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-slate-500 font-medium mb-2">
                                        {ev.professorName}
                                      </div>

                                      <div className="text-slate-800 font-normal leading-relaxed whitespace-pre-wrap">
                                        {ans && ans.trim() ? (
                                          ans
                                        ) : (
                                          <span className="text-slate-400 italic">
                                            Não informado
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                                      <span>{new Date(ev.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                                      {isMe && (
                                        <button
                                          onClick={() => startEditEvaluation(ev)}
                                          className="text-emerald-700 font-bold hover:underline"
                                        >
                                          Editar minha ficha
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 3: FORMULÁRIO / EDITOR DE AVALIAÇÃO */}
      {activeTab === 'editor' && (
        <div className="mt-6 space-y-6">
          {/* Cabeçalho do Formulário */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {editingId ? 'Editando Avaliação Existente' : 'Novo Formulário Individual'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  Ficha Individual – Pré-Conselho de Classe
                </h3>
                <p className="text-xs text-slate-500">
                  {schoolConfig.schoolName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-slate-600" />
                  <span>Salvar Rascunho</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSave('completed')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Concluir e Finalizar</span>
                </button>
              </div>
            </div>

            {/* Dados Iniciais do Cabeçalho: Turma, Componente, Docente, Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Turma / Classe *
                </label>
                <select
                  value={selectedTurma}
                  onChange={e => setSelectedTurma(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  {schoolConfig.turmas.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Componente Curricular *
                </label>
                <select
                  value={selectedComponente}
                  onChange={e => setSelectedComponente(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
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
                  Professor(a) Responsável
                </label>
                <input
                  type="text"
                  value={currentUser?.name || ''}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Data da Avaliação
                </label>
                <input
                  type="date"
                  value={evaluationDate}
                  onChange={e => setEvaluationDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Seções de Perguntas (Digitalizadas e Customizadas) */}
          <div className="space-y-6">
            {sections.map(section => {
              const secQuestions = questions
                .filter(q => q.sectionId === section.id && q.active)
                .sort((a, b) => a.order - b.order);

              if (secQuestions.length === 0) return null;

              return (
                <div
                  key={section.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                        {section.title}
                      </h4>
                      {section.description && (
                        <p className="text-[11px] text-slate-300">
                          {section.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-6 divide-y divide-slate-100">
                    {secQuestions.map((q, idx) => (
                      <div key={q.id} className={idx > 0 ? 'pt-6' : ''}>
                        <div className="mb-2">
                          <label className="block text-xs sm:text-sm font-bold text-slate-900">
                            {q.title}{' '}
                            {q.isRequired && (
                              <span className="text-rose-500 font-bold">*</span>
                            )}
                          </label>
                          {q.subtitle && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {q.subtitle}
                            </p>
                          )}
                        </div>

                        <textarea
                          rows={4}
                          value={answers[q.id] || ''}
                          onChange={e => handleAnswerChange(q.id, e.target.value)}
                          placeholder={
                            q.placeholder ||
                            'Digite suas observações pedagógicas com base na realidade desta turma...'
                          }
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Barra Flutuante ou Inferior de Salvar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Todas as respostas são gravadas no seu registro exclusivo de professor.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('my_evaluations')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={() => handleSave('draft')}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Save className="w-4 h-4 text-slate-600" />
                <span>Salvar Rascunho</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave('completed')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Finalizar Avaliação</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Edição do Perfil do Docente */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};
