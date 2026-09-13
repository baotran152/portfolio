# Photos

Drop image files here and list them in `src/lib/photos.ts`.

Each entry needs a `src` (`/photos/<file>`), an `alt` describing the image for screen
readers, and an optional `caption` shown in the lightbox.

The chat's `getPhotos` tool renders whatever is listed there. An empty list means the
tool is not offered at all, so the model cannot show an empty gallery.
