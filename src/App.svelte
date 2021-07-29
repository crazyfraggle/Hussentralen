<script lang="ts">
  import Calendars from "./Calendars.svelte";
  import YrNow from "./YrNow.svelte";
  import Floor from "./Floor.svelte";
  import Clock from "./Clock.svelte";
  import Dinner from "./Dinner.svelte";
  import Birthdays from "./Birthdays.svelte";
  import FuzzyClock from "./FuzzyClock.svelte";

  let lastActivity = new Date().getTime();
  let now = new Date().getTime();
  $: timeSinceLastActivity = now - lastActivity;

  setInterval(() => {
    now = new Date().getTime();
  }, 1_000);
  document.onclick = () => {
    lastActivity = new Date().getTime();
  };
</script>

<FuzzyClock visible={timeSinceLastActivity > 10_000} />
<div class="row" id="today">
  <div>
    <Dinner />
    <Birthdays />
  </div>
  <div>{timeSinceLastActivity}</div>
  <YrNow />
</div>
<div class="row" id="cals">
  <Calendars />
</div>
<div class="row" id="rooms">
  <Floor plan={2} />
  <Floor plan={1} />
  <Floor plan={0} />
</div>
<div class="row" id="info">
  <Clock />
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .row * {
    flex-grow: 1;
  }
  #rooms {
    flex-grow: 0;
  }
  #today {
    flex-grow: 0;
  }
  #cals {
    flex-grow: 1;
  }
  #info {
    flex-grow: 0;
    margin-bottom: 1em;
    align-items: center;
  }
</style>
