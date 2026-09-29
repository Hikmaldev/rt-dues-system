import React from "react";
import { getHouseholds } from "@/lib/services/householdService";
import { db } from "@/lib/services/dbStore";
import { HouseholdsClient } from "@/components/HouseholdsClient";

export const dynamic = "force-dynamic";

export default async function HouseholdsPage() {
  const households = await getHouseholds();
  const blocks = await db.blocks.findMany();

  return <HouseholdsClient initialHouseholds={households} blocks={blocks} />;
}
