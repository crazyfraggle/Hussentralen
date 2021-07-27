<script lang="ts">
  import { raw, sensors } from "./stores/NetatmoStore";
  export let plan: number = 0;
  $: temp = $sensors[plan]?.temperature.current;
  $: hum = $sensors[plan]?.humidity;
  $: co2 = $sensors[plan]?.co2;
</script>

<div class="netatmo">
  <div class="temp">
    <h3>Temperatur</h3>
    <div class="line">
      <span class="measure">{temp}</span><span class="unit">°C</span>
    </div>
  </div>
  <div class="humidity">
    <h3>Humidity</h3>
    <div class="line">
      <span class="measure">{hum}</span><span class="unit">%</span>
    </div>
  </div>
  <div class="co2">
    <h3>CO<sub>2</sub></h3>
    <div class="line">
      <span class="measure">{co2}</span><span class="unit">ppm</span>
    </div>
  </div>
</div>

<style lang="scss">
  div.netatmo {
    display: flex;
    flex-wrap: wrap;
  }
  div {
    h3 {
      font-size: 60%;
      margin: 0;
      padding: 0;
    }
  }
  .temp .line {
    font-size: 125%;
  }
  .line {
    display: flex;
    align-items: flex-start;
  }
  .measure {
    font-size: 120%;
  }
  .unit {
    font-size: 60%;
  }
</style>
