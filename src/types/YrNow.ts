export interface YrData {
  type: "Feature";
  geometry: { type: "Point"; coordinates: number[] };
  properties: {
    meta: {
      updated_at: Date;
      units: {
        air_temperature: "celsius";
        precipitation_amount: "mm";
        precipitation_rate: "mm/h";
        relative_humidity: "%";
        wind_from_direction: "degrees";
        wind_speed: "m/s";
        wind_speed_of_gust: "m/s";
      };
      radar_coverage: "ok";
    };
    timeseries: [
      {
        time: Date;
        data: {
          instant: {
            details: {
              air_temperature?: number;
              precipitation_rate?: number;
              relative_humidity?: number;
              wind_from_direction?: number;
              wind_speed?: number;
              wind_speed_of_gust?: number;
            };
          };
          next_1_hours: {
            summary: { symbol_code: string };
            details: { precipitation_amount: number };
          };
        };
      }
    ];
  };
}
