import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  SectionDefinition,
  QuestionDefinition,
  EvaluationRecord,
  SchoolConfig
} from '../types';
import {
  INITIAL_SCHOOL_CONFIG,
  INITIAL_SECTIONS,
  INITIAL_QUESTIONS,
  INITIAL_USERS,
  INITIAL_EVALUATIONS
} from '../data/initialData';

interface SchoolContextType {
  currentUser: User | null;
  users: User[];
  sections: SectionDefinition[];
  questions: QuestionDefinition[];
  evaluations: EvaluationRecord[];
  schoolConfig: SchoolConfig;
  
  // Auth
  login: (code: string) => { success: boolean; message?: string };
  loginForUser: (userId: string, code: string) => { success: boolean; message?: string };
  logout: () => void;
  switchUserForDemo: (user: User) => void;
  
  // Question Management (Admin)
  addQuestion: (question: Omit<QuestionDefinition, 'id' | 'order' | 'isDefault'>) => void;
  updateQuestion: (id: string, updates: Partial<QuestionDefinition>) => void;
  deleteQuestion: (id: string) => void;
  restoreDefaultQuestions: () => void;

  // Teacher / User Management (Admin)
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Evaluation Records (Professores e Visualização)
  saveEvaluation: (record: Omit<EvaluationRecord, 'id' | 'updatedAt'> & { id?: string }) => { success: boolean; error?: string; id: string };
  deleteEvaluation: (id: string) => { success: boolean; error?: string };
  
  // Config & Data Management
  updateSchoolConfig: (updates: Partial<SchoolConfig>) => void;
  resetAllData: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'pre_conselho_current_user',
  USERS: 'pre_conselho_users_v1',
  SECTIONS: 'pre_conselho_sections_v1',
  QUESTIONS: 'pre_conselho_questions_v1',
  EVALUATIONS: 'pre_conselho_evaluations_v1',
  CONFIG: 'pre_conselho_config_v1'
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [sections] = useState<SectionDefinition[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SECTIONS);
      return stored ? JSON.parse(stored) : INITIAL_SECTIONS;
    } catch {
      return INITIAL_SECTIONS;
    }
  });

  const [questions, setQuestions] = useState<QuestionDefinition[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return stored ? JSON.parse(stored) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      return stored ? JSON.parse(stored) : INITIAL_EVALUATIONS;
    } catch {
      return INITIAL_EVALUATIONS;
    }
  });

  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return stored ? JSON.parse(stored) : INITIAL_SCHOOL_CONFIG;
    } catch {
      return INITIAL_SCHOOL_CONFIG;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(schoolConfig));
  }, [schoolConfig]);

  // Auth logic
  const login = (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) {
      return { success: false, message: 'Digite o código de acesso.' };
    }
    const found = users.find(
      u => u.accessCode.toLowerCase() === trimmed.toLowerCase() && u.active
    );
    if (!found) {
      return { success: false, message: 'Código de segurança inválido ou professor desativado.' };
    }
    setCurrentUser(found);
    return { success: true };
  };

  const loginForUser = (userId: string, code: string) => {
    const trimmed = code.trim();
    if (!trimmed) {
      return { success: false, message: 'Por favor, digite a chave de acesso do perfil.' };
    }
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      return { success: false, message: 'Perfil não encontrado.' };
    }
    if (!targetUser.active) {
      return { success: false, message: 'Este perfil está desativado no sistema.' };
    }
    if (targetUser.accessCode.trim().toLowerCase() !== trimmed.toLowerCase()) {
      return {
        success: false,
        message: `Chave de acesso incorreta para o perfil de ${targetUser.name}. Verifique o código e tente novamente.`
      };
    }
    setCurrentUser(targetUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUserForDemo = (user: User) => {
    setCurrentUser(user);
  };

  // Question Management (Admin)
  const addQuestion = (newQ: Omit<QuestionDefinition, 'id' | 'order' | 'isDefault'>) => {
    const id = 'q_custom_' + Date.now();
    const sectionQuestions = questions.filter(q => q.sectionId === newQ.sectionId);
    const order = sectionQuestions.length + 1;
    const questionToAdd: QuestionDefinition = {
      ...newQ,
      id,
      order,
      isDefault: false
    };
    setQuestions(prev => [...prev, questionToAdd]);
  };

  const updateQuestion = (id: string, updates: Partial<QuestionDefinition>) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const restoreDefaultQuestions = () => {
    setQuestions(INITIAL_QUESTIONS);
  };

  // Teacher Management (Admin)
  const addUser = (newUser: Omit<User, 'id' | 'createdAt'>) => {
    const id = 'user_' + Date.now();
    const userToAdd: User = {
      ...newUser,
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, userToAdd]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, ...updates } : u))
    );
    if (currentUser?.id === id) {
      setCurrentUser(prev => (prev ? { ...prev, ...updates } : null));
    }
    // Se atualizou o nome do professor, sincroniza nas avaliações do mesmo para coerência nas impressões
    if (updates.name) {
      setEvaluations(prev =>
        prev.map(e => (e.professorId === id ? { ...e, professorName: updates.name! } : e))
      );
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) {
      setCurrentUser(null);
    }
  };

  // Evaluations: Security & Protection against overwrite
  const saveEvaluation = (
    data: Omit<EvaluationRecord, 'id' | 'updatedAt'> & { id?: string }
  ) => {
    if (!currentUser) {
      return { success: false, error: 'Usuário não autenticado.', id: '' };
    }

    const now = new Date().toISOString();

    if (data.id) {
      // Editing existing
      const existing = evaluations.find(e => e.id === data.id);
      if (!existing) {
        return { success: false, error: 'Ficha de avaliação não encontrada.', id: data.id };
      }

      // Security check: only author or admin can update this evaluation!
      if (currentUser.role !== 'admin' && existing.professorId !== currentUser.id) {
        return {
          success: false,
          error: 'Acesso negado: Você não tem permissão para alterar as respostas de outro professor!',
          id: data.id
        };
      }

      const updatedRecord: EvaluationRecord = {
        ...existing,
        turma: data.turma,
        componente: data.componente,
        date: data.date,
        status: data.status,
        answers: { ...data.answers },
        updatedAt: now,
        submittedAt: data.status === 'completed' ? (existing.submittedAt || now) : undefined
      };

      setEvaluations(prev => prev.map(e => (e.id === data.id ? updatedRecord : e)));
      return { success: true, id: data.id };
    } else {
      // New evaluation
      const newId = 'eval_' + Date.now();
      const newRecord: EvaluationRecord = {
        id: newId,
        professorId: currentUser.role === 'admin' ? data.professorId || currentUser.id : currentUser.id,
        professorName: currentUser.role === 'admin' ? data.professorName || currentUser.name : currentUser.name,
        turma: data.turma,
        componente: data.componente,
        date: data.date || new Date().toISOString().split('T')[0],
        status: data.status,
        answers: { ...data.answers },
        updatedAt: now,
        submittedAt: data.status === 'completed' ? now : undefined
      };

      setEvaluations(prev => [newRecord, ...prev]);
      return { success: true, id: newId };
    }
  };

  const deleteEvaluation = (id: string) => {
    const existing = evaluations.find(e => e.id === id);
    if (!existing) {
      return { success: false, error: 'Avaliação não encontrada.' };
    }

    if (currentUser?.role !== 'admin' && existing.professorId !== currentUser?.id) {
      return {
        success: false,
        error: 'Permissão negada: Somente o próprio professor ou o administrador pode excluir sua avaliação.'
      };
    }

    setEvaluations(prev => prev.filter(e => e.id !== id));
    return { success: true };
  };

  const updateSchoolConfig = (updates: Partial<SchoolConfig>) => {
    setSchoolConfig(prev => ({ ...prev, ...updates }));
  };

  const resetAllData = () => {
    setUsers(INITIAL_USERS);
    setQuestions(INITIAL_QUESTIONS);
    setEvaluations(INITIAL_EVALUATIONS);
    setSchoolConfig(INITIAL_SCHOOL_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.EVALUATIONS);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
  };

  const exportDataJson = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      schoolConfig,
      users,
      questions,
      evaluations
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDataJson = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (parsed.schoolConfig) setSchoolConfig(parsed.schoolConfig);
      if (Array.isArray(parsed.users)) setUsers(parsed.users);
      if (Array.isArray(parsed.questions)) setQuestions(parsed.questions);
      if (Array.isArray(parsed.evaluations)) setEvaluations(parsed.evaluations);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        currentUser,
        users,
        sections,
        questions,
        evaluations,
        schoolConfig,
        login,
        loginForUser,
        logout,
        switchUserForDemo,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        restoreDefaultQuestions,
        addUser,
        updateUser,
        deleteUser,
        saveEvaluation,
        deleteEvaluation,
        updateSchoolConfig,
        resetAllData,
        exportDataJson,
        importDataJson
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
