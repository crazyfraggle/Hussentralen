<script lang="ts">
  import { calendarPromise } from "./stores/CalendarStore";
  import { birthdayCalendarId } from "./config";

  const cp = calendarPromise(birthdayCalendarId);
  $: todaysEvents = $cp;
</script>

<div
  on:click={() => {
    cp.reload();
  }}
>
  <h3>Dagens bursdager</h3>
  {#await todaysEvents}
    <p>Luftboller og ventesuppe</p>
  {:then events}
    {#each events.allDayEvents as birthday}
      <p>{birthday.title}</p>
    {:else}
      <p>Ingen bursdager i dag</p>
    {/each}
  {:catch ev}
    <pre>{JSON.stringify(ev)}</pre>
  {/await}
</div>
