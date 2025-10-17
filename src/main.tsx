import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RepoContext } from "@automerge/react";
import App from "./App.tsx";
import { repository } from "./repository.ts";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RepoContext.Provider value={repository}>
      <App />
    </RepoContext.Provider>
  </StrictMode>
);
