import { describe, expect, it } from 'vitest';

import {
  calculate,
  createRecipeText,
  getMixStatus,
  TABLE_SALT_SODIUM_FRACTION,
  type CalculatorInput,
} from './calculator';

const baseInput: CalculatorInput = {
  mode: 'ride',
  drinkType: 'concentrate',
  carbsPerHour: 90,
  durationMinutes: 150,
  carbsPerBottle: 225,
  bottleVolumeMl: 250,
  bottleCount: 1,
  sodiumEnabled: false,
  sodiumMgPerL: 600,
  citrusEnabled: false,
  citrusMlPerBottle: 10,
};

describe('calculate', () => {
  it('puts 225 g in a 250 ml bottle at exactly 900 g/L', () => {
    const result = calculate(baseInput);

    expect(result.totalCarbs).toBe(225);
    expect(result.perBottleCarbs).toBe(225);
    expect(result.concentration).toBe(900);
    expect(result.mixStatus.level).toBe('hot');
    expect(result.overLimit).toBe(false);
  });

  it('supports direct per-bottle recipes', () => {
    const result = calculate({
      ...baseInput,
      mode: 'recipe',
      drinkType: 'ready',
      carbsPerBottle: 60,
      bottleVolumeMl: 750,
      bottleCount: 2,
    });

    expect(result.totalCarbs).toBe(120);
    expect(result.totalVolumeMl).toBe(1500);
    expect(result.concentration).toBe(80);
    expect(result.drinkLabel).toBe('Medium ready-to-drink mix');
  });

  it('recommends more volume and bottles above 900 g/L', () => {
    const result = calculate({
      ...baseInput,
      carbsPerHour: 100,
      durationMinutes: 180,
      bottleVolumeMl: 250,
    });

    expect(result.totalCarbs).toBe(300);
    expect(result.concentration).toBe(1200);
    expect(result.minimumVolumeMl).toBe(340);
    expect(result.minimumBottleCount).toBe(2);
    expect(result.overLimit).toBe(true);
  });

  it('distributes a ride plan across multiple bottles', () => {
    const result = calculate({
      ...baseInput,
      bottleVolumeMl: 500,
      bottleCount: 2,
    });

    expect(result.totalCarbs).toBe(225);
    expect(result.perBottleCarbs).toBe(112.5);
    expect(result.concentration).toBe(225);
  });

  it('converts sodium targets into approximate table salt mass', () => {
    const result = calculate({
      ...baseInput,
      bottleVolumeMl: 500,
      bottleCount: 2,
      sodiumEnabled: true,
      sodiumMgPerL: 600,
    });

    expect(result.totalSodiumMg).toBe(600);
    expect(result.totalSaltGrams).toBeCloseTo(
      0.6 / TABLE_SALT_SODIUM_FRACTION,
      2,
    );
    expect(result.perBottleSaltGrams).toBe(0.76);
  });

  it('counts citrus within the stated final bottle volume', () => {
    const result = calculate({
      ...baseInput,
      bottleCount: 3,
      citrusEnabled: true,
      citrusMlPerBottle: 15,
    });

    expect(result.totalVolumeMl).toBe(750);
    expect(result.totalCitrusMl).toBe(45);
  });
});

describe('mixing boundaries', () => {
  it.each([
    [700, 'room'],
    [701, 'warm'],
    [850, 'warm'],
    [851, 'hot'],
    [900, 'hot'],
    [901, 'over'],
  ] as const)('classifies %i g/L as %s', (concentration, level) => {
    expect(getMixStatus(concentration).level).toBe(level);
  });
});

describe('recipe copy', () => {
  it('includes final-volume and additive instructions', () => {
    const input: CalculatorInput = {
      ...baseInput,
      mode: 'recipe',
      sodiumEnabled: true,
      citrusEnabled: true,
    };
    const text = createRecipeText(input, calculate(input));

    expect(text).toContain('Top up each bottle to 250 ml final volume');
    expect(text).toContain('table salt per bottle');
    expect(text).toContain('lemon/lime juice per bottle');
  });
});
