import { Block, Household, Bill, FundUsage, Payment, ReminderLog } from "@/types/database";
import { mockBlocks, mockHouseholds, mockBills, mockFundUsages, mockReminders } from "@/lib/mockData";
import { isNeonConfigured, queryNeon } from "@/lib/db/neon";

// In-memory persistent state for local development when Neon credentials are not yet configured
let blocksStore: Block[] = [...mockBlocks];
let householdsStore: Household[] = [...mockHouseholds];
let billsStore: Bill[] = [...mockBills];
let fundUsagesStore: FundUsage[] = [...mockFundUsages];
let remindersStore: ReminderLog[] = [...mockReminders];

export const db = {
  blocks: {
    findMany: async () => {
      if (isNeonConfigured()) {
        try {
          const rows = await queryNeon(
            `SELECT b.id, b.name, b.monthly_due_amount::numeric as monthly_due_amount,
                    (SELECT COUNT(*)::int FROM households h WHERE h.block_id = b.id) as total_houses
             FROM blocks b
             ORDER BY b.name ASC`
          );
          if (rows && rows.length > 0) {
            return rows.map((r: any) => ({
              id: String(r.id),
              name: String(r.name),
              monthly_due_amount: Number(r.monthly_due_amount),
              total_houses: Number(r.total_houses || 0),
            }));
          }
        } catch (err) {
          console.warn("Neon blocks query fallback to memory store:", err);
        }
      }
      return blocksStore;
    },
    findById: async (id: string) => blocksStore.find((b) => b.id === id),
  },

  households: {
    findMany: async () => householdsStore,
    findById: async (id: string) => householdsStore.find((h) => h.id === id),
    findByAccessCode: async (code: string) =>
      householdsStore.find(
        (h) => h.access_code.toUpperCase() === code.trim().toUpperCase()
      ),
    create: async (data: Household) => {
      householdsStore = [data, ...householdsStore];
      return data;
    },
    update: async (id: string, partial: Partial<Household>) => {
      householdsStore = householdsStore.map((h) =>
        h.id === id ? { ...h, ...partial } : h
      );
      return householdsStore.find((h) => h.id === id);
    },
  },

  bills: {
    findMany: async () => billsStore,
    findById: async (id: string) => billsStore.find((b) => b.id === id),
    findByHouseholdId: async (householdId: string) =>
      billsStore.filter((b) => b.household_id === householdId),
    createMany: async (newBills: Bill[]) => {
      billsStore = [...newBills, ...billsStore];
      return newBills;
    },
    update: async (id: string, partial: Partial<Bill>) => {
      billsStore = billsStore.map((b) =>
        b.id === id ? { ...b, ...partial } : b
      );
      return billsStore.find((b) => b.id === id);
    },
  },

  fundUsages: {
    findMany: async () => fundUsagesStore,
    create: async (data: FundUsage) => {
      fundUsagesStore = [data, ...fundUsagesStore];
      return data;
    },
  },

  reminders: {
    findMany: async () => remindersStore,
  },
};
