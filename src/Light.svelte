<!--
  [?] Light interaction (on/off, color/temp, brightness)
-->
<script type="ts">
  import { lights, singleLight } from "./stores/LightStore";

  export let light: string;
  const sl = singleLight(light);
  $: lightData = $sl;
  $: lightStyle =
    lightData &&
    `color: ${sl.on() ? "black" : "#aaa"}; background-color: ${sl.color()}`;

  $: console.log(lightStyle);

  function toggleLightState() {
    console.log("You clicked on", lightData);
    sl.toggleOnOff();
  }
</script>

{#if lightData}
  <div class="light" on:click={toggleLightState}>
    <div class="lightstate" style={lightStyle}>
      <span class="lightname">{lightData.name}</span>
    </div>
  </div>
{/if}

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
