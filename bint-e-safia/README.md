# BINT E SAFIA — storefront

A responsive, interactive storefront for the Bint e Safia clothing brand, laid out like a Pakistani fashion retailer (pk.khaadi.com was the reference). Plain HTML, CSS and JavaScript with no build step and no dependencies.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve bint-e-safia      # or: python3 -m http.server -d bint-e-safia
```

It deploys as-is to any static host: Netlify, Vercel, GitHub Pages or Cloudflare Pages. Routing uses the URL hash (`#/shop/festive`, `#/product/bs-101`), so the host needs no rewrite rules.

## What's included

| Area | Features |
|---|---|
| Header | Rotating announcement bar, sticky header, mega menus (by type / by fabric / featured piece), search overlay with live results, wishlist and bag counters, mobile slide-out menu |
| Home | Auto-playing hero slider (swipe, dots, pause), category circles, New Arrivals rail with tabs, promo tiles, Shop by Fabric, Bestsellers, brand story, service perks |
| Shop | Category, New In, Sale and search listings; filters for type, fabric, size, colour, price and on-sale; sort; 2 or 3 column grid; active filter chips; load more; shareable filter URLs; filter drawer on mobile |
| Product | Gallery with thumbnails, hover zoom and swipe; size picker with sold-out sizes; size guide; quantity; wishlist; accordions for description, fabric and care, and delivery; related products |
| Bag & checkout | Slide-out bag with quantity steppers and a free-delivery progress bar; checkout with validation (Pakistani mobile numbers, cities), standard or express delivery, COD / card / JazzCash / Easypaisa, discount code `SAFIA10`, order confirmation |
| Pages | Our story, Contact, FAQs, Shipping, Returns & exchange, Store locator |
| Quick view | Modal from any product card |

The bag, wishlist and grid preference are saved in the browser's `localStorage`.

## Customising

- **Products, prices, sizes, cities, stores and delivery fees:** `assets/js/data.js`
- **Colours and fonts:** the tokens at the top of `assets/css/styles.css`
- **Page copy (story, FAQs, policies):** the `PAGES` object in `assets/js/app.js`
- **Announcement bar, footer and social links:** `index.html`

### Product images

Until you have photography, each product is drawn as a garment illustration from its colours and print motif (`buti`, `floral`, `ajrak`, `jaal`, `chevron`, `stripe`). To use real photos, add an `images` array to the product:

```js
P({ id: 'bs-101', name: 'Noor Block-Print Kurta', /* ... */ images: ['images/bs-101-front.jpg', 'images/bs-101-detail.jpg'] })
```

The first image is the main shot; the second shows on hover and as the close-up.

## Before going live

This is a front-end storefront. To take real orders:

1. **Orders and payments:** connect checkout to a backend or platform such as Shopify (Storefront API), WooCommerce or a custom API, and a payment gateway. The submit handler for `#co-form` in `app.js` is where it plugs in. Right now placing an order only shows a confirmation; no payment is taken.
2. **Contact and newsletter forms:** point them at a form service or your email provider. At the moment they validate input and show a message but send nothing.
3. **Replace the placeholder content:** the store addresses, social links, delivery fees, the `SAFIA10` code and the brand story are samples to edit.
