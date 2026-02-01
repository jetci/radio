
export interface Station {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  votes: number;
  clickcount: number;
  codec: string;
  bitrate: number;
  geo_lat: number | null;
  geo_long: number | null;
  is_approximate?: boolean; // New flag for fallback locations
}

export interface Country {
  name: string;
  iso_3166_1: string;
  stationcount: number;
}

export interface Tag {
  name: string;
  stationcount: number;
}

export interface RadioState {
  playing: boolean;
  station: Station | null;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

export interface SearchParams {
  name?: string;
  country?: string;
  countrycode?: string;
  tag?: string;
  limit?: number;
  lat?: number;
  long?: number;
}
