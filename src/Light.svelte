<!--
  [ ] Light interaction (on/off, color/temp, brightness)
  [ ] Hue Switch localization (it changes IP.)
-->
<script type="ts">
  import { lights } from "./stores/LightStore";

  export let light: string;

  $: lightData = $lights[light];
  $: lightStyle =
    lightData && lightData.state.on
      ? "background-color: #aaa; color: black;"
      : "background-color: black; color: #aaa";
</script>

{#if lightData}
  <div class="light">
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
