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
- **Colours:** navy `#08264a` (menu strip) and leaf green `#1f6b1a` (buttons) are sampled from the logo; prices and sale tags are red `#c21010`; announcement bar and footer are near-black. All are editable in *Theme settings → Colours*.
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
6. **Reviews** — install a reviews app (e.g. Judge.me). Stars and review counts appear on cards and product pages automatically once products have reviews.
7. **Footer contact** — *Customize → Footer → Get in touch*: add phone/WhatsApp, email and address.

## What's in the theme

Layout and feel follow a modern Pakistani retail store pattern (Inter type, bold uppercase titles, grey rounded product cards, red prices). Branding, products, photos and copy are Unify Organica's own.

**Homepage, top to bottom**
1. Black announcement bar (rotating messages).
2. Header: pill search on the left, your logo centred, account + CART on the right; navy menu strip with drop-down arrows (menu items containing "sale" turn red).
3. Full-width banner slider (2 built-in banners made from your bottles; upload your own 2400×900 / 1000×1150 to replace).
4. **Top collections** — rounded photo tiles with labels.
5. **Our best sellers** — underline tabs (Hair care · Body care · Joint care · All products) with a blurred "Discover all" tile.
6. **Shop all** row, then **Shop the look** tall photo tiles with a product chip, then Hair care / Body care / Joint care rows ("View all" on the right).
7. Wide promo strip ("Natural care made for *every day*").
8. 2×2 category banners in a large serif display font.
9. Dark "Don't know where to start?" block (buttons: shop all, ask on WhatsApp).
10. Trust icons (cash on delivery, natural ingredients, 200 ml, nationwide delivery, WhatsApp support).
11. SEO text about each product, then a black footer with newsletter, link columns, contact and payment icons.

**Product cards:** name, short tagline, star rating + review count (only once a reviews app such as Judge.me adds reviews), bold red price with struck-through old price, red SALE tag, quick "+" add to cart.

**Product page:** vertical thumbnails, large image, bold uppercase title, red price, stars (when reviews exist), quantity, full-width Add to cart and Buy now, perks list (COD, free delivery, natural ingredients, WhatsApp), collapsible How to use / Ingredients / Shipping tabs, "Pairs beautifully with".

Also: slide-out cart with free-shipping progress bar, floating WhatsApp button, collection pages with sorting, search, blog, contact, coming-soon page, customer accounts.

## Assumptions to check

- Prices, the "free shipping above Rs 3,000" message and cash on delivery assume a Pakistan store. Change them in the CSV and theme editor if not.
- **Joints Oil wording:** the listing says "soothes joint discomfort / eases stiffness / supports easier movement". Pain-relief claims for a topical oil can fall under DRAP's health-product rules; confirm your registration before using stronger medical wording such as "relieves pain".
- The claims strip (Natural oils · Herbal extracts · Gentle care · 200 ml bottles · Cash on delivery) avoids certifications; add "Organic", "Halal" etc. only if certified.
