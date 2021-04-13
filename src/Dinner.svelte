<script lang="ts">
  import { calendarPromise } from "./stores/CalendarStore";
  import { dinnerCalendarId } from "./config";

  const cp = calendarPromise(dinnerCalendarId);
  $: todaysEvents = $cp;
</script>

<div
  on:click={() => {
    cp.reload();
  }}
>
  <h3>Dagens middag</h3>
  {#await todaysEvents}
    <p>Luftboller og ventesuppe</p>
  {:then events}
    <p>{events.allDayEvents[0]?.title || "Bestill nokka"}</p>
    <!-- <pre>{JSON.stringify(events)}</pre> -->
  {:catch ev}
    <pre>{JSON.stringify(ev)}</pre>
  {/await}
</div>
