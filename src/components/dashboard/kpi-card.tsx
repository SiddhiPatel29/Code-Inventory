import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function KpiCard({ title, value, description, icon: Icon, trend, trendValue }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trendValue && (
              <span className={
                trend === 'up' ? 'text-emerald-500 font-medium' :
                trend === 'down' ? 'text-rose-500 font-medium' :
                'text-muted-foreground font-medium'
              }>
                {trendValue}
              </span>
            )}
            {description && <span className="ml-1">{description}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
