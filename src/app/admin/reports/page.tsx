import React from "react";
import { getBills } from "@/lib/services/billService";
import { db } from "@/lib/services/dbStore";
import { ReportsClient } from "@/components/ReportsClient";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const bills = await getBills();
  const blocks = await db.blocks.findMany();

  return <ReportsClient initialBills={bills} blocks={blocks} />;
}
