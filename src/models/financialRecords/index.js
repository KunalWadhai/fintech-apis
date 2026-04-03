import mongoose from "mongoose";
import { financialRecordSchema } from "../../schema/financialRecords/schema.js";

export const FinancialRecord = mongoose.model("FinancialRecord", financialRecordSchema);
