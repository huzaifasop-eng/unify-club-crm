# AFSHEENS Bakery website

A single-file website: open `index.html` in any browser, no installation needed.

Pages (all inside the one file): Home, Our Menu, Place an Order, Reviews, Contact Us.

## Customise
Everything you need to change is in the `CONFIG` block and the `PRODUCTS` list near the top of the `<script>` in `index.html`:
phone, WhatsApp number, email, Instagram/Facebook links, address, map location, opening hours, delivery fee, prices and items.

## Notes
- The cart, orders, reviews, and contact messages are saved in the visitor's browser (localStorage). They are not sent to you.
  After ordering, the customer gets a "Send on WhatsApp" button that sends you the full order.
- The photos, fonts and map need an internet connection. When offline, each photo is replaced with a pastel illustration and system fonts are used.
