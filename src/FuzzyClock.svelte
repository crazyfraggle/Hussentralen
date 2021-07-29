<script type="text/typescript">
  export let visible = true;

  function getHour(now: Date): string {
    const minute = now.getMinutes();
    let hour = now.getHours();

    if (minute > 17) {
      hour += 1;
    }
    const hours = [
      "twelve",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
    ];
    return hours[hour % 12];
  }

  function getDistance(now: Date): string | null {
    const minute = now.getMinutes();
    if (minute < 3 || (minute > 27 && minute < 33) || minute > 57) return null;
    if (
      (minute > 2 && minute < 8) ||
      (minute > 22 && minute < 28) ||
      (minute > 32 && minute < 38) ||
      (minute > 52 && minute < 58)
    )
      return "five_m";
    if (
      (minute > 7 && minute < 13) ||
      (minute > 17 && minute < 23) ||
      (minute > 37 && minute < 43) ||
      (minute > 47 && minute < 53)
    )
      return "ten_m";
    if ((minute > 12 && minute < 18) || (minute > 42 && minute < 48))
      return "quarter";
    return null;
  }
  function getDirection(now: Date): string | null {
    const minute = now.getMinutes();
    if (minute < 3 || (minute > 27 && minute < 33) || minute > 57) return null;
    if (minute < 18 || (minute > 32 && minute < 43)) return "past";
    if ((minute > 17 && minute < 28) || minute > 42) return "to";
    return null;
  }
  function getIsHalf(now: Date): boolean {
    const minute = now.getMinutes();
    return minute > 17 && minute < 43;
  }

  function update(now: Date) {
    const targets = [
      "clockheader",
      getDistance(now),
      getDirection(now),
      getIsHalf(now) ? "half" : null,
      getHour(now),
    ];
    console.log(targets);

    Array.from(document.querySelectorAll(".active")).forEach((element) =>
      element.classList.remove("active")
    );

    targets
      .filter((t) => !!t)
      .forEach((t) => document.getElementById(t)?.classList.add("active"));
  }

  let now = new Date();
  $: update(now);

  // Start interval timer
  setInterval(() => {
    now = new Date();
  }, 5_000);
</script>

{#if visible}
  <div
    class="fuzzyclock"
    on:click={() => {
      visible = false;
    }}
  >
    <span id="clockheader" class="active">Klokka er</span>
    <span id="five_m" class="distance">fem</span>
    <span id="ten_m" class="distance">ti</span>
    <span id="quarter" class="distance">kvart</span>
    <span id="to" class="direction">p&aring;</span>
    <span id="past" class="direction">over</span>
    <span id="half" class="half">halv</span>
    <span id="one" class="hour">ett</span>
    <span id="two" class="hour">to</span>
    <span id="three" class="hour">tre</span>
    <span id="four" class="hour">fire</span>
    <span id="five" class="hour">fem</span>
    <span id="six" class="hour">seks</span>
    <span id="seven" class="hour">sju</span>
    <span id="eight" class="hour">&aring;tte</span>
    <span id="nine" class="hour">ni</span>
    <span id="ten" class="hour">ti</span>
    <span id="eleven" class="hour">elleve</span>
    <span id="twelve" class="hour">tolv</span>
  </div>
{/if}

<style type="text/scss" media="screen">
  .fuzzyclock {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;

    width: 100%;
    min-height: 100%;
    background-color: black;

    font-size: 8vw;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
  }
  .active {
    color: white;
  }
  span {
    color: #224;
    font-weight: bold;
    margin: 0 1em;
  }
</style>
