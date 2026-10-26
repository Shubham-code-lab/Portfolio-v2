/** Shape of a single project card rendered in the carousel and detail page. */
export interface CardData {
  image: string;
  title: string;
  year: string;
  rating: string;
  status?: string;
  tags: readonly string[];
  desc: string;
  role?: string;
  timeline?: string;
  highlights?: readonly string[];
  techStack?: readonly string[];
  links?: readonly { label: string; href: string }[];
}
