/**
 * Products on offer, by slug (the part of the URL after /product/).
 *
 * `was` is the regular price, shown struck through next to the product's price. The product's
 * price itself (the one charged at checkout) still comes from the tracker inventory, so set the
 * offer price there and list the regular price here. Entries whose `was` is not higher than the
 * current price are ignored.
 *
 * Example: `l539: { was: 70 },`
 */
export const PRODUCT_OFFERS: Record<string, { was: number }> = {}
