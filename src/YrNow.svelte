<script lang="ts">
  import type { YrData } from "./types/YrNow";
  import { yrLocation } from "./config";

  interface Weather {
    temperature: number;
    wind: { speed: number; gust: number; direction: number };
    image: string;
    rain: number;
  }
  const { lat, lon } = yrLocation;
  async function fetchWeatherData(): Promise<Weather> {
    const url = `https://api.met.no/weatherapi/nowcast/2.0/complete?lat=${lat}&lon=${lon}`;
    const data = await fetch(url);
    const jsonResponse: YrData = await data.json();

    const details = jsonResponse.properties.timeseries[0].data.instant.details;
    const next1h = jsonResponse.properties.timeseries[0].data.next_1_hours;
    return {
      temperature: details.air_temperature,
      wind: {
        speed: details.wind_speed,
        gust: details.wind_speed_of_gust,
        direction: details.wind_from_direction,
      },
      image: `/yr/png/${next1h.summary.symbol_code}.png`,
      rain: next1h.details.precipitation_amount,
    };
  }

  const jsonDataPromise = fetchWeatherData();
</script>

<style>
  .yrblock {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .yrblock img {
    flex-grow: 0;
  }
  .yrblock div {
    flex-grow: 1;
  }
</style>

<div class="yrblock">
  {#await jsonDataPromise}
    <p>Fetching weather</p>
  {:then yr}
    <img src={yr.image} alt="Weather" />
    <div>
      <p>{yr.temperature}°C</p>
      <p>{yr.wind.speed}m/s</p>
      <p>{yr.rain}mm</p>
    </div>
  {/await}
</div>
