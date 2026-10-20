# BINT E SAFIA — storefront

A responsive, interactive storefront for the Bint e Safia clothing brand, built to the approved homepage mockup (blush and plum, split navigation around a centred calligraphic logo), with pk.khaadi.com as the reference for shop structure. Plain HTML, CSS and JavaScript with no build step and no dependencies.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve bint-e-safia      # or: python3 -m http.server -d bint-e-safia
```

It deploys as-is to any static host: Netlify, Vercel, GitHub Pages or Cloudflare Pages. Routing uses the URL hash (`#/shop/formal`, `#/product/bs-101`), so the host needs no rewrite rules.

## What's included

| Area | Features |
|---|---|
| Header | Plum announcement bar, sticky header with split navigation and centred logo, Collections mega menu with category photos, search overlay with live results, wishlist and bag counters, mobile slide-out menu |
| Home | Hero slideshow with progress counter (swipe, pause), arched category cards, Fresh Arrivals and Bestsellers rails, Festive Edit banner, Stories in Style lookbook, service perks, reviews, newsletter |
| Shop | Category, New In, Sale and search listings; filters for type, fabric, size, colour, price and on-sale; sort; 2 or 3 column grid; active filter chips; load more; shareable filter URLs; filter drawer on mobile |
| Product | Gallery with thumbnails, hover zoom and swipe; size picker with sold-out sizes; size guide; quantity; wishlist; accordions for description, fabric and care, and delivery; related products |
| Bag & checkout | Slide-out bag with quantity steppers and a free-delivery progress bar; checkout with validation (Pakistani mobile numbers, cities), standard or express delivery, COD / card / JazzCash / Easypaisa, discount code `SAFIA10`, order confirmation |
| Pages | Our story, Contact, Account sign-in, FAQs, Shipping, Returns & exchanges, Care guide, Store locator |
| Quick view | Modal from any product card |

The bag, wishlist and grid preference are saved in the browser's `localStorage`.

## Customising

- **Products, prices, sizes, cities, stores and delivery fees:** `assets/js/data.js`
- **Colours and fonts:** the tokens at the top of `assets/css/styles.css`
- **Page copy (story, FAQs, policies):** the `PAGES` object in `assets/js/app.js`
- **Announcement bar, footer and social links:** `index.html`

### Photos

The photos in `assets/img/` are **placeholders cut from the approved homepage mockup** by `tools/extract_mockup_images.py` (crop, remove baked-in UI, upscale, sharpen; the logo and florals are lifted onto transparent PNGs). They come from a 941px-wide image, so they look soft on large screens. Replace them with shoot photography before launch:

- Keep the same file names in `assets/img/`, or point each product's `images` array in `data.js` at new files.
- The first image is the main shot; the second shows on hover and as an extra gallery view. With one image, the product page shows a zoomed close-up as the second view.
- Recommended sizes: products 1200×1200 or larger, hero 2400×1100, category tiles 800×600.

Do not use photos from other brands' websites; they are copyrighted and show their products, not yours.

### Reviews

The "Real Stories, Real Love" reviews in `data.js` are sample text and show a visible "sample" note. Replace them with real, verified customer reviews and set `REVIEWS.sample` to `false`.

## Before going live

This is a front-end storefront. To take real orders:

1. **Orders and payments:** connect checkout to a backend or platform such as Shopify (Storefront API), WooCommerce or a custom API, and a payment gateway. The submit handler for `#co-form` in `app.js` is where it plugs in. Right now placing an order only shows a confirmation; no payment is taken.
2. **Contact and newsletter forms:** point them at a form service or your email provider. At the moment they validate input and show a message but send nothing.
3. **Replace the placeholder content:** the store addresses, social links, delivery fees, the `SAFIA10` code, the reviews and the brand story are samples to edit.
