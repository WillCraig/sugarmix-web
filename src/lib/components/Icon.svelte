<script lang="ts">
  export let name:
    | 'bolt'
    | 'clock'
    | 'bottle'
    | 'bottles'
    | 'cube'
    | 'drop'
    | 'check'
    | 'copy'
    | 'warning'
    | 'salt'
    | 'citrus'
    | 'thermometer'
    | 'measure';
  export let size = 24;
</script>

<svg
  viewBox="0 0 24 24"
  width={size}
  height={size}
  fill="none"
  stroke="currentColor"
  stroke-width="1.8"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  {#if name === 'bolt'}
    <path
      d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"
      fill="currentColor"
      stroke="none"
    />
  {:else if name === 'clock'}
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  {:else if name === 'bottle'}
    <path d="M9 3h6v3l2 2v12H7V8l2-2V3Z" />
    <path d="M8 15h8" />
  {:else if name === 'bottles'}
    <path d="M4 5h5v2l1 2v11H3V9l1-2V5Z" />
    <path d="M15 5h5v2l1 2v11h-7V9l1-2V5Z" />
    <path d="M4 15h5M15 15h5" />
  {:else if name === 'cube'}
    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
    <path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v9" />
  {:else if name === 'drop'}
    <path d="M12 3S6 10 6 15a6 6 0 0 0 12 0c0-5-6-12-6-12Z" />
  {:else if name === 'check'}
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  {:else if name === 'copy'}
    <rect x="8" y="8" width="11" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" />
  {:else if name === 'warning'}
    <path d="M12 3 2.8 20h18.4L12 3Z" />
    <path d="M12 9v5M12 17.5v.1" />
  {:else if name === 'salt'}
    <path d="M8 3h8l1 5H7l1-5ZM7 8h10l1 12H6L7 8Z" />
    <path d="M10 5h.1M14 5h.1M9 12h.1M12 11h.1M15 13h.1" />
  {:else if name === 'citrus'}
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
  {:else if name === 'thermometer'}
    <path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z" />
    <path d="M12 8v9" />
  {:else}
    <path d="M5 3v18M5 5h5M5 9h3M5 13h5M5 17h3M14 5h5v14h-5z" />
  {/if}
</svg>
