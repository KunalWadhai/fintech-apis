import { FinancialRecord } from "../../models/financialRecords/index.js";

export const getDashboardSummary = async () => {
  const [totals, categoryTotals, monthlyTrends, recentActivity] = await Promise.all([
    FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]),
    FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { type: "$type", category: "$category" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]),
    FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
    FinancialRecord.find({ isDeleted: false }).sort({ date: -1, createdAt: -1 }).limit(10),
  ]);

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
