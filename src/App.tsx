import { Component, lazy, ParentProps } from "solid-js";
import { A, Route, Routes, useLocation } from "@solidjs/router";

const HallOfFame = lazy(() => import("./pages/HallOfFame"));
const TotalTimeLeaderboard = lazy(() => import("./pages/TotalTimeLeaderboard"));

const NavbarButton: Component<ParentProps<{ href: string }>> = (props) => {
  const isCurrentPage = () => useLocation().pathname === props.href;

  return (
    <A
      href={props.href}
      class="btn btn-ghost text-xl text-white mr-1"
      classList={{ underline: isCurrentPage() }}
    >
      {props.children}
    </A>
  );
};

const App: Component = () => {
  return (
    <>
      <nav class="navbar">
        <NavbarButton href="/">Hall of Fame</NavbarButton>
        <NavbarButton href="/total-time">Total Time</NavbarButton>
      </nav>
      <div class="divider my-0 mx-2" />
      <Routes>
        <Route path="/" component={HallOfFame}></Route>
        <Route path="/total-time" component={TotalTimeLeaderboard}></Route>
      </Routes>
    </>
  );
};

export default App;
