import { derived, readable } from "svelte/store";
import { NetatmoApiClient } from "netatmo-api-client";
import {
  netatmoClientId,
  netatmoClientSecret,
  netatmoUsername,
  netatmoPassword,
} from "../config";

async function getSensorData() {
  const client = new NetatmoApiClient(netatmoClientId, netatmoClientSecret);
  client.login(netatmoUsername, netatmoPassword);
  const data = await client.getStationData();
}

export const raw = readable<string>("", (set) => {
  const intervalWorker = async () => {
    const client = new NetatmoApiClient(netatmoClientId, netatmoClientSecret);
    await client.login(netatmoUsername, netatmoPassword);
    client.getStationData().then((d) => {
      set(JSON.stringify(d));
    });
  };
  //  getSensorData().then((value) => {
  //    set(JSON.stringify(value));
  //  });
  const interval = setInterval(intervalWorker, 15 * 60_000);
  intervalWorker();
  return () => {
    clearInterval(interval);
  };
});
type SensorData = {
  temperature: {
    current: number;
  };
  humidity: number;
  co2: number;
};
//export const sensors = readable<string>("", (set) => {
export const sensors = readable<SensorData[]>([], (set) => {
  const intervalWorker = async () => {
    const client = new NetatmoApiClient(netatmoClientId, netatmoClientSecret);
    await client.login(netatmoUsername, netatmoPassword);
    client.getStationData().then((d: any) => {
      const msinModule = d.devices?.filter(
        (dev) => dev.id == "70:ee:50:5f:31:7a"
      )?.[0];
      console.log(msinModule);
      const p1 = msinModule?.modules?.filter(
        (mod) => mod.id == "03:00:00:09:9f:a4"
      )?.[0];
      const p0 = msinModule?.modules?.filter(
        (mod) => mod.id == "03:00:00:09:b4:ba"
      )?.[0];
      const sraw = [p0, p1, msinModule];
      console.log(sraw);
      set(sraw);
    });
  };
  //const intervalWorker = () => {
  //  const w = [
  //    { temp: 23, humidity: 41.2, co2: 654 },
  //    { temp: 22, humidity: 45.2, co2: 453 },
  //    { temp: 26, humidity: 33.2, co2: 789 },
  //  ];
  //  set(w);
  //};

  const interval = setInterval(intervalWorker, 15 * 60_000);
  intervalWorker();

  return () => {
    clearInterval(interval);
  };
});
