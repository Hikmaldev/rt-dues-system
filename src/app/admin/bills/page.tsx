import React from "react";
import { getBills } from "@/lib/services/billService";
import { db } from "@/lib/services/dbStore";
import { BillsClient } from "@/components/BillsClient";

export const dynamic = "force-dynamic";

export default async function BillsPage() {
  const bills = await getBills();
  const blocks = await db.blocks.findMany();

  return <BillsClient initialBills={bills} blocks={blocks} />;
}
