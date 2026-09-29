import React from "react";
import { getHouseholds } from "@/lib/services/householdService";
import { HomeClient } from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const households = await getHouseholds({ isActive: true });
  return <HomeClient featuredHouseholds={households} />;
}
