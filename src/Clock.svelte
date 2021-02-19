<script lang="ts">
  import BatteryIndicator from "./BatteryIndicator.svelte";

  let time = new Date();

  setInterval(() => {
    time = new Date();
  }, 1000);
</script>

<div class="clock"><strong>{time.toLocaleTimeString()}</strong></div>
<BatteryIndicator />
<div class="date"><strong>{time.toLocaleDateString()}</strong></div>

<style>
  div {
    font-size: 24pt;
  }
</style>
