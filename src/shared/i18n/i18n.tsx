import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Language = 'en' | 'fr'

const STORAGE_KEY = 'social-things:lang'

export type I18nKey =
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
  | 'page.order.tag'
  | 'page.order.title'
  | 'page.order.hint'
  | 'page.order.number'
  | 'page.product.moreFromProducts'
  | 'page.products.title'
  | 'page.products.hint'
  | 'page.products.loading'
  | 'page.products.filterTitle'
  | 'page.products.filterHint'
  | 'page.products.filterNew'
  | 'page.products.filterBest'
  | 'page.products.filterOffers'
  | 'page.products.filterEmpty'
  | 'page.products.wasPrice'
  | 'page.products.nowPrice'
  | 'page.faq.eyebrow'
  | 'page.faq.title'
  | 'page.faq.subtitle'
  | 'page.faq.fullDocument'
  | 'page.account.agreePolicy'
  | 'page.account.policiesConsentTitle'
  | 'page.account.errorPoliciesRequired'
  | 'page.account.signInToShop'
  | 'page.product.signInToBuy'
  | 'page.product.loading'
  | 'page.product.notFound'
  | 'page.product.notFoundHint'
  | 'page.product.selectOption'
  | 'page.product.selectOnLeft'
  | 'page.product.avatar'
  | 'page.product.color'
  | 'page.product.size'
  | 'page.product.quantity'
  | 'page.product.qty'
  | 'page.product.chooseAvatar'
  | 'page.product.chooseColor'
  | 'page.product.chooseSize'
  | 'page.product.chooseQuantity'
  | 'page.product.decreaseQuantity'
  | 'page.product.increaseQuantity'
  | 'page.product.buy'
  | 'page.product.added'
  | 'page.product.photo'
  | 'page.product.avatarMen'
  | 'page.product.avatarWomen'
  | 'page.product.avatarDuo'
  | 'page.product.lookBaggy'
  | 'page.product.lookParachute'
  | 'page.product.lookCargo'
  | 'page.product.lookSeated'
  | 'page.product.lookTogether'
  | 'page.product.dragToTurn'
  | 'page.product.zoomIn'
  | 'page.product.zoomOut'
  | 'page.product.avatarAria'
  | 'page.product.avatarUnavailable'
  | 'page.product.avatarLoading'
  | 'page.product.views'
  | 'page.product.mockup'
  | 'page.product.view3d'
  | 'page.product.teeAria'
  | 'page.product.dragToTurnTee'
  | 'page.product.avatarPicker'
  | 'page.product.sizeHelper'
  | 'page.product.sizeHelperHint'
  | 'page.product.sizeHelperBuild'
  | 'page.product.sizeHelperHeight'
  | 'page.product.sizeHelperWeight'
  | 'page.product.sizeHelperAdvice'
  | 'page.product.sizeHelperClosest'
  | 'page.product.sizeHelperOversize'
  | 'page.product.sizeHelperChoose'
  | 'page.product.sizeHelperLooser'
  | 'page.product.sizeHelperNone'
  | 'page.product.sizeHelperNote'
  | 'page.product.shareLook'
  | 'page.product.shareBusy'
  | 'page.product.shareDone'
  | 'page.product.front'
  | 'page.product.back'
  | 'page.product.sizes'
  | 'page.product.shareText'
  | 'footer.credit3d'
  | 'footer.by'
  | 'legal.back'
  | 'legal.faq'
  | 'legal.shipping'
  | 'legal.returns'
  | 'legal.privacy'
  | 'legal.terms'
  | 'footer.newsletterTitle'
  | 'footer.newsletterHint'
  | 'footer.newsletterPlaceholder'
  | 'footer.newsletterSubmit'
  | 'footer.newsletterDone'
  | 'footer.newsletterError'
  | 'pwa.tag'
  | 'pwa.title'
  | 'pwa.hint'
  | 'pwa.enable'
  | 'pwa.install'
  | 'pwa.later'
  | 'pwa.dismiss'
  | 'page.account.alertsOn'
  | 'page.account.alertsOff'
  | 'page.account.enableAlerts'

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
    'page.gallery.emptyHint': 'Upload shots in the tracker Lookbook (orange, rouge, vert, white).',
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
    'page.account.signInToShop': 'Sign in or create an account to add this to your cart.',
    'page.product.signInToBuy': 'SIGN IN',
    'page.product.loading': 'Loading product…',
    'page.product.notFound': 'Product not found',
    'page.product.notFoundHint': 'This piece may have sold out or moved.',
    'page.product.selectOption': 'Select an option',
    'page.product.selectOnLeft': 'SELECT ON LEFT',
    'page.product.avatar': 'Avatar',
    'page.product.color': 'Color',
    'page.product.size': 'Size',
    'page.product.quantity': 'Quantity',
    'page.product.qty': 'QTY',
    'page.product.chooseAvatar': 'Choose your avatar',
    'page.product.chooseColor': 'Choose your color',
    'page.product.chooseSize': 'Choose your size',
    'page.product.chooseQuantity': 'Choose quantity',
    'page.product.decreaseQuantity': 'Decrease quantity',
    'page.product.increaseQuantity': 'Increase quantity',
    'page.product.buy': 'BUY',
    'page.product.added': 'ADDED',
    'page.product.photo': 'Photo',
    'page.product.avatarMen': 'Men',
    'page.product.avatarWomen': 'Women',
    'page.product.avatarDuo': 'Duo',
    'page.product.lookBaggy': 'Baggy',
    'page.product.lookParachute': 'Parachute',
    'page.product.lookCargo': 'Cargo',
    'page.product.lookSeated': 'Seated',
    'page.product.lookTogether': 'Together',
    'page.product.dragToTurn': 'Drag to turn · double-tap to zoom',
    'page.product.zoomIn': 'Zoom in',
    'page.product.zoomOut': 'Zoom out',
    'page.product.avatarAria': 'T-shirt worn by a mannequin. Drag to turn it, pinch to zoom.',
    'page.product.avatarUnavailable': 'The 3D preview isn’t available on this device.',
    'page.product.avatarLoading': 'Loading avatar…',
    'page.product.views': 'Views',
    'page.product.mockup': 'Mockup',
    'page.product.view3d': '3D',
    'page.product.teeAria': 'T-shirt in 3D. Drag to turn it.',
    'page.product.dragToTurnTee': 'Drag to turn',
    'page.product.avatarPicker': 'Choose a mannequin',
    'page.product.sizeHelper': 'Which size for me?',
    'page.product.sizeHelperHint': 'Your height and weight give a size among this piece’s.',
    'page.product.sizeHelperBuild': 'Build',
    'page.product.sizeHelperHeight': 'Height (cm)',
    'page.product.sizeHelperWeight': 'Weight (kg)',
    'page.product.sizeHelperAdvice': 'We suggest',
    'page.product.sizeHelperClosest': 'the closest available',
    'page.product.sizeHelperOversize': 'It’s cut oversize, so it already falls loose.',
    'page.product.sizeHelperChoose': 'Choose',
    'page.product.sizeHelperLooser': 'Looser:',
    'page.product.sizeHelperNone': 'No size advice for this piece’s sizes.',
    'page.product.sizeHelperNote': 'Indicative advice, from common size charts.',
    'page.product.shareLook': 'Share this look',
    'page.product.shareBusy': 'Preparing…',
    'page.product.shareDone': 'Ready ✓',
    'page.product.front': 'FRONT',
    'page.product.back': 'BACK',
    'page.product.sizes': 'Sizes',
    'page.product.shareText': 'on SOCIAL THINGS',
    'footer.credit3d': '3D t-shirt model:',
    'footer.by': 'by',
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
    'page.order.tag': 'LOCKED IN',
    'page.order.title': 'Order confirmed',
    'page.order.hint': 'Your order is saved and stock was taken from tracker inventory.',
    'page.order.number': 'Order',
    'page.product.moreFromProducts': 'MORE FROM THE PRODUCTS',
    'page.products.title': 'Products',
    'page.products.hint': 'Tap a piece to view details and add to cart.',
    'page.products.loading': 'Loading products…',
    'page.products.filterTitle': 'Filter products',
    'page.products.filterHint': 'New pieces, best-sellers or what’s on offer.',
    'page.products.filterNew': 'New',
    'page.products.filterBest': 'Best-sellers',
    'page.products.filterOffers': 'Offers',
    'page.products.filterEmpty': 'Nothing here right now.',
    'page.products.wasPrice': 'Was',
    'page.products.nowPrice': 'now',
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
    'footer.newsletterTitle': 'Join the list',
    'footer.newsletterHint': 'Drops and restocks first.',
    'footer.newsletterPlaceholder': 'Email',
    'footer.newsletterSubmit': 'Subscribe',
    'footer.newsletterDone': 'You are on the list.',
    'footer.newsletterError': 'Could not subscribe. Try again.',
    'pwa.tag': 'Install',
    'pwa.title': 'Keep the drop on you',
    'pwa.hint': 'Join the list, turn on alerts, and add SOCIAL THINGS to your home screen.',
    'pwa.enable': 'Enable alerts',
    'pwa.install': 'Add to home screen',
    'pwa.later': 'Later',
    'pwa.dismiss': 'No thanks',
    'page.account.alertsOn': 'Drop alerts are on.',
    'page.account.alertsOff': 'Drop alerts are off on this device.',
    'page.account.enableAlerts': 'Enable alerts',
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
    'page.gallery.emptyHint': 'Ajoutez les photos dans le Lookbook du tracker (orange, rouge, vert, white).',
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
    'page.account.signInToShop': 'Connectez-vous ou créez un compte pour ajouter cet article au panier.',
    'page.product.signInToBuy': 'CONNEXION',
    'page.product.loading': 'Chargement du produit…',
    'page.product.notFound': 'Produit introuvable',
    'page.product.notFoundHint': 'Cette pièce est peut-être épuisée ou a été déplacée.',
    'page.product.selectOption': 'Choisissez une option',
    'page.product.selectOnLeft': 'CHOISISSEZ À GAUCHE',
    'page.product.avatar': 'Avatar',
    'page.product.color': 'Couleur',
    'page.product.size': 'Taille',
    'page.product.quantity': 'Quantité',
    'page.product.qty': 'QTÉ',
    'page.product.chooseAvatar': 'Choisissez votre avatar',
    'page.product.chooseColor': 'Choisissez votre couleur',
    'page.product.chooseSize': 'Choisissez votre taille',
    'page.product.chooseQuantity': 'Choisissez la quantité',
    'page.product.decreaseQuantity': 'Diminuer la quantité',
    'page.product.increaseQuantity': 'Augmenter la quantité',
    'page.product.buy': 'ACHETER',
    'page.product.added': 'AJOUTÉ',
    'page.product.photo': 'Photo',
    'page.product.avatarMen': 'Homme',
    'page.product.avatarWomen': 'Femme',
    'page.product.avatarDuo': 'Duo',
    'page.product.lookBaggy': 'Baggy',
    'page.product.lookParachute': 'Parachute',
    'page.product.lookCargo': 'Cargo',
    'page.product.lookSeated': 'Assis',
    'page.product.lookTogether': 'Ensemble',
    'page.product.dragToTurn': 'Faites glisser pour tourner · touchez deux fois pour zoomer',
    'page.product.zoomIn': 'Zoomer',
    'page.product.zoomOut': 'Dézoomer',
    'page.product.avatarAria': 'T-shirt porté par un mannequin. Faites glisser pour le tourner, pincez pour zoomer.',
    'page.product.avatarUnavailable': 'L’aperçu 3D n’est pas disponible sur cet appareil.',
    'page.product.avatarLoading': 'Chargement de l’avatar…',
    'page.product.views': 'Vues',
    'page.product.mockup': 'Maquette',
    'page.product.view3d': '3D',
    'page.product.teeAria': 'T-shirt en 3D. Faites glisser pour le tourner.',
    'page.product.dragToTurnTee': 'Faites glisser pour tourner',
    'page.product.avatarPicker': 'Choisir un mannequin',
    'page.product.sizeHelper': 'Quelle taille pour moi ?',
    'page.product.sizeHelperHint': 'Votre hauteur et votre poids donnent une taille parmi celles de cette pièce.',
    'page.product.sizeHelperBuild': 'Morphologie',
    'page.product.sizeHelperHeight': 'Hauteur (cm)',
    'page.product.sizeHelperWeight': 'Poids (kg)',
    'page.product.sizeHelperAdvice': 'Nous vous conseillons le',
    'page.product.sizeHelperClosest': 'la plus proche disponible',
    'page.product.sizeHelperOversize': 'Coupe oversize : il tombe déjà large.',
    'page.product.sizeHelperChoose': 'Choisir le',
    'page.product.sizeHelperLooser': 'Plus ample :',
    'page.product.sizeHelperNone': 'Pas de conseil pour les tailles de cette pièce.',
    'page.product.sizeHelperNote': 'Conseil indicatif, d’après des guides de tailles courants.',
    'page.product.shareLook': 'Partager ce look',
    'page.product.shareBusy': 'Préparation…',
    'page.product.shareDone': 'Prêt ✓',
    'page.product.front': 'DEVANT',
    'page.product.back': 'DOS',
    'page.product.sizes': 'Tailles',
    'page.product.shareText': 'sur SOCIAL THINGS',
    'footer.credit3d': 'Modèle 3D du t-shirt :',
    'footer.by': 'par',
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
    'page.order.tag': 'VALIDÉ',
    'page.order.title': 'Commande confirmée',
    'page.order.hint': 'Votre commande est enregistrée et le stock a été retiré de tracker-social.',
    'page.order.number': 'Commande',
    'page.product.moreFromProducts': 'PLUS DE PRODUITS',
    'page.products.title': 'Produits',
    'page.products.hint': 'Touchez une pièce pour voir les détails et l’ajouter au panier.',
    'page.products.loading': 'Chargement des produits…',
    'page.products.filterTitle': 'Filtrer les produits',
    'page.products.filterHint': 'Nouveautés, meilleures ventes ou offres du moment.',
    'page.products.filterNew': 'Nouveautés',
    'page.products.filterBest': 'Meilleures ventes',
    'page.products.filterOffers': 'Offres',
    'page.products.filterEmpty': 'Rien pour le moment.',
    'page.products.wasPrice': 'Avant',
    'page.products.nowPrice': 'maintenant',
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
    'footer.newsletterTitle': 'Rejoindre la liste',
    'footer.newsletterHint': 'Drops et restocks en premier.',
    'footer.newsletterPlaceholder': 'E-mail',
    'footer.newsletterSubmit': 'S’inscrire',
    'footer.newsletterDone': 'Vous êtes sur la liste.',
    'footer.newsletterError': 'Inscription impossible. Réessayez.',
    'pwa.tag': 'Installer',
    'pwa.title': 'Gardez le drop sur vous',
    'pwa.hint': 'Rejoignez la liste, activez les alertes et ajoutez SOCIAL THINGS à l’accueil.',
    'pwa.enable': 'Activer les alertes',
    'pwa.install': 'Ajouter à l’accueil',
    'pwa.later': 'Plus tard',
    'pwa.dismiss': 'Non merci',
    'page.account.alertsOn': 'Les alertes drop sont activées.',
    'page.account.alertsOff': 'Les alertes drop sont désactivées sur cet appareil.',
    'page.account.enableAlerts': 'Activer les alertes',
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
