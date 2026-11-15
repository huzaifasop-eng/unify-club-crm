# Unify Organica — Shopify store

A complete Online Store 2.0 theme for **Unify Organica** (organic hair oils, shampoos, body wash, hand wash, hand & feet creams and gift sets), plus a product import file.

| Path | What it is |
| --- | --- |
| `unify-organica-theme/` | The theme source (Liquid, JSON templates, CSS, JS, packshot assets) |
| `unify-organica-theme.zip` | Same theme zipped, ready to upload |
| `unify-organica-products.csv` | **32 products / 38 variants** with prices, sale prices, descriptions, SEO text, tags and product photos |
| `catalog/products.json` | The catalogue source: names, label text, ingredients, sizes, prices |
| `catalog/images/` | Branded 1600×1600 packshot for every product |
| `catalog/render-packshots.cjs` | Re-renders the packshots after you edit `products.json` |
| `preview/index.html` | Static render of the homepage (open in a browser) |

## Brand & packaging system

Every pack carries the same label structure: leaf monogram → UNIFY ORGANICA → product name → descriptor → key ingredients → size → a colour band reading *Organic · Halal · Cruelty free*. Each line has its own colour so shelves read at a glance:

| Line | Pack | Colour |
| --- | --- | --- |
| Hair oils & serums | Amber glass dropper, gold collar | Amber / honey |
| Shampoos & conditioners | Pump bottle, tube, jar | Sage, aqua, plum |
| Body wash & body care | Pump bottle, jar, lip pot | Terracotta, citrus, rose, charcoal, cocoa |
| Hand wash | Pump bottle | Teal, lavender, lemongrass |
| Hand & feet creams | Standing tube | Cream, mint, rose, saffron |
| Handmade soaps | Kraft carton with label band | Kraft + green / cream / black |
| Gift sets | Gift box with gold ribbon | Forest green, amber, teal |

## Launch in 6 steps

1. **Upload the theme** — Shopify admin → *Online Store → Themes → Add theme → Upload zip file* → `unify-organica-theme.zip` → *Publish*.
2. **Import products** — *Products → Import* → `unify-organica-products.csv`. Photos download automatically from this GitHub repository (it must stay public, or upload the files in `catalog/images/` to each product instead).
3. **Create collections** (*Products → Collections → Create*, type **Automated**, condition *Product tag is equal to …*). Use these handles so the homepage connects automatically:

   | Title | Handle | Tag |
   | --- | --- | --- |
   | Hair Oils | `hair-oils` | `hair-oils` |
   | Shampoos & Conditioners | `shampoos` | `shampoos` |
   | Body Wash | `body-wash` | `body-wash` |
   | Body Care | `body-care` | `body-care` |
   | Hand Wash | `hand-wash` | `hand-wash` |
   | Hand & Feet Care | `hand-feet-care` | `hand-feet-care` |
   | Handmade Soaps | `soaps` | `soaps` |
   | Gift Sets | `gift-sets` | `gift-sets` |
   | Bestsellers | `bestsellers` | `bestseller` |
   | New Arrivals | `new-arrivals` | `new` |
   | Men | `men` | `men` |

4. **Menus** — *Online Store → Navigation*. Suggested `main-menu`: Sale · New Arrivals · Hair Oils · Shampoos · Body Wash · Body Care · Hand Wash · Hand & Feet · Soaps · Gift Sets · Men. Suggested `footer`: About us, Contact, Shipping policy, Returns & exchange, Track my order, FAQs, Privacy policy, Terms. Create a page with template `page.contact` for the contact form.
5. **Your own photos (optional)** — when you shoot real product photos, add them to each product; they replace the rendered packshot automatically.
6. **Customize** — theme editor: banner slides (upload your own or keep the packshot banners), colours, WhatsApp number, free-shipping threshold, social links.

### Editing products or labels later

Edit `catalog/products.json` (name, descriptor, ingredients, sizes, prices), then from the repository root run `node shopify/catalog/render-packshots.cjs` to redraw every label. The CSV is generated from the same file.

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

- Prices are a sensible PKR price ladder, not costed — check them against your margins. Copy, prices, the "free shipping above Rs 3,000" message and "cash on delivery" assume a Pakistan-based store. Change them in the theme editor / CSV if not.
- The customer reviews section holds **placeholder text** marked "Sample review". Replace with real reviews and customer photos before launch.
- Ingredient lists on the labels are **headline actives only**, not full INCI declarations. Your printed packaging needs the full ingredient list, batch, expiry and manufacturer details required by DRAP/local rules.
- Halal / organic / cruelty-free claims (and their pop-up explanations) should only stay if they are true and certified for your products.
- "Certified organic" / "dermatologically tested" claims should only stay if you hold those certifications.
