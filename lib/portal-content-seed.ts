import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { DEMO_ACCOUNTS } from '@/lib/portal-auth';

const DEMO_POSTS = [
  {
    title: 'Uniform policy update',
    excerpt: 'New uniform requirements effective Term 3. Please review the updated dress code.',
    content: 'All learners must wear the official Mzinyathi Gardens uniform from Term 3 onwards.',
    imageUrl: '/school/student.jpg',
    category: 'news' as const,
  },
  {
    title: 'Transport route changes',
    excerpt: 'Pickup times adjusted for Route B and Kensington drop-off points.',
    content: 'Route B morning pickup moves to 06:45. Kensington drop-off now at 15:30.',
    imageUrl: '/school/school1.jpg',
    category: 'news' as const,
  },
  {
    title: 'Health & safety briefing',
    excerpt: 'Mandatory safety orientation for all families — read the circular.',
    content: 'A health and safety briefing will be held for all parents on the first Friday of term.',
    imageUrl: '/school/staff.jpg',
    category: 'activity' as const,
  },
  {
    title: 'Parent meetings — Grade 4 & 5',
    excerpt: 'Meet your child’s class teacher and review mid-term progress.',
    content: 'Parent-teacher meetings for Grades 4 and 5 on 28 May 2026.',
    imageUrl: '/school/schooldev.jpg',
    category: 'event' as const,
    publishedAt: new Date('2026-05-28'),
  },
  {
    title: 'Sports day',
    excerpt: 'All families welcome — learners compete in track and field events.',
    content: 'Annual sports day on 2 June 2026. Gates open at 08:00.',
    imageUrl: '/school/student.jpg',
    category: 'event' as const,
    publishedAt: new Date('2026-06-02'),
  },
  {
    title: 'Mid-year exams',
    excerpt: 'Examination timetable published for Grades 4–7.',
    content: 'Mid-year examinations run from 14–20 June 2026.',
    imageUrl: '/school/school1.jpg',
    category: 'event' as const,
    publishedAt: new Date('2026-06-14'),
  },
  {
    title: 'Term 2 ends',
    excerpt: 'School closes at 12:00 on the last day of term.',
    content: 'Term 2 concludes on 4 July 2026. Report cards available from 7 July.',
    imageUrl: '/school/schooldev.jpg',
    category: 'event' as const,
    publishedAt: new Date('2026-07-04'),
  },
];

const DEMO_FEES = [
  {
    reference: 'INV-2026-0401',
    description: 'Term 2 Tuition',
    amountCents: 45000,
    status: 'paid' as const,
    paidAt: new Date('2026-05-01'),
  },
  {
    reference: 'INV-2026-0408',
    description: 'Transport — May',
    amountCents: 6000,
    status: 'paid' as const,
    paidAt: new Date('2026-05-01'),
  },
  {
    reference: 'INV-2026-0412',
    description: 'Term 2 Balance',
    amountCents: 12000,
    status: 'outstanding' as const,
    dueDate: new Date('2026-06-15'),
  },
];

export async function seedPortalContent() {
  const db = getDb();
  const results: { posts: string[]; fees: string[] } = { posts: [], fees: [] };

  for (const post of DEMO_POSTS) {
    const [existing] = await db
      .select({ id: schema.schoolPosts.id })
      .from(schema.schoolPosts)
      .where(eq(schema.schoolPosts.title, post.title))
      .limit(1);

    if (existing) {
      results.posts.push(`${post.title}: skipped`);
      continue;
    }

    await db.insert(schema.schoolPosts).values({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl,
      category: post.category,
      status: 'published',
      publishedAt: post.publishedAt || new Date(),
    });
    results.posts.push(`${post.title}: created`);
  }

  const [student] = await db
    .select()
    .from(schema.students)
    .where(eq(schema.students.studentNumber, DEMO_ACCOUNTS.student.identifier.toUpperCase()))
    .limit(1);

  if (student) {
    for (const fee of DEMO_FEES) {
      const [existing] = await db
        .select({ id: schema.feeInvoices.id })
        .from(schema.feeInvoices)
        .where(eq(schema.feeInvoices.reference, fee.reference))
        .limit(1);

      if (existing) {
        results.fees.push(`${fee.reference}: skipped`);
        continue;
      }

      await db.insert(schema.feeInvoices).values({
        studentId: student.id,
        reference: fee.reference,
        description: fee.description,
        amountCents: fee.amountCents,
        status: fee.status,
        dueDate: fee.dueDate,
        paidAt: fee.paidAt,
      });
      results.fees.push(`${fee.reference}: created`);
    }
  }

  const { seedDemoMessages } = await import('./portal-messages');
  const messageSeed = await seedDemoMessages();

  const { seedPortalAcademics } = await import('./portal-academics-seed');
  const academicsSeed = await seedPortalAcademics();

  return { ...results, messages: messageSeed.messages, academics: academicsSeed.academics };
}
