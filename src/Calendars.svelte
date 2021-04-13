<!-- 
  TODO: Move GAPI loading logic to CalendarStore
-->
<script lang="ts">
  import Calendar from "./Calendar.svelte";
  import { calendarMap } from "./config";
  import { gapiClient } from "./stores/CalendarStore";

  const calendars = calendarMap;

  const handleGoogleApiLoad = () => {
    gapi.load("client:auth2", () => {
      console.log("Init client?");
      gapiClient.initClient();
    });
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

{#if $gapiClient.isSignedIn}
  <div class="calendars">
    {#each calendars as cal}
      <Calendar user={cal.user} calendarId={cal.calendarId} />
    {/each}
  </div>
{:else if $gapiClient.loading}
  <p>Awaiting Google API download</p>
{:else}
  <p><button on:click={handleLogInClick}>Sign in to Google</button></p>
{/if}

<style>
  .calendars {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    margin: 1em;
    border: 1px solid blueviolet;
  }
</style>
