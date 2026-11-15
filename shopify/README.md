# Unify Organica — Shopify store

A complete Online Store 2.0 theme for **Unify Organica** (organic hair oils, shampoos, body wash, hand wash, hand & feet creams and gift sets), plus a product import file.

| Path | What it is |
| --- | --- |
| `unify-organica-theme/` | The theme source (Liquid, JSON templates, CSS, JS, logo and product images) |
| `unify-organica-theme.zip` | Same theme zipped, ready to upload |
| `unify-organica-products.csv` | Your 5 products, each with its own photo plus the lineup photo, description, benefits, how-to-use and SEO text |
| `catalog/products.json` | Product data used to build the CSV |
| `catalog/images/` | Square product photos cut from your lineup image, the lineup photo, and the transparent logo |
| `preview/index.html` | Static render of the homepage (open in a browser) |

## Brand assets

- **Logo:** your exact Unify Organica logo, with the white background removed (`catalog/images/unify-organica-logo.png`). It is built into the theme, so the header, footer, mobile menu and coming-soon page use it automatically. To swap it later, upload a new logo in *Theme settings → Header → Logo image*.
- **Colours** are sampled from the logo: navy `#08264a` (buttons, headings, announcement bar) and leaf green `#1f6b1a` (accents, active tabs).
- **Product photos:** each bottle was cut out of your lineup photo and placed on a matching soft background (1000×1000).

## Products

| Product | Handle | Collection tag | Price (PKR, placeholder) |
| --- | --- | --- | --- |
| Unify Organica Hair Oil 200 ml | `hair-oil` | `hair-care` | 1,200 (was 1,500) |
| Unify Organica Hair Shampoo 200 ml | `hair-shampoo` | `hair-care` | 1,100 |
| Unify Organica Joints Oil 200 ml | `joints-oil` | `joint-care` | 1,500 (was 1,800) |
| Unify Organica Body Wash 200 ml | `body-wash` | `body-care` | 950 |
| Unify Organica Hand Wash 200 ml | `hand-wash` | `body-care` | 650 |

**Set your real prices** — the CSV prices are placeholders.

## Launch in 6 steps

1. **Upload the theme** — Shopify admin → *Online Store → Themes → Add theme → Upload zip file* → `unify-organica-theme.zip` → *Publish*.
2. **Import products** — *Products → Import* → `unify-organica-products.csv`. Photos download automatically from this GitHub repository (it must stay public at import time; after import Shopify keeps its own copy).
3. **Create collections** (*Products → Collections → Create*, type **Automated**, condition *Product tag is equal to …*):

   | Title | Handle | Tag |
   | --- | --- | --- |
   | Hair Care | `hair-care` | `hair-care` |
   | Body Care | `body-care` | `body-care` |
   | Joint Care | `joint-care` | `joint-care` |
   | Bestsellers | `bestsellers` | `bestseller` |

4. **Menus** — *Online Store → Navigation*. Suggested `main-menu`: Hair Oil · Hair Shampoo · Joints Oil · Body Wash · Hand Wash · Shop All · Contact. Suggested `footer`: About us, Contact, Shipping policy, Returns & exchange, Track my order, Privacy policy, Terms.
5. **WhatsApp** — *Theme settings → Social media → WhatsApp number* to show the floating chat button.
6. **Reviews** — replace the sample reviews on the homepage with real ones (and customer photos).

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

- Prices, the "free shipping above Rs 3,000" message and cash on delivery assume a Pakistan store. Change them in the CSV and theme editor if not.
- The homepage reviews are **placeholders** marked "Sample review". Replace them before launch.
- **Joints Oil wording:** the listing says "soothes joint discomfort / eases stiffness / supports easier movement". Pain-relief claims for a topical oil can fall under DRAP's health-product rules; confirm your registration before using stronger medical wording such as "relieves pain".
- The claims strip (Natural oils · Herbal extracts · Gentle care · 200 ml bottles · Cash on delivery) avoids certifications; add "Organic", "Halal" etc. only if certified.
