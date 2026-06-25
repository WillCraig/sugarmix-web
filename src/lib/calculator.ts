export type CalculatorMode = 'ride' | 'recipe';
export type DrinkType = 'concentrate' | 'ready';
export type MixLevel = 'room' | 'warm' | 'hot' | 'over';

export interface CalculatorInput {
  mode: CalculatorMode;
  drinkType: DrinkType;
  carbsPerHour: number;
  durationMinutes: number;
  carbsPerBottle: number;
  bottleVolumeMl: number;
  bottleCount: number;
  sodiumEnabled: boolean;
  sodiumMgPerL: number;
  citrusEnabled: boolean;
  citrusMlPerBottle: number;
}

export interface MixStatus {
  level: MixLevel;
  label: string;
  shortLabel: string;
  method: string;
}

export interface CalculatorResult {
  totalCarbs: number;
  totalVolumeMl: number;
  concentration: number;
  perBottleCarbs: number;
  bottleCount: number;
  bottleVolumeMl: number;
  mixStatus: MixStatus;
  drinkLabel: string;
  drinkNote: string;
  minimumVolumeMl: number;
  minimumPerBottleVolumeMl: number;
  minimumBottleCount: number;
  totalSodiumMg: number;
  totalSaltGrams: number;
  perBottleSaltGrams: number;
  totalCitrusMl: number;
  calories: number;
  overLimit: boolean;
}

export const MAX_PRACTICAL_CONCENTRATION = 900;
export const TABLE_SALT_SODIUM_FRACTION = 0.3934;

export function round(value: number, digits = 0): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function ceilTo(value: number, increment: number): number {
  return Math.ceil(value / increment) * increment;
}

export function getMixStatus(concentration: number): MixStatus {
  if (concentration > MAX_PRACTICAL_CONCENTRATION) {
    return {
      level: 'over',
      label: 'Needs more room',
      shortLabel: 'Over 900 g/L',
      method:
        'Increase final volume or use more bottles. Hot water can help mixing, but it does not keep an over-limit mix stable after cooling.',
    };
  }

  if (concentration > 850) {
    return {
      level: 'hot',
      label: 'Fits, but mix hot',
      shortLabel: 'Near the limit',
      method:
        'Use a larger heat-safe jug. Add hot water gradually, dissolve completely, cool, then top up to final volume.',
    };
  }

  if (concentration > 700) {
    return {
      level: 'warm',
      label: 'Fits, warm water helps',
      shortLabel: 'Warm water helps',
      method:
        'Use warm or hot water in a larger jug, stir until clear, cool, then top up to final volume.',
    };
  }

  return {
    level: 'room',
    label: 'Ready to mix',
    shortLabel: 'Easy mix',
    method:
      'Mix in a larger jug with room-temperature or warm water, then top up to final volume.',
  };
}

function getDrinkContext(
  drinkType: DrinkType,
  concentration: number,
): Pick<CalculatorResult, 'drinkLabel' | 'drinkNote'> {
  if (drinkType === 'ready') {
    if (concentration <= 60) {
      return {
        drinkLabel: 'Light ready-to-drink mix',
        drinkNote: 'A lower-strength bottle intended to be consumed as fluid.',
      };
    }
    if (concentration <= 80) {
      return {
        drinkLabel: 'Medium ready-to-drink mix',
        drinkNote:
          'A moderate-strength bottle intended to be consumed as fluid.',
      };
    }
    if (concentration <= 100) {
      return {
        drinkLabel: 'High-carb ready-to-drink mix',
        drinkNote: 'Practice this strength and fluid intake before race day.',
      };
    }
    return {
      drinkLabel: 'This lands in concentrate territory',
      drinkNote:
        'The selected carbs and volume are stronger than the ready-to-drink guide. Treat it as fuel and plan separate water.',
    };
  }

  if (concentration <= 400) {
    return {
      drinkLabel: 'Light fuel concentrate',
      drinkNote: 'Plenty of mixing headroom for a concentrate.',
    };
  }
  if (concentration <= 700) {
    return {
      drinkLabel: 'Easy-mixing fuel concentrate',
      drinkNote:
        'Dense fuel with comfortable room-temperature mixing headroom.',
    };
  }
  if (concentration <= 850) {
    return {
      drinkLabel: 'Dense fuel concentrate',
      drinkNote: 'Warm water will make the kitchen work easier.',
    };
  }
  if (concentration <= MAX_PRACTICAL_CONCENTRATION) {
    return {
      drinkLabel: 'Near-limit fuel concentrate',
      drinkNote:
        'Use hot water, measure final volume after cooling, and watch for crystals.',
    };
  }
  return {
    drinkLabel: 'Over the practical target',
    drinkNote:
      'Use the recommended volume or bottle count before relying on this mix.',
  };
}

export function calculate(input: CalculatorInput): CalculatorResult {
  const bottleVolumeMl = clamp(finiteOr(input.bottleVolumeMl, 250), 50, 5000);
  const bottleCount = Math.round(clamp(finiteOr(input.bottleCount, 1), 1, 99));
  const totalVolumeMl = bottleVolumeMl * bottleCount;
  const durationMinutes = clamp(finiteOr(input.durationMinutes, 60), 15, 1440);
  const carbsPerHour = clamp(finiteOr(input.carbsPerHour, 0), 0, 300);
  const carbsPerBottle = clamp(finiteOr(input.carbsPerBottle, 0), 0, 1500);
  const totalCarbs =
    input.mode === 'ride'
      ? carbsPerHour * (durationMinutes / 60)
      : carbsPerBottle * bottleCount;
  const perBottleCarbs = totalCarbs / bottleCount;
  const concentration =
    totalVolumeMl > 0 ? totalCarbs / (totalVolumeMl / 1000) : 0;
  const minimumVolumeRaw =
    totalCarbs > 0 ? (totalCarbs / MAX_PRACTICAL_CONCENTRATION) * 1000 : 0;
  const minimumVolumeMl = ceilTo(minimumVolumeRaw, 10);
  const minimumPerBottleVolumeRaw =
    perBottleCarbs > 0
      ? (perBottleCarbs / MAX_PRACTICAL_CONCENTRATION) * 1000
      : 0;
  const minimumPerBottleVolumeMl = ceilTo(minimumPerBottleVolumeRaw, 10);
  const minimumBottleCount = Math.max(
    1,
    Math.ceil(minimumVolumeRaw / bottleVolumeMl),
  );

  const sodiumMgPerL = input.sodiumEnabled
    ? clamp(finiteOr(input.sodiumMgPerL, 0), 0, 3000)
    : 0;
  const totalSodiumMg = sodiumMgPerL * (totalVolumeMl / 1000);
  const totalSaltGrams = totalSodiumMg / 1000 / TABLE_SALT_SODIUM_FRACTION;
  const citrusMlPerBottle = input.citrusEnabled
    ? clamp(finiteOr(input.citrusMlPerBottle, 0), 0, bottleVolumeMl)
    : 0;

  return {
    totalCarbs: round(totalCarbs, 1),
    totalVolumeMl: round(totalVolumeMl),
    concentration: round(concentration),
    perBottleCarbs: round(perBottleCarbs, 1),
    bottleCount,
    bottleVolumeMl: round(bottleVolumeMl),
    mixStatus: getMixStatus(concentration),
    ...getDrinkContext(input.drinkType, concentration),
    minimumVolumeMl,
    minimumPerBottleVolumeMl,
    minimumBottleCount,
    totalSodiumMg: round(totalSodiumMg),
    totalSaltGrams: round(totalSaltGrams, 2),
    perBottleSaltGrams: round(totalSaltGrams / bottleCount, 2),
    totalCitrusMl: round(citrusMlPerBottle * bottleCount),
    calories: round(totalCarbs * 4),
    overLimit: concentration > MAX_PRACTICAL_CONCENTRATION,
  };
}

export function formatDuration(minutes: number): string {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remaining = safeMinutes % 60;

  if (hours === 0) return `${remaining} m`;
  if (remaining === 0) return `${hours} h`;
  return `${hours} h ${remaining} m`;
}

export function createRecipeText(
  input: CalculatorInput,
  result: CalculatorResult,
): string {
  const finalVolumeLine =
    result.overLimit &&
    input.mode === 'ride' &&
    input.drinkType === 'concentrate'
      ? `Needs at least ${result.minimumPerBottleVolumeMl} ml final volume per bottle to dissolve within the 900 g/L target`
      : `Top up each bottle to ${result.bottleVolumeMl} ml final volume`;

  const lines = [
    'SugarMix recipe',
    `${result.bottleCount} × ${result.bottleVolumeMl} ml bottle${
      result.bottleCount === 1 ? '' : 's'
    }`,
    `${result.perBottleCarbs} g table sugar per bottle`,
    `${result.totalCarbs} g table sugar total`,
    finalVolumeLine,
    `${result.concentration} g/L · ${result.mixStatus.shortLabel}`,
  ];

  if (input.sodiumEnabled) {
    lines.push(
      `${result.perBottleSaltGrams} g table salt per bottle (${result.totalSodiumMg} mg sodium total)`,
    );
  }

  if (input.citrusEnabled) {
    lines.push(
      `${round(input.citrusMlPerBottle)} ml lemon/lime juice per bottle`,
    );
  }

  lines.push('', result.mixStatus.method);

  if (input.drinkType === 'concentrate') {
    lines.push('Fuel concentrate: take with your practiced water plan.');
  } else {
    lines.push(
      'Use only carbohydrate and fluid amounts practiced in training.',
    );
  }

  return lines.join('\n');
}
