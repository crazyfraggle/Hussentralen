# Home automation central

This is my little home automation central playground. It is mostly an experiment
in using a [Svelte] app to view the status of "smart" devices in my house at a
single location.

## Philips Hue lights

The initial trigger for the project was installation of Philips [Hue] lights
around the house. It turns out that controlling these on a LAN is very easy.

## Today section

A single location for the house member calendars. Powering this through Google
Calendars.

## Weather

Todays weather is provided by [Yr.no](https://yr.no/). Indoor and outdoor
measurements will be read from NetAtmo devices.

## Configuration

A `config.ts` file is required in `src` for the app to work. This needs to
define the following:

```typescript
// User ID from logging in to your hue hub
export const hueUserId: string;
// Client ID for your google app (as this app is not released on its own)
export const googleClientId: string;
// Google API key
export const googleApiKey: string;
// Map of google calendars for the Calendars component.
export const calendarMap = [
  {
    user: string,
    calendarId: string,
  },
];
// Location for YrNow weather
export const yrLocation = { lat: number, lon: number };
```

For obvious reasons, this is not checked in to GitHub.
