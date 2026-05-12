import type { ResultsByWheel, SegmentValue, SpinResult, Wheel } from '@/types';
import { GAUSSIAN_WEIGHTS } from '@/types';
import { defaultRng, type RNG } from './rng';

/** Returns the first economy when several have been rolled. */
export function getPrimaryEconomy(results: ResultsByWheel): string | undefined {
  const r = results[4];
  if (!r) return undefined;
  if (Array.isArray(r.value)) return r.value[0] as string;
  return r.value as string;
}

/**
 * Compute per-segment weights for a wheel given the country state so far.
 * Mirrors the v13 conditional probability table 1:1 — keep this file synced
 * with `data/wheels.ts` segment labels.
 */
export function getWeights(wheel: Wheel, results: ResultsByWheel): number[] {
  const N = wheel.segments.length;
  let weights = new Array<number>(N).fill(1);

  // HDI is pure uniform — no conditioning.
  if (wheel.id === 6) return weights;

  // Stat ladder wheels (intelligence, charisma, economic skill, military skill):
  // start from a Gaussian and boost the upper end when the regime favours it.
  if (wheel.id === 11 || wheel.id === 12 || wheel.id === 17 || wheel.id === 18) {
    weights = [...GAUSSIAN_WEIGHTS];
    const regime = asString(results[3]?.value);
    if (regime === 'Technocratie' && (wheel.id === 11 || wheel.id === 17)) {
      weights = weights.map((w, i) => (i >= 5 ? w * 3 : w));
    }
    if (
      (regime === 'Dictature militaire' || regime === 'Junte révolutionnaire') &&
      wheel.id === 18
    ) {
      weights = weights.map((w, i) => (i >= 6 ? w * 3 : w));
    }
    return weights;
  }

  if (wheel.id === 2) {
    const biome = asString(results[1]?.value);
    wheel.segments.forEach((seg, i) => {
      const n = asNumber(seg);
      if (['Désert', 'Steppe', 'Toundra'].includes(biome) && n >= 1_000_000) weights[i]! *= 3;
      if (biome === 'Archipel') {
        if (n >= 1_000 && n <= 250_000) weights[i]! *= 4;
        if (n > 1_000_000) weights[i]! *= 0.2;
      }
      if (['Volcanique', 'Marécages'].includes(biome)) {
        if (n >= 500 && n <= 100_000) weights[i]! *= 3;
        if (n > 1_000_000) weights[i]! *= 0.3;
      }
      if (biome === 'Méditerranéen' && n > 1_500_000) weights[i]! *= 0.2;
      if (['Tropical', 'Jungle'].includes(biome) && n >= 50_000 && n <= 2_000_000) weights[i]! *= 2;
    });
  }

  if (wheel.id === 3) {
    const km2 = asNumber(results[2]?.value);
    wheel.segments.forEach((seg, i) => {
      const s = asString(seg);
      // HARD CAP: tiny countries can't host federal/colonial/tribal regimes.
      if (
        km2 < 100 &&
        ['République fédérale', 'Empire colonial', 'Confédération tribale'].includes(s)
      ) {
        weights[i] = 0;
        return;
      }
      if (
        km2 < 1000 &&
        [
          'Monarchie absolue',
          'Monarchie constitutionnelle',
          'Théocratie',
          'Dyarchie',
          'Aristocratie héréditaire',
        ].includes(s)
      )
        weights[i]! *= 2.5;
      if (
        km2 >= 1000 &&
        km2 < 100_000 &&
        [
          'Démocratie parlementaire',
          'Démocratie présidentielle',
          'République fédérale',
          'Démocratie directe',
        ].includes(s)
      )
        weights[i]! *= 1.5;
      if (
        km2 > 2_000_000 &&
        [
          'République fédérale',
          'Empire colonial',
          'Dictature militaire',
          'Régime communiste',
          'Confédération tribale',
        ].includes(s)
      )
        weights[i]! *= 2;
      if (km2 > 10_000_000 && s === 'Démocratie directe') weights[i]! *= 0.2;
    });
  }

  if (wheel.id === 4) {
    const biome = asString(results[1]?.value);
    const km2 = asNumber(results[2]?.value);
    const BIOME_BOOSTERS: Record<string, string[]> = {
      Désert: ['Pétrole', 'Gaz', 'Solaire', 'Hôtellerie luxe', 'Citoyenneté à vendre'],
      Tropical: ['Café', 'Cacao', 'Bananes', 'Tourisme balnéaire', 'Cannabis légal'],
      Arctique: ['Gaz', 'Pêche industrielle', 'Caviar', 'Terres rares', 'Uranium'],
      Montagneux: ['Or', 'Cuivre', 'Hydroélectrique', 'Tourisme culturel', 'Horlogerie'],
      Archipel: [
        'Pêche industrielle',
        'Tourisme balnéaire',
        'Ports stratégiques',
        'Paradis fiscal',
        'Drapeau complaisance',
      ],
      Jungle: ['Cacao', 'Cobalt', 'Épices', 'Tourisme culturel', 'Bananes'],
      Steppe: ['Blé', 'Maïs', 'Uranium', 'Charbon'],
      Méditerranéen: ['Vin', "Huile d'olive", 'Tourisme balnéaire', 'Mode', 'Parfumerie'],
      Volcanique: ['Géothermie', 'Tourisme culturel', 'Café'],
      Marécages: ['Gaz', 'Pêche industrielle', 'Crustacés'],
      Toundra: ['Gaz', 'Uranium', 'Terres rares', 'Pêche industrielle'],
      'Forêt tempérée': ['Automobile', 'Pharma', 'Edtech', 'Vins fins', 'Construction'],
    };
    const boosters = BIOME_BOOSTERS[biome] ?? [];
    wheel.segments.forEach((seg, i) => {
      const s = asString(seg);
      if (
        biome === 'Désert' &&
        [
          'Pêche industrielle',
          'Aquaculture',
          'Algues',
          'Crustacés',
          'Caviar',
          'Coraux',
          'Perles',
          'Hydroélectrique',
        ].includes(s)
      ) {
        weights[i] = 0;
        return;
      }
      if (
        ['Arctique', 'Toundra'].includes(biome) &&
        [
          'Café',
          'Cacao',
          'Bananes',
          'Vin',
          "Huile d'olive",
          'Riz',
          'Tourisme balnéaire',
          'Coraux',
          'Perles',
        ].includes(s)
      ) {
        weights[i] = 0;
        return;
      }
      if (
        !['Archipel', 'Tropical', 'Marécages'].includes(biome) &&
        ['Coraux', 'Perles', 'Algues'].includes(s)
      )
        weights[i]! *= 0.1;
      if (boosters.includes(s)) weights[i]! *= 3;
      if (
        km2 < 10_000 &&
        [
          'Paradis fiscal',
          'Casinos',
          'Banque',
          'Citoyenneté à vendre',
          'Mode',
          'Joaillerie',
          'Yachts',
        ].includes(s)
      )
        weights[i]! *= 2;
      if (
        km2 > 2_000_000 &&
        ['Pétrole', 'Gaz', 'Blé', 'Maïs', 'Or', 'Diamants', 'Terres rares', 'Charbon'].includes(s)
      )
        weights[i]! *= 2;
    });
  }

  if (wheel.id === 5) {
    const km2 = asNumber(results[2]?.value);
    const biome = asString(results[1]?.value);
    const MAX_DENSITY = 25_000;
    const MIN_DENSITY = 0.001;
    const maxPop = km2 * MAX_DENSITY;
    const minPop = km2 * MIN_DENSITY;
    wheel.segments.forEach((seg, i) => {
      const n = asNumber(seg);
      if (n > maxPop) {
        weights[i] = 0;
        return;
      }
      if (n < minPop && km2 > 100_000) {
        weights[i] = 0;
        return;
      }
      if (['Désert', 'Arctique', 'Toundra'].includes(biome) && n > 50_000_000) weights[i]! *= 0.4;
      if (
        ['Tropical', 'Méditerranéen', 'Forêt tempérée'].includes(biome) &&
        n >= 10_000_000 &&
        n <= 800_000_000
      )
        weights[i]! *= 2;
      if (['Montagneux', 'Volcanique', 'Marécages'].includes(biome) && n > 100_000_000)
        weights[i]! *= 0.5;
      const density = n / km2;
      if (density >= 50 && density <= 500) weights[i]! *= 1.5;
    });
  }

  if (wheel.id === 7) {
    const regime = asString(results[3]?.value);
    const eco = getPrimaryEconomy(results) ?? '';
    const MAP: Record<string, string[]> = {
      'Régime communiste': ['Communisme orthodoxe', 'Socialisme démocratique'],
      'Socialisme autoritaire': ['Communisme orthodoxe', 'Socialisme démocratique'],
      'Monarchie absolue': ['Conservatisme traditionaliste', 'Théocratie morale'],
      'Monarchie constitutionnelle': ['Conservatisme traditionaliste', 'Capitalisme libéral'],
      'Dictature militaire': ['Nationalisme dur', 'Militarisme expansionniste'],
      'Junte révolutionnaire': ['Nationalisme dur', 'Militarisme expansionniste'],
      'Démocratie parlementaire': [
        'Capitalisme libéral',
        'Socialisme démocratique',
        'Pacifisme constitutionnel',
      ],
      'Démocratie présidentielle': ['Capitalisme libéral', 'Populisme identitaire'],
      Technocratie: ['Techno-progressisme', 'Transhumanisme officiel'],
      Théocratie: ['Théocratie morale', 'Conservatisme traditionaliste'],
      'Méritocratie pure': ['Méritocratie pure', 'Techno-progressisme'],
      'Anarchie organisée': ['Anarcho-capitalisme', 'Écologisme radical'],
    };
    const boosters = MAP[regime] ?? [];
    wheel.segments.forEach((seg, i) => {
      const s = asString(seg);
      if (boosters.includes(s)) weights[i]! *= 3;
      if (
        ["Trafic d'armes", 'Mercenariat'].includes(eco) &&
        ['Militarisme expansionniste', 'Anarcho-capitalisme'].includes(s)
      )
        weights[i]! *= 2;
      if (
        ['Hôtellerie luxe', 'Mode', 'Joaillerie'].includes(eco) &&
        s === 'Capitalisme libéral'
      )
        weights[i]! *= 2;
    });
  }

  if (wheel.id === 8) {
    const regime = asString(results[3]?.value);
    const ideo = asString(results[7]?.value);
    wheel.segments.forEach((seg, i) => {
      const s = asString(seg);
      if (
        (regime === 'Régime communiste' || ideo === 'Communisme orthodoxe') &&
        [
          'Économie planifiée',
          'Surveillance de masse',
          'Santé universelle',
          'Éducation gratuite doctorat',
          'Crédit social',
        ].includes(s)
      )
        weights[i]! *= 10;
      if (
        regime === 'Démocratie parlementaire' &&
        ideo === 'Capitalisme libéral' &&
        ['Capitalisme dérégulé', 'Santé 100% privée', 'Liberté libertarienne'].includes(s)
      )
        weights[i]! *= 5;
      if (
        (regime === 'Théocratie' || ideo === 'Théocratie morale') &&
        ["Religion d'État", 'Mariage religieux', 'Castes rigides'].includes(s)
      )
        weights[i]! *= 10;
      if (
        ['Dictature militaire', 'Junte révolutionnaire', 'État policier'].includes(regime) &&
        [
          'Service militaire 5 ans',
          'Police armée',
          'Milices privées',
          'Surveillance de masse',
        ].includes(s)
      )
        weights[i]! *= 10;
    });
  }

  if (wheel.id === 9) {
    const biome = asString(results[1]?.value);
    const ideo = asString(results[7]?.value);
    const MAP: Record<string, string[]> = {
      Désert: ['Faucon', 'Serpent', 'Lion'],
      Tropical: ['Tigre', 'Léopard', 'Éléphant', 'Serpent'],
      Arctique: ['Ours', 'Loup'],
      Toundra: ['Ours', 'Loup'],
      Montagneux: ['Aigle', 'Faucon', 'Bélier'],
      'Forêt tempérée': ['Loup', 'Ours', 'Cheval'],
      Jungle: ['Tigre', 'Léopard', 'Serpent', 'Éléphant'],
      Steppe: ['Cheval', 'Loup', 'Aigle'],
      Méditerranéen: ['Taureau', 'Cheval', 'Aigle'],
      Volcanique: ['Dragon', 'Serpent'],
      Marécages: ['Serpent', 'Capybara'],
      Archipel: ['Faucon', 'Dragon'],
    };
    const boosters = MAP[biome] ?? [];
    wheel.segments.forEach((seg, i) => {
      const s = asString(seg);
      if (boosters.includes(s)) weights[i]! *= 5;
      if (
        ['Militarisme expansionniste', 'Nationalisme dur'].includes(ideo) &&
        ['Aigle', 'Lion', 'Tigre', 'Dragon'].includes(s)
      )
        weights[i]! *= 3;
      if (
        ideo === 'Écologisme radical' &&
        ['Capybara', 'Éléphant', 'Rhinocéros'].includes(s)
      )
        weights[i]! *= 5;
    });
  }

  if (wheel.id === 10) {
    const regime = asString(results[3]?.value);
    const ideo = asString(results[7]?.value);
    const eco = getPrimaryEconomy(results) ?? '';
    wheel.segments.forEach((seg, i) => {
      const s = asString(seg);
      if (
        ['Régime communiste', 'Socialisme autoritaire'].includes(regime) &&
        ['Allié Chine', 'Allié Russie', 'Alliance BRICS+'].includes(s)
      )
        weights[i]! *= 10;
      if (
        regime === 'Démocratie parlementaire' &&
        ideo === 'Capitalisme libéral' &&
        ['Alliance occidentale', 'Allié USA'].includes(s)
      )
        weights[i]! *= 10;
      if (
        regime === 'Théocratie' &&
        ['État paria', 'Isolationniste', 'Non-aligné influent'].includes(s)
      )
        weights[i]! *= 10;
      if (
        ["Trafic d'armes", 'Mercenariat', 'Cannabis légal', 'Blanchiment'].includes(eco) &&
        s === 'État paria'
      )
        weights[i]! *= 10;
      if (
        ['Paradis fiscal', 'Citoyenneté à vendre'].includes(eco) &&
        ['Non-aligné influent', 'Neutralité armée'].includes(s)
      )
        weights[i]! *= 5;
    });
  }

  if (wheel.id === 13) {
    const regime = asString(results[3]?.value);
    wheel.segments.forEach((seg, i) => {
      const s = asString(seg);
      if (
        ['Dictature militaire', 'Junte révolutionnaire', 'État policier'].includes(regime) &&
        s === 'Militaire'
      )
        weights[i]! *= 10;
      if (regime === 'Théocratie' && s === 'Religieux') weights[i]! *= 10;
      if (
        regime === 'Technocratie' &&
        ['Ingénieur', 'Scientifique', 'Économiste'].includes(s)
      )
        weights[i]! *= 10;
      if (
        ['Monarchie absolue', 'Monarchie constitutionnelle', 'Aristocratie héréditaire'].includes(
          regime,
        ) &&
        s === 'Aristocrate'
      )
        weights[i]! *= 10;
    });
  }

  if (wheel.id === 15) {
    const regime = asString(results[3]?.value);
    wheel.segments.forEach((seg, i) => {
      const n = asNumber(seg);
      if (
        ['Démocratie parlementaire', 'Démocratie présidentielle'].includes(regime) &&
        n >= 40 &&
        n <= 60
      )
        weights[i]! *= 3;
      if (regime === 'Conseil des sages' && n >= 60) weights[i]! *= 10;
      if (
        ['Dictature militaire', 'Junte révolutionnaire'].includes(regime) &&
        n >= 35 &&
        n <= 55
      )
        weights[i]! *= 3;
    });
  }

  if (wheel.id === 16) {
    const age = asNumber(results[15]?.value);
    wheel.segments.forEach((seg, i) => {
      const s = asString(seg);
      if (age <= 40) {
        if (['Excellente santé', 'Bonne santé'].includes(s)) weights[i]! *= 10;
        if (['Cancer rémission', 'Démence précoce', 'Espérance < 2 ans'].includes(s))
          weights[i]! *= 0.1;
      }
      if (age >= 55 && age <= 70 && ['Diabète', 'Maladie cardiaque'].includes(s))
        weights[i]! *= 3;
      if (age >= 70 && ['Cancer rémission', 'Démence précoce', 'Espérance < 2 ans'].includes(s))
        weights[i]! *= 5;
    });
  }

  if (wheel.id === 19) {
    const regime = asString(results[3]?.value);
    wheel.segments.forEach((seg, i) => {
      const s = asString(seg);
      if (
        ['Démocratie parlementaire', 'Démocratie présidentielle', 'République fédérale'].includes(
          regime,
        ) &&
        s === 'Élu démocratiquement'
      )
        weights[i]! *= 10;
      if (
        ['Monarchie absolue', 'Monarchie constitutionnelle', 'Aristocratie héréditaire'].includes(
          regime,
        ) &&
        s === 'Héritage royal'
      )
        weights[i]! *= 10;
      if (
        ['Dictature militaire', 'Junte révolutionnaire'].includes(regime) &&
        ["Coup d'État accepté", 'Auto-proclamé'].includes(s)
      )
        weights[i]! *= 10;
      if (
        regime === 'Théocratie' &&
        ['Désigné prédécesseur', 'Élu sans opposition'].includes(s)
      )
        weights[i]! *= 5;
    });
  }

  if (wheel.id === 20) {
    const regime = asString(results[3]?.value);
    const eco = getPrimaryEconomy(results) ?? '';
    wheel.segments.forEach((seg, i) => {
      const s = asString(seg);
      if (['Oligarchie', 'Ploutocratie'].includes(regime) && s === 'Corruption documentée')
        weights[i]! *= 2;
      if (
        ["Trafic d'armes", 'Blanchiment', 'Contrefaçon'].includes(eco) &&
        s === 'Liens mafia'
      )
        weights[i]! *= 2;
    });
  }

  return weights;
}

/**
 * Pick a segment index given the weights and an RNG. When every weight is
 * zero (no possible combination) we fall back to the middle segment.
 */
export function weightedRandom(weights: readonly number[], rng: RNG = defaultRng): number {
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return Math.floor(weights.length / 2);
  let r = rng() * total;
  for (let i = 0; i < weights.length; i += 1) {
    r -= weights[i]!;
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

/** Run a single wheel spin and return a SpinResult ready to be stored. */
export function spinWheel(
  wheel: Wheel,
  results: ResultsByWheel,
  rng: RNG = defaultRng,
): SpinResult {
  const weights = getWeights(wheel, results);
  const chosenIndex = weightedRandom(weights, rng);
  const value = wheel.segments[chosenIndex] as SegmentValue;
  return { wheelId: wheel.id, label: wheel.label, value, chosenIndex };
}

// ---------- helpers ----------

type AnyValue = SegmentValue | SegmentValue[] | readonly SegmentValue[] | undefined;

function asString(v: AnyValue): string {
  if (v === undefined) return '';
  if (Array.isArray(v)) return String(v[0] ?? '');
  return String(v);
}

function asNumber(v: AnyValue): number {
  if (v === undefined) return 0;
  if (Array.isArray(v)) return Number(v[0] ?? 0);
  return typeof v === 'number' ? v : parseFloat(v as string);
}
