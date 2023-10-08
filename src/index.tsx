/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";

import App from "./App";
import { Router } from "@solidjs/router";
import { MetaProvider } from "@solidjs/meta";

render(
  () => (
    <Router>
      <MetaProvider>
        <App />
      </MetaProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
