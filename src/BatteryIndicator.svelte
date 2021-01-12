<script>
  let batteryLevel = 1.0;

  const hasBatterySupport = !!window.navigator.getBattery;

  function getBatteryState() {
    window.navigator.getBattery().then((battery) => {
      batteryLevel = battery.level;
    });
    setTimeout(getBatteryState, 60_000);
  }

  if (hasBatterySupport) {
    getBatteryState();
  }
</script>

<style>
  .indicator {
    width: 202px;
    border: 1px solid white;
  }
  .level {
    height: 25px;
    background-color: blanchedalmond;
    display: flex;
    align-items: center;
  }
  .batteryLevel {
    font-size: 18px;
    color: black;
  }
</style>

{#if hasBatterySupport}
  <div class="battery">
    <div class="indicator">
      <div class="level" style="width: {batteryLevel * 200}px">
        <span class="batteryLevel">{batteryLevel * 100}%</span>
      </div>
    </div>
  </div>
{/if}
