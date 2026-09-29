import { db } from "./dbStore";
import { fundUsageSchema, FundUsageInput } from "@/lib/validations";
import { FundUsage } from "@/types/database";
import { isNeonConfigured, queryNeon } from "@/lib/db/neon";
import { getBills } from "./billService";

export async function getTransparencySummary() {
  let fundUsages: FundUsage[] = [];

  if (isNeonConfigured()) {
    try {
      const rows = await queryNeon(
        `SELECT id, period, category, amount::numeric as amount, description, icon_type
         FROM fund_usages
         ORDER BY created_at DESC`
      );
      fundUsages = rows.map((r: any) => ({
        id: String(r.id),
        period: String(r.period),
        category: String(r.category),
        amount: Number(r.amount),
        description: String(r.description),
        icon_type: r.icon_type || "shield",
      }));
    } catch (err) {
      console.warn("Neon transparency summary fallback to local store:", err);
      fundUsages = await db.fundUsages.findMany();
    }
  } else {
    fundUsages = await db.fundUsages.findMany();
  }

  const bills = await getBills();

  // Aggregate stats (Zero resident PII, satisfying FR-PUB-03)
  const totalCollectedMonth = bills
    .filter((b) => b.period === "September 2026")
    .reduce((sum, b) => sum + (b.paid_amount || 0), 0);

  const totalExpenseMonth = fundUsages
    .filter((f) => f.period === "September 2026")
    .reduce((sum, f) => sum + f.amount, 0);

  const totalCollectedYear = 86400000;
  const totalExpenseYear = 51250000;
  const currentBalance = totalCollectedYear - totalExpenseYear;

  return {
    period: "September 2026",
    summary: {
      totalCollectedMonth,
      totalExpenseMonth,
      totalCollectedYear,
      totalExpenseYear,
      currentBalance,
    },
    usages: fundUsages,
  };
}

export async function createFundUsage(input: FundUsageInput) {
  const validated = fundUsageSchema.parse(input);

  const newUsage: FundUsage = {
    id: `fu-${Date.now()}`,
    period: validated.period,
    category: validated.category,
    amount: validated.amount,
    description: validated.description,
    icon_type: "shield",
  };

  if (isNeonConfigured()) {
    try {
      const rows = await queryNeon(
        `INSERT INTO fund_usages (period, category, amount, description, icon_type)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, period, category, amount::numeric as amount, description, icon_type`,
        [validated.period, validated.category, validated.amount, validated.description, "shield"]
      );
      if (rows && rows.length > 0) {
        return {
          id: String(rows[0].id),
          period: String(rows[0].period),
          category: String(rows[0].category),
          amount: Number(rows[0].amount),
          description: String(rows[0].description),
          icon_type: rows[0].icon_type,
        };
      }
    } catch (err) {
      console.warn("Neon fund usage insert fallback to local store:", err);
    }
  }

  return await db.fundUsages.create(newUsage);
}
