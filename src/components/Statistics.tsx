import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';
import type { Statistics } from '../types';

interface Props {
  stats: Statistics;
}

export function Statistics({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Critical Open Issues"
        value={stats.openCritical}
        icon={<AlertTriangle className="text-red-500" size={24} />}
        trend={stats.openCritical > 5 ? 'negative' : 'positive'}
      />
      <StatCard
        title="Recently Resolved"
        value={stats.resolvedLast30Days}
        icon={<CheckCircle className="text-green-500" size={24} />}
        trend="positive"
      />
      <StatCard
        title="Total Active"
        value={stats.total - (stats.byStatus.Closed || 0)}
        icon={<Activity className="text-blue-500" size={24} />}
        trend="neutral"
      />
      <StatCard
        title="Avg Resolution Time"
        value="3.2 days"
        icon={<Clock className="text-purple-500" size={24} />}
        trend="positive"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: 'positive' | 'negative' | 'neutral';
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  const trendColors = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-gray-500',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-sm">{title}</span>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`text-sm ${trendColors[trend]}`}>
          {trend === 'positive' && '↓ Improving'}
          {trend === 'negative' && '↑ Needs Attention'}
          {trend === 'neutral' && '→ Stable'}
        </span>
      </div>
    </div>
  );
}