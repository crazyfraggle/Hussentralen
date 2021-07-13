<!-- TODO:
  [ ] Graphical floor layouts
  [ ] Light map for floors
  [ ] Netatmo floor data (CO2/temp)
  [ ] Light switches for lamps on floors
-->
<script lang="ts">
  import { onMount } from "svelte";
  import Light from "./Light.svelte";
  import NetatmoStatus from "./NetatmoStatus.svelte";

  export let plan: number = 0;
  let canvas: HTMLCanvasElement;
  $: head = `${plan}. etasje`;

  const lightMap = [
    ["7", "8", "12", "13", "11"],
    ["1", "2", "3", "9"],
    ["4", "5", "6", "10", "14"],
  ];
  let lights = lightMap[plan];

  // onMount(() => {
  //   canvas.width = document.body.clientWidth / 3 - 20;
  //   canvas.height = (canvas.width * 850) / 550;

  //   // Now we has a canvas
  //   const ctx = canvas.getContext("2d");
  //   ctx.setTransform(canvas.width / 550, 0, 0, canvas.height / 850, 0, 0);

  //   ctx.fillStyle = "#656";
  //   ctx.fillRect(0, 0, 550, 850);

  //   ctx.fillStyle = "#000";
  //   ctx.fillRect(5, 5, 540, 840);

  //   ctx.fillStyle = "#c0ffee";
  //   ctx.font = "50px sans-serif";
  //   ctx.fillText(`${plan}. etasje`, 15, 400);
  // });
</script>

<div class="floor">
  <h2>{head}</h2>
  <!-- <canvas bind:this={canvas} class="floorPlan" /> -->
  <h3>Lights</h3>

  <div class="lights">
    {#each lights as light}
      <Light {light} />
    {/each}
  </div>

  <h3>Atmos</h3>
  <NetatmoStatus plan={plan}/>
</div>

<style>
  .floor {
    flex-grow: 1;
    flex-basis: 1;
    position: relative;
    margin: 0 1em;
  }
  .floorPlan {
    /* position: absolute; */
  }
  .lights {
  }
</style>
