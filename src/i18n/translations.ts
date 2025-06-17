
export type Language = 'en' | 'pt' | 'es';

export interface Translations {
  // App branding
  appName: string;
  appTagline: string;
  appDescription: string;
  
  // Navigation
  portfolio: string;
  income: string;
  expenses: string;
  assets: string;
  tasks: string;
  debt: string;
  
  // User profile
  userProfile: string;
  displayName: string;
  defaultCurrency: string;
  signIn: string;
  signOut: string;
  
  // Dashboard metrics
  availableNow: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  activeDebts: string;
  monthlyBalance: string;
  
  // Data management
  dataManagement: string;
  saveToCloud: string;
  loadFromCloud: string;
  exportData: string;
  importData: string;
  resetData: string;
  
  // Live data
  liveNumbers: string;
  lastUpdated: string;
  updatedAgo: string;
  
  // Common actions
  add: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  close: string;
  
  // Time periods
  monthly: string;
  yearly: string;
  projection: string;
  
  // Status
  active: string;
  inactive: string;
  completed: string;
  pending: string;
  
  // Unsaved changes
  unsavedChanges: string;
  unsavedChangesDesc: string;
  lastSync: string;
  lastModified: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'FinDash',
    appTagline: 'Smart Financial Dashboard',
    appDescription: 'Complete personal financial management dashboard for tracking assets, income, expenses, and financial projections.',
    
    portfolio: 'Portfolio',
    income: 'Income',
    expenses: 'Expenses',
    assets: 'Assets',
    tasks: 'Tasks',
    debt: 'Debt',
    
    userProfile: 'User Profile',
    displayName: 'Display Name',
    defaultCurrency: 'Default Currency',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    
    availableNow: 'Available Now',
    monthlyIncome: 'Monthly Income',
    monthlyExpenses: 'Monthly Expenses',
    activeDebts: 'Active Debts',
    monthlyBalance: 'Monthly Balance',
    
    dataManagement: 'Data Management',
    saveToCloud: 'Save to Cloud',
    loadFromCloud: 'Load from Cloud',
    exportData: 'Export Data',
    importData: 'Import Data',
    resetData: 'Reset Data',
    
    liveNumbers: 'live numbers',
    lastUpdated: 'Last updated',
    updatedAgo: 'ago',
    
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    
    monthly: 'Monthly',
    yearly: 'Yearly',
    projection: 'Projection',
    
    active: 'Active',
    inactive: 'Inactive',
    completed: 'Completed',
    pending: 'Pending',
    
    unsavedChanges: 'Unsaved Changes',
    unsavedChangesDesc: 'Click "Save to Cloud" to sync your changes.',
    lastSync: 'Last sync',
    lastModified: 'Last modified',
  },
  
  pt: {
    appName: 'FinDash',
    appTagline: 'Painel Financeiro Inteligente',
    appDescription: 'Painel completo de gestão financeira pessoal para rastrear ativos, receitas, despesas e projeções financeiras.',
    
    portfolio: 'Portfólio',
    income: 'Receitas',
    expenses: 'Despesas',
    assets: 'Ativos',
    tasks: 'Tarefas',
    debt: 'Dívidas',
    
    userProfile: 'Perfil do Usuário',
    displayName: 'Nome de Exibição',
    defaultCurrency: 'Moeda Padrão',
    signIn: 'Entrar',
    signOut: 'Sair',
    
    availableNow: 'Disponível Agora',
    monthlyIncome: 'Receita Mensal',
    monthlyExpenses: 'Despesas Mensais',
    activeDebts: 'Dívidas Ativas',
    monthlyBalance: 'Saldo Mensal',
    
    dataManagement: 'Gestão de Dados',
    saveToCloud: 'Salvar na Nuvem',
    loadFromCloud: 'Carregar da Nuvem',
    exportData: 'Exportar Dados',
    importData: 'Importar Dados',
    resetData: 'Resetar Dados',
    
    liveNumbers: 'dados ao vivo',
    lastUpdated: 'Última atualização',
    updatedAgo: 'atrás',
    
    add: 'Adicionar',
    edit: 'Editar',
    delete: 'Excluir',
    save: 'Salvar',
    cancel: 'Cancelar',
    close: 'Fechar',
    
    monthly: 'Mensal',
    yearly: 'Anual',
    projection: 'Projeção',
    
    active: 'Ativo',
    inactive: 'Inativo',
    completed: 'Concluído',
    pending: 'Pendente',
    
    unsavedChanges: 'Alterações Não Salvas',
    unsavedChangesDesc: 'Clique em "Salvar na Nuvem" para sincronizar suas alterações.',
    lastSync: 'Última sincronização',
    lastModified: 'Última modificação',
  },
  
  es: {
    appName: 'FinDash',
    appTagline: 'Panel Financiero Inteligente',
    appDescription: 'Panel completo de gestión financiera personal para rastrear activos, ingresos, gastos y proyecciones financieras.',
    
    portfolio: 'Portafolio',
    income: 'Ingresos',
    expenses: 'Gastos',
    assets: 'Activos',
    tasks: 'Tareas',
    debt: 'Deudas',
    
    userProfile: 'Perfil de Usuario',
    displayName: 'Nombre a Mostrar',
    defaultCurrency: 'Moneda Predeterminada',
    signIn: 'Iniciar Sesión',
    signOut: 'Cerrar Sesión',
    
    availableNow: 'Disponible Ahora',
    monthlyIncome: 'Ingresos Mensuales',
    monthlyExpenses: 'Gastos Mensuales',
    activeDebts: 'Deudas Activas',
    monthlyBalance: 'Balance Mensual',
    
    dataManagement: 'Gestión de Datos',
    saveToCloud: 'Guardar en la Nube',
    loadFromCloud: 'Cargar de la Nube',
    exportData: 'Exportar Datos',
    importData: 'Importar Datos',
    resetData: 'Resetear Datos',
    
    liveNumbers: 'datos en vivo',
    lastUpdated: 'Última actualización',
    updatedAgo: 'hace',
    
    add: 'Agregar',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    
    monthly: 'Mensual',
    yearly: 'Anual',
    projection: 'Proyección',
    
    active: 'Activo',
    inactive: 'Inactivo',
    completed: 'Completado',
    pending: 'Pendiente',
    
    unsavedChanges: 'Cambios No Guardados',
    unsavedChangesDesc: 'Haz clic en "Guardar en la Nube" para sincronizar tus cambios.',
    lastSync: 'Última sincronización',
    lastModified: 'Última modificación',
  },
};

export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations.en;
};
