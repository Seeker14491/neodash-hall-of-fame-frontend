import { Component, createSignal, For, Match, Switch } from "solid-js";
import { FaBrandsGithub } from "solid-icons/fa";
import * as R from "remeda";
import { Title } from "@solidjs/meta";

type Response = {
  timestamp: string;
  total_levels: number;
  players: string[];
  total_times_ms: number[];
  levels_finished: number[];
  ranks: number[];
};

const [response, setResponse] = createSignal<Response | {}>({});
const [fetchState, setFetchState] = createSignal<"loading" | "done" | "failed">(
  "loading",
);

let numEntriesToKeep = 0;
const update = async () => {
  try {
    const response: Response | {} = await (
      await fetch("https://neodash-total-time-api.seekr.pw/")
    ).json();
    if ("timestamp" in response) {
      numEntriesToKeep = R.takeWhile(
        response.levels_finished,
        (x) => x === response.total_levels,
      ).length;
    }
    setResponse(response);
    setFetchState("done");
  } catch (e) {
    console.error("failed to fetch Total Time data: " + e);
    setFetchState("failed");
  }
};

update();
setInterval(update, 60000);

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
  return (
    <>
      <Title>Neodash Total Time Leaderboard</Title>
      <div class="flex flex-col items-center text-white">
        <h1 class="m-4 text-center text-3xl font-bold">
          Neodash Total Time Leaderboard
        </h1>
        <Switch>
          <Match when={fetchState() === "loading"}>
            <p class="text-xl">Loading...</p>
          </Match>
          <Match when={fetchState() === "failed"}>
            <p class="text-xl">Failed to load data.</p>
          </Match>
          <Match when={fetchState() === "done" && R.equals(response(), {})}>
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
                <tbody>
                  <For each={R.range(0, numEntriesToKeep)}>
                    {(i) => {
                      const response1: Response = response() as any;
                      return (
                        <tr class="border-0">
                          <td class="text-xl font-bold">
                            #{response1.ranks[i]}
                          </td>
                          <td class="text-xl">{response1.players[i]}</td>
                          <td class="text-xl font-semibold">
                            {formatTime(response1.total_times_ms[i])}
                          </td>
                        </tr>
                      );
                    }}
                  </For>
                </tbody>
              </table>
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
