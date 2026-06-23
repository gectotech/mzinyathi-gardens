/** Grade buckets for student roster (R6–R11 spec). */
export const GRADE_BUCKETS = [
  'ECD A',
  'ECD B',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Graduated',
] as const;

export type GradeBucket = (typeof GRADE_BUCKETS)[number];

/** Maps current grade → next grade on annual promotion. Grade 7 → graduated archive. */
export const PROMOTION_MAP: Record<string, GradeBucket | 'graduated'> = {
  'ECD A': 'ECD B',
  'ECD B': 'Grade 1',
  'Grade 1': 'Grade 2',
  'Grade 2': 'Grade 3',
  'Grade 3': 'Grade 4',
  'Grade 4': 'Grade 5',
  'Grade 5': 'Grade 6',
  'Grade 6': 'Grade 7',
  'Grade 7': 'graduated',
};

export function nextGrade(current: string): GradeBucket | 'graduated' | null {
  return PROMOTION_MAP[current] ?? null;
}
