export interface AirportPrice {
  startingMonthly: number;
  startingQuarterly?: number;
  startingYearly?: number;
  currency: string;
}

export interface AirportPlan {
  name: string;
  price: number;
  traffic: string;
  period: string;
  speedLimit?: string;
  devices?: number;
}

export interface AirportAISupport {
  status: 'verified' | 'reported' | 'community' | 'pending';
  chatgpt: boolean;
  claude: boolean;
  gemini: boolean;
  note?: string;
}

export interface AirportStreamingSupport {
  status: 'verified' | 'reported' | 'community' | 'pending';
  netflix: boolean;
  disney: boolean;
  youtube: boolean;
  hbo?: boolean;
  note?: string;
}

export interface AirportTrial {
  supported: boolean;
  details?: string;
}

export interface AirportSource {
  type: 'verified' | 'reported' | 'community' | 'pending';
  date: string;
  desc: string;
}

export interface Airport {
  id: string;
  slug: string;
  name: string;
  logo: string;
  tagline: string;
  badge?: string;
  website: string;
  affiliateUrl: string;
  description: string;
  price: AirportPrice;
  plans: AirportPlan[];
  protocols: string[];
  routes: string[];
  regions: string[];
  clients: string[];
  ai: AirportAISupport;
  streaming: AirportStreamingSupport;
  trial: AirportTrial;
  unlimitedPlan: boolean;
  status: 'normal' | 'observing' | 'abnormal' | 'pending';
  rating?: number; // 真实测试综合打分，无则为 undefined
  lastVerified: string;
  advantages: string[];
  warnings: string[];
  sources: AirportSource[];
}
