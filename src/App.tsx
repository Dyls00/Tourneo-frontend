import { useState } from "react";
import "./App.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Main } from "./components/Main";


function App() {

  const [view, setView] = useState("tournois");
  return (
    <div className="content">
      <Header currentView={view} changeView={setView}/>
      <Main currentView={view} changeView={setView} />
      <Footer />
    </div>
  );
}

export default App;
