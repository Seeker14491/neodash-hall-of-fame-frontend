import {
  Component,
  createMemo,
  createSignal,
  For,
  Match,
  Switch,
} from "solid-js";
import { FaBrandsGithub } from "solid-icons/fa";

type Entry = [string, number];

const [fetchedEntries, setFetchedEntries] = createSignal<Entry[]>([]);
const [fetchState, setFetchState] = createSignal<"loading" | "done" | "failed">(
  "loading"
);

const ranks = createMemo(() => {
  const entries = fetchedEntries();
  if (entries.length === 0) {
    return [];
  }

  const ranks = [1];
  for (let i = 1; i < entries.length; ++i) {
    if (entries[i][1] < entries[i - 1][1]) {
      ranks.push(i + 1);
    } else {
      ranks.push(ranks[i - 1]);
    }
  }

  return ranks;
});

const update = async () => {
  try {
    const response = await (
      await fetch("https://neodash-hall-of-fame-api.seekr.pw/")
    ).json();
    setFetchedEntries(response);
    setFetchState("done");
  } catch (e) {
    console.error("failed to fetch Hall of Fame data: " + e);
    setFetchState("failed");
  }
};

update();
setInterval(update, 60000);

const App: Component = () => {
  return (
    <div class="flex flex-col items-center text-white">
      <h1 class="m-4 text-center text-3xl font-bold">Neodash Hall of Fame</h1>
      <Switch>
        <Match when={fetchState() === "loading"}>
          <p class="text-xl">Loading...</p>
        </Match>
        <Match when={fetchState() === "failed"}>
          <p class="text-xl">Failed to load data.</p>
        </Match>
        <Match when={fetchState() === "done"}>
          <div class="mx-auto max-w-full">
            <table class="table-compact mx-1 my-2 table">
              <thead>
                <tr>
                  <th class="sticky top-0 text-xl">Rank</th>
                  <th class="sticky top-0 text-xl">Player</th>
                  <th class="sticky top-0 text-xl">Score</th>
                </tr>
              </thead>
              <tbody>
                <For each={fetchedEntries()}>
                  {(entry, i) => (
                    <tr>
                      <td class="text-xl font-bold">#{ranks()[i()]}</td>
                      <td class="text-xl">{entry[0]}</td>
                      <td class="text-right text-xl font-semibold">
                        {entry[1]}
                      </td>
                    </tr>
                  )}
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
  );
};

export default App;
