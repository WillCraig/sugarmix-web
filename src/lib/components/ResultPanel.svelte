<script lang="ts">
  import type {
    CalculatorInput,
    CalculatorResult,
    DrinkType,
  } from '$lib/calculator';
  import ConcentrationGauge from './ConcentrationGauge.svelte';
  import Icon from './Icon.svelte';

  export let input: CalculatorInput;
  export let result: CalculatorResult;
  export let drinkType: DrinkType;
  export let copyState: 'idle' | 'copied' | 'failed';
  export let oncopy: () => void;

  $: isPerHourConcentrate =
    input.mode === 'ride' && drinkType === 'concentrate';
  $: dissolveShortfallMl = Math.max(
    0,
    result.minimumPerBottleVolumeMl - result.bottleVolumeMl,
  );
  $: recipeWaterLabel =
    isPerHourConcentrate && result.overLimit ? 'Needs at least' : 'Top up to';
  $: recipeWaterVolumeMl =
    isPerHourConcentrate && result.overLimit
      ? result.minimumPerBottleVolumeMl
      : result.bottleVolumeMl;
  $: bottleHeading =
    result.bottleCount === 1
      ? `For one ${result.bottleVolumeMl} ml bottle`
      : `For each ${result.bottleVolumeMl} ml bottle`;
</script>

<section class="result-panel" aria-labelledby="result-heading">
  <div class="result-topline">
    <div>
      <span>Total carbs</span>
      <strong>{result.totalCarbs}<small>g</small></strong>
    </div>
    <div>
      <span id="result-heading">Concentration</span>
      <strong>{result.concentration}<small>g/L</small></strong>
    </div>
  </div>

  <ConcentrationGauge {result} {drinkType} />

  <div class={`fit-status ${result.mixStatus.level}`} aria-live="polite">
    <span><Icon name={result.overLimit ? 'warning' : 'check'} size={25} /></span
    >
    <div>
      <b>{result.mixStatus.label}</b>
      <small>{result.drinkLabel}</small>
    </div>
  </div>

  {#if isPerHourConcentrate}
    <div
      class={`recommendation dissolve-check ${result.overLimit ? 'over' : 'fits'}`}
    >
      <b>
        {result.overLimit
          ? 'Needs more water to dissolve'
          : `Fits in ${result.bottleVolumeMl} ml`}
      </b>
      <span>
        {#if result.overLimit}
          Use at least {result.minimumPerBottleVolumeMl} ml final volume per bottle.
          The {result.bottleVolumeMl} ml bottle is short by
          {dissolveShortfallMl} ml.
          {#if result.bottleCount > 1}
            That is {result.minimumVolumeMl} ml total across
            {result.bottleCount} bottles.
          {/if}
        {:else}
          This stays within the 900 g/L target for a {result.bottleVolumeMl} ml bottle.
        {/if}
      </span>
    </div>
  {:else if result.overLimit}
    <div class="recommendation">
      <b>Give this mix more space</b>
      <span>
        Use at least {result.minimumVolumeMl} ml final volume, or
        {result.minimumBottleCount} × {result.bottleVolumeMl} ml bottles.
      </span>
    </div>
  {/if}

  <button class="copy-button" type="button" onclick={oncopy}>
    <Icon name={copyState === 'copied' ? 'check' : 'copy'} size={21} />
    {#if copyState === 'copied'}
      Recipe copied
    {:else if copyState === 'failed'}
      Copy failed
    {:else}
      Copy recipe
    {/if}
  </button>

  <div class="recipe">
    <div class="recipe-heading">
      <span>{bottleHeading}</span>
      {#if result.bottleCount > 1}
        <small
          >{result.bottleCount} bottles · {result.totalVolumeMl} ml batch</small
        >
      {/if}
    </div>
    <div class="recipe-numbers">
      <div>
        <span class="recipe-icon sugar"><Icon name="cube" size={26} /></span>
        <p>
          <strong>{result.perBottleCarbs}<small>g</small></strong>
          <span>table sugar</span>
        </p>
      </div>
      <div>
        <span class="recipe-icon water"><Icon name="drop" size={26} /></span>
        <p>
          <span>{recipeWaterLabel}</span>
          <strong>{recipeWaterVolumeMl}<small>ml</small></strong>
        </p>
      </div>
    </div>

    {#if input.sodiumEnabled || input.citrusEnabled}
      <div class="recipe-additions">
        {#if input.sodiumEnabled}
          <span>
            <Icon name="salt" size={18} />
            {result.perBottleSaltGrams} g salt / bottle
          </span>
        {/if}
        {#if input.citrusEnabled}
          <span>
            <Icon name="citrus" size={18} />
            {input.citrusMlPerBottle} ml citrus / bottle
          </span>
        {/if}
      </div>
    {/if}

    <div class="method">
      <span><Icon name="thermometer" size={26} /></span>
      <p>{result.mixStatus.method}</p>
    </div>
  </div>

  <div class={`fuel-note ${drinkType}`}>
    <Icon name={drinkType === 'concentrate' ? 'warning' : 'drop'} size={26} />
    <p>
      <b>
        {drinkType === 'concentrate'
          ? 'Fuel concentrate, not hydration'
          : 'Ready-to-drink still needs practice'}
      </b>
      <span>
        {drinkType === 'concentrate'
          ? 'Take it with the water you have practiced in training.'
          : 'Use carbohydrate and fluid amounts you have tested before race day.'}
      </span>
    </p>
  </div>
</section>
