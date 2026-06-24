import { eq } from 'drizzle-orm';
import { getDb, schema } from './index';
import { hashPassword } from '../auth';
import { allPhases, phasesData } from '../housesData';

const DEFAULT_JOBS = [
  {
    title: 'Security Officer',
    department: 'Security',
    location: 'Mzinyathi Gardens',
    tagline: 'Protect our community with integrity and vigilance.',
  },
  {
    title: 'Construction Worker',
    department: 'Construction',
    location: 'Mzinyathi Gardens',
    tagline: 'Build the future – one brick at a time.',
  },
  {
    title: 'Administrative Assistant',
    department: 'Administration',
    location: 'Mzinyathi Gardens',
    tagline: 'Keep our operations smooth and efficient.',
  },
  {
    title: 'Teacher (Primary)',
    department: 'Teaching',
    location: 'Mzinyathi Gardens',
    tagline: 'Shape young minds and inspire lifelong learning.',
  },
];

const DEFAULT_PAGES = [
  { slug: 'home', title: 'Home', metaDescription: 'Mzinyathi Gardens gated community living' },
  { slug: 'about', title: 'About', metaDescription: 'About Mzinyathi Gardens' },
  { slug: 'contact', title: 'Contact', metaDescription: 'Contact Mzinyathi Gardens' },
  { slug: 'careers', title: 'Careers', metaDescription: 'Careers at Mzinyathi Gardens' },
  { slug: 'properties', title: 'Properties', metaDescription: 'Property phases at Mzinyathi Gardens' },
  { slug: 'projects', title: 'Projects', metaDescription: 'Projects and house plans' },
  { slug: 'services', title: 'Services', metaDescription: 'Estate services and amenities' },
  { slug: 'faq', title: 'FAQ', metaDescription: 'Frequently asked questions about Mzinyathi Gardens' },
];

const DEFAULT_SETTINGS: Record<string, unknown> = {
  site_name: 'Mzinyathi Gardens',
  contact_email: 'info@mzinyathigardens.co.zw',
  reply_email: 'info@mzinyathigardens.co.zw',
  phone_za: '+27 76 082 8987',
  phone_zw_1: '+263 77 620 3372',
  phone_zw_2: '+263 77 116 0529',
  facebook_url: 'https://www.facebook.com/mzinyathigardens',
  instagram_url: 'https://www.instagram.com/mzinyathigardens_official',
  google_play_url: 'https://play.google.com/store/apps/details?id=com.mzinyathi.mzinyathigardens',
  app_store_url: 'https://apps.apple.com/app/id123456789',
};

export async function seedDatabase() {
  const db = getDb();

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@mzinyathigardens.co.za').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const superEmail = (process.env.SUPER_ADMIN_EMAIL || 'superadmin@mzinyathigardens.co.za').toLowerCase();
  const superPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@2026!';

  async function upsertUser(
    email: string,
    password: string,
    name: string,
    role: 'admin' | 'super_admin'
  ) {
    const [existing] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    const passwordHash = await hashPassword(password);

    if (existing) {
      await db
        .update(schema.users)
        .set({ passwordHash, name, role, isActive: true, updatedAt: new Date() })
        .where(eq(schema.users.id, existing.id));
      return { email, action: 'updated' as const };
    }

    await db.insert(schema.users).values({ email, passwordHash, name, role });
    return { email, action: 'created' as const };
  }

  const users = [
    await upsertUser(adminEmail, adminPassword, 'Site Admin', 'admin'),
    await upsertUser(superEmail, superPassword, 'Super Admin', 'super_admin'),
  ];

  const existingPhases = await db.select({ id: schema.phases.id }).from(schema.phases).limit(1);
  if (existingPhases.length === 0) {
    let sortOrder = 0;
    for (const phase of Object.values(phasesData)) {
      await db.insert(schema.phases).values({
        id: phase.id,
        name: phase.name,
        description: phase.description,
        image: phase.image,
        features: phase.features,
        status: phase.status,
        sortOrder: sortOrder++,
      });

      for (const house of phase.houses) {
        await db.insert(schema.houses).values({
          id: house.id,
          phaseId: house.phaseId,
          title: house.title,
          description: house.description,
          fullDescription: house.fullDescription,
          image: house.image,
          images: house.images,
          beds: house.beds,
          baths: house.baths,
          size: house.size,
          price: house.price,
          features: house.features,
        });
      }
    }
  }

  const existingJobs = await db.select({ id: schema.jobs.id }).from(schema.jobs).limit(1);
  if (existingJobs.length === 0) {
    await db.insert(schema.jobs).values(DEFAULT_JOBS);
  }

  for (const page of DEFAULT_PAGES) {
    const existing = await db
      .select()
      .from(schema.sitePages)
      .where(eq(schema.sitePages.slug, page.slug))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(schema.sitePages).values({
        slug: page.slug,
        title: page.title,
        metaDescription: page.metaDescription,
        sections: {},
        status: 'published',
      });
    }
  }

  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    const existing = await db
      .select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, key))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(schema.siteSettings).values({ key, value });
    }
  }

  const codeAssets = [
    { name: 'Global CSS', slug: 'global-css', assetType: 'css', content: '/* Super admin custom CSS */\n' },
    { name: 'Global JS', slug: 'global-js', assetType: 'js', content: '// Super admin custom JS\n' },
    { name: 'Site Config', slug: 'site-config', assetType: 'config', content: JSON.stringify({ theme: 'default' }, null, 2) },
  ];

  for (const asset of codeAssets) {
    const existing = await db
      .select()
      .from(schema.codeAssets)
      .where(eq(schema.codeAssets.slug, asset.slug))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(schema.codeAssets).values({
        ...asset,
        status: 'published',
      });
    }
  }

  const { seedPortalDemoAccounts } = await import('../portal-service');
  const portalAccounts = await seedPortalDemoAccounts();

  const { seedPortalContent } = await import('../portal-content-seed');
  const portalContent = await seedPortalContent();

  return {
    phases: phasesData.length,
    users,
    portalAccounts,
    portalContent,
    message: 'Database seeded successfully',
  };
}
