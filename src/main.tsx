import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { UserProvider } from "./user.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "./components/Tournaments/Login.tsx";
import Matchesadd from "./components/Matches/Matchesadd.tsx";
import PoolAdd from "./components/pool/pooladd.tsx";
import PoolList from "./components/pool/poollist.tsx";
import { TournamentForm } from "./components/Tournaments/TournamentForm.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/matchadd" element={<Matchesadd />} />
          <Route path="/pooladd" element={<PoolAdd />} />
          <Route path="/TournamentForm" element={<TournamentForm />} />
          <Route path="/poollist" element={<PoolList />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
