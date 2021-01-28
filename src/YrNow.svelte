<script lang="ts">
  import { weather } from "./stores/YrStore";
  $: yr = $weather;
</script>

{#if yr}
  <div class="yrblock">
    <img src={yr.image} alt="Weather" />
    <div>
      <p>{yr.temperature}°C</p>
      <p>{yr.wind.speed}m/s</p>
      <p>{yr.rain}mm</p>
    </div>
  </div>
{/if}

<style>
  .yrblock {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .yrblock img {
    flex-grow: 0;
  }
  .yrblock div {
    flex-grow: 1;
  }
</style>
