import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Language = 'en' | 'fr'

const STORAGE_KEY = 'social-things:lang'

type I18nKey =
  | 'nav.home'
  | 'nav.products'
  | 'nav.gallery'
  | 'nav.faq'
  | 'nav.about'
  | 'nav.account'
  | 'nav.cart'
  | 'sheet.openMenu'
  | 'sheet.closeMenu'
  | 'page.about.title'
  | 'page.gallery.title'
  | 'page.gallery.hint'
  | 'page.gallery.empty'
  | 'page.gallery.emptyHint'
  | 'page.gallery.close'
  | 'page.gallery.all'
  | 'page.gallery.filter'
  | 'page.gallery.filterTitle'
  | 'page.gallery.filterHint'
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
  | 'page.account.browseProducts'
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
  | 'page.cart.productsEyebrow'
  | 'page.cart.productsTitle'
  | 'page.cart.viewAll'
  | 'page.cart.loading'
  | 'page.cart.productsEmpty'
  | 'page.product.moreFromProducts'
  | 'page.products.title'
  | 'page.products.hint'
  | 'page.products.loading'
  | 'page.faq.eyebrow'
  | 'page.faq.title'
  | 'page.faq.subtitle'
  | 'page.faq.fullDocument'
  | 'page.account.agreePolicy'
  | 'page.account.policiesConsentTitle'
  | 'page.account.errorPoliciesRequired'
  | 'legal.back'
  | 'legal.faq'
  | 'legal.shipping'
  | 'legal.returns'
  | 'legal.privacy'
  | 'legal.terms'

const MESSAGES: Record<Language, Record<I18nKey, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.gallery': 'Gallery',
    'nav.faq': 'FAQ',
    'nav.about': 'About',
    'nav.account': 'Account',
    'nav.cart': 'Cart',
    'sheet.openMenu': 'Open menu',
    'sheet.closeMenu': 'Close menu',
    'page.about.title': 'About',
    'page.gallery.title': 'Gallery',
    'page.gallery.hint': 'Shots from the drop — filter by color folder or browse all.',
    'page.gallery.empty': 'No pictures yet',
    'page.gallery.emptyHint': 'Add images under src/assets/gallery/ (folders ok) then refresh.',
    'page.gallery.close': 'Close',
    'page.gallery.all': 'All',
    'page.gallery.filter': 'Filter',
    'page.gallery.filterTitle': 'Filter by color',
    'page.gallery.filterHint': 'Pick a color to narrow the lookbook.',
    'page.account.title': 'Account',
    'page.account.guestHint': 'Sign in or create an account to continue.',
    'page.account.welcomeBack': 'You are signed in.',
    'page.account.loading': 'Loading account…',
    'page.account.signIn': 'Sign in',
    'page.account.register': 'Register',
    'page.account.signInHint': 'Welcome back — enter your details below.',
    'page.account.registerHint': 'Join Social Things — create your account to shop drops and track orders.',
    'page.account.name': 'Name',
    'page.account.email': 'Email',
    'page.account.password': 'Password',
    'page.account.confirmPassword': 'Confirm password',
    'page.account.createAccount': 'Create account',
    'page.account.submitting': 'Please wait…',
    'page.account.signOut': 'Sign out',
    'page.account.signedInAs': 'Signed in as',
    'page.account.browseProducts': 'Browse products',
    'page.account.errorRequired': 'Please fill in all required fields.',
    'page.account.errorPasswordShort': 'Password must be at least 6 characters.',
    'page.account.errorPasswordMatch': 'Passwords do not match.',
    'page.account.errorGeneric': 'Something went wrong. Please try again.',
    'page.account.errorInvalidCredentials': 'Invalid email or password.',
    'page.account.errorEmailTaken': 'An account with this email already exists.',
    'page.account.agreePolicy': 'I have read and agree to',
    'page.account.policiesConsentTitle': 'Required — accept all policies to register',
    'page.account.errorPoliciesRequired':
      'Please accept all policies (shipping, returns, privacy, and terms) to create your account.',
    'page.cart.title': 'Cart',
    'page.cart.empty': 'Your cart is empty',
    'page.cart.emptyHint': 'Add something from the products to get started.',
    'page.cart.continue': 'Browse products',
    'page.cart.itemSingular': 'item',
    'page.cart.itemPlural': 'items',
    'page.cart.productsEyebrow': 'FROM THE PRODUCTS',
    'page.cart.productsTitle': 'Keep exploring',
    'page.cart.viewAll': 'View all',
    'page.cart.loading': 'Loading products…',
    'page.cart.productsEmpty': 'Nothing else to show right now.',
    'page.product.moreFromProducts': 'MORE FROM THE PRODUCTS',
    'page.products.title': 'Products',
    'page.products.hint': 'Tap a piece to view details and add to cart.',
    'page.products.loading': 'Loading products…',
    'page.faq.eyebrow': 'Support',
    'page.faq.title': 'FAQ',
    'page.faq.subtitle': 'Answers about our brand, fit, and how to reach us.',
    'page.faq.fullDocument': 'Read the full FAQ document:',
    'legal.back': 'Back',
    'legal.faq': 'FAQ',
    'legal.shipping': 'Shipping Policy',
    'legal.returns': 'Return & Exchange Policy',
    'legal.privacy': 'Privacy Policy',
    'legal.terms': 'Terms of Service',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.products': 'Produits',
    'nav.gallery': 'Galerie',
    'nav.faq': 'FAQ',
    'nav.about': 'À propos',
    'nav.account': 'Compte',
    'nav.cart': 'Panier',
    'sheet.openMenu': 'Ouvrir le menu',
    'sheet.closeMenu': 'Fermer le menu',
    'page.about.title': 'À propos',
    'page.gallery.title': 'Galerie',
    'page.gallery.hint': 'Photos du drop — filtrez par dossier couleur ou voyez tout.',
    'page.gallery.empty': 'Pas encore d’images',
    'page.gallery.emptyHint': 'Ajoutez des images dans src/assets/gallery/ (dossiers ok) puis actualisez.',
    'page.gallery.close': 'Fermer',
    'page.gallery.all': 'Tout',
    'page.gallery.filter': 'Filtrer',
    'page.gallery.filterTitle': 'Filtrer par couleur',
    'page.gallery.filterHint': 'Choisissez une couleur pour affiner le lookbook.',
    'page.account.title': 'Compte',
    'page.account.guestHint': 'Connectez-vous ou créez un compte pour continuer.',
    'page.account.welcomeBack': 'Vous êtes connecté.',
    'page.account.loading': 'Chargement du compte…',
    'page.account.signIn': 'Connexion',
    'page.account.register': 'Inscription',
    'page.account.signInHint': 'Bon retour — saisissez vos identifiants.',
    'page.account.registerHint': 'Rejoignez Social Things — créez votre compte pour acheter et suivre vos commandes.',
    'page.account.name': 'Nom',
    'page.account.email': 'E-mail',
    'page.account.password': 'Mot de passe',
    'page.account.confirmPassword': 'Confirmer le mot de passe',
    'page.account.createAccount': 'Créer un compte',
    'page.account.submitting': 'Veuillez patienter…',
    'page.account.signOut': 'Déconnexion',
    'page.account.signedInAs': 'Connecté en tant que',
    'page.account.browseProducts': 'Voir les produits',
    'page.account.errorRequired': 'Veuillez remplir tous les champs obligatoires.',
    'page.account.errorPasswordShort': 'Le mot de passe doit contenir au moins 6 caractères.',
    'page.account.errorPasswordMatch': 'Les mots de passe ne correspondent pas.',
    'page.account.errorGeneric': 'Une erreur est survenue. Réessayez.',
    'page.account.errorInvalidCredentials': 'E-mail ou mot de passe incorrect.',
    'page.account.errorEmailTaken': 'Un compte existe déjà avec cet e-mail.',
    'page.account.agreePolicy': 'J’ai lu et j’accepte',
    'page.account.policiesConsentTitle': 'Obligatoire — acceptez toutes les politiques pour vous inscrire',
    'page.account.errorPoliciesRequired':
      'Veuillez accepter toutes les politiques (expédition, retours, confidentialité et conditions) pour créer votre compte.',
    'page.cart.title': 'Panier',
    'page.cart.empty': 'Votre panier est vide',
    'page.cart.emptyHint': 'Ajoutez un produit pour commencer.',
    'page.cart.continue': 'Voir les produits',
    'page.cart.itemSingular': 'article',
    'page.cart.itemPlural': 'articles',
    'page.cart.productsEyebrow': 'DES PRODUITS',
    'page.cart.productsTitle': 'Continuer à explorer',
    'page.cart.viewAll': 'Tout voir',
    'page.cart.loading': 'Chargement des produits…',
    'page.cart.productsEmpty': 'Rien d’autre à afficher pour le moment.',
    'page.product.moreFromProducts': 'PLUS DE PRODUITS',
    'page.products.title': 'Produits',
    'page.products.hint': 'Touchez une pièce pour voir les détails et l’ajouter au panier.',
    'page.products.loading': 'Chargement des produits…',
    'page.faq.eyebrow': 'Assistance',
    'page.faq.title': 'FAQ',
    'page.faq.subtitle': 'Réponses sur la marque, les tailles et comment nous joindre.',
    'page.faq.fullDocument': 'Lire le document FAQ complet :',
    'legal.back': 'Retour',
    'legal.faq': 'FAQ',
    'legal.shipping': 'Politique d’expédition',
    'legal.returns': 'Politique de retour et d’échange',
    'legal.privacy': 'Politique de confidentialité',
    'legal.terms': 'Conditions d’utilisation',
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
