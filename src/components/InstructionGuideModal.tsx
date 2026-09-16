import React, { useState } from 'react';
import { HelpCircle, Copy, Check, BookOpen, ShieldCheck, Layers, FileText } from 'lucide-react';

export const InstructionGuideModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const suggestedPrompt = `"Crie um site escolar com login individual para professores onde toda vez que entrarem precisam digitar a sua chave de acesso pessoal, podendo também personalizar e digitar o próprio perfil (nome, disciplina e chave de acesso). Cada docente responde às perguntas do formulário de Pré-Conselho (Panorama da turma, Participação, Aprendizagem e frequência, Destaques, Encaminhamentos e Síntese) sem apagar ou modificar as respostas dos colegas, mas podendo visualizá-las em modo somente leitura. O administrador deve ter acesso para cadastrar professores e editar as perguntas do formulário."`;

  const digitizedQuestionsText = `Formulário de Avaliação – Pré-Conselho de Classe
Escola Estadual do Campo Frei Graciano Droessler - Ensino Fundamental em Tempo Integral

Dados Iniciais:
- Classe / Turma
- Componente Curricular
- Professor(a)
- Data

1. PANORAMA DA TURMA
- Como você avalia o desenvolvimento geral da turma em relação à aprendizagem?
- Como está a participação, o envolvimento e a postura dos estudantes nas aulas?

2. APRENDIZAGEM E FREQUÊNCIA
- Quais habilidades/conteúdos apresentam maior dificuldade para a turma?
- Há estudantes com baixa frequência ou que necessitam de acompanhamento mais próximo? Quais e por quê?

3. DESTAQUES E SITUAÇÕES QUE MERECEM ATENÇÃO
- Estudantes que se destacaram positivamente (aprendizagem, participação, responsabilidade ou protagonismo):
- Estudantes que apresentam dificuldades significativas ou necessitam de intervenção/encaminhamento:

4. ENCAMINHAMENTOS
- Quais estratégias já foram realizadas e quais ações você sugere para o próximo período?
- Há alguma observação importante que deve ser registrada no Pré-Conselho?

5. SÍNTESE DO PROFESSOR
- Deixe aqui uma observação geral sobre a turma e/ou sobre algum estudante que considere relevante para o Conselho de Classe:

Assinaturas:
- Assinatura do(a) Professor(a)
- Assinatura da Pedagoga
- Assinatura da Diretora`;

  return (
    <>
      {/* Botão flutuante discreto de Ajuda e Digitalização */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg border border-slate-700 flex items-center gap-2 text-xs font-bold transition-transform hover:scale-105"
        title="Ver texto digitalizado das perguntas e orientações da plataforma"
      >
        <BookOpen className="w-4 h-4 text-emerald-400" />
        <span>Guia & Perguntas Digitalizadas</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Guia do Pré-Conselho & Perguntas Digitalizadas
                  </h3>
                  <p className="text-xs text-slate-500">
                    Textos oficiais transcritos do papel e orientações técnicas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              
              {/* Box 1: Frase Recomendada */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Frase Pronta para Solicitação / Especificação
                  </span>
                  <button
                    onClick={() => copyToClipboard(suggestedPrompt, 'prompt')}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-300 hover:bg-emerald-100 transition-colors"
                  >
                    {copiedSection === 'prompt' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Frase</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-medium text-emerald-900 italic leading-relaxed">
                  {suggestedPrompt}
                </p>
              </div>

              {/* Box 2: Como funciona o isolamento seguro */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-700" />
                  Garantia de Isolamento: Por que nenhum professor apaga o do outro?
                </h4>
                <p className="leading-relaxed text-slate-600">
                  1. <strong>Identificador Único por Registro:</strong> Cada avaliação gerada possui uma chave única atrelada ao código e ID exclusivo do docente.<br />
                  2. <strong>Bloqueio de Edição Cruzada:</strong> No código da aplicação, a função de salvar só permite alteração se o usuário logado for o autor daquela ficha específica.<br />
                  3. <strong>Mural Coletivo Somente Leitura:</strong> As anotações de outros componentes curriculares aparecem com selo de proteção para consulta e alinhamento prévio, sem campos de edição habilitados para colegas.
                </p>
              </div>

              {/* Box 3: Perguntas Digitalizadas dos Formulários de Papel */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900">
                    Perguntas Originais Digitalizadas (Ficha Pré-Conselho de Classe)
                  </h4>
                  <button
                    onClick={() => copyToClipboard(digitizedQuestionsText, 'questions')}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300 hover:bg-slate-200 transition-colors"
                  >
                    {copiedSection === 'questions' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Todas as Perguntas</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {digitizedQuestionsText}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end rounded-b-2xl">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Fechar Guia
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
