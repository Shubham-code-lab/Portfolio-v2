import image1 from '../assets/2222765.jpg';
import image2 from '../assets/alejandro-contreras-wTPp323zAEw-unsplash.jpg';
import image3 from '../assets/gear-5-luffy-3840x2160-24363.jpg';
import image4 from '../assets/majestic-mountain-peak-tranquil-winter-landscape-generated-by-ai.jpg';
import image5 from '../assets/sampleimage16x9.jpg';
import image6 from '../assets/sampleImagetiger16x9.jpg';
import image7 from '../assets/cropped-image.png';
import image8 from '../assets/616945.png';
import type { CardData } from '../types/card';

export const CARDS: readonly CardData[] = [
  { image: image1, title: 'Neon Dreams',    year: '2023', rating: '4.8', tags: ['Sci-Fi',    'Action'],      desc: 'A visual journey through neon-lit futures and digital horizons.' },
  { image: image2, title: 'Wild Paws',      year: '2022', rating: '4.6', tags: ['Nature',    'Wildlife'],    desc: 'Rare moments of cats in their most untamed, natural habitat.' },
  { image: image3, title: 'Gear Fifth',     year: '2023', rating: '4.9', tags: ['Animation', 'Action'],      desc: 'The ultimate power awakens in an epic clash of will and legend.' },
  { image: image4, title: 'Summit',         year: '2021', rating: '4.7', tags: ['Nature',    '4K'],          desc: 'Majestic peaks and winter silence across remote mountain ranges.' },
  { image: image5, title: 'Sample Reel',    year: '2023', rating: '4.4', tags: ['Short',     'Visual'],      desc: 'A curated sample of cinematographic techniques and composition.' },
  { image: image6, title: 'Tiger Hour',     year: '2022', rating: '4.5', tags: ['Wildlife',  'Drama'],       desc: "Following one of nature's most powerful predators across seasons." },
  { image: image7, title: 'Frame by Frame', year: '2023', rating: '4.3', tags: ['Art',       'Documentary'], desc: 'The art of composition explored through meticulously crafted imagery.' },
  { image: image8, title: 'Cipher',         year: '2021', rating: '4.2', tags: ['Thriller',  'Mystery'],     desc: 'Hidden messages, layered narratives, and the beauty of the unseen.' },
] as const;
