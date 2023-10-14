import {
  Component,
  createMemo,
  createSignal,
  Match,
  onCleanup,
  onMount,
  Switch,
} from "solid-js";
import { FaBrandsGithub } from "solid-icons/fa";
import * as R from "remeda";
import { Title } from "@solidjs/meta";
import indicator from "ordinal/indicator";

type Response = {
  timestamp: string;
  total_levels: number;
  players: string[];
  total_times_ms: number[];
  levels_finished: number[];
  ranks: number[];
};

const formatTime = (time_ms: number) => {
  const h = Math.floor(time_ms / 3600000);
  const m = Math.floor((time_ms % 3600000) / 60000);
  const s = Math.floor((time_ms % 60000) / 1000);
  const ms = Math.floor(time_ms % 1000);

  let formattedTime = "";

  if (h > 0) {
    formattedTime += `${h}:`;
  }

  formattedTime += `${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;

  return formattedTime;
};

const TotalTimeLeaderboard: Component = () => {
  const [response, setResponse] = createSignal<Response | null>(null, {
    equals: (a, b) => a?.timestamp === b?.timestamp,
  });

  const [fetchState, setFetchState] = createSignal<
    "loading" | "done" | "failed"
  >("loading");

  let tableRows = createMemo(() => {
    const response1 = response();
    if (response1 == null) {
      return <></>;
    }

    const numEntriesToKeep = R.takeWhile(
      response1.levels_finished,
      (x) => x === response1.total_levels,
    ).length;

    return R.range(0, numEntriesToKeep).map((i) => {
      return (
        <tr class="border-0">
          <td class="text-xl font-bold">
            {response1.ranks[i]}
            <sup>{indicator(i + 1)}</sup>
          </td>
          <td class="text-xl">{response1.players[i]}</td>
          <td class="text-lg font-mono text-right">
            {formatTime(response1.total_times_ms[i])}
          </td>
        </tr>
      );
    });
  });

  const update = async () => {
    try {
      const response: Response | {} = await (
        await fetch("https://neodash-total-time-api.seekr.pw/")
      ).json();
      if ("timestamp" in response) {
        setResponse(response);
      } else {
        setResponse(null);
      }
      setFetchState("done");
    } catch (e) {
      console.error("failed to fetch Total Time data: " + e);
      setFetchState("failed");
    }
  };

  onMount(update);

  const updateTimer = setInterval(update, 60000);
  onCleanup(() => clearInterval(updateTimer));

  return (
    <>
      <Title>Neodash Total Time Leaderboard</Title>
      <div class="flex flex-col items-center text-white">
        <h1 class="m-4 text-center text-3xl font-bold">
          Neodash Total Time Leaderboard
        </h1>
        <div class="italic mx-2 text-center">
          Sum of times across all grid levels, including hardcore
        </div>
        <Switch>
          <Match when={fetchState() === "loading"}>
            <p class="text-xl">Loading...</p>
          </Match>
          <Match when={fetchState() === "failed"}>
            <p class="text-xl">Failed to load data.</p>
          </Match>
          <Match when={fetchState() === "done" && response() == null}>
            <p class="text-xl">No data available right now.</p>
          </Match>
          <Match when={fetchState() === "done"}>
            <div class="mx-auto max-w-full">
              <table class="table-xs mx-1 my-2 table table-pin-rows">
                <thead>
                  <tr class="border-0">
                    <th class="top-0 text-xl bg-base-100 text-white">Rank</th>
                    <th class="top-0 text-xl bg-base-100 text-white">Player</th>
                    <th class="top-0 text-xl bg-base-100 text-white">
                      Total Time
                    </th>
                  </tr>
                </thead>
                <tbody>{tableRows()}</tbody>
              </table>
            </div>
            <div class="italic mt-2">
              players: {response()!.players.length}
              <br />
              levels: {response()!.total_levels}
            </div>
          </Match>
        </Switch>
        <a
          class="link link-hover m-4 mt-8 flex items-center gap-1"
          href="https://github.com/Seeker14491/neodash-hall-of-fame"
        >
          <FaBrandsGithub size={20} color="#ffffff" />
          Source
        </a>
      </div>
    </>
  );
};

export default TotalTimeLeaderboard;
