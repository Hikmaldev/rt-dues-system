import React from "react";
import { db } from "@/lib/services/dbStore";
import { getBills } from "@/lib/services/billService";
import { FundUsageClient } from "@/components/FundUsageClient";

export const dynamic = "force-dynamic";

export default async function FundUsageAdminPage() {
  const usages = await db.fundUsages.findMany();
  const bills = await getBills({ period: "September 2026" });
  const totalIncome = bills.reduce((sum, b) => sum + (b.paid_amount || 0), 0);

  return <FundUsageClient initialUsages={usages} totalIncome={totalIncome} />;
}
