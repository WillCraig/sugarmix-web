<script lang="ts">
  import type { CalculatorResult, DrinkType } from '$lib/calculator';

  export let result: CalculatorResult;
  export let drinkType: DrinkType;

  $: scaleMaximum = drinkType === 'ready' ? 150 : 1000;
  $: marker = Math.min(
    100,
    Math.max(0, (result.concentration / scaleMaximum) * 100),
  );
  $: segments =
    drinkType === 'ready'
      ? [
          { label: 'Light', className: 'easy', width: 40 },
          { label: 'Medium', className: 'warm', width: 14 },
          { label: 'High carb', className: 'near', width: 13 },
          { label: 'Concentrate', className: 'over', width: 33 },
        ]
      : [
          { label: 'Easy mix', className: 'easy', width: 70 },
          { label: 'Warm water', className: 'warm', width: 15 },
          { label: 'Near limit', className: 'near', width: 5 },
          { label: 'Over', className: 'over', width: 10 },
        ];
  $: ticks =
    drinkType === 'ready'
      ? [
          { label: '0', left: 0 },
          { label: '60', left: 40 },
          { label: '80', left: 53.3 },
          { label: '100', left: 66.7 },
          { label: '150', left: 100 },
        ]
      : [
          { label: '0', left: 0 },
          { label: '700', left: 70 },
          { label: '850', left: 85 },
          { label: '900', left: 90 },
          { label: '1000', left: 100 },
        ];
</script>

<div
  class="gauge"
  class:over-limit={result.overLimit}
  style={`--marker: ${marker}%`}
  aria-label={`${result.concentration} grams per litre. ${result.mixStatus.label}`}
>
  <div class="gauge-segments" aria-hidden="true">
    {#each segments as segment (segment.label)}
      <span class={segment.className} style={`width: ${segment.width}%`}>
        {segment.label}
      </span>
    {/each}
  </div>
  <div class="gauge-track" aria-hidden="true">
    <span class="gauge-marker">
      <b>{result.concentration}</b>
    </span>
  </div>
  <div class="gauge-ticks" aria-hidden="true">
    {#each ticks as tick (tick.label)}
      <span
        class:edge-start={tick.left === 0}
        class:edge-end={tick.left === 100}
        style={`left: ${tick.left}%`}
      >
        {tick.label}
      </span>
    {/each}
  </div>
</div>
