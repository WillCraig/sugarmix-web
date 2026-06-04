const SUGAR_DENSITY = 1.587;
const KCAL_PER_G = 4;
const MIN_BOTTLE_SIZE = 1;
const MIN_BOTTLES = 1;

export const CEILING = { room: 200, hot: 280 };
export const TEMP_LABEL = {
  room: 'Room temp · ~20°C',
  hot: 'Hot water · ~60°C',
};

export function round(n, d = 0) {
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

export function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

function finiteOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

export function compute(s) {
  const conc = clamp(finiteOr(s.concentration, 800), 100, 950);
  const temp = s.temp === 'hot' ? 'hot' : 'room';
  const ceiling = CEILING[temp];
  const bottleSize = Math.max(MIN_BOTTLE_SIZE, finiteOr(s.bottleSize, 500));
  const numBottles = Math.max(MIN_BOTTLES, finiteOr(s.numBottles, 1));

  let V;
  switch (s.mode) {
    case 'carbs':
      V = (finiteOr(s.totalCarbs, 0) / conc) * 1000;
      break;
    case 'rate':
      V =
        ((finiteOr(s.carbsPerHour, 0) * finiteOr(s.durationHours, 0)) / conc) *
        1000;
      break;
    case 'bottles':
      V = numBottles * bottleSize;
      break;
    case 'volume':
    default:
      V = finiteOr(s.finalVolume, 0);
      break;
  }
  V = Math.max(0, V);

  const sugar = (conc / 1000) * V;
  const sugarVol = sugar / SUGAR_DENSITY;
  const water = Math.max(0, V - sugarVol);
  const wv = V > 0 ? (sugar / V) * 100 : 0;
  const gPerL = V > 0 ? (sugar / V) * 1000 : 0;
  const per100Water = water > 0 ? (sugar / water) * 100 : Infinity;
  const ratio = per100Water / ceiling;

  const salt = (V / 1000) * finiteOr(s.saltPerL, 1.0);
  const lemon = V * (finiteOr(s.lemonPct, 3) / 100);

  const kcal = sugar * KCAL_PER_G;
  const carbs = sugar;
  const cost = (sugar / 1000) * finiteOr(s.pricePerKg, 1.1);

  const bottles =
    s.mode === 'bottles' ? numBottles : Math.max(1, Math.ceil(V / bottleSize));

  let risk;
  if (ratio > 1.0) {
    risk = {
      level: 'exceeds',
      label: "Won't fully dissolve",
      note:
        temp === 'room'
          ? 'Past room-temp solubility — switch to hot water.'
          : 'Past hot-water solubility — reduce sugar or volume.',
    };
  } else if (ratio > 0.9 || gPerL > 870) {
    risk = {
      level: 'high',
      label: 'High — overnight rest',
      note: 'Supersaturated. Rest in the fridge overnight to stabilise.',
    };
  } else if (ratio > 0.72 || gPerL > 750) {
    risk = {
      level: 'moderate',
      label: 'Moderate',
      note: 'Dissolves with patience. A short rest helps.',
    };
  } else {
    risk = {
      level: 'low',
      label: 'Low — dissolves easily',
      note: 'Comfortably below the solubility ceiling.',
    };
  }

  const totalCarbs =
    s.mode === 'rate'
      ? finiteOr(s.carbsPerHour, 0) * finiteOr(s.durationHours, 0)
      : carbs;

  return {
    ok: V > 0 && sugar > 0,
    mode: s.mode,
    temp,
    tempLabel: TEMP_LABEL[temp],
    ceiling,
    finalVolume: round(V),
    sugar: round(sugar, 1),
    water: round(water),
    sugarVol: round(sugarVol),
    salt: round(salt, 2),
    lemon: round(lemon),
    gPerL: round(gPerL),
    wv: round(wv, 1),
    per100Water: isFinite(per100Water) ? round(per100Water) : Infinity,
    ratio,
    kcal: round(kcal),
    carbs: round(carbs, 1),
    cost: round(cost, 2),
    currency: s.currency ?? '$',
    bottles,
    bottleSize,
    perBottleVol: round(V / bottles),
    perBottleCarbs: round(carbs / bottles, 1),
    perBottleKcal: round(kcal / bottles),
    totalCarbs: round(totalCarbs, 1),
    risk,
  };
}

export function steps(r) {
  const out = [
    `Measure ${r.sugar} g of table sugar.`,
    `Pour ${r.water} ml of ${r.temp === 'hot' ? 'hot (~60°C)' : 'room-temp'} water into your flask.`,
    `Add the sugar gradually, stirring or shaking until fully dissolved.`,
  ];
  if (r.salt > 0) out.push(`Stir in ${r.salt} g of salt.`);
  if (r.lemon > 0) out.push(`Add ${r.lemon} ml of lemon juice.`);
  out.push(`Top up to ${r.finalVolume} ml final volume.`);
  if (r.risk.level === 'high' || r.risk.level === 'exceeds')
    out.push(`Rest in the fridge overnight to stabilise before riding.`);
  return out;
}
