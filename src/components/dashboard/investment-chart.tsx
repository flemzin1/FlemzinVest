"use client";

import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { accountActivityData } from "@/lib/data";

const chartConfig = {
  balance: {
    label: "Balance",
    color: "hsl(var(--foreground))",
  },
  deposit: {
    label: "Deposit",
    color: "hsl(var(--chart-1))",
  },
  investment: {
    label: "Investment",
    color: "hsl(var(--chart-2))",
  },
  withdrawal: {
    label: "Withdrawal",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export function InvestmentChart() {
  return (
    <Card className="shadow-md border-border">
      <CardHeader>
        <CardTitle>Account Activity</CardTitle>
        <CardDescription>Your account balance over time with transaction markers.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ComposedChart
            accessibilityLayer
            data={accountActivityData}
            margin={{
              left: 0,
              right: 20,
              top: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Legend />
            <Line
              dataKey="balance"
              type="monotone"
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
              dot={false}
            />
            <Scatter dataKey="deposit" fill="hsl(var(--chart-1))" />
            <Scatter dataKey="investment" fill="hsl(var(--chart-2))" />
            <Scatter dataKey="withdrawal" fill="hsl(var(--destructive))" />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
