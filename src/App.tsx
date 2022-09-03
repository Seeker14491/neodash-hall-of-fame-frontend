import { Component, createMemo, createSignal, For } from "solid-js";

type Entry = [string, number];

const [fetchedEntries, setFetchedEntries] = createSignal<Entry[]>([]);

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
  const response = await (
    await fetch("https://neodash-hall-of-fame-api.seekr.pw/")
  ).json();
  setFetchedEntries(response);
};

update();
setInterval(update, 60000);

const App: Component = () => {
  return (
    <div class="flex flex-col text-white">
      <h1 class="m-4 text-center text-3xl font-bold">Neodash Hall of Fame</h1>
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
                  <td class="text-right text-xl font-semibold">{entry[1]}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
