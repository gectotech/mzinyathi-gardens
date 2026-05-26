import { asc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { jsonOk, handleAuthError } from '@/lib/api-utils';
import { allPhases, phasesData } from '@/lib/housesData';

export async function GET() {
  try {
    const db = getDb();
    const dbPhases = await db.select().from(schema.phases).orderBy(asc(schema.phases.sortOrder));

    if (dbPhases.length === 0) {
      return jsonOk({ phases: allPhases, phasesData, source: 'static' });
    }

    const dbHouses = await db
      .select()
      .from(schema.houses)
      .where(eq(schema.houses.isActive, true));

    const phases = dbPhases.map((phase) => ({
      id: phase.id,
      name: phase.name,
      description: phase.description,
      image: phase.image,
      features: phase.features || [],
      status: phase.status,
      houses: dbHouses
        .filter((h) => h.phaseId === phase.id)
        .map((h) => ({
          id: h.id,
          title: h.title,
          description: h.description,
          fullDescription: h.fullDescription,
          image: h.image,
          images: h.images || [],
          beds: h.beds,
          baths: h.baths,
          size: h.size,
          phase: phase.name,
          phaseId: h.phaseId,
          price: h.price,
          features: h.features || [],
        })),
    }));

    const map: Record<string, (typeof phases)[0]> = {};
    for (const p of phases) map[p.id] = p;

    return jsonOk({ phases, phasesData: map, source: 'database' });
  } catch {
    return jsonOk({ phases: allPhases, phasesData, source: 'static' });
  }
}
