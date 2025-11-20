import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { UserProvider } from "./user.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "./components/Login.tsx";
import { MatchesList } from "./components/Matches/MatchesList.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/MatchList" element={<MatchesList />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
