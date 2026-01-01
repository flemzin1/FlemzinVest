import { InvestmentChart } from "@/components/dashboard/investment-chart";
import { InvestmentsOverview } from "@/components/dashboard/investments-overview";
import { BalanceSummaryCard } from "@/components/dashboard/balance-summary-card";
import { ActivitySummaryCard } from "@/components/dashboard/activity-summary-card";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 mb-16 md:mb-0">
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <BalanceSummaryCard showAddMoneyButton={true} />
        <ActivitySummaryCard />
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-8">
        <InvestmentChart />
      </div>
      <div>
        <InvestmentsOverview />
      </div>
    </div>
  );
}
