# Unify Organica — Shopify store

A complete Online Store 2.0 theme for **Unify Organica** (organic hair oils, shampoos, body wash, hand wash, hand & feet creams and gift sets), plus a product import file.

| Path | What it is |
| --- | --- |
| `unify-organica-theme/` | The theme source (Liquid, JSON templates, CSS, JS) |
| `unify-organica-theme.zip` | Same theme zipped, ready to upload |
| `unify-organica-products.csv` | 15 products across six categories, in Shopify's product CSV format |
| `preview/index.html` | Static render of the homepage (open in a browser) |

## Launch in 6 steps

1. **Upload the theme** — Shopify admin → *Online Store → Themes → Add theme → Upload zip file* → choose `unify-organica-theme.zip` → *Publish* (or *Customize* first).
2. **Import products** — *Products → Import* → choose `unify-organica-products.csv`. Prices are in your store currency; edit them before or after import.
3. **Create collections** (*Products → Collections → Create*, type **Automated**). Use exactly these handles so the homepage connects automatically:

   | Title | Handle | Condition |
   | --- | --- | --- |
   | Hair Oils | `hair-oils` | Product type is equal to `Hair Oil` |
   | Shampoos | `shampoos` | Product type is equal to `Shampoo` |
   | Body Wash | `body-wash` | Product type is equal to `Body Wash` |
   | Hand Wash | `hand-wash` | Product type is equal to `Hand Wash` |
   | Hand & Feet Care | `hand-feet-care` | Product type is equal to `Hand & Feet Cream` |
   | Gift Sets | `gift-sets` | Product type is equal to `Gift Set` |
   | Bestsellers | `bestsellers` | Product tag is equal to `bestseller` |

4. **Menus** — *Online Store → Navigation*: fill `main-menu` (e.g. Shop all, Hair care, Body care, Gift sets, Our story, Journal) and `footer` (Contact, Shipping, Returns, FAQ). Create a page using template `page.contact` for the contact form.
5. **Photos** — add product photos when you have them. Until then every product, collection tile and empty cart shows an illustrated Unify Organica pack (dropper, pump, tube, jar or gift box) chosen from the product type.
6. **Customize** — in the theme editor: colours, fonts, free-shipping threshold (Theme settings → Cart), social links, and every homepage text/section (drag to reorder, add or remove).

## What's in the theme

- Homepage: scrolling announcement bar, sticky header, hero with illustrated products and rotating "100% organic" seal, trust marquee, shop-by-category tiles, bestsellers grid, ingredient story, ritual steps, gift-box promo, testimonials, brand story, newsletter (10% off signup).
- Slide-out cart drawer with free-shipping progress bar and quantity controls (AJAX, no page reload).
- Product page: gallery, size pills, quantity, dynamic checkout buttons, benefit badges, collapsible tabs (connect "Ingredients" to a metafield), "Pairs beautifully with" recommendations.
- Collection pages with sorting and pagination, search, cart page with gift note, blog, contact, 404, password/coming-soon page with launch-list signup, customer account pages.
- Responsive to phone width, respects reduced-motion, passes Shopify Theme Check with 0 offenses.

## Assumptions to check

- Copy, prices (PKR-scale numbers), the "free shipping over 3,000" message and "cash on delivery" assume a Pakistan-based store. Change them in the theme editor / CSV if not.
- Testimonials are **sample text**. Replace them with real customer reviews before launch.
- "Certified organic" / "dermatologically tested" claims should only stay if you hold those certifications.
