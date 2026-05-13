import type { Country, Leader, ResultsByWheel, SegmentValue } from '@/types';

function asString(v: SegmentValue | readonly SegmentValue[] | undefined): string {
  if (v === undefined) return '';
  if (Array.isArray(v)) return String(v[0] ?? '');
  return String(v);
}

function asNumber(v: SegmentValue | readonly SegmentValue[] | undefined): number {
  if (v === undefined) return 0;
  if (Array.isArray(v)) return Number(v[0] ?? 0);
  return typeof v === 'number' ? v : parseFloat(v as string);
}

function asStringArray(v: SegmentValue | readonly SegmentValue[] | undefined): string[] {
  if (v === undefined) return [];
  if (Array.isArray(v)) return v.map((x) => String(x));
  return [String(v)];
}

/** True only when all 20 wheel results are present. */
export function isComplete(results: ResultsByWheel): boolean {
  for (let i = 1; i <= 20; i += 1) {
    if (!results[i]) return false;
  }
  return true;
}

/**
 * Build a typed Country snapshot from the wheel results. Caller must check
 * isComplete first — partial results will yield empty strings / zeros.
 */
export function buildCountry(results: ResultsByWheel): Country {
  const leader: Leader = {
    intelligence: asString(results[11]?.value),
    charisma: asString(results[12]?.value),
    background: asString(results[13]?.value),
    style: asString(results[14]?.value),
    age: asNumber(results[15]?.value),
    health: asString(results[16]?.value),
    economicSkill: asString(results[17]?.value),
    militarySkill: asString(results[18]?.value),
    legitimacy: asString(results[19]?.value),
    weakness: asString(results[20]?.value),
  };

  const biome = asString(results[1]?.value);
  const areaKm2 = asNumber(results[2]?.value);
  const population = asNumber(results[5]?.value);
  const hdi = parseFloat(asString(results[6]?.value)) || 0.5;
  const ideology = asString(results[7]?.value);
  const economies = asStringArray(results[4]?.value);

  const seed = `${biome}|${areaKm2}|${population}|${ideology}|${economies.join(',')}`;

  return {
    biome,
    areaKm2,
    regime: asString(results[3]?.value),
    economies,
    population,
    hdi,
    ideology,
    system: asString(results[8]?.value),
    animal: asString(results[9]?.value),
    geopolitics: asString(results[10]?.value),
    leader,
    seed,
    generatedAt: new Date().toISOString(),
  };
}
