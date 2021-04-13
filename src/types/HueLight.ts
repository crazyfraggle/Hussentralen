export interface HueLight {
  state: {
    on: boolean;
    bri: number;
    ct: number;
    alert: "select";
    colormode: "ct" | "rgb" | "xy";
    mode: "homeautomation";
    reachable: true;
    xy: number[];
  };
  swupdate: { state: "noupdates"; lastinstall: string };
  type: string;
  name: string;
  modelid: string;
  manufacturername: string;
  productname: string;
  capabilities: {
    certified: boolean;
    control: {
      mindimlevel: number;
      maxlumen: number;
      ct: { min: number; max: number };
    };
    streaming: { renderer: false; proxy: false };
  };
  config: {
    archetype: "sultanbulb" | "lightstrip";
    function: "functional";
    direction: "omnidirectional";
    startup: { mode: "powerfail"; configured: true };
  };
  uniqueid: string;
  swversion: string;
}

export type HueLightContainer = { [key: string]: HueLight };
