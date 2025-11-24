import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { UserProvider } from "./user.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "./components/user/Login.tsx";
import Matchesadd from "./components/Matches/Matchesadd.tsx";
import PoolAdd from "./components/pool/pooladd.tsx";
import MatchesList from "./components/Matches/MatchesList.tsx";
import MatchResultForm from "./components/Matches/MatchResultForm.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/matchadd" element={<Matchesadd />} />
          <Route
            path="/matches/:matchId/result"
            element={<MatchResultForm />}
          />
          <Route path="/matches/pool/:poolId" element={<MatchesList />} />
          <Route path="/pooladd" element={<PoolAdd />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);