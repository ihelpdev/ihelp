export interface OnDemandService {
  id: string;
  name: string;
  slug: string;
  category: "Pro" | "Flex";
  description: string;
  suggested_base_rate_ngn: number;
  unit: string;
}

export interface SubscriptionBaseService {
  id: string;
  name: string;
  slug: string;
  tier_eligibility: string;
  description: string;
  base_price_per_session_ngn: number;
}

export interface FrequencyMatrixItem {
  frequency_key: "WEEKLY" | "BI_WEEKLY" | "MONTHLY";
  label: string;
  sessions_per_month: number;
  discount_percentage: number;
}