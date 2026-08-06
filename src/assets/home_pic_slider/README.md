# Home hero slider images

Use **different** crops for mobile and desktop:

```
home_pic_slider/
  mobile/    # portrait — ~1080×1920 (9:16), subject centered
  desktop/   # landscape — ~1920×1080 (16:9)
```

Pair files by the same base name, e.g. `slide-1.png` in both folders.

Supported: png, jpg, jpeg, webp, avif.

If a pair is missing one side, the other is used as fallback.
