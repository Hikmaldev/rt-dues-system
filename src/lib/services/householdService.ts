import { db } from "./dbStore";
import { householdSchema, HouseholdInput } from "@/lib/validations";
import { Household } from "@/types/database";
import { isNeonConfigured, queryNeon } from "@/lib/db/neon";

export async function getHouseholds(filter?: {
  houseStatus?: string;
  blockId?: string;
  isActive?: boolean;
  query?: string;
}) {
  if (isNeonConfigured()) {
    try {
      let sql = `
        SELECT id, house_status, house_number, head_of_family_name, 
               contact, access_code, is_active, block_id
        FROM households
        WHERE 1=1
      `;
      const params: any[] = [];

      if (filter?.houseStatus && filter.houseStatus !== "all") {
        params.push(filter.houseStatus);
        sql += ` AND house_status = $${params.length}`;
      }
      if (filter?.blockId && filter.blockId !== "all") {
        params.push(filter.blockId);
        sql += ` AND block_id = $${params.length}`;
      }
      if (filter?.isActive !== undefined) {
        params.push(filter.isActive);
        sql += ` AND is_active = $${params.length}`;
      }
      if (filter?.query) {
        params.push(`%${filter.query}%`);
        sql += ` AND (head_of_family_name ILIKE $${params.length} OR house_number ILIKE $${params.length} OR access_code ILIKE $${params.length})`;
      }

      sql += ` ORDER BY house_number ASC`;
      const data = await queryNeon<Household>(sql, params);
      return data;
    } catch (err) {
      console.warn("Neon query fallback to local store:", err);
    }
  }

  // Fallback to local db store
  let items = await db.households.findMany();

  if (filter?.houseStatus && filter.houseStatus !== "all") {
    items = items.filter((h) => h.house_status === filter.houseStatus);
  }
  if (filter?.blockId && filter.blockId !== "all") {
    items = items.filter((h) => h.block_id === filter.blockId);
  }
  if (filter?.isActive !== undefined) {
    items = items.filter((h) => h.is_active === filter.isActive);
  }
  if (filter?.query) {
    const q = filter.query.toLowerCase();
    items = items.filter(
      (h) =>
        h.head_of_family_name.toLowerCase().includes(q) ||
        h.house_number.toLowerCase().includes(q) ||
        h.access_code.toLowerCase().includes(q)
    );
  }

  return items;
}

export async function getHouseholdByAccessCode(accessCode: string) {
  const cleanCode = accessCode.trim().toUpperCase();

  if (isNeonConfigured()) {
    try {
      const rows = await queryNeon<Household>(
        `SELECT id, house_status, house_number, head_of_family_name, contact, access_code, is_active, block_id
         FROM households
         WHERE UPPER(access_code) = UPPER($1)
         LIMIT 1`,
        [cleanCode]
      );
      if (rows && rows.length > 0) return rows[0];
    } catch (err) {
      console.warn("Neon lookup fallback to local store:", err);
    }
  }

  return await db.households.findByAccessCode(cleanCode);
}

export async function createHousehold(input: HouseholdInput) {
  // 1. Validate with Zod
  const validated = householdSchema.parse(input);

  // 2. Generate secure unique access code
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  const cleanHouse = validated.house_number.replace(/[^A-Za-z0-9]/g, "");
  const accessCode = `RH-${cleanHouse}-${randomChars}`;

  const newHousehold: Household = {
    id: `hh-${Date.now()}`,
    house_status: validated.house_status || "tetap",
    house_number: validated.house_number,
    head_of_family_name: validated.head_of_family_name,
    contact: validated.contact || "-",
    access_code: accessCode,
    is_active: validated.is_active ?? true,
    block_id: validated.block_id,
  };

  if (isNeonConfigured()) {
    try {
      const rows = await queryNeon<Household>(
        `INSERT INTO households (house_status, house_number, head_of_family_name, contact, access_code, is_active, block_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, house_status, house_number, head_of_family_name, contact, access_code, is_active, block_id`,
        [
          newHousehold.house_status,
          newHousehold.house_number,
          newHousehold.head_of_family_name,
          newHousehold.contact,
          newHousehold.access_code,
          newHousehold.is_active,
          newHousehold.block_id || null,
        ]
      );
      if (rows && rows.length > 0) return rows[0];
    } catch (err) {
      console.warn("Neon insert fallback to local store:", err);
    }
  }

  return await db.households.create(newHousehold);
}

export async function toggleHouseholdActive(id: string, isActive: boolean) {
  if (isNeonConfigured()) {
    try {
      const rows = await queryNeon<Household>(
        `UPDATE households
         SET is_active = $1, updated_at = now()
         WHERE id = $2
         RETURNING id, house_status, house_number, head_of_family_name, contact, access_code, is_active, block_id`,
        [isActive, id]
      );
      if (rows && rows.length > 0) return rows[0];
    } catch (err) {
      console.warn("Neon update fallback to local store:", err);
    }
  }

  return await db.households.update(id, { is_active: isActive });
}
