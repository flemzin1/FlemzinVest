
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { type Transaction } from "@/lib/data";
import { useMemo } from "react";
import { format, parseISO, addDays, subDays, eachDayOfInterval } from "date-fns";
import { useUser } from "@/hooks/use-user";

const chartConfig = {
  balance: {
    label: "Balance",
    color: "hsl(var(--chart-1))",
  },
  deposit: {
    label: "Deposit",
    color: "hsl(var(--chart-1))", // Blue
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))", // Green
  }
} satisfies ChartConfig;

type ChartDataPoint = {
  date: string;
  balance: number;
  transactionType: 'Deposit' | 'Profit' | null;
};

const generateChartData = (transactions: Transaction[]): ChartDataPoint[] => {
  if (!transactions || transactions.length === 0) {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => ({
      date: format(addDays(subDays(today, 6), i), "MMM d"),
      balance: 0,
      transactionType: null,
    }));
  }

  const completedTx = transactions
    .filter(tx => tx.status === 'Completed' && ['Deposit', 'Profit', 'Withdrawal'].includes(tx.type))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (completedTx.length === 0) {
     const today = new Date();
    return Array.from({ length: 7 }, (_, i) => ({
      date: format(addDays(subDays(today, 6), i), "MMM d"),
      balance: 0,
      transactionType: null,
    }));
  }

  const firstTxDate = new Date(completedTx[0].date);
  const ninetyDaysAgo = subDays(new Date(), 90);
  const startDate = firstTxDate < ninetyDaysAgo ? ninetyDaysAgo : firstTxDate;
  
  const today = new Date();
  
  const dateInterval = eachDayOfInterval({
      start: subDays(startDate, 1),
      end: today,
  });

  const data: ChartDataPoint[] = [];
  let currentBalance = 0;
  
  // Calculate balance up to the start date
  const balanceBeforeStartDate = completedTx
      .filter(tx => new Date(tx.date) < startDate)
      .reduce((acc, tx) => {
          if (tx.type === 'Deposit' || tx.type === 'Profit') return acc + tx.amount;
          if (tx.type === 'Withdrawal') return acc - tx.amount;
          return acc;
      }, 0);

  currentBalance = balanceBeforeStartDate;

  dateInterval.forEach(day => {
      const formattedDate = format(day, 'yyyy-MM-dd');
      const dailyTransactions = completedTx.filter(tx => format(new Date(tx.date), 'yyyy-MM-dd') === formattedDate);
      
      let dailyTransactionType: 'Deposit' | 'Profit' | null = null;

      if (dailyTransactions.length > 0) {
          dailyTransactions.forEach(tx => {
              if (tx.type === 'Deposit' || tx.type === 'Profit') {
                  currentBalance += tx.amount;
                  // Prioritize showing profit dot if both happen on the same day
                  if (tx.type === 'Profit') dailyTransactionType = 'Profit';
                  else if (dailyTransactionType !== 'Profit') dailyTransactionType = 'Deposit';
              } else if (tx.type === 'Withdrawal') {
                  currentBalance -= tx.amount;
              }
          });
      }
      
      data.push({
          date: format(day, 'MMM d'),
          balance: currentBalance,
          transactionType: dailyTransactionType,
      });
  });
  
  // Special case for a single transaction to show a ramp-up
  if (completedTx.length === 1) {
    const singleTxDate = new Date(completedTx[0].date);
    const dayBefore = subDays(singleTxDate, 1);
    
    return [
        { date: format(dayBefore, 'MMM d'), balance: 0, transactionType: null },
        ...data.filter(d => new Date(d.date) >= dayBefore)
    ];
  }

  return data;
};

const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    
    if (payload.transactionType === 'Deposit') {
        return <circle cx={cx} cy={cy} r={5} stroke={chartConfig.deposit.color} strokeWidth={2} fill={"#fff"} />;
    }
    if (payload.transactionType === 'Profit') {
        return <circle cx={cx} cy={cy} r={5} stroke={chartConfig.profit.color} strokeWidth={2} fill={"#fff"} />;
    }
    return null;
};


export function InvestmentChart() {
  const user = useUser();
  const accountActivityData = useMemo(() => generateChartData(user?.transactions || []), [user]);

  return (
    <Card className="shadow-md border-border">
      <CardHeader>
        <CardTitle>Account Activity</CardTitle>
        <CardDescription>Your account balance over the last 90 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
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
              tickFormatter={(value) => value.slice(0, 6)}
               minTickGap={20}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 'dataMax + 100']}
            />
            <Tooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="balance"
              type="monotone"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={<CustomDot />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
