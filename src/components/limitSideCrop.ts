// Lets an image fill its frame (object-fit: cover) while never losing more
// than `maxCrop` of its own pixels off either side. Once the frame is too
// tall for that — cover would enlarge the image to fill the height, cutting
// its sides — the image stops growing and sits centred instead, the frame's
// background showing above and below.
//
// Returns a ref for the <img>: it records the most the image may be scaled
// past the frame's width (--max-cover, from its natural width), which the
// frame's CSS uses to cap the image's height. The frame needs the matching
// "limit crop" class (container-type: inline-size; a centring grid).
export const limitSideCrop = (maxCrop: number) => (img: HTMLImageElement | null) => {
  if (!img) return;
  const apply = () => {
    const width = img.naturalWidth;
    // (A pixel's margin, so layout rounding never tips it past the limit.)
    const crop = maxCrop - 1;
    if (width > 2 * crop) {
      img.style.setProperty('--max-cover', String(width / (width - 2 * crop)));
    }
  };
  if (img.complete) apply();
  else img.addEventListener('load', apply, { once: true });
};
