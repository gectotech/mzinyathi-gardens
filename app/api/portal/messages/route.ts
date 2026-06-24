import { NextRequest } from 'next/server';
import { z } from 'zod';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { getDb, schema } from '@/lib/db';
import { countUnreadMessages, getMessageRecipients, listMessagesForAccount, markMessageRead } from '@/lib/portal-messages';
import { getPortalSession } from '@/lib/portal-session';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getPortalSession();
    if (!session) return jsonError('Unauthorized', 401);

    const db = getDb();
    const [account] = await db
      .select()
      .from(schema.portalAccounts)
      .where(eq(schema.portalAccounts.id, session.accountId))
      .limit(1);

    if (!account) {
      const unreadOnly = request.nextUrl.searchParams.get('unreadOnly') === 'true';
      if (unreadOnly) return jsonOk({ count: 0, messages: [] });
      return jsonOk({ messages: [], unreadCount: 0 });
    }

    const unreadOnly = request.nextUrl.searchParams.get('unreadOnly') === 'true';
    if (unreadOnly) {
      const count = await countUnreadMessages(account.id);
      return jsonOk({ count });
    }

    const messages = await listMessagesForAccount(account.id);
    const unreadCount = messages.filter((m) => !m.isRead).length;
    const recipients = await getMessageRecipients(account);
    return jsonOk({ messages, unreadCount, recipients });
  } catch (error) {
    return handleAuthError(error);
  }
}

const patchSchema = z.object({
  messageId: z.string().uuid(),
  action: z.literal('mark_read'),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await getPortalSession();
    if (!session) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const data = patchSchema.parse(body);

    const updated = await markMessageRead(data.messageId, session.accountId);
    if (!updated) return jsonError('Message not found', 404);

    return jsonOk({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid request', 400);
    return handleAuthError(error);
  }
}

const postSchema = z.object({
  recipientAccountId: z.string().uuid(),
  subject: z.string().min(2),
  body: z.string().min(2),
  studentId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getPortalSession();
    if (!session) return jsonError('Unauthorized', 401);

    const db = getDb();
    const [account] = await db
      .select()
      .from(schema.portalAccounts)
      .where(eq(schema.portalAccounts.id, session.accountId))
      .limit(1);

    if (!account) return jsonError('Portal account not found', 404);

    const body = await request.json();
    const data = postSchema.parse(body);

    const [recipient] = await db
      .select()
      .from(schema.portalAccounts)
      .where(eq(schema.portalAccounts.id, data.recipientAccountId))
      .limit(1);

    if (!recipient) return jsonError('Recipient not found', 404);

    const { sendPortalMessage } = await import('@/lib/portal-messages');
    const message = await sendPortalMessage({
      senderAccountId: account.id,
      senderName: `${account.firstName} ${account.lastName}`,
      senderRole: account.role as 'student' | 'teacher' | 'parent',
      recipientAccountId: data.recipientAccountId,
      subject: data.subject,
      body: data.body,
      studentId: data.studentId,
    });

    return jsonOk({ message: { id: message.id } });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid request', 400);
    return handleAuthError(error);
  }
}
