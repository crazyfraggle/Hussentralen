import { derived, readable, writable } from "svelte/store";
import dayjs from "dayjs";
import { googleApiKey, googleClientId } from "../config";

interface TimedEvent {
  startTime: string;
  endTime: string;
  title: string;
}

interface AlldayEvent {
  title: string;
  currentDay: number;
  numDays: number;
}

interface EventCollection {
  allDayEvents: AlldayEvent[];
  timedEvents: TimedEvent[];
}

async function loadEventsAsync(calendarId: string): Promise<EventCollection> {
  let todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  let todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);

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
    console.log("EVENTS:", calendarId, events);

    const allEvents = events.map((event) => ({
      startTime: new Date(
        event.start.dateTime || `${event.start.date}T00:00:00`
      ),
      endTime: new Date(event.end.dateTime || `${event.end.date}T00:00:00`),
      title: event.summary,
      allDay: !!event.start.date,
    }));

    const allDayEvents: AlldayEvent[] = allEvents
      .filter((event) => event.allDay)
      .filter((event) => event.endTime > todayStart)
      .map((event) => {
        return { title: event.title, currentDay: 1, numDays: 1 };
      });

    const timedEvents: TimedEvent[] = allEvents
      .filter((event) => !event.allDay)
      .map((event) => {
        return {
          title: event.title,
          startTime: dayjs(event.startTime).format("HH.mm"),
          endTime: dayjs(event.endTime).format("HH.mm"),
        };
      });
    return { allDayEvents, timedEvents };
  } catch (e) {
    console.error(e);
    return { allDayEvents: [], timedEvents: [] };
  }
}

const discoveryDocs = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const scope = "https://www.googleapis.com/auth/calendar.readonly";

export const gapiClient = (() => {
  const { subscribe, set, update } = writable({
    loading: true,
    isSignedIn: false,
  });

  const updateSigninStatus = (isSignedInNow: boolean) => {
    update((state) => ({ ...state, isSignedIn: isSignedInNow }));
  };

  return {
    subscribe,
    initClient: async () => {
      console.log("Client init");
      await gapi.client.init({
        apiKey: googleApiKey,
        clientId: googleClientId,
        discoveryDocs,
        scope,
      });
      console.log("Client initted!");

      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      update((state) => ({ ...state, loading: false }));
    },
  };
})();

// export const calendar = (calendarId: string) => {
//   return readable<EventCollection>(undefined, (set) => {
//     const intervalWorker = () => {
//       loadEventsAsync(calendarId).then((w) => {
//         set(w);
//       });
//     };

//     const interval = setInterval(intervalWorker, 15 * 60_000);
//     intervalWorker();

//     return () => {
//       clearInterval(interval);
//     };
//   });
// };

// export const calendarPromise = (calendarId: string) => {
//   let setter = undefined;
//   const { subscribe } = readable<Promise<EventCollection>>(undefined, (set) => {
//     setter = set;
//     const intervalWorker = () => {
//       set(loadEventsAsync(calendarId));
//     };
//     const interval = setInterval(intervalWorker, 15 * 60_000);
//     intervalWorker();

//     return () => {
//       clearInterval(interval);
//     };
//   });
//   return {
//     subscribe,
//     reload: () => {
//       console.log("Reload plz");
//       if (setter) {
//         console.log("OK");
//         setter(loadEventsAsync(calendarId));
//       }
//     },
//   };
// };

const updateTicker = writable(0, (set) => {
  const intervalWorker = () => {
    set(new Date().getTime());
  };
  const interval = setInterval(intervalWorker, 15 * 60_000);
  intervalWorker();
  return () => {
    clearInterval(interval);
  };
});

export const calendarPromise = (calendarId: string) => {
  const { subscribe } = derived([gapiClient, updateTicker], (values) => {
    const [$gapiClient, _tick] = values;

    if ($gapiClient.isSignedIn) {
      return loadEventsAsync(calendarId);
    }

    return Promise.reject("Not signed in");
  });
  return {
    subscribe,
    reload: () => {
      updateTicker.set(new Date().getTime());
    },
  };
};
