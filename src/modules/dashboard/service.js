import * as recordStore from "../../models/financialRecords/services.js";

export const getDashboardSummary = async () => {
  const [totals, categoryTotals, monthlyTrends, recentActivity] =
    await recordStore.loadDashboardSummaryData();

  const totalIncome = totals.find((item) => item._id === "income")?.total || 0;
  const totalExpenses = totals.find((item) => item._id === "expense")?.total || 0;

  return {
    totals: {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
    },
    categoryTotals,
    monthlyTrends,
    recentActivity,
  };
};
