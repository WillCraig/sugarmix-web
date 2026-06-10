<script lang="ts">
  import Icon from './Icon.svelte';

  export let id: string;
  export let label: string;
  export let value: number;
  export let unit = '';
  export let step = 1;
  export let minimum = 0;
  export let maximum = Number.POSITIVE_INFINITY;
  export let icon: 'bolt' | 'bottle' | 'bottles' | 'cube' | 'salt' | 'citrus';
  export let onchange: (value: number) => void;

  function commit(next: number) {
    const bounded = Math.min(maximum, Math.max(minimum, next));
    onchange(Math.round(bounded * 100) / 100);
  }

  function handleInput(event: Event) {
    const next = Number((event.currentTarget as HTMLInputElement).value);
    if (Number.isFinite(next)) onchange(next);
  }
</script>

<div class="stepper-field">
  <div class="field-identity">
    <span class="field-icon"><Icon name={icon} size={25} /></span>
    <label for={id}>{label}</label>
  </div>
  <div class="stepper-control">
    <button
      type="button"
      aria-label={`Decrease ${label}`}
      onclick={() => commit(value - step)}
      disabled={value <= minimum}
    >
      <span aria-hidden="true">−</span>
    </button>
    <div class="number-wrap">
      <input
        {id}
        type="number"
        inputmode="decimal"
        min={minimum}
        max={Number.isFinite(maximum) ? maximum : undefined}
        {step}
        {value}
        oninput={handleInput}
        onblur={() => commit(value)}
      />
      {#if unit}<span>{unit}</span>{/if}
    </div>
    <button
      type="button"
      aria-label={`Increase ${label}`}
      onclick={() => commit(value + step)}
      disabled={value >= maximum}
    >
      <span aria-hidden="true">+</span>
    </button>
  </div>
</div>
