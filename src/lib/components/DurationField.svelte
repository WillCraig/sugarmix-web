<script lang="ts">
  import { formatDuration } from '$lib/calculator';
  import Icon from './Icon.svelte';

  export let value: number;
  export let onchange: (value: number) => void;

  function commit(next: number) {
    onchange(Math.min(1440, Math.max(15, Math.round(next / 15) * 15)));
  }

  function handleInput(event: Event) {
    const hours = Number((event.currentTarget as HTMLInputElement).value);
    if (Number.isFinite(hours)) onchange(hours * 60);
  }
</script>

<div class="stepper-field">
  <div class="field-identity">
    <span class="field-icon"><Icon name="clock" size={25} /></span>
    <label for="duration-hours">Duration</label>
  </div>
  <div class="stepper-control">
    <button
      type="button"
      aria-label="Decrease duration by 15 minutes"
      onclick={() => commit(value - 15)}
      disabled={value <= 15}
    >
      <span aria-hidden="true">−</span>
    </button>
    <div class="number-wrap duration-value">
      <input
        id="duration-hours"
        class="duration-input"
        type="number"
        inputmode="decimal"
        min="0.25"
        max="24"
        step="0.25"
        value={value / 60}
        aria-describedby="duration-display"
        oninput={handleInput}
        onblur={() => commit(value)}
      />
      <span id="duration-display">{formatDuration(value)}</span>
    </div>
    <button
      type="button"
      aria-label="Increase duration by 15 minutes"
      onclick={() => commit(value + 15)}
      disabled={value >= 1440}
    >
      <span aria-hidden="true">+</span>
    </button>
  </div>
</div>
