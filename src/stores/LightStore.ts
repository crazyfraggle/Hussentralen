// TODO: Can we subscribe to the Hue Hub?
// TODO: Cache result to avoid polling delay
import { derived, writable } from "svelte/store";
import { hueUserId } from "../config";
import type { HueLightContainer } from "../types/HueLight";

let hubAddress: string | undefined = undefined;

async function fetchLightData(): Promise<HueLightContainer> {
  if (!hubAddress) {
    const hubData = await fetch("https://discovery.meethue.com/");
    const hubJsonData = await hubData.json();
    if (hubJsonData.length > 0) {
      hubAddress = hubJsonData[0]["internalipaddress"];
    } else {
      hubAddress = "NO";
    }
  }
  if (hubAddress === "NO") {
    return {};
  }
  const url = `http://${hubAddress}/api/${hueUserId}/lights`;
  const lightData = await fetch(url);
  const jsonResponse = await lightData.json();
  return jsonResponse as HueLightContainer;
}

function xyToRgb(xy: number[], brightness: number): string {
  const [x, y] = xy;
  const z = 1.0 - x - y;
  const Y = brightness; // The given brightness value
  const X = (Y / y) * x;
  const Z = (Y / y) * z;
  const r = X * 1.656492 - Y * 0.354851 - Z * 0.255038;
  const g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
  const b = X * 0.051713 - Y * 0.121364 + Z * 1.01153;

  return `rgb(${r}, ${g}, ${b})`;
}

function l2() {
  const { subscribe, set, update } = writable<HueLightContainer>({});
  let lightData: HueLightContainer = undefined;

  const interval = setInterval(() => {
    fetchLightData()
      .then((lights) => {
        lightData = lights;
        console.log(lights);
        set(lights);
      })
      .catch((error) => {
        console.log(error);
      });
  }, 5000);

  return {
    subscribe,
    color: (light: string) => {
      const ld = lightData[light];
      if (!ld.state.on) {
        return "black";
      }

      if (ld.state.colormode == "xy") {
        return xyToRgb(ld.state.xy, ld.state.bri);
      }
      return "#ada";
    },
    on: (light: string) => {
      const ld = lightData[light];
      return ld.state.on;
    },
    toggleOnOff: (light) => {
      update((l) => {
        const currentLightState = l[light].state.on;
        l[light].state.on = !currentLightState;
        const url = `http://${hubAddress}/api/${hueUserId}/lights/${light}/state`;
        fetch(url, {
          method: "PUT",
          body: JSON.stringify({ on: !currentLightState }),
        }).then(() => {
          l[light].state.on = !currentLightState;
        });

        return l;
      });
    },
  };
}
export const lights = l2();

export const singleLight = (light: string) => {
  const { subscribe } = derived(lights, ($lights) => {
    return $lights[light];
  });
  return {
    subscribe,
    on: () => lights.on(light),
    color: () => lights.color(light),
    toggleOnOff: () => lights.toggleOnOff(light),
  };
};
