import { Component, Show, createSignal } from "solid-js";

const [data, setData] = createSignal<{ total_levels: number } | null>(null);

const update = async () => {
  const response = await (
    await fetch("https://neodash-total-time-api.seekr.pw")
  ).json();
  console.log(response);
  setData(response);
};

update();

const TotalTimeLeaderboard: Component = () => {
  return (
    <Show when={data() != null} fallback={<p>Loading...</p>}>
      <h1>total_levels: {data()!.total_levels}</h1>
    </Show>
  );
};

export default TotalTimeLeaderboard;
