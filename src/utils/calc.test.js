import assert from 'node:assert/strict';
import test from 'node:test';

import { compute } from './calc.js';

test('volume mode computes sugar and water for a target volume', () => {
  const result = compute({
    mode: 'volume',
    concentration: 800,
    temp: 'hot',
    finalVolume: 500,
    saltPerL: 1,
    lemonPct: 0,
  });

  assert.equal(result.ok, true);
  assert.equal(result.finalVolume, 500);
  assert.equal(result.sugar, 400);
  assert.equal(result.water, 248);
  assert.equal(result.gPerL, 800);
  assert.equal(result.carbs, 400);
});

test('carbs mode derives final volume from total carbs', () => {
  const result = compute({
    mode: 'carbs',
    concentration: 600,
    totalCarbs: 90,
    bottleSize: 500,
  });

  assert.equal(result.finalVolume, 150);
  assert.equal(result.sugar, 90);
  assert.equal(result.bottles, 1);
});

test('rate mode derives total carbs and final volume from ride fueling target', () => {
  const result = compute({
    mode: 'rate',
    concentration: 800,
    carbsPerHour: 90,
    durationHours: 4,
    bottleSize: 500,
  });

  assert.equal(result.finalVolume, 450);
  assert.equal(result.totalCarbs, 360);
  assert.equal(result.perBottleCarbs, 360);
});

test('bottles mode uses bottle count and size for batch volume', () => {
  const result = compute({
    mode: 'bottles',
    concentration: 800,
    numBottles: 2,
    bottleSize: 500,
  });

  assert.equal(result.finalVolume, 1000);
  assert.equal(result.bottles, 2);
  assert.equal(result.perBottleVol, 500);
  assert.equal(result.perBottleCarbs, 400);
});

test('invalid bottle size does not create infinite bottle calculations', () => {
  const result = compute({
    mode: 'volume',
    concentration: 800,
    finalVolume: 500,
    bottleSize: 0,
  });

  assert.equal(Number.isFinite(result.bottles), true);
  assert.equal(result.bottles, 500);
  assert.equal(result.perBottleVol, 1);
});
