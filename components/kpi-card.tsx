'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type KpiCardProps = {
  title?: string;
  value?: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  icon?: ReactNode;
  className?: string;
};

export function KpiCard({
  title = 'KPI',
  value = '0',
  delta = '0%',
  trend = 'up',
  icon,
  className,
}: KpiCardProps) {
  const TrendIcon = trend === 'down' ? TrendingDown : TrendingUp;
  const color =
    trend === 'down'
      ? 'text-rose-600 dark:text-rose-400'
      : 'text-emerald-600 dark:text-emerald-400';

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-2 flex items-center gap-1 text-xs">
          <TrendIcon className={cn('h-3.5 w-3.5', color)} />
          <span className={cn(color)}>{delta}</span>
          <span className="text-muted-foreground">{'vs last period'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
