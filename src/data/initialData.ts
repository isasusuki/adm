import { SectionDefinition, QuestionDefinition, User, EvaluationRecord, SchoolConfig } from '../types';

export const INITIAL_SCHOOL_CONFIG: SchoolConfig = {
  schoolName: 'ESCOLA ESTADUAL DO CAMPO FREI GRACIANO DROESSLER',
  schoolSubtitle: 'ENSINO FUNDAMENTAL EM TEMPO INTEGRAL',
  documentTitle: 'FICHA INDIVIDUAL – PRÉ-CONSELHO DE CLASSE',
  pedagogaName: 'Prof.ª Helena Vasconcelos (Pedagoga)',
  diretoraName: 'Prof.ª Maria Aparecida Gomes (Diretora)',
  turmas: [
    '6º Ano A',
    '6º Ano B',
    '7º Ano A',
    '7º Ano B',
    '8º Ano A',
    '9º Ano A'
  ],
  componentes: [
    'Língua Portuguesa',
    'Matemática',
    'Ciências',
    'História',
    'Geografia',
    'Arte',
    'Educação Física',
    'Língua Inglesa'
  ]
};

export const INITIAL_SECTIONS: SectionDefinition[] = [
  {
    id: 'sec_1',
    order: 1,
    title: '1. PANORAMA DA TURMA',
    description: 'Avaliação geral da dinâmica pedagógica, engajamento e atitude.'
  },
  {
    id: 'sec_2',
    order: 2,
    title: '2. APRENDIZAGEM E FREQUÊNCIA',
    description: 'Identificação de conteúdos desafiadores e acompanhamento da assiduidade.'
  },
  {
    id: 'sec_3',
    order: 3,
    title: '3. DESTAQUES E SITUAÇÕES QUE MERECEM ATENÇÃO',
    description: 'Reconhecimento de méritos e mapeamento de estudantes em vulnerabilidade pedagógica.'
  },
  {
    id: 'sec_4',
    order: 4,
    title: '4. ENCAMINHAMENTOS',
    description: 'Estratégias adotadas, propostas para o período seguinte e anotações para o Conselho.'
  },
  {
    id: 'sec_5',
    order: 5,
    title: '5. SÍNTESE DO PROFESSOR',
    description: 'Parecer final conciso sobre a turma e estudantes de relevância para a reunião.'
  }
];

// As perguntas foram digitalizadas exatamente dos formulários impressos das fotos:
export const INITIAL_QUESTIONS: QuestionDefinition[] = [
  // 1. Panorama da Turma
  {
    id: 'q_1_1',
    sectionId: 'sec_1',
    order: 1,
    title: 'Como você avalia o desenvolvimento geral da turma em relação à aprendizagem?',
    placeholder: 'Descreva a evolução do grupo, assimilação dos conceitos e ritmo coletivo...',
    type: 'textarea',
    isRequired: true,
    isDefault: true,
    active: true
  },
  {
    id: 'q_1_2',
    sectionId: 'sec_1',
    order: 2,
    title: 'Como está a participação, o envolvimento e a postura dos estudantes nas aulas?',
    placeholder: 'Comente sobre colaboração em grupo, respeito às regras, entusiasmo e disciplina...',
    type: 'textarea',
    isRequired: true,
    isDefault: true,
    active: true
  },
  // 2. Aprendizagem e Frequência
  {
    id: 'q_2_1',
    sectionId: 'sec_2',
    order: 3,
    title: 'Quais habilidades/conteúdos apresentam maior dificuldade para a turma?',
    placeholder: 'Especifique tópicos curriculares, operações, interpretação de texto, raciocínio lógico...',
    type: 'textarea',
    isRequired: true,
    isDefault: true,
    active: true
  },
  {
    id: 'q_2_2',
    sectionId: 'sec_2',
    order: 4,
    title: 'Há estudantes com baixa frequência ou que necessitam de acompanhamento mais próximo? Quais e por quê?',
    placeholder: 'Cite nomes de alunos com faltas excessivas ou desengajamento pontual...',
    type: 'textarea',
    isRequired: true,
    isDefault: true,
    active: true
  },
  // 3. Destaques e Situações que Merecem Atenção
  {
    id: 'q_3_1',
    sectionId: 'sec_3',
    order: 5,
    title: 'Estudantes que se destacaram positivamente (aprendizagem, participação, responsabilidade ou protagonismo):',
    placeholder: 'Nomes dos estudantes e motivos do destaque (exemplos de dedicação, liderança positiva)...',
    type: 'textarea',
    isRequired: true,
    isDefault: true,
    active: true
  },
  {
    id: 'q_3_2',
    sectionId: 'sec_3',
    order: 6,
    title: 'Estudantes que apresentam dificuldades significativas ou necessitam de intervenção/encaminhamento:',
    placeholder: 'Nomes dos estudantes e principais barreiras enfrentadas (necessidade de reforço, apoio psicopedagógico)...',
    type: 'textarea',
    isRequired: true,
    isDefault: true,
    active: true
  },
  // 4. Encaminhamentos
  {
    id: 'q_4_1',
    sectionId: 'sec_4',
    order: 7,
    title: 'Quais estratégias já foram realizadas e quais ações você sugere para o próximo período?',
    placeholder: 'Atividades diferenciadas, recuperação contínua, atendimento individualizado, novos métodos...',
    type: 'textarea',
    isRequired: true,
    isDefault: true,
    active: true
  },
  {
    id: 'q_4_2',
    sectionId: 'sec_4',
    order: 8,
    title: 'Há alguma observação importante que deve ser registrada no Pré-Conselho?',
    placeholder: 'Situações familiares, contexto emocional ou demandas para a equipe pedagógica...',
    type: 'textarea',
    isRequired: false,
    isDefault: true,
    active: true
  },
  // 5. Síntese do Professor
  {
    id: 'q_5_1',
    sectionId: 'sec_5',
    order: 9,
    title: 'Deixe aqui uma observação geral sobre a turma e/ou sobre algum estudante que considere relevante para o Conselho de Classe:',
    subtitle: 'Em poucas frases, descreva o perfil geral da turma e os resultados alcançados.',
    placeholder: 'Síntese global para balizar as decisões do Conselho de Classe...',
    type: 'textarea',
    isRequired: true,
    isDefault: true,
    active: true
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Coordenação Pedagógica / Direção',
    email: 'direcao@escola.gov.br',
    role: 'admin',
    accessCode: 'ADM2026',
    active: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'prof_carlos',
    name: 'Prof. Carlos Silva',
    email: 'carlos.silva@escola.gov.br',
    role: 'professor',
    accessCode: 'PROF101',
    component: 'Língua Portuguesa',
    active: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'prof_mariana',
    name: 'Profa. Mariana Oliveira',
    email: 'mariana.oliveira@escola.gov.br',
    role: 'professor',
    accessCode: 'PROF102',
    component: 'Matemática',
    active: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'prof_roberto',
    name: 'Prof. Roberto Santos',
    email: 'roberto.santos@escola.gov.br',
    role: 'professor',
    accessCode: 'PROF103',
    component: 'Ciências',
    active: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'prof_juliana',
    name: 'Profa. Juliana Mendes',
    email: 'juliana.mendes@escola.gov.br',
    role: 'professor',
    accessCode: 'PROF104',
    component: 'História',
    active: true,
    createdAt: '2026-02-01'
  }
];

// Avaliações de exemplo para demonstração inicial da visualização de colegas sem edição:
export const INITIAL_EVALUATIONS: EvaluationRecord[] = [
  {
    id: 'eval_sample_1',
    professorId: 'prof_mariana',
    professorName: 'Profa. Mariana Oliveira',
    turma: '6º Ano A',
    componente: 'Matemática',
    date: '2026-09-15',
    status: 'completed',
    answers: {
      q_1_1: 'A turma demonstra bom rendimento global nas operações básicas, porém necessita de mais tempo de concentração na resolução de situações-problema complexas.',
      q_1_2: 'A maioria dos estudantes é bastante participativa e faz as atividades propostas em aula. Um pequeno grupo ainda se distrai com facilidade no fundo da sala.',
      q_2_1: 'Fração e interpretação de enunciados que envolvem mais de duas etapas de raciocínio lógico.',
      q_2_2: 'O aluno Gabriel Santos faltou 7 dias no mês por questões de saúde relatadas pelos responsáveis. Precisa de apoio nas listas de revisão.',
      q_3_1: 'Ana Beatriz Souza e Lucas Ferreira - excelente raciocínio, ajudam os colegas durante as atividades em dupla.',
      q_3_2: 'Matheus Henrique - grande bloqueio com tabuada e insegurança ao participar oralmente.',
      q_4_1: 'Realizamos oficinas com jogos matemáticos concretos e listas semanais de fixação. Sugiro continuidade de monitoria entre pares.',
      q_4_2: 'Conversar com a família do aluno Matheus para alinhamento pedagógico e incentivo ao estudo em casa.',
      q_5_1: 'Turma com excelente potencial de crescimento. Se mantermos a rotina de estudos e o trabalho colaborativo, terão ótimo fechamento de ciclo.'
    },
    updatedAt: '2026-09-15T14:30:00Z',
    submittedAt: '2026-09-15T14:30:00Z'
  },
  {
    id: 'eval_sample_2',
    professorId: 'prof_carlos',
    professorName: 'Prof. Carlos Silva',
    turma: '6º Ano A',
    componente: 'Língua Portuguesa',
    date: '2026-09-14',
    status: 'completed',
    answers: {
      q_1_1: 'Evolução positiva na leitura compartilhada e na produção textual inicial do gênero crônica.',
      q_1_2: 'Postura respeitosa e muito engajada nas rodas de leitura. Participam com entusiasmo e expressam opiniões.',
      q_2_1: 'Coesão textual e pontuação nos textos dissertativos curtos.',
      q_2_2: 'Gabriel Santos teve algumas faltas consecutivas, o que impactou o fechamento da sequência didática de leitura.',
      q_3_1: 'Ana Beatriz Souza (leitora assídua, redação impecável) e Sofia Lima (muito participativa).',
      q_3_2: 'Felipe Costa - dificuldade em interpretação de texto e grafia de palavras básicas.',
      q_4_1: 'Diário de leitura individual e reescrita coletiva de textos no quadro.',
      q_4_2: 'Integrar a leitura de Língua Portuguesa com os temas de Ciências e História para enriquecer o vocabulário.',
      q_5_1: 'Grupo comunicativo e dinâmico. O estímulo à leitura diária tem surtido efeitos visíveis na escrita dos alunos.'
    },
    updatedAt: '2026-09-14T16:20:00Z',
    submittedAt: '2026-09-14T16:20:00Z'
  }
];
