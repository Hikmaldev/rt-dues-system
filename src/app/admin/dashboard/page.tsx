import React from "react";
import { getHouseholds } from "@/lib/services/householdService";
import { getBills } from "@/lib/services/billService";
import { db } from "@/lib/services/dbStore";
import { formatRupiah } from "@/lib/mockData";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const selectedMonth = "September 2026";
  const households = await getHouseholds();
  const bills = await getBills({ period: selectedMonth });
  const blocks = await db.blocks.findMany();

  const activeHouseholds = households.filter((h) => h.is_active);
  const totalHouses = activeHouseholds.length;

  const paidBills = bills.filter((b) => b.status === "paid");
  const unpaidBills = bills.filter((b) => b.status === "unpaid");
  const partialBills = bills.filter((b) => b.status === "partial");

  const paidHouses = paidBills.length;
  const unpaidHouses = unpaidBills.length;
  const partialHouses = partialBills.length;

  const totalCollected = bills.reduce((sum, b) => sum + (b.paid_amount || 0), 0);
  const targetAmount = bills.reduce((sum, b) => sum + b.amount, 0);
  const paidPercentage =
    bills.length > 0 ? Math.round((paidHouses / bills.length) * 100) : 0;

  // Status Rumah statistics (FR: Rumah Tetap Rp 10.000/bln, Kontrakan Rp 5.000/bln)
  const tetapBills = bills.filter(
    (b) => b.house_status === "tetap" || b.amount === 10000 || b.block_name === "Rumah Tetap"
  );
  const kontrakanBills = bills.filter(
    (b) => b.house_status === "kontrakan" || b.amount === 5000 || b.block_name === "Kontrakan"
  );

  const houseStatusStats = [
    {
      name: "Rumah Tetap / Milik",
      statusKey: "tetap",
      rate: 10000,
      total: tetapBills.length,
      paid: tetapBills.filter((b) => b.status === "paid").length,
      percent:
        tetapBills.length > 0
          ? Math.round(
              (tetapBills.filter((b) => b.status === "paid").length /
                tetapBills.length) *
                100
            )
          : 0,
      target: tetapBills.reduce((s, b) => s + b.amount, 0),
      collected: tetapBills.reduce((s, b) => s + (b.paid_amount || 0), 0),
    },
    {
      name: "Rumah Kontrakan",
      statusKey: "kontrakan",
      rate: 5000,
      total: kontrakanBills.length,
      paid: kontrakanBills.filter((b) => b.status === "paid").length,
      percent:
        kontrakanBills.length > 0
          ? Math.round(
              (kontrakanBills.filter((b) => b.status === "paid").length /
                kontrakanBills.length) *
                100
            )
          : 0,
      target: kontrakanBills.reduce((s, b) => s + b.amount, 0),
      collected: kontrakanBills.reduce((s, b) => s + (b.paid_amount || 0), 0),
    },
  ];

  const totalTetap = activeHouseholds.filter((h) => (h.house_status || "tetap") === "tetap").length;
  const totalKontrakan = activeHouseholds.filter((h) => h.house_status === "kontrakan").length;

  // Attention list: households with unpaid or partial dues
  const attentionList = bills
    .filter((b) => b.status === "unpaid" || b.status === "partial")
    .slice(0, 5)
    .map((b) => {
      const isKontrakan = b.house_status === "kontrakan" || b.amount === 5000;
      return {
        name: b.household_name,
        house: `${b.house_number} (${isKontrakan ? "Kontrakan · Rp 5.000" : "Rumah Tetap · Rp 10.000"})`,
        overdue: b.status === "unpaid" ? "Belum membayar" : "Sebagian",
        color: b.status === "unpaid" ? "rose" : "amber",
      };
    });

  // Recent payment transactions
  const recentActivities = bills
    .filter((b) => b.paid_at)
    .slice(0, 4)
    .map((b) => {
      const isKontrakan = b.house_status === "kontrakan" || b.amount === 5000;
      return {
        name: b.household_name,
        house: `${b.house_number} (${isKontrakan ? "Kontrakan" : "Rumah Tetap"})`,
        action:
          b.status === "paid" ? "Pembayaran iuran lunas" : "Pembayaran sebagian",
        amount: formatRupiah(b.paid_amount || b.amount),
        time: b.paid_at || "-",
        type: b.status,
      };
    });

  const initialData = {
    totalHouses,
    paidHouses,
    unpaidHouses,
    partialHouses,
    totalCollected,
    targetAmount,
    paidPercentage,
    selectedMonth,
    houseStatusStats,
    totalTetap,
    totalKontrakan,
    attentionList,
    recentActivities,
    blocks,
  };

  return <AdminDashboardClient initialData={initialData} />;
}
