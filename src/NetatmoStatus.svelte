<script lang="ts">
 import {raw,sensors} from "./stores/NetatmoStore";
 export let plan: number = 0;
 $: temp = $sensors[plan]?.temperature.current;
 $: hum = $sensors[plan]?.humidity;
 $: co2 = $sensors[plan]?.co2;

</script>

<div>
    <span>{temp}°C, {hum}%, {co2}ppm</span>
</div>

<style>
 div {
     color: green;
 }
</style>
