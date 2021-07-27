<!-- TODO:
  [ ] Styling with style
  [ ] Show day in sequence for multi-day events
  [ ] Better loading indicator
-->
<script type="ts">
  import { calendarPromise } from "./stores/CalendarStore";

  export let user: string;
  export let calendarId: string;

  const cp = calendarPromise(calendarId);
  $: todaysEvents = $cp;
</script>

<div class="calendar">
  <h2>{user}</h2>
  {#await todaysEvents}
    <p>Loading calendars</p>
  {:then eventCollection}
    <dl
      class="events"
      on:click={() => {
        cp.reload();
      }}
    >
      {#each eventCollection.allDayEvents as event}
        <dd class="title allday">{event.title}</dd>
      {/each}
      {#each eventCollection.timedEvents as event}
        <dt class="timespan">
          {event.startTime}-{event.endTime}
        </dt>
        <dd class="title event">{event.title}</dd>
      {:else}
        <dd class="nothing">Ingenting planlagt i dag</dd>
      {/each}
    </dl>
  {/await}
</div>

<style>
  .calendar {
    flex-grow: 0;
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .events {
    margin: 0;
  }

  .events dd,
  .events dt {
    margin: 0;
  }

  .timespan {
    color: #aaaaaa;
    font-size: 90%;
  }
  .nothing {
    color: darkgreen;
  }
  .title {
    font-size: 100%;
    margin: 0;
    margin-bottom: 0.4em;
  }
  .allday {
    background-color: darkcyan;
  }
</style>
