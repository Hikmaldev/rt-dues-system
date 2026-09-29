import React from "react";
import { getHouseholds } from "@/lib/services/householdService";
import { StatusLookupClient } from "@/components/StatusLookupClient";

export const dynamic = "force-dynamic";

export default async function StatusLookupPage() {
  const households = await getHouseholds();

  return <StatusLookupClient initialHouseholds={households} />;
}
