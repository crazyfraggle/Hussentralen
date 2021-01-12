<!-- TODO:
  [ ] Styling with style
  [ ] Show day in sequence for multi-day events
  [ ] Better loading indicator
-->
<script type="ts">
  export let user: string;
  export let calendarId: string;

  interface EventSummary {
    startTime: Date;
    endTime: Date;
    title: string;
    allDay: boolean;
  }

  let todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  let todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);

  let todaysEvents = loadEventsAsync();

  async function loadEventsAsync(): Promise<EventSummary[]> {
    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: calendarId,
        timeMin: todayStart.toISOString(),
        timeMax: todayEnd.toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      });
      var events = response.result.items;
      // console.log("EVENTS:", events);
      return events.map((event) => ({
        startTime: new Date(event.start.dateTime || event.start.date),
        endTime: new Date(event.end.dateTime || event.end.date),
        title: event.summary,
        allDay: !!event.start.date,
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  // Reload calendars every 15 minutes
  setInterval(() => {
    todaysEvents = loadEventsAsync();
  }, 15 * 60_000);
</script>

<style>
  .calendar {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .events {
    margin: 0;
  }

  .timespan {
    color: #aaaaaa;
  }
  .nothing {
    color: darkgreen;
  }
  .title {
    font-size: 125%;
    margin: 0;
    margin-bottom: 0.4em;
  }
</style>

<div class="calendar">
  <h2>{user}</h2>
  {#await todaysEvents}
    <p>Loading calendars</p>
  {:then events}
    <dl class="events">
      {#each events as event}
        {#if !event.allDay}
          <dt class="timespan">
            {event.startTime.toLocaleTimeString()}-{event.endTime.toLocaleTimeString()}
          </dt>
        {/if}
        <dd class="title">{event.title}</dd>
      {:else}
        <dd class="nothing">Ingenting planlagt i dag</dd>
      {/each}
    </dl>
  {/await}
</div>
