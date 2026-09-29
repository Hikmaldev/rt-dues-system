import React from "react";
import { getTransparencySummary } from "@/lib/services/transparencyService";
import { TransparencyClient } from "@/components/TransparencyClient";

export const dynamic = "force-dynamic";

export default async function TransparencyPage() {
  const summaryData = await getTransparencySummary();

  return <TransparencyClient initialData={summaryData} />;
}
