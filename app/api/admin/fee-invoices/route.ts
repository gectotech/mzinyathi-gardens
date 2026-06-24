import { NextRequest } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { getDb, schema } from '@/lib/db';
import { formatFeeAmount } from '@/lib/portal-fees';

function nextInvoiceReference() {
  const year = new Date().getFullYear();
  const suffix = String(Date.now()).slice(-6);
  return `INV-${year}-${suffix}`;
}

export async function GET(request: NextRequest) {
  try {
    await requirePermission('school_students');
    const studentId = request.nextUrl.searchParams.get('studentId');

    const db = getDb();
    const conditions = studentId ? [eq(schema.feeInvoices.studentId, studentId)] : [];

    const rows = await db
      .select({
        invoice: schema.feeInvoices,
        studentNumber: schema.students.studentNumber,
        firstName: schema.students.firstName,
        surname: schema.students.surname,
      })
      .from(schema.feeInvoices)
      .innerJoin(schema.students, eq(schema.feeInvoices.studentId, schema.students.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(schema.feeInvoices.createdAt))
      .limit(100);

    const invoices = rows.map(({ invoice, studentNumber, firstName, surname }) => ({
      ...invoice,
      amount: formatFeeAmount(invoice.amountCents, invoice.currency),
      learnerName: `${firstName} ${surname}`,
      studentNumber,
    }));

    return jsonOk({ invoices });
  } catch (error) {
    return handleAuthError(error);
  }
}

const createSchema = z.object({
  studentId: z.string().uuid(),
  description: z.string().min(2),
  amountCents: z.number().int().positive(),
  currency: z.string().min(3).max(3).optional(),
  status: z.enum(['paid', 'partial', 'outstanding', 'overdue']).optional(),
  dueDate: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('school_students', true);
    const body = await request.json();
    const data = createSchema.parse(body);

    const db = getDb();
    const [student] = await db
      .select()
      .from(schema.students)
      .where(eq(schema.students.id, data.studentId))
      .limit(1);

    if (!student) return jsonError('Student not found', 404);

    const [invoice] = await db
      .insert(schema.feeInvoices)
      .values({
        studentId: data.studentId,
        reference: nextInvoiceReference(),
        description: data.description,
        amountCents: data.amountCents,
        currency: data.currency || 'USD',
        status: data.status || 'outstanding',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        paidAt: data.status === 'paid' ? new Date() : null,
      })
      .returning();

    await logAudit(user.id, 'create', 'fee_invoice', invoice.id, {
      studentId: data.studentId,
      reference: invoice.reference,
    });

    return jsonOk({
      invoice: {
        ...invoice,
        amount: formatFeeAmount(invoice.amountCents, invoice.currency),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid request', 400);
    return handleAuthError(error);
  }
}

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['paid', 'partial', 'outstanding', 'overdue']).optional(),
  description: z.string().min(2).optional(),
  dueDate: z.string().nullable().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const user = await requirePermission('school_students', true);
    const body = await request.json();
    const data = patchSchema.parse(body);

    const db = getDb();
    const updates: Partial<typeof schema.feeInvoices.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (data.description) updates.description = data.description;
    if (data.dueDate !== undefined) updates.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    if (data.status) {
      updates.status = data.status;
      updates.paidAt = data.status === 'paid' ? new Date() : null;
    }

    const [invoice] = await db
      .update(schema.feeInvoices)
      .set(updates)
      .where(eq(schema.feeInvoices.id, data.id))
      .returning();

    if (!invoice) return jsonError('Invoice not found', 404);

    await logAudit(user.id, 'update', 'fee_invoice', invoice.id, { status: invoice.status });

    return jsonOk({ invoice });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid request', 400);
    return handleAuthError(error);
  }
}
