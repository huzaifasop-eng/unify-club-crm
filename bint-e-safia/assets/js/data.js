/* BINT E SAFIA — catalogue data.
 * Edit this file to change products, prices and categories.
 * Each product's artwork is drawn from its colours + motif (see art.js section in app.js).
 * To use real photography instead, add `images: ['path/front.jpg', 'path/detail.jpg']`. */
window.BES_DATA = (() => {
  const CATEGORIES = [
    { slug: 'ready-to-wear', name: 'Ready to Wear', blurb: 'Stitched kurtas, co-ords and suits, ready the day they arrive.', motif: 'buti', base: '#6B1E2A', ink: '#E8C27A' },
    { slug: 'unstitched', name: 'Unstitched', blurb: 'Two and three-piece fabric sets for your own tailor.', motif: 'ajrak', base: '#1F4E55', ink: '#D9B26A' },
    { slug: 'festive', name: 'Festive', blurb: 'Organza, chiffon and velvet for mehndi, baraat and walima.', motif: 'floral', base: '#5E0F1E', ink: '#D4AF6A' },
    { slug: 'accessories', name: 'Accessories', blurb: 'Dupattas, shawls and stoles to finish the look.', motif: 'jaal', base: '#5E6236', ink: '#E4D3A3' }
  ];

  const COLORS = {
    Maroon: '#6B1E2A', Ivory: '#EFE6D6', Teal: '#1F4E55', Blush: '#E9C3C0', Black: '#1D1B1C', Mustard: '#C8962E',
    Sage: '#9BAA8E', Navy: '#1E2A47', Grey: '#8D8A86', Rust: '#8E3B1F', Olive: '#5E6236', Plum: '#4A1F3D'
  };

  const FABRIC_NOTES = {
    Khaddar: 'Hand-feel cotton with a slubby, warm weave made for cooler days. Softens with every wash.',
    Karandi: 'A crisp, textured blend with a fine cross-weave. Holds its shape and keeps the chill out.',
    Cambric: 'Smooth, mid-weight cotton that sits between lawn and khaddar. An all-season staple.',
    Lawn: 'Fine, breathable cotton with a soft drape. Light enough for warm afternoons.',
    Linen: 'Airy linen blend with a natural slub and a relaxed, lived-in fall.',
    Velvet: 'Dense micro-velvet with a deep pile and a rich, low sheen.',
    Organza: 'Sheer, crisp organza that holds embroidery beautifully. Lined where needed.',
    Chiffon: 'Weightless chiffon with a fluid drape, finished with a matching inner slip.',
    'Raw Silk': 'Raw silk with a subtle nub and a soft lustre. Structured yet comfortable.',
    Cotton: 'Pure cotton, block-printed and softened for everyday wear.',
    Pashmina: 'A warm pashmina-wool blend, finely brushed for a soft hand.'
  };

  const CARE = {
    default: ['Gentle hand wash or dry clean', 'Wash dark colours separately', 'Do not bleach or tumble dry', 'Iron on reverse at medium heat'],
    delicate: ['Dry clean only', 'Store folded in a muslin bag', 'Steam on low; keep iron off embroidery']
  };

  const P = (o) => ({ sale: null, isNew: false, best: false, pieces: 1, ...o });

  const PRODUCTS = [
    // Ready to Wear
    P({ id: 'bs-101', name: 'Noor Block-Print Kurta', cat: 'ready-to-wear', sub: '1 Piece', fabric: 'Khaddar', price: 4490, color: 'Maroon', base: '#6B1E2A', ink: '#E8C27A', accent: '#E8C27A', motif: 'buti', isNew: true, best: true, collection: "Winter Khaddar '26", desc: 'A straight-cut kurta block-printed with small gold butis, finished with a contrast hem band and a dotted placket.' }),
    P({ id: 'bs-102', name: 'Zarnish Embroidered Shirt', cat: 'ready-to-wear', sub: '1 Piece', fabric: 'Karandi', price: 5990, color: 'Ivory', base: '#EFE6D6', ink: '#7A2E3A', accent: '#7A2E3A', motif: 'floral', isNew: true, collection: "Winter Khaddar '26", desc: 'Ivory karandi shirt scattered with thread-embroidered blooms in deep wine, with a self-piped neckline.' }),
    P({ id: 'bs-103', name: 'Mehrunisa 2-Piece Suit', cat: 'ready-to-wear', sub: '2 Piece', pieces: 2, fabric: 'Khaddar', price: 7490, color: 'Teal', base: '#1F4E55', ink: '#D9B26A', accent: '#0F2E33', motif: 'ajrak', best: true, collection: "Winter Khaddar '26", desc: 'Ajrak-inspired printed kurta paired with solid straight trousers. A modern take on a Sindhi classic.' }),
    P({ id: 'bs-104', name: 'Gul Bahar 3-Piece Suit', cat: 'ready-to-wear', sub: '3 Piece', pieces: 3, fabric: 'Cambric', price: 8990, sale: 6290, color: 'Blush', base: '#E9C3C0', ink: '#8C3B4A', accent: '#8C3B4A', motif: 'floral', collection: 'Essentials', desc: 'Soft blush kurta with a printed floral repeat, matching trousers and a lightweight voile dupatta.' }),
    P({ id: 'bs-105', name: 'Sitara Straight Kurta', cat: 'ready-to-wear', sub: '1 Piece', fabric: 'Cambric', price: 3990, color: 'Black', base: '#1D1B1C', ink: '#C9A25E', accent: '#C9A25E', motif: 'chevron', best: true, collection: 'Essentials', desc: 'An everyday black kurta with a fine gold chevron print and side slits for easy movement.' }),
    P({ id: 'bs-106', name: 'Rangeen Stripe Kurta', cat: 'ready-to-wear', sub: '1 Piece', fabric: 'Linen', price: 4290, sale: 2990, color: 'Mustard', base: '#C8962E', ink: '#6B3E12', accent: '#6B3E12', motif: 'stripe', collection: 'Essentials', desc: 'Mustard linen kurta with bias stripes and a relaxed, boxy fit.' }),
    P({ id: 'bs-107', name: 'Fiza 2-Piece Co-ord', cat: 'ready-to-wear', sub: '2 Piece', pieces: 2, fabric: 'Linen', price: 6990, color: 'Sage', base: '#9BAA8E', ink: '#F2EEE3', accent: '#4F5E45', motif: 'jaal', isNew: true, collection: 'Essentials', desc: 'A sage co-ord set with a white jaal lattice print, short kurta and wide-leg trousers.' }),
    P({ id: 'bs-108', name: 'Afsana 3-Piece Suit', cat: 'ready-to-wear', sub: '3 Piece', pieces: 3, fabric: 'Khaddar', price: 9490, color: 'Navy', base: '#1E2A47', ink: '#C9894B', accent: '#B8893E', motif: 'ajrak', isNew: true, best: true, collection: "Winter Khaddar '26", desc: 'Deep navy khaddar suit with copper ajrak blocks, matching trousers and a printed shawl-weight dupatta.' }),
    P({ id: 'bs-109', name: 'Shirin Printed Kurta', cat: 'ready-to-wear', sub: '1 Piece', fabric: 'Lawn', price: 3490, sale: 2440, color: 'Grey', base: '#8D8A86', ink: '#F1ECE4', accent: '#3C3A38', motif: 'buti', collection: 'Essentials', desc: 'A light lawn kurta in dove grey with tiny white florets. Ideal for layering into the season.' }),
    P({ id: 'bs-110', name: 'Marvi Ajrak Kurta', cat: 'ready-to-wear', sub: '1 Piece', fabric: 'Khaddar', price: 4790, color: 'Rust', base: '#8E3B1F', ink: '#1B1714', accent: '#1B1714', motif: 'ajrak', isNew: true, collection: "Winter Khaddar '26", desc: 'Rust-red khaddar printed with a bold indigo-black ajrak grid. Cut long with a straight hem.' }),

    // Unstitched
    P({ id: 'bs-201', name: 'Winter Khaddar 3-Piece', cat: 'unstitched', sub: '3 Piece', pieces: 3, fabric: 'Khaddar', price: 6490, color: 'Olive', base: '#5E6236', ink: '#E4D3A3', accent: '#3A3C20', motif: 'buti', isNew: true, best: true, collection: "Winter Khaddar '26", desc: 'Printed khaddar shirt (3 m), dyed khaddar trousers (2.5 m) and a printed khaddar dupatta (2.5 m).' }),
    P({ id: 'bs-202', name: 'Karandi Jaal 3-Piece', cat: 'unstitched', sub: '3 Piece', pieces: 3, fabric: 'Karandi', price: 7990, color: 'Plum', base: '#4A1F3D', ink: '#D9B8C9', accent: '#2C1024', motif: 'jaal', isNew: true, collection: "Winter Khaddar '26", desc: 'Printed karandi shirt (3 m), dyed trousers (2.5 m) and a woven karandi dupatta (2.5 m) in deep plum.' }),
    P({ id: 'bs-203', name: 'Printed Cambric 2-Piece', cat: 'unstitched', sub: '2 Piece', pieces: 2, fabric: 'Cambric', price: 4990, sale: 3490, color: 'Teal', base: '#1F4E55', ink: '#E7D9B5', accent: '#123236', motif: 'chevron', collection: 'Essentials', desc: 'Printed cambric shirt (3 m) with dyed cambric trousers (2.5 m).' }),
    P({ id: 'bs-204', name: 'Ajrak Heritage 3-Piece', cat: 'unstitched', sub: '3 Piece', pieces: 3, fabric: 'Khaddar', price: 6990, color: 'Maroon', base: '#5C1A1F', ink: '#1A1A2E', accent: '#1A1A2E', motif: 'ajrak', best: true, collection: "Winter Khaddar '26", desc: 'Ajrak-printed shirt (3 m), dyed trousers (2.5 m) and a full ajrak dupatta (2.5 m) in madder red and indigo.' }),
    P({ id: 'bs-205', name: 'Lawn Essentials 2-Piece', cat: 'unstitched', sub: '2 Piece', pieces: 2, fabric: 'Lawn', price: 3990, color: 'Ivory', base: '#F1EADB', ink: '#3E5C76', accent: '#3E5C76', motif: 'stripe', collection: 'Essentials', desc: 'Striped lawn shirt (3 m) with dyed lawn trousers (2.5 m) in soft ivory and blue.' }),
    P({ id: 'bs-206', name: 'Velvet Shawl Suit 3-Piece', cat: 'unstitched', sub: '3 Piece', pieces: 3, fabric: 'Velvet', price: 12990, color: 'Black', base: '#121012', ink: '#B88A44', accent: '#2A2224', motif: 'floral', isNew: true, collection: 'Festive Edit', desc: 'Embroidered velvet shirt front (1.25 m), plain velvet back and sleeves, raw silk trousers and an embroidered velvet shawl.' }),

    // Festive
    P({ id: 'bs-301', name: 'Shehnai Organza Formal', cat: 'festive', sub: '3 Piece', pieces: 3, fabric: 'Organza', price: 18500, color: 'Ivory', base: '#F3EBDD', ink: '#B08D57', accent: '#B08D57', motif: 'floral', best: true, collection: 'Festive Edit', desc: 'Ivory organza kalidar with antique gold tilla blooms, raw silk trousers and an organza dupatta with scalloped edges.' }),
    P({ id: 'bs-302', name: 'Rukhsaar Chiffon Formal', cat: 'festive', sub: '3 Piece', pieces: 3, fabric: 'Chiffon', price: 16900, color: 'Maroon', base: '#5E0F1E', ink: '#D4AF6A', accent: '#D4AF6A', motif: 'floral', isNew: true, collection: 'Festive Edit', desc: 'Deep maroon chiffon with zari floral embroidery, a lined slip, straight trousers and a heavily bordered dupatta.' }),
    P({ id: 'bs-303', name: 'Mahtab Velvet Kurta', cat: 'festive', sub: '1 Piece', fabric: 'Velvet', price: 11500, color: 'Navy', base: '#16203A', ink: '#C9A45C', accent: '#C9A45C', motif: 'jaal', collection: 'Festive Edit', desc: 'Midnight velvet kurta with a gold jaal of zardozi work across the yoke and sleeves.' }),
    P({ id: 'bs-304', name: 'Dilkash Silk 2-Piece', cat: 'festive', sub: '2 Piece', pieces: 2, fabric: 'Raw Silk', price: 13900, sale: 9730, color: 'Teal', base: '#0E4B4F', ink: '#E3C27D', accent: '#E3C27D', motif: 'buti', collection: 'Festive Edit', desc: 'Raw silk kurta in peacock teal with gold buti embroidery and matching cigarette pants.' }),

    // Accessories
    P({ id: 'bs-401', name: 'Ajrak Printed Dupatta', cat: 'accessories', sub: 'Dupatta', fabric: 'Cotton', price: 2490, color: 'Maroon', base: '#6B1E2A', ink: '#1A1A2E', accent: '#1A1A2E', motif: 'ajrak', best: true, collection: 'Essentials', desc: 'A full-length cotton dupatta in classic ajrak blocks. 2.5 m.' }),
    P({ id: 'bs-402', name: 'Karandi Winter Shawl', cat: 'accessories', sub: 'Shawl', fabric: 'Karandi', price: 3990, color: 'Mustard', base: '#B98A2E', ink: '#5B3510', accent: '#5B3510', motif: 'jaal', isNew: true, collection: "Winter Khaddar '26", desc: 'A warm karandi shawl with a woven jaal pattern and twisted fringe. 2.5 m.' }),
    P({ id: 'bs-403', name: 'Chiffon Embroidered Dupatta', cat: 'accessories', sub: 'Dupatta', fabric: 'Chiffon', price: 3290, sale: 2290, color: 'Blush', base: '#E9C3C0', ink: '#9A5A62', accent: '#9A5A62', motif: 'floral', collection: 'Festive Edit', desc: 'Sheer blush chiffon with an embroidered floral border on all four sides. 2.5 m.' }),
    P({ id: 'bs-404', name: 'Pashmina Blend Stole', cat: 'accessories', sub: 'Stole', fabric: 'Pashmina', price: 4990, color: 'Grey', base: '#8D8A86', ink: '#E9E4DC', accent: '#4A4744', motif: 'stripe', collection: "Winter Khaddar '26", desc: 'A brushed pashmina-blend stole in heather grey with fine woven stripes. 2 m.' }),
    P({ id: 'bs-405', name: 'Block-Print Cotton Stole', cat: 'accessories', sub: 'Stole', fabric: 'Cotton', price: 1990, color: 'Black', base: '#1D1B1C', ink: '#E8C27A', accent: '#E8C27A', motif: 'buti', collection: 'Essentials', desc: 'A soft cotton stole hand block-printed with gold butis. 2 m.' })
  ];

  const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

  const SIZE_CHART = [
    // size, chest, length, shoulder, sleeve (inches)
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

  const SHIPPING = { freeOver: 5000, standard: 250, express: 450, promo: { code: 'SAFIA10', pct: 10 } };

  return { CATEGORIES, COLORS, FABRIC_NOTES, CARE, PRODUCTS, SIZES, SIZE_CHART, CITIES, STORES, SHIPPING };
})();
