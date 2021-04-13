// TODO: Make a store for retrieving Yr data regularly

import { derived, readable } from "svelte/store";
import type { YrData } from "../types/YrNow";
import { yrLocation } from "../config";

interface Weather {
  temperature: number;
  wind: { speed: number; gust: number; direction: number };
  image: string;
  rain: number;
}

async function fetchWeatherData(): Promise<Weather> {
  const { lat, lon } = yrLocation;
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

export const weather = readable<Weather>(undefined, (set) => {
  const intervalWorker = () => {
    fetchWeatherData().then((w) => {
      set(w);
    });
  };
  const interval = setInterval(intervalWorker, 15 * 60_000);
  intervalWorker();

  return () => {
    clearInterval(interval);
  };
});
