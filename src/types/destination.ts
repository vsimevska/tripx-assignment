export interface SubDestination {
  name: string;
  slug: string;
  code: string;
  thumbnail: string;
  countHotels: number;
  alias: string[];
}

export interface Destination {
  name: string;
  slug: string;
  code: string;
  thumbnail: string;
  countHotels: number;
  countDestinations: number;
  destinations: SubDestination[];
}
