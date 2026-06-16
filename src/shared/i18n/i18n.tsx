import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Language = 'en' | 'fr'

const STORAGE_KEY = 'social-things:lang'

type I18nKey =
  | 'nav.home'
  | 'nav.catalog'
  | 'nav.about'
  | 'nav.account'
  | 'nav.cart'
  | 'sheet.openMenu'
  | 'sheet.closeMenu'
  | 'page.about.title'
  | 'page.account.title'
  | 'page.account.guestHint'
  | 'page.account.welcomeBack'
  | 'page.account.loading'
  | 'page.account.signIn'
  | 'page.account.register'
  | 'page.account.signInHint'
  | 'page.account.registerHint'
  | 'page.account.name'
  | 'page.account.email'
  | 'page.account.password'
  | 'page.account.confirmPassword'
  | 'page.account.createAccount'
  | 'page.account.submitting'
  | 'page.account.signOut'
  | 'page.account.signedInAs'
  | 'page.account.browseCatalog'
  | 'page.account.errorRequired'
  | 'page.account.errorPasswordShort'
  | 'page.account.errorPasswordMatch'
  | 'page.account.errorGeneric'
  | 'page.account.errorInvalidCredentials'
  | 'page.account.errorEmailTaken'
  | 'page.cart.title'
  | 'page.cart.empty'
  | 'page.cart.emptyHint'
  | 'page.cart.continue'
  | 'page.cart.itemSingular'
  | 'page.cart.itemPlural'
  | 'page.cart.catalogEyebrow'
  | 'page.cart.catalogTitle'
  | 'page.cart.viewAll'
  | 'page.cart.loading'
  | 'page.cart.catalogEmpty'

const MESSAGES: Record<Language, Record<I18nKey, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.catalog': 'Catalog',
    'nav.about': 'About',
    'nav.account': 'Account',
    'nav.cart': 'Cart',
    'sheet.openMenu': 'Open menu',
    'sheet.closeMenu': 'Close menu',
    'page.about.title': 'About',
    'page.account.title': 'Account',
    'page.account.guestHint': 'Sign in or create an account to continue.',
    'page.account.welcomeBack': 'You are signed in.',
    'page.account.loading': 'Loading account…',
    'page.account.signIn': 'Sign in',
    'page.account.register': 'Register',
    'page.account.signInHint': 'Welcome back — enter your details below.',
    'page.account.registerHint': 'Create an account to save your details and orders.',
    'page.account.name': 'Name',
    'page.account.email': 'Email',
    'page.account.password': 'Password',
    'page.account.confirmPassword': 'Confirm password',
    'page.account.createAccount': 'Create account',
    'page.account.submitting': 'Please wait…',
    'page.account.signOut': 'Sign out',
    'page.account.signedInAs': 'Signed in as',
    'page.account.browseCatalog': 'Browse catalog',
    'page.account.errorRequired': 'Please fill in all required fields.',
    'page.account.errorPasswordShort': 'Password must be at least 6 characters.',
    'page.account.errorPasswordMatch': 'Passwords do not match.',
    'page.account.errorGeneric': 'Something went wrong. Please try again.',
    'page.account.errorInvalidCredentials': 'Invalid email or password.',
    'page.account.errorEmailTaken': 'An account with this email already exists.',
    'page.cart.title': 'Cart',
    'page.cart.empty': 'Your cart is empty',
    'page.cart.emptyHint': 'Add something from the catalog to get started.',
    'page.cart.continue': 'Browse catalog',
    'page.cart.itemSingular': 'item',
    'page.cart.itemPlural': 'items',
    'page.cart.catalogEyebrow': 'FROM THE CATALOG',
    'page.cart.catalogTitle': 'Keep exploring',
    'page.cart.viewAll': 'View all',
    'page.cart.loading': 'Loading collection…',
    'page.cart.catalogEmpty': 'Nothing else to show right now.',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.catalog': 'Catalogue',
    'nav.about': 'À propos',
    'nav.account': 'Compte',
    'nav.cart': 'Panier',
    'sheet.openMenu': 'Ouvrir le menu',
    'sheet.closeMenu': 'Fermer le menu',
    'page.about.title': 'À propos',
    'page.account.title': 'Compte',
    'page.account.guestHint': 'Connectez-vous ou créez un compte pour continuer.',
    'page.account.welcomeBack': 'Vous êtes connecté.',
    'page.account.loading': 'Chargement du compte…',
    'page.account.signIn': 'Connexion',
    'page.account.register': 'Inscription',
    'page.account.signInHint': 'Bon retour — saisissez vos identifiants.',
    'page.account.registerHint': 'Créez un compte pour enregistrer vos informations.',
    'page.account.name': 'Nom',
    'page.account.email': 'E-mail',
    'page.account.password': 'Mot de passe',
    'page.account.confirmPassword': 'Confirmer le mot de passe',
    'page.account.createAccount': 'Créer un compte',
    'page.account.submitting': 'Veuillez patienter…',
    'page.account.signOut': 'Déconnexion',
    'page.account.signedInAs': 'Connecté en tant que',
    'page.account.browseCatalog': 'Voir le catalogue',
    'page.account.errorRequired': 'Veuillez remplir tous les champs obligatoires.',
    'page.account.errorPasswordShort': 'Le mot de passe doit contenir au moins 6 caractères.',
    'page.account.errorPasswordMatch': 'Les mots de passe ne correspondent pas.',
    'page.account.errorGeneric': 'Une erreur est survenue. Réessayez.',
    'page.account.errorInvalidCredentials': 'E-mail ou mot de passe incorrect.',
    'page.account.errorEmailTaken': 'Un compte existe déjà avec cet e-mail.',
    'page.cart.title': 'Panier',
    'page.cart.empty': 'Votre panier est vide',
    'page.cart.emptyHint': 'Ajoutez une pièce du catalogue pour commencer.',
    'page.cart.continue': 'Voir le catalogue',
    'page.cart.itemSingular': 'article',
    'page.cart.itemPlural': 'articles',
    'page.cart.catalogEyebrow': 'DU CATALOGUE',
    'page.cart.catalogTitle': 'Continuer à explorer',
    'page.cart.viewAll': 'Tout voir',
    'page.cart.loading': 'Chargement du catalogue…',
    'page.cart.catalogEmpty': 'Rien d’autre à afficher pour le moment.',
  },
}

interface I18nContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: I18nKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw === 'fr' || raw === 'en' ? raw : 'en'
  })

  const setLang = (next: Language) => setLangState(next)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<I18nContextValue>(() => {
    return {
      lang,
      setLang,
      t: (key) => MESSAGES[lang][key] ?? key,
    }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

