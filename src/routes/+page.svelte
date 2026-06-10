<script lang="ts">
  import { browser } from '$app/environment';
  import { resolve } from '$app/paths';
  import { onMount } from 'svelte';

  import {
    calculate,
    createRecipeText,
    round,
    type CalculatorInput,
    type CalculatorMode,
    type DrinkType,
  } from '$lib/calculator';
  import AdditivesPanel from '$lib/components/AdditivesPanel.svelte';
  import DurationField from '$lib/components/DurationField.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import NumberStepper from '$lib/components/NumberStepper.svelte';
  import ResultPanel from '$lib/components/ResultPanel.svelte';

  const STORAGE_KEY = 'sugarmix-settings-v1';

  let mode: CalculatorMode = 'ride';
  let drinkType: DrinkType = 'concentrate';
  let carbsPerHour = 90;
  let durationMinutes = 150;
  let carbsPerBottle = 225;
  let bottleVolumeMl = 250;
  let bottleCount = 1;
  let sodiumEnabled = false;
  let sodiumMgPerL = 600;
  let citrusEnabled = false;
  let citrusMlPerBottle = 10;
  let hydrated = false;
  let copyState: 'idle' | 'copied' | 'failed' = 'idle';
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  $: input = {
    mode,
    drinkType,
    carbsPerHour,
    durationMinutes,
    carbsPerBottle,
    bottleVolumeMl,
    bottleCount,
    sodiumEnabled,
    sodiumMgPerL,
    citrusEnabled,
    citrusMlPerBottle,
  } satisfies CalculatorInput;
  $: result = calculate(input);
  $: presets =
    drinkType === 'concentrate'
      ? [
          { label: 'Easy', value: 600 },
          { label: 'Dense', value: 750 },
          { label: 'Near limit', value: 900 },
        ]
      : [
          { label: 'Light', value: 60 },
          { label: 'Medium', value: 80 },
          { label: 'High carb', value: 100 },
        ];

  $: if (hydrated && browser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
  }

  onMount(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const saved = JSON.parse(stored) as Partial<CalculatorInput>;
        if (saved.mode === 'ride' || saved.mode === 'recipe') mode = saved.mode;
        if (saved.drinkType === 'concentrate' || saved.drinkType === 'ready') {
          drinkType = saved.drinkType;
        }
        if (Number.isFinite(saved.carbsPerHour)) {
          carbsPerHour = saved.carbsPerHour as number;
        }
        if (Number.isFinite(saved.durationMinutes)) {
          durationMinutes = saved.durationMinutes as number;
        }
        if (Number.isFinite(saved.carbsPerBottle)) {
          carbsPerBottle = saved.carbsPerBottle as number;
        }
        if (Number.isFinite(saved.bottleVolumeMl)) {
          bottleVolumeMl = saved.bottleVolumeMl as number;
        }
        if (Number.isFinite(saved.bottleCount)) {
          bottleCount = saved.bottleCount as number;
        }
        if (typeof saved.sodiumEnabled === 'boolean') {
          sodiumEnabled = saved.sodiumEnabled;
        }
        if (Number.isFinite(saved.sodiumMgPerL)) {
          sodiumMgPerL = saved.sodiumMgPerL as number;
        }
        if (typeof saved.citrusEnabled === 'boolean') {
          citrusEnabled = saved.citrusEnabled;
        }
        if (Number.isFinite(saved.citrusMlPerBottle)) {
          citrusMlPerBottle = saved.citrusMlPerBottle as number;
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    hydrated = true;
  });

  function setDrinkType(next: DrinkType) {
    if (drinkType === next) return;

    const plannedCarbs =
      mode === 'ride'
        ? carbsPerHour * (durationMinutes / 60)
        : carbsPerBottle * bottleCount;

    drinkType = next;
    if (next === 'ready') {
      bottleVolumeMl = 750;
      bottleCount =
        mode === 'ride'
          ? Math.max(1, Math.ceil(plannedCarbs / 75))
          : Math.max(1, bottleCount);
      carbsPerBottle = 60;
    } else {
      bottleVolumeMl = 250;
      bottleCount =
        mode === 'ride'
          ? Math.max(1, Math.ceil(plannedCarbs / 225))
          : Math.max(1, bottleCount);
      carbsPerBottle = 225;
    }
  }

  function applyPreset(concentration: number) {
    carbsPerBottle = round((concentration * bottleVolumeMl) / 1000, 1);
  }

  async function copyRecipe() {
    try {
      await navigator.clipboard.writeText(createRecipeText(input, result));
      copyState = 'copied';
    } catch {
      copyState = 'failed';
    }

    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copyState = 'idle';
    }, 2200);
  }
</script>

<svelte:head>
  <title>SugarMix · Plain-sugar endurance fuel calculator</title>
  <meta
    name="description"
    content="Plan plain white sugar endurance drink mixes by ride or bottle, check concentration, and get a practical mixing recipe."
  />
  <meta
    property="og:title"
    content="SugarMix · Will your endurance fuel fit?"
  />
  <meta
    property="og:description"
    content="A fast plain-sugar bottle calculator for endurance athletes."
  />
</svelte:head>

<header class="site-header">
  <a class="brand" href={resolve('/')} aria-label="SugarMix home">SugarMix</a>
  <a class="how-link" href={resolve('/#how-it-works')}>How it works</a>
</header>

<main>
  <div class="calculator-shell">
    <section class="planner" aria-labelledby="page-title">
      <div class="intro">
        <h1 id="page-title">Will your fuel fit?</h1>
        <p>
          Plan a plain-sugar mix by ride or bottle, then see the exact kitchen
          recipe.
        </p>
      </div>

      <div class="mode-tabs" role="tablist" aria-label="Calculator mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'ride'}
          class:active={mode === 'ride'}
          onclick={() => (mode = 'ride')}
        >
          Plan a ride
          <small>Carbs per hour × time</small>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'recipe'}
          class:active={mode === 'recipe'}
          onclick={() => (mode = 'recipe')}
        >
          Build a recipe
          <small>Carbs in each bottle</small>
        </button>
      </div>

      <fieldset class="drink-selector">
        <legend>What are you making?</legend>
        <div>
          <button
            type="button"
            aria-pressed={drinkType === 'concentrate'}
            class:active={drinkType === 'concentrate'}
            onclick={() => setDrinkType('concentrate')}
          >
            <span>Fuel concentrate</span>
            <small>Small bottle + separate water</small>
          </button>
          <button
            type="button"
            aria-pressed={drinkType === 'ready'}
            class:active={drinkType === 'ready'}
            onclick={() => setDrinkType('ready')}
          >
            <span>Ready to drink</span>
            <small>Carbs and fluid together</small>
          </button>
        </div>
      </fieldset>

      <div class="input-stack">
        {#if mode === 'ride'}
          <NumberStepper
            id="carbs-per-hour"
            label="Carbs / hour"
            value={carbsPerHour}
            unit="g"
            step={5}
            minimum={0}
            maximum={300}
            icon="bolt"
            onchange={(value) => (carbsPerHour = value)}
          />
          <DurationField
            value={durationMinutes}
            onchange={(value) => (durationMinutes = value)}
          />
        {:else}
          <NumberStepper
            id="carbs-per-bottle"
            label="Carbs / bottle"
            value={carbsPerBottle}
            unit="g"
            step={5}
            minimum={0}
            maximum={1500}
            icon="cube"
            onchange={(value) => (carbsPerBottle = value)}
          />
        {/if}

        <NumberStepper
          id="bottle-volume"
          label="Bottle"
          value={bottleVolumeMl}
          unit="ml"
          step={50}
          minimum={50}
          maximum={5000}
          icon="bottle"
          onchange={(value) => (bottleVolumeMl = value)}
        />
        <NumberStepper
          id="bottle-count"
          label="Bottles"
          value={bottleCount}
          step={1}
          minimum={1}
          maximum={99}
          icon="bottles"
          onchange={(value) => (bottleCount = value)}
        />
      </div>

      {#if mode === 'recipe'}
        <div class="preset-row" aria-label="Concentration presets">
          <span>Quick concentration</span>
          <div>
            {#each presets as preset (preset.value)}
              <button
                type="button"
                class:active={result.concentration === preset.value}
                onclick={() => applyPreset(preset.value)}
              >
                <b>{preset.value}</b> g/L
                <small>{preset.label}</small>
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </section>

    <aside class="result-column">
      <ResultPanel
        {input}
        {result}
        {drinkType}
        {copyState}
        oncopy={copyRecipe}
      />
    </aside>

    <div class="additives-slot">
      <AdditivesPanel
        {sodiumEnabled}
        {sodiumMgPerL}
        {citrusEnabled}
        {citrusMlPerBottle}
        {result}
        setSodiumEnabled={(value) => (sodiumEnabled = value)}
        setSodiumMgPerL={(value) => (sodiumMgPerL = value)}
        setCitrusEnabled={(value) => (citrusEnabled = value)}
        setCitrusMlPerBottle={(value) => (citrusMlPerBottle = value)}
      />
    </div>
  </div>

  <section class="education" id="how-it-works" aria-labelledby="why-title">
    <div class="education-lead">
      <div class="bottle-diagram" aria-hidden="true">
        <svg viewBox="0 0 210 220">
          <path
            d="M55 43h45v23c0 8 24 15 24 38v91H31v-91c0-23 24-30 24-38V43Z"
          />
          <path d="M49 25h57v20H49z" />
          <path class="fill" d="M34 122h87v70H34z" />
          <path class="dash" d="M36 105h86" />
          <path
            d="M141 44v151M141 56h18M141 84h11M141 112h18M141 140h11M141 168h18M141 195h18"
          />
          <text x="164" y="61">250</text>
          <text x="164" y="200">0 ml</text>
        </svg>
      </div>
      <div>
        <span class="section-number">01</span>
        <h2 id="why-title">Why 900 g/L matters</h2>
        <p>
          It is a conservative practical target for plain sucrose in a cooled
          bottle: extremely dense, still measurable, and close enough to the
          room-temperature limit that mixing technique matters.
        </p>
      </div>
    </div>

    <div class="education-rows">
      <article>
        <span class="education-icon yellow">
          <Icon name="measure" size={28} />
        </span>
        <div>
          <h3>Final volume is the target</h3>
          <p>
            Sugar changes solution volume. Dissolve the ingredients first, let a
            hot mix cool, then add water until the total reaches the bottle
            mark.
          </p>
        </div>
      </article>
      <article>
        <span class="education-icon orange">
          <Icon name="thermometer" size={28} />
        </span>
        <div>
          <h3>Hot water helps mixing, not storage</h3>
          <p>
            Heat makes dense sugar easier to dissolve. Once the bottle cools, an
            over-concentrated solution can still form crystals.
          </p>
        </div>
      </article>
      <article>
        <span class="education-icon blue">
          <Icon name="drop" size={28} />
        </span>
        <div>
          <h3>Concentrate and hydration are separate jobs</h3>
          <p>
            A compact fuel bottle can carry carbohydrate, but it does not
            replace a practiced fluid plan. Ready-to-drink mode keeps both in
            the same bottle.
          </p>
        </div>
      </article>
    </div>
  </section>

  <section class="method-band" aria-labelledby="method-title">
    <div>
      <span class="section-number">02</span>
      <h2 id="method-title">Mix it without the mess</h2>
    </div>
    <ol>
      <li>
        <span>1</span>
        <p>
          <b>Use a larger jug.</b> Do not try to create a near-limit mix in a full
          narrow bottle.
        </p>
      </li>
      <li>
        <span>2</span>
        <p>
          <b>Add sugar gradually.</b> Stir into warm or hot water until the solution
          is completely clear.
        </p>
      </li>
      <li>
        <span>3</span>
        <p>
          <b>Cool, then top up.</b> Add salt and citrus, transfer, and measure the
          final volume last.
        </p>
      </li>
    </ol>
  </section>

  <section class="sources" aria-labelledby="sources-title">
    <div>
      <span class="section-number">03</span>
      <h2 id="sources-title">Assumptions &amp; sources</h2>
    </div>
    <p>
      SugarMix is a planning tool, not medical advice. Plain sucrose is counted
      as one gram of carbohydrate per gram. The 900 g/L marker is a conservative
      kitchen heuristic, not a guaranteed laboratory boundary. Temperature,
      agitation, ingredient purity, and storage all matter.
    </p>
    <ul>
      <li>
        <a href="https://pubchem.ncbi.nlm.nih.gov/compound/Sucrose">
          PubChem · Sucrose compound record
        </a>
      </li>
      <li>
        <a href="https://pubmed.ncbi.nlm.nih.gov/26920240/">
          Academy of Nutrition and Dietetics, Dietitians of Canada, and ACSM ·
          Nutrition and Athletic Performance
        </a>
      </li>
    </ul>
  </section>
</main>

<footer>
  <a class="brand" href={resolve('/')}>SugarMix</a>
  <p>Plain sugar. Clear numbers. Practice before race day.</p>
</footer>
