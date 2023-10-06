import { Component, lazy, ParentProps } from "solid-js";
import { A, Route, Routes } from "@solidjs/router";

const HallOfFame = lazy(() => import("./pages/HallOfFame"));
const TotalTimeLeaderboard = lazy(() => import("./pages/TotalTimeLeaderboard"));

const NavbarButton: Component<ParentProps<{ href: string }>> = (props) => (
  <A href={props.href} class="btn btn-ghost text-xl">
    {props.children}
  </A>
);

const App: Component = () => {
  return (
    <>
      <nav class="navbar">
        <NavbarButton href="/">Hall of Fame</NavbarButton>
        <A href="/total-time" class="btn btn-ghost text-xl">
          Total Time
        </A>
      </nav>
      <Routes>
        <Route path="/" component={HallOfFame}></Route>
        <Route path="/total-time" component={TotalTimeLeaderboard}></Route>
      </Routes>
    </>
  );
};

export default App;
