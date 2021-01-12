<!--
  [ ] Don't query each light individually, fetch all and use the one we need
  [ ] Light interaction (on/off, color/temp, brightness)
  [ ] Hue Switch localization (it changes IP.)
  [ ] Don't flash when reloading light data
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

  setInterval(() => {
    fetchLightData(light).then((ld) => {
      lightData = ld;
      console.log(ld);
    });
  }, 60_000);
  $: lightStyle =
    lightData && lightData.state.on
      ? "background-color: white"
      : "background-color: black";
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
    flex-grow: 0;
    flex-shrink: 0;
    width: 1.5em;
    height: 1.5em;
    border: 1px solid plum;
    border-radius: 50%;
    margin-inline-end: 0.4em;
  }
</style>

{#if lightData}
  <div class="light">
    <div class="lightstate" style={lightStyle} />
    <div>{lightData.name} er {lightData.state.on ? 'på' : 'av'}</div>
  </div>
{/if}
