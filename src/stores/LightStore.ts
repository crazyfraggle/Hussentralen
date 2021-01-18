// TODO: Can we subscribe to the Hue Hub?
import { readable } from "svelte/store";
import { hueUserId } from "../config";
import type { HueLight } from "../types/HueLight";

type HueLightContainer = { [key: string]: HueLight };

async function fetchLightData(): Promise<HueLightContainer> {
  const url = `http://192.168.10.112/api/${hueUserId}/lights`;
  const lightData = await fetch(url);
  const jsonResponse = await lightData.json();
  return jsonResponse as HueLightContainer;
}

export const lights = readable<HueLightContainer>({}, (set) => {
  const interval = setInterval(() => {
    fetchLightData().then((lights) => {
      set(lights);
    });
  }, 5000);

  return () => {
    clearInterval(interval);
  };
});
