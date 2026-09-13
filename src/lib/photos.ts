// Photos shown by the chat's getPhotos tool. Add files to public/photos/ and list
// them here; an empty list disables the tool entirely (see route.ts), so the model
// can never open an empty gallery.

export type PhotoItem = {
  src: string;
  alt: string;
  caption?: string;
};

// TODO: add pictures to public and show this
export const PHOTOS: PhotoItem[] = [
  // {
  //   src: '/me.jpg',
  //   alt: 'Trần Nguyễn Duy Bảo',
  //   caption: 'Me, somewhere between a deploy and a coffee',
  // },
];

export const hasPhotos = () => PHOTOS.length > 0;
