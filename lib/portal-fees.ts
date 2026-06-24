import { desc, eq, inArray } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';

export const FEE_STATUS_LABELS: Record<string, string> = {
  paid: 'Paid in full',
  partial: 'Partially paid',
  outstanding: 'Outstanding',
  overdue: 'Overdue',
};

export function formatFeeAmount(cents: number, currency = 'USD') {
  const amount = cents / 100;
  const formatted = amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);
  return `${currency} ${formatted}`;
}

export function formatFeeDueDate(date: Date | null | undefined) {
  if (!date) return undefined;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export type FeeLineItem = {
  id: string;
  reference: string;
  description: string;
  amount: string;
  amountCents: number;
  status: string;
  statusLabel: string;
  dueDate?: string;
  paidAt?: string;
  studentId: string;
  studentName?: string;
  studentNumber?: string;
};

function mapInvoice(
  row: typeof schema.feeInvoices.$inferSelect,
  student?: { firstName: string; surname: string; studentNumber: string }
): FeeLineItem {
  return {
    id: row.id,
    reference: row.reference,
    description: row.description,
    amount: formatFeeAmount(row.amountCents, row.currency),
    amountCents: row.amountCents,
    status: row.status,
    statusLabel: FEE_STATUS_LABELS[row.status] || row.status,
    dueDate: formatFeeDueDate(row.dueDate),
    paidAt: formatFeeDueDate(row.paidAt),
    studentId: row.studentId,
    studentName: student ? `${student.firstName} ${student.surname}` : undefined,
    studentNumber: student?.studentNumber,
  };
}

export async function getFeesForStudent(studentId: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.feeInvoices)
    .where(eq(schema.feeInvoices.studentId, studentId))
    .orderBy(desc(schema.feeInvoices.dueDate), desc(schema.feeInvoices.createdAt));

  return rows.map((row) => mapInvoice(row));
}

export async function getFeesForStudents(studentIds: string[]) {
  if (studentIds.length === 0) return [];

  const db = getDb();
  const rows = await db
    .select({
      invoice: schema.feeInvoices,
      student: schema.students,
    })
    .from(schema.feeInvoices)
    .innerJoin(schema.students, eq(schema.feeInvoices.studentId, schema.students.id))
    .where(inArray(schema.feeInvoices.studentId, studentIds))
    .orderBy(desc(schema.feeInvoices.dueDate), desc(schema.feeInvoices.createdAt));

  return rows.map(({ invoice, student }) => mapInvoice(invoice, student));
}

export function summarizeFees(items: FeeLineItem[]) {
  const outstanding = items
    .filter((i) => i.status === 'outstanding' || i.status === 'overdue' || i.status === 'partial')
    .reduce((sum, i) => sum + i.amountCents, 0);

  return {
    totalOutstanding: formatFeeAmount(outstanding),
    totalOutstandingCents: outstanding,
    itemCount: items.length,
  };
}
