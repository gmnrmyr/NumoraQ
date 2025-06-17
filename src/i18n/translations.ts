
export type Language = 'en' | 'pt' | 'es' | 'fr' | 'de';

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
  netWorth: string;
  totalAssets: string;
  
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
  search: string;
  filter: string;
  sort: string;
  
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
  
  // Asset types
  liquidAssets: string;
  illiquidAssets: string;
  realEstate: string;
  investments: string;
  
  // Income types
  passiveIncome: string;
  activeIncome: string;
  salary: string;
  freelance: string;
  dividends: string;
  rental: string;
  
  // Expense types
  recurringExpenses: string;
  variableExpenses: string;
  housing: string;
  transportation: string;
  food: string;
  entertainment: string;
  
  // Financial terms
  amount: string;
  category: string;
  description: string;
  date: string;
  priority: string;
  notes: string;
  
  // Messages
  noDataYet: string;
  addFirstItem: string;
  syncingData: string;
  dataUpdated: string;
  errorOccurred: string;
  
  // Sorting options
  sortBy: string;
  sortByDate: string;
  sortByAmount: string;
  sortByPriority: string;
  sortByName: string;
  ascending: string;
  descending: string;
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
    netWorth: 'Net Worth',
    totalAssets: 'Total Assets',
    
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
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    
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
    
    liquidAssets: 'Liquid Assets',
    illiquidAssets: 'Illiquid Assets',
    realEstate: 'Real Estate',
    investments: 'Investments',
    
    passiveIncome: 'Passive Income',
    activeIncome: 'Active Income',
    salary: 'Salary',
    freelance: 'Freelance',
    dividends: 'Dividends',
    rental: 'Rental',
    
    recurringExpenses: 'Recurring Expenses',
    variableExpenses: 'Variable Expenses',
    housing: 'Housing',
    transportation: 'Transportation',
    food: 'Food & Dining',
    entertainment: 'Entertainment',
    
    amount: 'Amount',
    category: 'Category',
    description: 'Description',
    date: 'Date',
    priority: 'Priority',
    notes: 'Notes',
    
    noDataYet: 'No data yet',
    addFirstItem: 'Add your first item',
    syncingData: 'Syncing data...',
    dataUpdated: 'Data updated successfully',
    errorOccurred: 'An error occurred',
    
    sortBy: 'Sort by',
    sortByDate: 'Date',
    sortByAmount: 'Amount',
    sortByPriority: 'Priority',
    sortByName: 'Name',
    ascending: 'Ascending',
    descending: 'Descending',
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
    netWorth: 'Patrimônio Líquido',
    totalAssets: 'Total de Ativos',
    
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
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    
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
    
    liquidAssets: 'Ativos Líquidos',
    illiquidAssets: 'Ativos Ilíquidos',
    realEstate: 'Imóveis',
    investments: 'Investimentos',
    
    passiveIncome: 'Renda Passiva',
    activeIncome: 'Renda Ativa',
    salary: 'Salário',
    freelance: 'Freelance',
    dividends: 'Dividendos',
    rental: 'Aluguel',
    
    recurringExpenses: 'Despesas Recorrentes',
    variableExpenses: 'Despesas Variáveis',
    housing: 'Habitação',
    transportation: 'Transporte',
    food: 'Alimentação',
    entertainment: 'Entretenimento',
    
    amount: 'Valor',
    category: 'Categoria',
    description: 'Descrição',
    date: 'Data',
    priority: 'Prioridade',
    notes: 'Notas',
    
    noDataYet: 'Nenhum dado ainda',
    addFirstItem: 'Adicione seu primeiro item',
    syncingData: 'Sincronizando dados...',
    dataUpdated: 'Dados atualizados com sucesso',
    errorOccurred: 'Ocorreu um erro',
    
    sortBy: 'Ordenar por',
    sortByDate: 'Data',
    sortByAmount: 'Valor',
    sortByPriority: 'Prioridade',
    sortByName: 'Nome',
    ascending: 'Crescente',
    descending: 'Decrescente',
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
    netWorth: 'Patrimonio Neto',
    totalAssets: 'Total de Activos',
    
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
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    
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
    
    liquidAssets: 'Activos Líquidos',
    illiquidAssets: 'Activos Ilíquidos',
    realEstate: 'Bienes Raíces',
    investments: 'Inversiones',
    
    passiveIncome: 'Ingresos Pasivos',
    activeIncome: 'Ingresos Activos',
    salary: 'Salario',
    freelance: 'Freelance',
    dividends: 'Dividendos',
    rental: 'Alquiler',
    
    recurringExpenses: 'Gastos Recurrentes',
    variableExpenses: 'Gastos Variables',
    housing: 'Vivienda',
    transportation: 'Transporte',
    food: 'Comida y Cena',
    entertainment: 'Entretenimiento',
    
    amount: 'Cantidad',
    category: 'Categoría',
    description: 'Descripción',
    date: 'Fecha',
    priority: 'Prioridad',
    notes: 'Notas',
    
    noDataYet: 'Sin datos aún',
    addFirstItem: 'Agrega tu primer elemento',
    syncingData: 'Sincronizando datos...',
    dataUpdated: 'Datos actualizados exitosamente',
    errorOccurred: 'Ocurrió un error',
    
    sortBy: 'Ordenar por',
    sortByDate: 'Fecha',
    sortByAmount: 'Cantidad',
    sortByPriority: 'Prioridad',
    sortByName: 'Nombre',
    ascending: 'Ascendente',
    descending: 'Descendente',
  },

  fr: {
    appName: 'FinDash',
    appTagline: 'Tableau de Bord Financier Intelligent',
    appDescription: 'Tableau de bord complet de gestion financière personnelle pour suivre les actifs, revenus, dépenses et projections financières.',
    
    portfolio: 'Portefeuille',
    income: 'Revenus',
    expenses: 'Dépenses',
    assets: 'Actifs',
    tasks: 'Tâches',
    debt: 'Dettes',
    
    userProfile: 'Profil Utilisateur',
    displayName: 'Nom d\'Affichage',
    defaultCurrency: 'Devise par Défaut',
    signIn: 'Se Connecter',
    signOut: 'Se Déconnecter',
    
    availableNow: 'Disponible Maintenant',
    monthlyIncome: 'Revenus Mensuels',
    monthlyExpenses: 'Dépenses Mensuelles',
    activeDebts: 'Dettes Actives',
    monthlyBalance: 'Solde Mensuel',
    netWorth: 'Valeur Nette',
    totalAssets: 'Total des Actifs',
    
    dataManagement: 'Gestion des Données',
    saveToCloud: 'Sauvegarder dans le Cloud',
    loadFromCloud: 'Charger depuis le Cloud',
    exportData: 'Exporter les Données',
    importData: 'Importer les Données',
    resetData: 'Réinitialiser les Données',
    
    liveNumbers: 'données en direct',
    lastUpdated: 'Dernière mise à jour',
    updatedAgo: 'il y a',
    
    add: 'Ajouter',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    close: 'Fermer',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    
    monthly: 'Mensuel',
    yearly: 'Annuel',
    projection: 'Projection',
    
    active: 'Actif',
    inactive: 'Inactif',
    completed: 'Terminé',
    pending: 'En Attente',
    
    unsavedChanges: 'Modifications Non Sauvegardées',
    unsavedChangesDesc: 'Cliquez sur "Sauvegarder dans le Cloud" pour synchroniser vos modifications.',
    lastSync: 'Dernière synchronisation',
    lastModified: 'Dernière modification',
    
    liquidAssets: 'Actifs Liquides',
    illiquidAssets: 'Actifs Illiquides',
    realEstate: 'Immobilier',
    investments: 'Investissements',
    
    passiveIncome: 'Revenus Passifs',
    activeIncome: 'Revenus Actifs',
    salary: 'Salaire',
    freelance: 'Freelance',
    dividends: 'Dividendes',
    rental: 'Location',
    
    recurringExpenses: 'Dépenses Récurrentes',
    variableExpenses: 'Dépenses Variables',
    housing: 'Logement',
    transportation: 'Transport',
    food: 'Nourriture et Restauration',
    entertainment: 'Divertissement',
    
    amount: 'Montant',
    category: 'Catégorie',
    description: 'Description',
    date: 'Date',
    priority: 'Priorité',
    notes: 'Notes',
    
    noDataYet: 'Aucune donnée pour le moment',
    addFirstItem: 'Ajoutez votre premier élément',
    syncingData: 'Synchronisation des données...',
    dataUpdated: 'Données mises à jour avec succès',
    errorOccurred: 'Une erreur s\'est produite',
    
    sortBy: 'Trier par',
    sortByDate: 'Date',
    sortByAmount: 'Montant',
    sortByPriority: 'Priorité',
    sortByName: 'Nom',
    ascending: 'Croissant',
    descending: 'Décroissant',
  },

  de: {
    appName: 'FinDash',
    appTagline: 'Intelligentes Finanz-Dashboard',
    appDescription: 'Vollständiges persönliches Finanzmanagement-Dashboard zur Verfolgung von Vermögenswerten, Einkommen, Ausgaben und Finanzprognosen.',
    
    portfolio: 'Portfolio',
    income: 'Einkommen',
    expenses: 'Ausgaben',
    assets: 'Vermögen',
    tasks: 'Aufgaben',
    debt: 'Schulden',
    
    userProfile: 'Benutzerprofil',
    displayName: 'Anzeigename',
    defaultCurrency: 'Standardwährung',
    signIn: 'Anmelden',
    signOut: 'Abmelden',
    
    availableNow: 'Verfügbar Jetzt',
    monthlyIncome: 'Monatliches Einkommen',
    monthlyExpenses: 'Monatliche Ausgaben',
    activeDebts: 'Aktive Schulden',
    monthlyBalance: 'Monatlicher Saldo',
    netWorth: 'Nettovermögen',
    totalAssets: 'Gesamtvermögen',
    
    dataManagement: 'Datenverwaltung',
    saveToCloud: 'In Cloud Speichern',
    loadFromCloud: 'Von Cloud Laden',
    exportData: 'Daten Exportieren',
    importData: 'Daten Importieren',
    resetData: 'Daten Zurücksetzen',
    
    liveNumbers: 'Live-Zahlen',
    lastUpdated: 'Zuletzt aktualisiert',
    updatedAgo: 'vor',
    
    add: 'Hinzufügen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    close: 'Schließen',
    search: 'Suchen',
    filter: 'Filtern',
    sort: 'Sortieren',
    
    monthly: 'Monatlich',
    yearly: 'Jährlich',
    projection: 'Prognose',
    
    active: 'Aktiv',
    inactive: 'Inaktiv',
    completed: 'Abgeschlossen',
    pending: 'Ausstehend',
    
    unsavedChanges: 'Nicht Gespeicherte Änderungen',
    unsavedChangesDesc: 'Klicken Sie auf "In Cloud Speichern", um Ihre Änderungen zu synchronisieren.',
    lastSync: 'Letzte Synchronisation',
    lastModified: 'Zuletzt geändert',
    
    liquidAssets: 'Liquide Vermögenswerte',
    illiquidAssets: 'Illiquide Vermögenswerte',
    realEstate: 'Immobilien',
    investments: 'Investitionen',
    
    passiveIncome: 'Passives Einkommen',
    activeIncome: 'Aktives Einkommen',
    salary: 'Gehalt',
    freelance: 'Freelance',
    dividends: 'Dividenden',
    rental: 'Miete',
    
    recurringExpenses: 'Wiederkehrende Ausgaben',
    variableExpenses: 'Variable Ausgaben',
    housing: 'Wohnen',
    transportation: 'Transport',
    food: 'Essen und Trinken',
    entertainment: 'Unterhaltung',
    
    amount: 'Betrag',
    category: 'Kategorie',
    description: 'Beschreibung',
    date: 'Datum',
    priority: 'Priorität',
    notes: 'Notizen',
    
    noDataYet: 'Noch keine Daten',
    addFirstItem: 'Fügen Sie Ihr erstes Element hinzu',
    syncingData: 'Daten werden synchronisiert...',
    dataUpdated: 'Daten erfolgreich aktualisiert',
    errorOccurred: 'Ein Fehler ist aufgetreten',
    
    sortBy: 'Sortieren nach',
    sortByDate: 'Datum',
    sortByAmount: 'Betrag',
    sortByPriority: 'Priorität',
    sortByName: 'Name',
    ascending: 'Aufsteigend',
    descending: 'Absteigend',
  },
};

export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations.en;
};
