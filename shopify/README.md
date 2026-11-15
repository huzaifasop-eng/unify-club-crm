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

Layout and feel follow a clean, high-density beauty-store style (white background, Poppins, teal accent, red sale prices). All branding, copy and artwork are Unify Organica's own.

- **Header:** teal announcement bar (messages rotate), centred spaced-letter UNIFY ORGANICA wordmark, underline search box, account and cart, all-caps category menu underneath with dropdowns. Any menu item containing "sale" turns red.
- **Homepage:** full-width banner slider (upload your own banners or use the illustrated ones), scrolling claims strip (Organic · Natural · Halal · Sulphate free · Paraben free · Cruelty free; each claim opens an explanation pop-up), tagline, "Shop by category" outlined buttons, tabbed product carousel, Bestsellers and Bundles carousels, customer photo reviews carousel, journal posts.
- **Product cards:** bordered card, red "Sale X%" badge, struck-through price with red sale price, outlined "Add to cart" button (adds instantly; shows "Choose options" for products with sizes and "Notify me" when sold out).
- **Floating WhatsApp button:** set your number in *Theme settings → Social media*.
- Slide-out cart with free-shipping progress bar; product page with sale badge, size buttons, quantity, buy-now button, share link, collapsible Benefits / How to use / Ingredients / Shipping tabs and "Pairs beautifully with" recommendations.
- Collection pages with sorting, search, cart page with gift note, blog, contact, 404, coming-soon page and customer accounts.
- The earlier story-style sections (Hero, Ingredient story, Ritual steps, Image with text, Newsletter, Rich text) are still available under *Add section* in the theme editor.
- Works at phone width and passes Shopify Theme Check with 0 offenses.

## Assumptions to check

- Copy, prices (PKR-scale numbers), the "free shipping above Rs 3,000" message and "cash on delivery" assume a Pakistan-based store. Change them in the theme editor / CSV if not.
- The customer reviews section holds **placeholder text** marked "Sample review". Replace with real reviews and customer photos before launch.
- Halal / organic / cruelty-free claims (and their pop-up explanations) should only stay if they are true and certified for your products.
- "Certified organic" / "dermatologically tested" claims should only stay if you hold those certifications.
