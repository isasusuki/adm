import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { EvaluationRecord } from '../types';
import { Printer, ArrowLeft, CheckCircle2, School } from 'lucide-react';

interface PrintableSheetProps {
  evaluation: EvaluationRecord;
  onBack: () => void;
}

export const PrintableSheet: React.FC<PrintableSheetProps> = ({ evaluation, onBack }) => {
  const { schoolConfig, sections, questions } = useSchool();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Barra de Ações na tela (oculta na impressão) */}
      <div className="print:hidden mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Painel</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Formato A4 otimizado para impressão oficial
          </span>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ficha Oficial</span>
          </button>
        </div>
      </div>

      {/* Documento Imprimível - Réplica Exata do Papel */}
      <div className="bg-white p-8 sm:p-12 rounded-lg border-2 border-slate-800 shadow-lg print:border-2 print:border-black print:p-6 print:shadow-none print:m-0 text-slate-900 font-sans">
        
        {/* Moldura Interna de Linha Dupla como na foto original */}
        <div className="border border-slate-900 p-6 print:p-4 min-h-[900px] flex flex-col justify-between">
          <div>
            {/* Cabeçalho Oficial */}
            <div className="text-center pb-4 border-b-2 border-slate-900 relative">
              <div className="text-center">
                <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-900">
                  {schoolConfig.schoolName}
                </h1>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 mt-0.5">
                  {schoolConfig.schoolSubtitle}
                </h2>
                <div className="mt-2.5 text-sm sm:text-base font-black uppercase tracking-widest text-slate-900 bg-slate-100 py-1 border-y border-slate-300 print:bg-transparent">
                  {schoolConfig.documentTitle}
                </div>
              </div>
            </div>

            {/* Dados Iniciais do Cabeçalho */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4 py-4 border-b border-slate-900 text-xs sm:text-sm">
              <div className="col-span-2">
                <span className="font-bold">Professor(a): </span>
                <span className="border-b border-slate-600 pb-0.5 inline-block min-w-[180px] font-semibold">
                  {evaluation.professorName}
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-bold">Componente: </span>
                <span className="border-b border-slate-600 pb-0.5 inline-block min-w-[180px] font-semibold">
                  {evaluation.componente}
                </span>
              </div>
              <div>
                <span className="font-bold">Turma: </span>
                <span className="border-b border-slate-600 pb-0.5 inline-block min-w-[90px] font-semibold">
                  {evaluation.turma}
                </span>
              </div>
              <div>
                <span className="font-bold">Data: </span>
                <span className="border-b border-slate-600 pb-0.5 inline-block min-w-[90px] font-semibold">
                  {new Date(evaluation.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-[11px] font-semibold text-slate-600">
                  Status: {evaluation.status === 'completed' ? 'Finalizada para Conselho' : 'Rascunho do Professor'}
                </span>
              </div>
            </div>

            {/* Corpo das Perguntas agrupadas por Seções */}
            <div className="space-y-5 pt-4 text-xs sm:text-sm">
              {sections.map(section => {
                const sectionQuestions = questions
                  .filter(q => q.sectionId === section.id && q.active)
                  .sort((a, b) => a.order - b.order);

                if (sectionQuestions.length === 0) return null;

                return (
                  <div key={section.id} className="space-y-3">
                    <h3 className="font-extrabold uppercase text-slate-900 text-xs sm:text-sm tracking-wide bg-slate-100/70 p-1 border-l-4 border-slate-800 print:bg-transparent print:p-0 print:border-none">
                      {section.title}
                    </h3>

                    <div className="space-y-3 pl-2 sm:pl-3">
                      {sectionQuestions.map(q => {
                        const answerText = evaluation.answers[q.id] || '';
                        return (
                          <div key={q.id} className="space-y-1">
                            <p className="font-bold text-slate-900 leading-snug">
                              {q.title}
                            </p>
                            {q.subtitle && (
                              <p className="text-[11px] text-slate-600 italic">
                                {q.subtitle}
                              </p>
                            )}
                            <div className="min-h-[40px] text-slate-800 whitespace-pre-wrap pt-1 pb-2 border-b border-dashed border-slate-300 print:border-slate-400 font-medium">
                              {answerText ? (
                                answerText
                              ) : (
                                <span className="text-slate-400 italic font-normal text-[11px]">
                                  [Sem observações registradas para este item]
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Campo de Assinaturas (Conforme formulário original) */}
          <div className="pt-10 mt-8 border-t-2 border-slate-900">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-6 text-center">
              Assinaturas Regulamentares
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
              <div>
                <div className="border-t border-slate-800 pt-1.5 font-bold">
                  Assinatura do(a) Professor(a)
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  {evaluation.professorName}
                </div>
              </div>
              <div>
                <div className="border-t border-slate-800 pt-1.5 font-bold">
                  Assinatura da Pedagoga
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  {schoolConfig.pedagogaName}
                </div>
              </div>
              <div>
                <div className="border-t border-slate-800 pt-1.5 font-bold">
                  Assinatura da Diretora
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  {schoolConfig.diretoraName}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
