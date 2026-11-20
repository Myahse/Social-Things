# Product assets

One folder per product, named after its slug (e.g. `src/assets/product/l539/`).

| File | Used for |
| --- | --- |
| `product.*` | Local cover photo (merged with the tracker photos) |
| `avatar.*` | On-body photo, shown on product-card hover |
| `print-front.*` | Front print artwork, painted on the tee of the 3D Avatar view |
| `print-back.*` | Back print artwork, painted on the tee of the 3D Avatar view |
| `mockup.*`, `mockup-2.*`, … | Flat design mockups, shown in the product page's Mockup tab (the tab appears only when there are some) |

Print files: PNG or WebP with a transparent background, about 1000–2000 px wide. The front print sits
centred at chest height and the back print at upper-back height, on both the 3D tee and the mannequins.
Without them the 3D and Avatar views show a plain tee in the product colour.
