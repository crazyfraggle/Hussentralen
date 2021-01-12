<!--
  [ ] Don't query each light individually, fetch all and use the one we need
  [ ] Light interaction (on/off, color/temp, brightness)
  [ ] Hue Switch localization (it changes IP.)
-->
<script type="ts">
  import { hueUserId } from "./config";
  export let light: string;

  import type { HueLight } from "./types/HueLight";

  async function fetchLightData(light: string): Promise<HueLight> {
    const url = `http://192.168.10.112/api/${hueUserId}/lights/${light}`;
    const lightData = await fetch(url);
    const jsonResponse = await lightData.json();
    return jsonResponse as HueLight;
  }

  let lightData: HueLight = undefined;

  function repeatedlyFetchLightData() {
    fetchLightData(light).then((ld) => {
      lightData = ld;
      console.log(ld);
    });
    setTimeout(repeatedlyFetchLightData, 60_000);
  }
  repeatedlyFetchLightData();

  $: lightStyle =
    lightData && lightData.state.on
      ? "background-color: #aaa; color: black;"
      : "background-color: black; color: #aaa";
</script>

<style>
  .light {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.4em 0;
  }
  .lightstate {
    display: block;
    flex-grow: 1;
    flex-shrink: 0;
    height: 1.5em;
    line-height: 1.5em;
    border: 1px solid #aaa;
    border-radius: 0.75em;
    margin-inline-end: 0.4em;
  }
  .lightname {
    padding-inline-start: 1em;
  }
</style>

{#if lightData}
  <div class="light">
    <div class="lightstate" style={lightStyle}>
      <span class="lightname">{lightData.name}</span>
    </div>
  </div>
{/if}
