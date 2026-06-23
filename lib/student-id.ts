/**
 * Student number engine — mirrors Supabase trigger spec (MGP + YY + 4-digit seq + A–Z).
 * Implemented in application layer for Neon/Drizzle; immutable once assigned.
 *
 * Format: MGP260001A (no hyphen) — distinct from application tracking IDs (MGP-######).
 */
import { desc, sql, like } from 'drizzle-orm';
import type { Db } from '@/lib/db';
import { schema } from '@/lib/db';

function currentYearSuffix() {
  return String(new Date().getFullYear()).slice(-2);
}

function randomLetter() {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

export function formatStudentNumber(yearSuffix: string, sequence: number, letter: string) {
  return `MGP${yearSuffix}${String(sequence).padStart(4, '0')}${letter}`;
}

export function isStudentNumber(id: string) {
  return /^MGP\d{2}\d{4}[A-Z]$/i.test(id.trim());
}

/**
 * Allocate the next student number for the current calendar year.
 * Uses MAX sequence from existing rows for collision-safe increments.
 */
export async function allocateStudentNumber(db: Db): Promise<string> {
  const yy = currentYearSuffix();
  const prefix = `MGP${yy}`;

  const [row] = await db
    .select({ studentNumber: schema.students.studentNumber })
    .from(schema.students)
    .where(like(schema.students.studentNumber, `${prefix}%`))
    .orderBy(desc(schema.students.studentNumber))
    .limit(1);

  let nextSeq = 1;
  if (row?.studentNumber) {
    const match = row.studentNumber.match(/^MGP\d{2}(\d{4})[A-Z]$/i);
    if (match) nextSeq = parseInt(match[1], 10) + 1;
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const letter = randomLetter();
    const candidate = formatStudentNumber(yy, nextSeq + attempt, letter);
    const [existing] = await db
      .select({ id: schema.students.id })
      .from(schema.students)
      .where(sql`upper(${schema.students.studentNumber}) = ${candidate.toUpperCase()}`)
      .limit(1);
    if (!existing) return candidate;
  }

  throw new Error('Could not allocate a unique student number');
}
