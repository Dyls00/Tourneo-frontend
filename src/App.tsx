import { useState } from "react";
import "./App.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Main } from "./components/Main";

const [view, setView] = useState("tournois");

function App() {
  return (
    <div className="content">
      <Header changeView={setView}/>
      <Main currentView={view}/>
      <Footer />
    </div>
  );
}

export default App;
