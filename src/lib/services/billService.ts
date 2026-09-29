import { db } from "./dbStore";
import { generateBillsSchema, recordPaymentSchema, GenerateBillsInput, RecordPaymentInput } from "@/lib/validations";
import { Bill } from "@/types/database";
import { isNeonConfigured, queryNeon } from "@/lib/db/neon";

function mapBillRow(row: any): Bill {
  return {
    id: String(row.id),
    household_id: String(row.household_id),
    household_name: String(row.household_name || "Warga RT"),
    house_number: String(row.house_number || "-"),
    house_status: row.house_status || "tetap",
    block_name: row.block_name || (row.house_status === "kontrakan" ? "Kontrakan" : "Rumah Tetap"),
    period: String(row.period),
    amount: Number(row.amount || 0),
    paid_amount: Number(row.paid_amount || 0),
    status: row.status,
    due_date: String(row.due_date),
    method: row.method || undefined,
    paid_at: row.paid_at || undefined,
    proof_file_url: row.proof_file_url || undefined,
    notes: row.notes || undefined,
  };
}

export async function getBills(filter?: {
  period?: string;
  status?: string;
  houseStatus?: string;
  blockName?: string;
  query?: string;
}) {
  if (isNeonConfigured()) {
    try {
      let sql = `
        SELECT 
          b.id,
          b.household_id,
          h.head_of_family_name as household_name,
          h.house_number,
          COALESCE(b.house_status, h.house_status, 'tetap') as house_status,
          COALESCE(b.block_name, CASE WHEN h.house_status = 'kontrakan' THEN 'Kontrakan' ELSE 'Rumah Tetap' END) as block_name,
          b.period,
          b.amount,
          b.paid_amount,
          b.status,
          b.due_date,
          b.method,
          b.paid_at,
          b.proof_file_url,
          b.notes
        FROM bills b
        JOIN households h ON b.household_id = h.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (filter?.period && filter.period !== "all") {
        params.push(filter.period);
        sql += ` AND b.period = $${params.length}`;
      }
      if (filter?.status && filter.status !== "all") {
        params.push(filter.status);
        sql += ` AND b.status = $${params.length}`;
      }
      if (filter?.houseStatus && filter.houseStatus !== "all") {
        params.push(filter.houseStatus);
        sql += ` AND (b.house_status = $${params.length} OR h.house_status = $${params.length})`;
      }
      if (filter?.query) {
        params.push(`%${filter.query}%`);
        sql += ` AND (h.head_of_family_name ILIKE $${params.length} OR h.house_number ILIKE $${params.length})`;
      }

      sql += ` ORDER BY b.created_at DESC`;
      const rows = await queryNeon(sql, params);
      return rows.map(mapBillRow);
    } catch (err) {
      console.warn("Neon query fallback to local store:", err);
    }
  }

  let items = await db.bills.findMany();

  if (filter?.period && filter.period !== "all") {
    items = items.filter((b) => b.period === filter.period);
  }
  if (filter?.status && filter.status !== "all") {
    items = items.filter((b) => b.status === filter.status);
  }
  if (filter?.houseStatus && filter.houseStatus !== "all") {
    items = items.filter((b) => b.house_status === filter.houseStatus);
  }
  if (filter?.blockName && filter.blockName !== "all") {
    items = items.filter((b) => b.block_name === filter.blockName || b.house_status === filter.blockName);
  }
  if (filter?.query) {
    const q = filter.query.toLowerCase();
    items = items.filter(
      (b) =>
        b.household_name.toLowerCase().includes(q) ||
        b.house_number.toLowerCase().includes(q)
    );
  }

  return items;
}

export async function getBillsByHousehold(householdId: string) {
  if (isNeonConfigured()) {
    try {
      const rows = await queryNeon(
        `SELECT 
          b.id,
          b.household_id,
          h.head_of_family_name as household_name,
          h.house_number,
          COALESCE(b.house_status, h.house_status, 'tetap') as house_status,
          COALESCE(b.block_name, CASE WHEN h.house_status = 'kontrakan' THEN 'Kontrakan' ELSE 'Rumah Tetap' END) as block_name,
          b.period,
          b.amount,
          b.paid_amount,
          b.status,
          b.due_date,
          b.method,
          b.paid_at,
          b.proof_file_url,
          b.notes
        FROM bills b
        JOIN households h ON b.household_id = h.id
        WHERE b.household_id = $1
        ORDER BY b.created_at DESC`,
        [householdId]
      );
      if (rows && rows.length > 0) {
        return rows.map(mapBillRow);
      }
    } catch (err) {
      console.warn("Neon lookup fallback to local store:", err);
    }
  }

  return await db.bills.findByHouseholdId(householdId);
}

export async function generateMonthlyBills(input: GenerateBillsInput) {
  // 1. Zod Validation
  const validated = generateBillsSchema.parse(input);

  if (isNeonConfigured()) {
    try {
      const households = await queryNeon(
        `SELECT id, house_status, house_number, head_of_family_name FROM households WHERE is_active = true`
      );
      const existingBills = await queryNeon(
        `SELECT household_id FROM bills WHERE period = $1`,
        [validated.period]
      );
      const existingHouseholdIds = new Set(existingBills.map((b: any) => String(b.household_id)));

      let createdCount = 0;
      for (const h of households) {
        if (existingHouseholdIds.has(String(h.id))) {
          continue;
        }

        const houseStatus = h.house_status || "tetap";
        const amount = houseStatus === "kontrakan" ? 5000 : 10000;
        const blockName = houseStatus === "kontrakan" ? "Kontrakan" : "Rumah Tetap";

        await queryNeon(
          `INSERT INTO bills (household_id, house_status, block_name, period, amount, paid_amount, status, due_date)
           VALUES ($1, $2, $3, $4, $5, 0, 'unpaid', $6)
           ON CONFLICT (household_id, period) DO NOTHING`,
          [h.id, houseStatus, blockName, validated.period, amount, validated.due_date]
        );
        createdCount++;
      }

      if (createdCount === 0) {
        return {
          success: true,
          message: `Semua tagihan untuk periode ${validated.period} sudah ada (tidak ada tagihan ganda).`,
          createdCount: 0,
        };
      }

      return {
        success: true,
        message: `Berhasil membuat ${createdCount} tagihan baru untuk periode ${validated.period}.`,
        createdCount,
      };
    } catch (err) {
      console.warn("Neon bill generation fallback to local store:", err);
    }
  }

  // 2. Fallback to local store
  const households = (await db.households.findMany()).filter((h) => h.is_active);
  const existingBills = await db.bills.findMany();

  const periodBills = existingBills.filter((b) => b.period === validated.period);
  const existingHouseholdIds = new Set(periodBills.map((b) => b.household_id));

  const newBillsToCreate: Bill[] = [];

  for (const h of households) {
    if (existingHouseholdIds.has(h.id)) {
      continue;
    }

    const houseStatus = h.house_status || "tetap";
    const amount = houseStatus === "kontrakan" ? 5000 : 10000;

    newBillsToCreate.push({
      id: `bill-${Date.now()}-${h.id.slice(-4)}`,
      household_id: h.id,
      household_name: h.head_of_family_name,
      house_number: h.house_number,
      house_status: houseStatus,
      block_name: houseStatus === "kontrakan" ? "Kontrakan" : "Rumah Tetap",
      period: validated.period,
      amount,
      paid_amount: 0,
      status: "unpaid",
      due_date: validated.due_date,
    });
  }

  if (newBillsToCreate.length === 0) {
    return {
      success: true,
      message: `Semua tagihan untuk periode ${validated.period} sudah ada (tidak ada tagihan ganda).`,
      createdCount: 0,
    };
  }

  await db.bills.createMany(newBillsToCreate);

  return {
    success: true,
    message: `Berhasil membuat ${newBillsToCreate.length} tagihan baru untuk periode ${validated.period}.`,
    createdCount: newBillsToCreate.length,
  };
}

export async function recordPayment(input: RecordPaymentInput) {
  // 1. Zod Validation
  const validated = recordPaymentSchema.parse(input);

  const now = new Date();
  const formattedTime =
    now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    ", " +
    now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  if (isNeonConfigured()) {
    try {
      const existing = await queryNeon(`SELECT * FROM bills WHERE id = $1`, [validated.bill_id]);
      if (existing && existing.length > 0) {
        const bill = existing[0];
        const paidAmount =
          validated.status === "paid"
            ? Number(bill.amount)
            : validated.status === "unpaid"
            ? 0
            : Number(validated.paid_amount || 0);

        const updatedRows = await queryNeon(
          `UPDATE bills
           SET status = $1, paid_amount = $2, method = $3, paid_at = $4, notes = $5, proof_file_url = $6, updated_at = now()
           WHERE id = $7
           RETURNING *`,
          [
            validated.status,
            paidAmount,
            validated.method || null,
            validated.status !== "unpaid" ? formattedTime : null,
            validated.notes || bill.notes || null,
            validated.proof_file_url || bill.proof_file_url || null,
            validated.bill_id,
          ]
        );

        if (validated.status !== "unpaid" && paidAmount > 0) {
          await queryNeon(
            `INSERT INTO payments (bill_id, paid_amount, method, proof_file_url, notes)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              validated.bill_id,
              paidAmount,
              validated.method || "cash",
              validated.proof_file_url || null,
              validated.notes || null,
            ]
          );
        }

        if (updatedRows && updatedRows.length > 0) {
          return mapBillRow(updatedRows[0]);
        }
      }
    } catch (err) {
      console.warn("Neon payment record fallback to local store:", err);
    }
  }

  const existingBill = await db.bills.findById(validated.bill_id);
  if (!existingBill) {
    throw new Error("Tagihan tidak ditemukan");
  }

  const updatedBill: Partial<Bill> = {
    status: validated.status,
    paid_amount:
      validated.status === "paid"
        ? existingBill.amount
        : validated.status === "unpaid"
        ? 0
        : validated.paid_amount,
    method: validated.method,
    paid_at: validated.status !== "unpaid" ? formattedTime : undefined,
    proof_file_url: validated.proof_file_url || existingBill.proof_file_url,
    notes: validated.notes || existingBill.notes,
  };

  const result = await db.bills.update(validated.bill_id, updatedBill);
  return result;
}
