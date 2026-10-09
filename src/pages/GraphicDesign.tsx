import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';
import type { StripImage } from '../components/ImageStrip';
import posterRitaMarquez from '../assets/Poster_rita_marquez.jpg';
import posterLivingNewEconomy from '../assets/Poster_living_new_economy.jpg';
import posterAllCitizensMust from '../assets/Poster_all_citizens_must.jpg';

// The graphic design pages: Editorial, Posters and Ephemera. Each is one
// gallery section — a short introduction beside a strip of work that runs from
// the section's top out to the window edge, scrolled and navigated sideways. Pieces are mostly portrait but can be any
// shape (aspect: width ÷ height). Placeholders for now: an item without a
// src shows its label in a frame of its shape.

interface GalleryPage {
  id: string;
  title: string;
  intro: string;
  pieces: StripImage[];
}

const PORTRAIT = 3 / 4;
const POSTER = 2 / 3;
const SPREAD = 3 / 2;

const placeholderCaption = 'Placeholder — description to come.';

export const GALLERY_PAGES: Record<'editorial' | 'posters' | 'ephemera', GalleryPage> = {
  editorial: {
    id: 'editorial',
    title: 'Editorial',
    intro:
      'Placeholder introduction: magazine and publication design — covers, spreads and the systems behind them. Scroll sideways through the work.',
    pieces: [
      {
        label: 'Cover',
        alt: 'Placeholder: a magazine cover',
        aspect: PORTRAIT,
        caption: placeholderCaption,
      },
      {
        label: 'Opening spread',
        alt: 'Placeholder: an opening spread',
        aspect: SPREAD,
        caption: placeholderCaption,
      },
      {
        label: 'Feature',
        alt: 'Placeholder: a feature page',
        aspect: PORTRAIT,
        caption: placeholderCaption,
      },
      {
        label: 'Detail',
        alt: 'Placeholder: a typographic detail',
        aspect: 4 / 5,
        caption: placeholderCaption,
      },
      {
        label: 'Back page',
        alt: 'Placeholder: a back page',
        aspect: PORTRAIT,
        caption: placeholderCaption,
      },
    ],
  },
  posters: {
    id: 'posters',
    title: 'Posters',
    intro:
      'Placeholder introduction: posters for events, campaigns and causes. Scroll sideways through the work.',
    pieces: [
      {
        src: posterRitaMarquez,
        label: 'Rita Marquez Quartet',
        alt: 'Poster: "Rita, Marquez Quartet at Arrivederci", the singer in halftone purple under a large pink script title.',
        aspect: 11 / 17,
        caption: 'Gig poster for the Rita Marquez Quartet at Arrivederci. 11\u00a0×\u00a017.',
      },
      {
        src: posterLivingNewEconomy,
        label: 'Living the New Economy',
        alt: 'Poster: "Living the New Economy, Convergence, Oct. 23–26 in Oakland, CA", a white koru spiral over green-toned photos of speakers.',
        aspect: 3 / 4,
        caption: 'Conference poster for Living the New Economy in Oakland. 18\u00a0×\u00a024.',
      },
      {
        src: posterAllCitizensMust,
        label: 'All Citizens Must',
        alt: 'Poster: a mock public notice, "All citizens must, every where, every day, constantly fiddle with their cell phones", in yellow, magenta and brown blocks.',
        aspect: 11 / 14,
        caption: 'A mock public notice on our phone habits.',
      },
      {
        label: 'Series',
        alt: 'Placeholder: a poster series, shown side by side',
        aspect: SPREAD,
        caption: placeholderCaption,
      },
      {
        label: 'Poster four',
        alt: 'Placeholder: a poster',
        aspect: POSTER,
        caption: placeholderCaption,
      },
    ],
  },
  ephemera: {
    id: 'ephemera',
    title: 'Ephemera',
    intro:
      'Placeholder introduction: invitations, tickets, cards and the small printed things in between. Scroll sideways through the work.',
    pieces: [
      {
        label: 'Invitation',
        alt: 'Placeholder: an invitation',
        aspect: 5 / 7,
        caption: placeholderCaption,
      },
      {
        label: 'Ticket',
        alt: 'Placeholder: a ticket',
        aspect: 2 / 1,
        caption: placeholderCaption,
      },
      {
        label: 'Postcard',
        alt: 'Placeholder: a postcard',
        aspect: SPREAD,
        caption: placeholderCaption,
      },
      {
        label: 'Bookmark',
        alt: 'Placeholder: a bookmark',
        aspect: 1 / 3,
        caption: placeholderCaption,
      },
      {
        label: 'Card',
        alt: 'Placeholder: a greeting card',
        aspect: PORTRAIT,
        caption: placeholderCaption,
      },
    ],
  },
};

export const GraphicDesignPage = ({ page }: { page: GalleryPage }) => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: 'Graphic design',
        heading: page.title,
        content: <p>{page.intro}</p>,
        imageSlot: {
          type: 'strip',
          id: `gd-${page.id}`,
          images: page.pieces,
          wheelScrolls: true,
          outlined: true,
          lightbox: true,
        },
        layout: 'gallery',
      },
    ]}
  />
);
