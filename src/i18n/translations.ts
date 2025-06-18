
import { Language, Translations } from './types';
import { en } from './locales/en';
import { pt } from './locales/pt';
import { es } from './locales/es';

// French and German translations (abbreviated for mobile optimization)
const fr: Translations = {
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
  
  high: 'Haute',
  medium: 'Moyenne',
  low: 'Basse',
  
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
  health: 'Santé',
  utilities: 'Services Publics',
  personal: 'Personnel',
  travel: 'Voyage',
  trips: 'Voyages',
  other: 'Autres',
  
  amount: 'Montant',
  category: 'Catégorie',
  description: 'Descrip.',
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
  
  addExpense: 'Ajouter Dépense',
  addNewExpense: 'Ajouter Nouvelle Dépense',
  expenseName: 'Nom de la dépense',
  selectCategory: 'Sélectionner catégorie',
  selectType: 'Sélectionner type',
  recurring: 'Récurrent',
  variable: 'Variable',
  day: 'Jour',
  dueDayPlaceholder: 'Jour d\'échéance (1-31)',
  inactiveExpenses: 'dépenses inactives',
  totalExpenses: 'total',
  oneTimeExpenses: 'Dépenses uniques',
  combinedActiveExpenses: 'Dépenses actives combinées',
  totalImpact: 'Impact Total',
  expenseSummary: 'Résumé des Dépenses',
  tapToSwitch: 'Appuyez pour changer',
};

const de: Translations = {
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
  
  high: 'Hoch',
  medium: 'Mittel',
  low: 'Niedrig',
  
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
  health: 'Gesundheit',
  utilities: 'Versorgungsunternehmen',
  personal: 'Persönlich',
  travel: 'Reisen',
  trips: 'Reisen',
  other: 'Andere',
  
  amount: 'Betrag',
  category: 'Kategorie',
  description: 'Beschr.',
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
  
  addExpense: 'Ausgabe Hinzufügen',
  addNewExpense: 'Neue Ausgabe Hinzufügen',
  expenseName: 'Name der Ausgabe',
  selectCategory: 'Kategorie auswählen',
  selectType: 'Typ auswählen',
  recurring: 'Wiederkehrend',
  variable: 'Variabel',
  day: 'Tag',
  dueDayPlaceholder: 'Fälligkeitstag (1-31)',
  inactiveExpenses: 'inaktive Ausgaben',
  totalExpenses: 'gesamt',
  oneTimeExpenses: 'Einmalige Ausgaben',
  combinedActiveExpenses: 'Kombinierte aktive Ausgaben',
  totalImpact: 'Gesamtauswirkung',
  expenseSummary: 'Ausgabenübersicht',
  tapToSwitch: 'Tippen zum Wechseln',
};

export const translations: Record<Language, Translations> = {
  en,
  pt,
  es,
  fr,
  de,
};

export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations.en;
};

export type { Language, Translations };
