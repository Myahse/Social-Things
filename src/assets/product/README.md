# Product assets

One folder per product, named after its slug (e.g. `src/assets/product/l539/`).

| File | Used for |
| --- | --- |
| `product.*` | Local cover photo (merged with the tracker photos) |
| `avatar.*` | On-body photo, shown on product-card hover |
| `print-front.*` | Front print artwork, painted on the tee of the 3D Avatar view |
| `print-back.*` | Back print artwork, painted on the tee of the 3D Avatar view |

Print files: PNG or WebP with a transparent background, about 1000–2000 px wide. The front print sits
centred at chest height and the back print at upper-back height. Without them the Avatar view shows a
plain tee in the product colour.
