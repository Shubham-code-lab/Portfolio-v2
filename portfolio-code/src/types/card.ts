/** Shape of a single project card rendered in the carousel and detail page. */
export interface CardData {
  image:  string;
  title:  string;
  year:   string;
  rating: string;
  tags:   readonly string[];
  desc:   string;
}
