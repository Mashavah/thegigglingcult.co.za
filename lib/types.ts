export type ProvinceId = 'gp' | 'wc' | 'kzn' | 'ec' | 'fs' | 'lp' | 'mp' | 'nw' | 'nc';

export type Province = {
  id: ProvinceId;
  short: string;
  name: string;
  city: string;
};

export type VenueId =
  | 'goliath' | 'parkers' | 'teatro' | 'lyric' | 'atterbury'
  | 'ctcc' | 'joumase' | 'baxter' | 'bay' | 'grandwest'
  | 'catalina' | 'playhouse' | 'rhumbelow' | 'sneddon' | 'icc'
  | 'athenaeum' | 'guild' | 'sand' | 'meropa' | 'emnotweni' | 'superbowl' | 'ncTheatre';

export type Venue = {
  id: VenueId;
  name: string;
  area: string;
  province: ProvinceId;
};

export type SocialNetwork = 'instagram' | 'x' | 'tiktok' | 'youtube' | 'facebook';

export type Comedian = {
  slug: string;
  name: string;
  province: ProvinceId;
  style: string;
  bio: string;
  socials: Partial<Record<SocialNetwork, string>>;
  /** Placeholder "rising" comic — replace with the real roster. */
  upcoming?: boolean;
  /** Optional explicit photo URL; otherwise /img/comedians/<slug>.jpg is tried. */
  photo?: string;
};

export type EventType = 'headline' | 'showcase' | 'openmic' | 'special' | 'festival' | 'tour';

export type Event = {
  id: string;
  date: Date;
  time: string;
  title: string;
  venue: VenueId;
  lineup: string[];
  type: EventType;
  price: number;
  blurb: string;
  soldOut: boolean;
};

export type Article = {
  slug: string;
  date: Date;
  category: string;
  readTime: number;
  title: string;
  excerpt: string;
  body: string;
};

export type ProvinceFilter = ProvinceId | 'all';
