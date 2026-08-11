"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Point = { years: number; netWorth: number };

function fmtAxis(n: number) {
  if (!Number.isFinite(n)) return "$0";
  if (n >= 1000000) return `$${Math.round(n / 100000) / 10}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${Math.round(n)}`;
}

function fmtMoney(n: number) {
  return Number(n).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });
}

export default function NetWorthChart({ data }: { data: Point[] }) {
  return (
    <div className="mt-6">
      <div className="text-sm font-semibold text-neutral-900">
        Net worth over time
      </div>

      <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#e5e5e5" />
              <XAxis
  dataKey="years"
  tickFormatter={(v) => (v === 0 ? "Now" : `${v}y`)}
  tickLine={false}
  axisLine={{ stroke: "#404040", strokeWidth: 1.5 }}
  tick={{ fontSize: 12, fill: "#525252" }}
/>
              <YAxis
  tickFormatter={fmtAxis}
  tickLine={false}
  axisLine={{ stroke: "#404040", strokeWidth: 1.5 }}
  width={55}
  tick={{ fontSize: 12, fill: "#525252" }}
/>
              <Tooltip
                formatter={(value) => fmtMoney(Number(value))}
                labelFormatter={(label) =>
                  label === 0 ? "Now" : `${label} years`
                }
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e5e5",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              />
              <Line
                type="monotone"
                dataKey="netWorth"
                stroke="#3edf0d"
                strokeWidth={4.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}