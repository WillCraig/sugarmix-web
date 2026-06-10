<script lang="ts">
  import type { CalculatorResult } from '$lib/calculator';
  import Icon from './Icon.svelte';
  import NumberStepper from './NumberStepper.svelte';

  export let sodiumEnabled: boolean;
  export let sodiumMgPerL: number;
  export let citrusEnabled: boolean;
  export let citrusMlPerBottle: number;
  export let result: CalculatorResult;
  export let setSodiumEnabled: (value: boolean) => void;
  export let setSodiumMgPerL: (value: number) => void;
  export let setCitrusEnabled: (value: boolean) => void;
  export let setCitrusMlPerBottle: (value: number) => void;
</script>

<details class="additives">
  <summary>
    <span>
      <b>Salt &amp; flavor</b>
      <small>Optional kitchen additions</small>
    </span>
    <span class="summary-mark" aria-hidden="true">+</span>
  </summary>
  <div class="additives-body">
    <div class="addition-block">
      <div class="addition-heading">
        <span class="addition-icon"><Icon name="salt" size={22} /></span>
        <div>
          <b>Table salt</b>
          <small>Enter a sodium target; we convert it to salt mass.</small>
        </div>
        <label class="switch">
          <input
            type="checkbox"
            checked={sodiumEnabled}
            onchange={(event) =>
              setSodiumEnabled(
                (event.currentTarget as HTMLInputElement).checked,
              )}
          />
          <span aria-hidden="true"></span>
          <span class="sr-only">Include table salt</span>
        </label>
      </div>
      {#if sodiumEnabled}
        <NumberStepper
          id="sodium"
          label="Sodium target"
          value={sodiumMgPerL}
          unit="mg/L"
          step={100}
          minimum={0}
          maximum={3000}
          icon="salt"
          onchange={setSodiumMgPerL}
        />
        <p class="addition-result">
          About <b>{result.totalSaltGrams} g table salt total</b>
          · {result.perBottleSaltGrams} g per bottle
        </p>
      {/if}
    </div>

    <div class="addition-block">
      <div class="addition-heading">
        <span class="addition-icon citrus"
          ><Icon name="citrus" size={22} /></span
        >
        <div>
          <b>Lemon or lime juice</b>
          <small>Counts inside the final bottle volume.</small>
        </div>
        <label class="switch">
          <input
            type="checkbox"
            checked={citrusEnabled}
            onchange={(event) =>
              setCitrusEnabled(
                (event.currentTarget as HTMLInputElement).checked,
              )}
          />
          <span aria-hidden="true"></span>
          <span class="sr-only">Include citrus juice</span>
        </label>
      </div>
      {#if citrusEnabled}
        <NumberStepper
          id="citrus"
          label="Juice per bottle"
          value={citrusMlPerBottle}
          unit="ml"
          step={5}
          minimum={0}
          maximum={result.bottleVolumeMl}
          icon="citrus"
          onchange={setCitrusMlPerBottle}
        />
        <p class="addition-result">
          <b>{result.totalCitrusMl} ml total</b>
          · add before topping up with water
        </p>
      {/if}
    </div>

    <p class="fine-print">
      Table salt is estimated as 39.34% sodium by mass. Citrus carbohydrate is
      not included in the carb total.
    </p>
  </div>
</details>
