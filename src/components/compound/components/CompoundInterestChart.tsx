import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export type CompoundPoint = {
  year: number;
  expected: number;
  high: number;
  low: number;
};

function fmtAxis(n: number) {
  if (!Number.isFinite(n)) return '$0';
  if (n >= 1000000) return `$${Math.round(n / 100000) / 10}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${Math.round(n)}`;
}

function fmtMoney(n: number) {
  return Number(n).toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  });
}

export default function CompoundInterestChart({ data }: { data: CompoundPoint[] }) {
  return (
    <div className="w-full h-[450px] sm:h-[550px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 15, right: 15, left: 10, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="year"
            tickFormatter={(v) => (v === 0 ? 'Now' : `${v}y`)}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis
            tickFormatter={fmtAxis}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
            width={60}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <Tooltip
            formatter={(value, name) => [
              fmtMoney(Number(value)),
              name === 'expected'
                ? 'Expected Return'
                : name === 'high'
                ? '+ Variance'
                : '- Variance',
            ]}
            labelFormatter={(label) => (label === 0 ? 'Current Baseline' : `Year ${label}`)}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
              fontSize: '13px',
              fontWeight: '500',
            }}
          />
          <Line
            type="monotone"
            dataKey="expected"
            stroke="#10b981"
            strokeWidth={3.5}
            dot={false}
            activeDot={{ r: 6, fill: '#0f291e', stroke: '#10b981', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="high"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}