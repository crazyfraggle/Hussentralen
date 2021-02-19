// TODO: Can we subscribe to the Hue Hub?
// TODO: How to find the Hub
import { readable } from "svelte/store";
import { hueUserId } from "../config";
import type { HueLight } from "../types/HueLight";

let hubAddress: string | undefined = undefined;

type HueLightContainer = { [key: string]: HueLight };
async function fetchLightData(): Promise<HueLightContainer> {
  if (!hubAddress) {
    const hubData = await fetch("https://discovery.meethue.com/");
    const hubJsonData = await hubData.json();
    hubAddress = hubJsonData[0]["internalipaddress"];
  }
  const url = `http://${hubAddress}/api/${hueUserId}/lights`;
  const lightData = await fetch(url);
  const jsonResponse = await lightData.json();
  return jsonResponse as HueLightContainer;
}

export const lights = readable<HueLightContainer>({}, (set) => {
  const interval = setInterval(() => {
    fetchLightData()
      .then((lights) => {
      set(lights);
      })
      .catch((error) => {
        console.log(error);
    });
  }, 5000);

  return () => {
    clearInterval(interval);
  };
});
