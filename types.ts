export type ViewState = 
  | 'GLOBAL_DASHBOARD' 
  | 'REGION_DETAIL' 
  | 'BRANCH_DETAIL' 
  | 'RISK_CENTER' 
  | 'STAFF_LIST'
  | 'PROFILE';

export interface StatCardProps {
  label: string;
  value: string;
  subValue: string;
  trend: 'up' | 'down';
  trendValue?: string;
  color: 'red' | 'green' | 'orange' | 'blue';
  icon?: string;
}

export interface ListItemProps {
  id: string;
  initials: string;
  title: string;
  subtitle: string;
  value: string;
  subValueLabel: string;
  ftod: string;
  dpd1_30: string;
  dpd31_60: string;
  colorClass: string;
  textClass: string;
  bgClass: string;
  onClick?: () => void;
}