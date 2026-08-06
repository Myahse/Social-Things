import type { Language } from '@/shared/i18n/i18n'

export type FaqItem = { q: string; a: string }

export const FAQ_ITEMS: Record<Language, FaqItem[]> = {
  en: [
    {
      q: 'Where is Social Thing based?',
      a: 'We are based and operate out of Minneapolis, Minnesota, USA.',
    },
    {
      q: 'Where are your garments manufactured?',
      a: 'All our garments are designed by our owner and designer Richard Yabasette Abouya. We work with premium manufacturers globally to bring our streetwear collections to life.',
    },
    {
      q: 'How do your pieces fit?',
      a: 'Our streetwear pieces are typically designed with an oversized or relaxed, true-to-size streetwear fit. Check the specific "Sizing Guide" link on each product page for exact measurements.',
    },
    {
      q: 'How can I contact customer support?',
      a: 'Hit us up at support@socialthing.com with any questions about your order and our customer service will gladly answer any questions you may have.',
    },
  ],
  fr: [
    {
      q: 'Où est basée Social Thing ?',
      a: 'Nous sommes basés et opérons depuis Minneapolis, Minnesota, États-Unis.',
    },
    {
      q: 'Où sont fabriqués vos vêtements ?',
      a: 'Tous nos vêtements sont conçus par notre propriétaire et designer Richard Yabasette Abouya. Nous travaillons avec des manufacturiers premium dans le monde entier pour donner vie à nos collections streetwear.',
    },
    {
      q: 'Comment taillent vos pièces ?',
      a: 'Nos pièces streetwear sont généralement conçues avec une coupe oversize ou décontractée, fidèle à la taille streetwear. Consultez le lien « Guide des tailles » sur chaque fiche produit pour les mesures exactes.',
    },
    {
      q: 'Comment contacter le service client ?',
      a: 'Écrivez-nous à support@socialthing.com pour toute question sur votre commande — notre équipe se fera un plaisir de vous répondre.',
    },
  ],
}
