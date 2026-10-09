import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';
import type { StripImage } from '../components/ImageStrip';
import cioHome from '../assets/Editorial_cio_home.jpg';
import cioHomeFull from '../assets/Editorial_cio_home_full.jpg';
import cioHomeTablet from '../assets/Editorial_cio_home_tablet.jpg';
import cioHomeTabletFull from '../assets/Editorial_cio_home_tablet_full.jpg';
import cioArticle from '../assets/Editorial_cio_article.jpg';
import cioArticleFull from '../assets/Editorial_cio_article_full.jpg';
import cioStyleColor from '../assets/Editorial_cio_style_color.jpg';
import cioStyleType from '../assets/Editorial_cio_style_type.jpg';
import posterRitaMarquez from '../assets/Poster_rita_marquez.jpg';
import posterYaldaNight from '../assets/Poster_yalda_night.jpg';
import posterYaldaNightFlag from '../assets/Poster_yalda_night_flag.jpg';
import posterYaldaNightWhite from '../assets/Poster_yalda_night_white.jpg';
import posterAdventuresOfLulu from '../assets/Poster_adventures_of_lulu.jpg';
import posterMidsummerMeadows from '../assets/Poster_midsummer_meadows.jpg';
import posterLivingNewEconomy from '../assets/Poster_living_new_economy.jpg';
import posterLneDirectionPhoto from '../assets/Poster_lne_direction_photo.jpg';
import posterLneDirectionMap from '../assets/Poster_lne_direction_map.jpg';
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
const SPREAD = 3 / 2;
// A US Letter page, landscape.
const PAGE_LANDSCAPE = 11 / 8.5;

const placeholderCaption = 'Placeholder — description to come.';

export const GALLERY_PAGES: Record<'editorial' | 'posters' | 'ephemera', GalleryPage> = {
  editorial: {
    id: 'editorial',
    title: 'Editorial',
    intro:
      'Placeholder introduction: magazine and publication design — covers, spreads and the systems behind them. Scroll sideways through the work.',
    pieces: [
      // The web pages are far taller than the strip: it shows each one's
      // top, and the lightbox the whole page, to scroll down.
      {
        src: cioHome,
        fullSrc: cioHomeFull,
        label: 'CIO.com home',
        alt: 'Design for the CIO.com home page: a red masthead over a grid of lead stories, then news, trending authors, video and more, down a long page.',
        aspect: PORTRAIT,
        caption: 'Home page redesign for CIO.com, at desktop width.',
      },
      {
        src: cioHomeTablet,
        fullSrc: cioHomeTabletFull,
        label: 'CIO.com home, tablet',
        alt: 'The CIO.com home page design at tablet width, in portrait: the same stories reflowed into a narrower grid.',
        aspect: PORTRAIT,
        caption: 'The CIO.com home page, responsive, on a tablet in portrait.',
      },
      {
        src: cioArticle,
        fullSrc: cioArticleFull,
        label: 'CIO.com article',
        alt: 'Design for a CIO.com article page: headline, byline and a long column of body text with images, beside a rail of related stories.',
        aspect: PORTRAIT,
        caption: 'Article page for CIO.com.',
      },
      {
        src: cioStyleColor,
        label: 'Style guide: color',
        alt: 'CIO.com style guide page, color palette: swatches from CIO brand red to robin’s egg, each with RGB and hex values and where it’s used.',
        aspect: PAGE_LANDSCAPE,
        caption: 'The CIO.com style guide: the color palette.',
      },
      {
        src: cioStyleType,
        label: 'Style guide: type',
        alt: 'CIO.com style guide page, typography: Antenna Condensed for display and Myriad Pro for body text, with weights and settings.',
        aspect: PAGE_LANDSCAPE,
        caption: 'The CIO.com style guide: typography.',
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
        src: posterYaldaNight,
        label: 'Yalda Night',
        alt: 'Poster for Yalda Night, a new play by Morgan Ludlow: the title on a torn turquoise band across a split pomegranate, its seeds spilled on lace below.',
        aspect: 930 / 1210,
        caption: 'Poster for Yalda Night, a new play by Morgan Ludlow.',
      },
      {
        src: posterYaldaNightFlag,
        label: 'Yalda Night, flag',
        alt: 'Alternate Yalda Night poster: the title in Persian script, filled with stars and stripes, on a dark ground under a red lace border.',
        aspect: 642 / 860,
        caption: 'Yalda Night: an alternate, the Persian title in stars and stripes.',
      },
      {
        src: posterYaldaNightWhite,
        label: 'Yalda Night, white',
        alt: 'Alternate Yalda Night poster: the Persian title in black on white, with butterflies and pomegranate flowers, under a black lace border.',
        aspect: 642 / 860,
        caption: 'Yalda Night: an alternate, in black and white with butterflies.',
      },
      {
        src: posterAdventuresOfLulu,
        label: 'The Adventures of Lulu',
        alt: 'Poster for The Adventures of Lulu, new plays at 18th & Union Theatre: an engraved woman under the Space Needle and a rainbow, the title in large magenta letters, with animals and mushrooms.',
        aspect: 3 / 4,
        caption: 'Poster for The Adventures of Lulu, an evening of new plays at 18th & Union.',
      },
      {
        src: posterMidsummerMeadows,
        label: 'An Evening at Midsummer Meadows',
        alt: 'Poster for An Evening at Midsummer Meadows by Morgan Ludlow: a dark, cut-paper forest glowing blue, scattered with tiny colored flowers, the title in lilac.',
        aspect: 3 / 4,
        caption: 'Poster for An Evening at Midsummer Meadows, by Morgan Ludlow.',
      },
      {
        src: posterLivingNewEconomy,
        label: 'Living the New Economy',
        alt: 'Poster: "Living the New Economy, Convergence, Oct. 23–26 in Oakland, CA", a white koru spiral over green-toned photos of speakers.',
        aspect: 3 / 4,
        caption: 'Conference poster for Living the New Economy in Oakland. 18\u00a0×\u00a024.',
      },
      {
        src: posterLneDirectionPhoto,
        label: 'LNE: early direction, photo',
        alt: 'An early direction for the Living the New Economy poster: the koru over a photo of a smiling woman, in an orange frame.',
        aspect: 3 / 4,
        caption: 'An early direction: the koru over a photograph.',
      },
      {
        src: posterLneDirectionMap,
        label: 'LNE: early direction, map',
        alt: 'An early direction for the Living the New Economy poster: the koru over a full-color road map of the Bay Area, in an orange frame.',
        aspect: 3 / 4,
        caption: 'An early direction: the koru over a road map of the Bay.',
      },
      {
        src: posterAllCitizensMust,
        label: 'All Citizens Must',
        alt: 'Poster: a mock public notice, "All citizens must, every where, every day, constantly fiddle with their cell phones", in yellow, magenta and brown blocks.',
        aspect: 11 / 14,
        caption: 'A mock public notice on our phone habits.',
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
