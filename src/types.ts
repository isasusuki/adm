export type UserRole = 'admin' | 'professor';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  accessCode: string; // Código seguro para login
  component?: string; // Disciplina principal (para professores)
  active: boolean;
  createdAt: string;
}

export interface SectionDefinition {
  id: string;
  order: number;
  title: string;
  description?: string;
}

export interface QuestionDefinition {
  id: string;
  sectionId: string;
  order: number;
  title: string;
  subtitle?: string;
  placeholder?: string;
  type: 'textarea' | 'text';
  isRequired?: boolean;
  isDefault?: boolean;
  active: boolean;
}

export interface EvaluationRecord {
  id: string;
  professorId: string;
  professorName: string;
  turma: string;
  componente: string;
  date: string;
  status: 'draft' | 'completed';
  answers: Record<string, string>; // questionId -> text
  updatedAt: string;
  submittedAt?: string;
  pedagogaSignature?: string;
  directorSignature?: string;
}

export interface SchoolConfig {
  schoolName: string;
  schoolSubtitle: string;
  documentTitle: string;
  pedagogaName: string;
  diretoraName: string;
  turmas: string[];
  componentes: string[];
}
