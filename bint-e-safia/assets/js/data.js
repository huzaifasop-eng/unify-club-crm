/* BINT E SAFIA — catalogue and site content.
 * Edit this file to change products, prices, categories and copy.
 * Images live in assets/img/. The current photos are placeholders cut from the approved mockup
 * (see tools/extract_mockup_images.py); swap in shoot photography with the same file names or new paths. */
window.BES_DATA = (() => {
  const IMG = 'assets/img/';

  const CATEGORIES = [
    { slug: 'ready-to-wear', name: 'Ready to Wear', tagline: 'Effortless Elegance', blurb: 'Stitched suits and kurtas, ready the day they arrive.', image: IMG + 'cat-ready-to-wear.jpg' },
    { slug: 'unstitched', name: 'Unstitched', tagline: 'Design Your Story', blurb: 'Embroidered fabric sets for your own tailor’s cut.', image: IMG + 'cat-unstitched.jpg' },
    { slug: 'formal', name: 'Formal Wear', tagline: 'For Special Moments', blurb: 'Organza, chiffon and silk for mehndi, baraat and walima.', image: IMG + 'cat-formal.jpg' },
    { slug: 'casual', name: 'Casual Wear', tagline: 'Everyday Grace', blurb: 'Printed lawn and soft cottons for every day of the week.', image: IMG + 'cat-casual.jpg' },
    { slug: 'accessories', name: 'Accessories', tagline: 'The Finishing Touch', blurb: 'Clutches and dupattas to complete the look.', image: IMG + 'cat-accessories.jpg' }
  ];
  const SALE_TILE = { slug: 'sale', name: 'Sale', tagline: 'Loved Styles for Less', image: IMG + 'cat-sale.jpg' };

  const COLORS = {
    Pink: '#D9AFAA', Plum: '#5E1F3D', Ivory: '#F1E6D8', Sage: '#9DAA92', Red: '#9E1B2E', Lilac: '#C8B0D6',
    Green: '#6F7F4F', Navy: '#1F2B4D', Black: '#1E1A1C', Gold: '#C9A866'
  };

  const FABRIC_NOTES = {
    Lawn: 'Fine, breathable cotton lawn with a soft drape. Light enough for warm afternoons.',
    Cambric: 'Smooth, mid-weight cotton that sits between lawn and khaddar. An all-season staple.',
    Organza: 'Sheer, crisp organza that holds embroidery beautifully. Lined where needed.',
    Chiffon: 'Weightless chiffon with a fluid drape, finished with a matching inner slip.',
    'Raw Silk': 'Raw silk with a subtle nub and a soft lustre. Structured yet comfortable.',
    Embellished: 'Hand-finished beadwork and pearls on a structured frame.'
  };

  const CARE = {
    default: ['Gentle hand wash or dry clean', 'Wash dark colours separately', 'Do not bleach or tumble dry', 'Iron on reverse at medium heat'],
    delicate: ['Dry clean only', 'Store folded in a muslin bag', 'Steam on low; keep iron off embroidery']
  };

  const P = (o) => ({ sale: null, isNew: false, best: false, pieces: 1, ...o, images: o.images.map((f) => IMG + f) });

  const PRODUCTS = [
    P({ id: 'bs-101', name: 'Rosé Whisper', type: 'Embroidered Lawn Suit', cat: 'ready-to-wear', sub: '3 Piece', pieces: 3, fabric: 'Lawn', price: 8500, color: 'Pink', swatches: ['#C9A3A0', '#5B1830', '#E3B9A8'], isNew: true, collection: 'Summer Bloom', images: ['rose-whisper.jpg', 'cat-ready-to-wear.jpg'], desc: 'Blush lawn shirt with tonal thread embroidery down the front, paired with straight trousers and a sheer printed dupatta.' }),
    P({ id: 'bs-102', name: 'Plum Aura', type: 'Embroidered Silk Suit', cat: 'formal', sub: '3 Piece', pieces: 3, fabric: 'Raw Silk', price: 12500, color: 'Plum', swatches: ['#7A4466', '#3B1530', '#F1E3D6'], isNew: true, collection: 'The Festive Edit', images: ['plum-aura.jpg', 'look-1.jpg'], desc: 'Deep plum raw silk with antique-gold zari on the neckline and a scattered motif dupatta.' }),
    P({ id: 'bs-103', name: 'Ivory Bloom', type: 'Printed Lawn Suit', cat: 'casual', sub: '3 Piece', pieces: 3, fabric: 'Lawn', price: 6950, color: 'Ivory', swatches: ['#BFA79A', '#8E1E2A', '#F3EADF'], isNew: true, collection: 'Summer Bloom', images: ['ivory-bloom.jpg', 'look-3.jpg'], desc: 'Soft ivory lawn with a delicate gold floral print and a matching printed dupatta.' }),
    P({ id: 'bs-104', name: 'Sage Noori', type: 'Embroidered Organza Suit', cat: 'formal', sub: '3 Piece', pieces: 3, fabric: 'Organza', price: 14500, color: 'Sage', swatches: ['#A9B19C', '#7E8E78', '#EDE0D2'], isNew: true, collection: 'The Festive Edit', images: ['sage-noori.jpg', 'look-4.jpg', 'cat-casual.jpg'], desc: 'Sage organza with pastel floral embroidery, a lined slip and an organza dupatta with an embroidered border.' }),
    P({ id: 'bs-105', name: 'Rubi Grace', type: 'Embroidered Chiffon Suit', cat: 'formal', sub: '3 Piece', pieces: 3, fabric: 'Chiffon', price: 13000, color: 'Red', swatches: ['#D7B8B4', '#4C4E57', '#9E1B2E'], best: true, collection: 'The Festive Edit', images: ['rubi-grace.jpg'], desc: 'Ruby chiffon with gold zari embroidery and a heavily bordered dupatta, made for the wedding season.' }),
    P({ id: 'bs-106', name: 'Lilac Dreams', type: 'Embroidered Lawn Suit', cat: 'ready-to-wear', sub: '3 Piece', pieces: 3, fabric: 'Lawn', price: 8500, color: 'Lilac', swatches: ['#E2CBD6', '#1C1530', '#E8C1B8'], isNew: true, collection: 'Summer Bloom', images: ['lilac-dreams.jpg'], desc: 'Lilac lawn with gold-thread sprigs, straight trousers and a sheer, lightly embroidered dupatta.' }),
    P({ id: 'bs-107', name: 'Mehfil', type: 'Embroidered Lawn Suit', cat: 'unstitched', sub: '3 Piece', pieces: 3, fabric: 'Lawn', price: 8500, color: 'Plum', swatches: ['#6B2B4A', '#8E6A5A', '#EFD9CC'], best: true, collection: 'Summer Bloom', images: ['mehfil.jpg', 'cat-unstitched.jpg'], desc: 'Unstitched: embroidered lawn front (1.25 m), dyed back and sleeves, cambric trousers (2.5 m) and a printed chiffon dupatta (2.5 m).' }),
    P({ id: 'bs-108', name: 'Zarreen', type: 'Embroidered Shirt & Dupatta', cat: 'unstitched', sub: '2 Piece', pieces: 2, fabric: 'Cambric', price: 11000, color: 'Green', swatches: ['#5E6B3E', '#A57E9A', '#E9D3C3'], best: true, collection: 'The Festive Edit', images: ['zarreen.jpg'], desc: 'Unstitched: olive cambric shirt with gold embroidery (3 m) and a printed organza dupatta (2.5 m).' }),
    P({ id: 'bs-109', name: 'Gulbahar', type: 'Printed Lawn Suit', cat: 'casual', sub: '3 Piece', pieces: 3, fabric: 'Lawn', price: 6950, sale: 5560, color: 'Ivory', swatches: ['#E1CDBA', '#B5574E', '#EFE3D7'], best: true, collection: 'Summer Bloom', images: ['gulbahar.jpg', 'cat-formal.jpg'], desc: 'Ivory lawn with a red and green floral print border, matching trousers and a printed dupatta.' }),
    P({ id: 'bs-110', name: 'Sahar', type: 'Embroidered Silk Suit', cat: 'formal', sub: '3 Piece', pieces: 3, fabric: 'Raw Silk', price: 12500, color: 'Navy', swatches: ['#1F2B4D', '#3C2230', '#D9C3AF'], best: true, collection: 'The Festive Edit', images: ['sahar.jpg'], desc: 'Midnight navy raw silk with a gold zardozi yoke and matching straight trousers.' }),
    P({ id: 'bs-111', name: 'Noir', type: 'Embroidered Lawn Suit', cat: 'ready-to-wear', sub: '3 Piece', pieces: 3, fabric: 'Lawn', price: 9500, sale: 7600, color: 'Black', swatches: ['#1E1A1C', '#3E3A3C', '#8E1E2A'], best: true, collection: 'Summer Bloom', images: ['noir.jpg'], desc: 'Black lawn with gold embroidery down the placket and a black chiffon dupatta flecked with gold.' }),
    P({ id: 'bs-112', name: 'Fiza', type: 'Embroidered Organza Suit', cat: 'formal', sub: '3 Piece', pieces: 3, fabric: 'Organza', price: 14000, color: 'Pink', swatches: ['#E4C5C2', '#1E1A1C', '#9C4A54'], best: true, collection: 'The Festive Edit', images: ['fiza.jpg'], desc: 'Powder pink organza with tonal floral embroidery and a sheer embroidered dupatta.' }),
    P({ id: 'bs-201', name: 'Zeenat Pearl Clutch', type: 'Embellished Clutch', cat: 'accessories', sub: 'Clutch', fabric: 'Embellished', price: 5950, color: 'Gold', swatches: ['#C9A866', '#F1E6D8'], isNew: true, collection: 'The Festive Edit', images: ['cat-accessories.jpg'], desc: 'A gold-frame clutch covered in hand-set pearls and crystals, with a detachable chain.' }),
    P({ id: 'bs-202', name: 'Shehnaz Embroidered Dupatta', type: 'Embroidered Dupatta', cat: 'accessories', sub: 'Dupatta', fabric: 'Chiffon', price: 4500, sale: 3150, color: 'Plum', swatches: ['#5E1F3D', '#C9A866'], collection: 'The Festive Edit', images: ['cat-sale.jpg'], desc: 'A plum chiffon dupatta with gold zari borders and scattered buti. 2.5 m.' })
  ];

  const HERO = [
    { eyebrow: 'Timeless Traditions', title: ['Modern', 'Women'], text: 'Graceful silhouettes, intricate details and colors that tell your story.', cta: ['Explore Collections', '#/shop/all'], image: IMG + 'hero-modern-women.jpg', tint: '#EBD8D3' },
    { eyebrow: 'The Festive Edit', title: ['Moments', 'in Bloom'], text: 'For the celebrations, the gatherings and everything in between.', cta: ['Explore the Edit', '#/shop/formal'], image: IMG + 'festive-moments.jpg', tint: '#F1DEDC', focus: '30% 40%' },
    { eyebrow: 'Unstitched', title: ['Design', 'Your Story'], text: 'Embroidered fabric sets, cut to your own measurements by your own tailor.', cta: ['Shop Unstitched', '#/shop/unstitched'], image: IMG + 'look-2.jpg', tint: '#EADADB' }
  ];

  const LOOKBOOK = ['look-1.jpg', 'look-2.jpg', 'look-3.jpg', 'look-4.jpg'].map((f, i) => ({
    image: IMG + f,
    alt: ['Everyday Elegance', 'Modern Traditions', 'For Your Special Days', 'Grace in Every Detail'][i],
    href: ['#/product/bs-102', '#/shop/unstitched', '#/product/bs-103', '#/product/bs-104'][i]
  }));

  // Sample copy for layout only. Replace with real, verified customer reviews before launch.
  const REVIEWS = {
    sample: true,
    items: [
      { name: 'Areeba K.', city: 'Lahore', rating: 5, text: 'Absolutely in love with the quality and details. Bint e Safia never disappoints!' },
      { name: 'Sana M.', city: 'Karachi', rating: 5, text: 'The fabric, the fit, the packaging — everything felt so premium. Highly recommended!' },
      { name: 'Zainab R.', city: 'Islamabad', rating: 5, text: 'Such elegant designs! Finally a brand that truly understands modern women.' },
      { name: 'Hira A.', city: 'Faisalabad', rating: 5, text: 'Ordered for my sister’s mehndi and got compliments all night. Delivered in three days.' }
    ]
  };

  const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  const SIZE_CHART = [
    ['XS', 36, 40, 13.5, 21],
    ['S', 38, 41, 14, 21.5],
    ['M', 40, 42, 14.5, 22],
    ['L', 42, 43, 15, 22.5],
    ['XL', 44, 44, 15.5, 23]
  ];

  const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Hyderabad', 'Sialkot', 'Gujranwala', 'Abbottabad', 'Bahawalpur', 'Sukkur', 'Other'];

  const STORES = [
    { city: 'Lahore', name: 'Gulberg Flagship', address: 'MM Alam Road, Gulberg III', hours: '11 am – 10 pm' },
    { city: 'Karachi', name: 'Clifton', address: 'Block 5, Clifton', hours: '11 am – 10 pm' },
    { city: 'Islamabad', name: 'F-7 Markaz', address: 'Jinnah Super Market, F-7', hours: '11 am – 9 pm' }
  ];

  const SHIPPING = { freeOver: 10000, standard: 250, express: 450, promo: { code: 'SAFIA10', pct: 10 } };

  return { IMG, CATEGORIES, SALE_TILE, COLORS, FABRIC_NOTES, CARE, PRODUCTS, HERO, LOOKBOOK, REVIEWS, SIZES, SIZE_CHART, CITIES, STORES, SHIPPING };
})();
