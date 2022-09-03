import { formatDistanceToNow } from "date-fns";
import { Component, createSignal, For } from "solid-js";

type Entry = [string, number];

const [fetchedEntries, setFetchedEntries] = createSignal<Entry[]>([]);

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
    <div class="flex flex-col">
      <h1 class="m-4 text-center text-3xl font-bold">Neodash Hall of Fame</h1>
      <div class="mx-auto max-w-full overflow-x-auto">
        <table class="table-compact mx-1 my-2 table">
          <thead>
            <tr>
              <th class="!static">Rank</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <For each={fetchedEntries()}>
              {(entry, i) => (
                <tr>
                  <td>{i() + 1}</td>
                  <td>{entry[0]}</td>
                  <td>{entry[1]}</td>
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
