export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface RevenueResponse {
  daily: DailyRevenue[];
  total: number;
}
