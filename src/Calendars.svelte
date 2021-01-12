<script lang="ts">
  import { calendarMap, googleApiKey, googleClientId } from "./config";
  import Calendar from "./Calendar.svelte";

  const calendars = calendarMap;
  const discoveryDocs = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];
  const scope = "https://www.googleapis.com/auth/calendar.readonly";

  let isSignedIn = false;
  let loadingGapi = true;
  let todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  let todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);

  async function updateSigninStatus(isSignedInNow: boolean) {
    isSignedIn = isSignedInNow;
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  async function initClient() {
    await gapi.client.init({
      apiKey: googleApiKey,
      clientId: googleClientId,
      discoveryDocs,
      scope,
    });

    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    loadingGapi = false;
  }

  // To list all calendars
  // const cals = await gapi.client.calendar.calendarList.list();
  // console.log("Calendars:", cals);

  const handleGoogleApiLoad = () => {
    gapi.load("client:auth2", initClient);
  };
  const handleLogInClick = (_) => {
    gapi.auth2.getAuthInstance().signIn();
  };
</script>

<svelte:head>
  <script
    async
    defer
    src="https://apis.google.com/js/api.js"
    on:load={handleGoogleApiLoad}>
  </script>
</svelte:head>

{#if isSignedIn}
  {#each calendars as cal}
    <Calendar user={cal.user} calendarId={cal.calendarId} />
  {/each}
{:else if loadingGapi}
  <p>Awaiting Google API download</p>
{:else}
  <p><button on:click={handleLogInClick}>Sign in to Google</button></p>
{/if}
