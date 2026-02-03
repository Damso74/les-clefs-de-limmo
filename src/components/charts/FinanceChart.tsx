"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MonthlyFinance } from "@/domain/types";
import { formatMonth } from "@/lib/utils";

interface FinanceChartProps {
  data: MonthlyFinance[];
}

export function FinanceChart({ data }: FinanceChartProps) {
  const chartData = data.map((d) => ({
    month: formatMonth(d.month),
    Facturé: d.billed,
    Encaissé: d.collected,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            tickFormatter={(value) =>
              value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number) =>
              new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 0,
              }).format(value)
            }
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
          />
          <Bar
            dataKey="Facturé"
            fill="#93c5fd"
            radius={[4, 4, 0, 0]}
            name="Facturé"
          />
          <Bar
            dataKey="Encaissé"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            name="Encaissé"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
