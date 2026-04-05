import { FinancialRecord } from "./index.js";

const activeMatch = { isDeleted: false };

const buildListFilter = ({ type, category, startDate, endDate }) => {
  const filter = { ...activeMatch };
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  return filter;
};

export const insertFinancialRecord = (payload) => FinancialRecord.create(payload);

export const listFinancialRecordsWithTotal = async (criteria, { skip, limit }) => {
  const filter = buildListFilter(criteria);
  const sort = { date: -1, createdAt: -1 };
  const [items, total] = await Promise.all([
    FinancialRecord.find(filter).sort(sort).skip(skip).limit(limit),
    FinancialRecord.countDocuments(filter),
  ]);
  return { items, total };
};

export const updateFinancialRecordById = (recordId, payload) =>
  FinancialRecord.findOneAndUpdate({ _id: recordId, ...activeMatch }, payload, {
    returnDocument: "after",
    runValidators: true,
  });

export const softDeleteFinancialRecordById = (recordId) =>
  FinancialRecord.findOneAndUpdate(
    { _id: recordId, ...activeMatch },
    { isDeleted: true },
    { returnDocument: "after" }
  );

export const loadDashboardSummaryData = () =>
  Promise.all([
    FinancialRecord.aggregate([
      { $match: activeMatch },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    FinancialRecord.aggregate([
      { $match: activeMatch },
      { $group: { _id: { type: "$type", category: "$category" }, total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]),
    FinancialRecord.aggregate([
      { $match: activeMatch },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
    FinancialRecord.find(activeMatch).sort({ date: -1, createdAt: -1 }).limit(10),
  ]);
