import { useUser } from "../user";
import { TournamentList } from "./Tournaments/tournamentList";
import { TournamentView } from "./Tournaments/TournamentView";
import MatchesList from "./Matches/MatchesList";
import PoolList from "./pool/poollist";
import { TournamentForm } from "./Tournaments/TournamentForm";
import { TournamentFormEdition } from "./Tournaments/TournamentFormEdition";
import MatchAdd from "./Matches/Matchesadd";
import PoolAdd from "./pool/pooladd";
import type { ViewProps } from "../utils/ViewProps"; 
import { Profil } from "./user/Profil";
import { Login } from "./user/Login";
import { MainView } from "../MainView";

export const Main = ({ currentView, changeView }: ViewProps) => {
    const { user } = useUser();

    return (
        <main className="main-content">
            <div className="main-content">

                {/* VUE DYNAMIQUE */}
                {currentView === "mainview" && <MainView />}
                {user && currentView === "tournois" && (
                    <TournamentList changeView={changeView} />
                )}
                {!user && currentView === "login" && <Login changeView={changeView}/>}
                {user && currentView === "profil" && <Profil changeView={changeView}/>}
                {user && currentView === "tournoiView" && <TournamentView />}
                {user && currentView === "tournoiForm" && <TournamentForm />}
                {user && currentView === "tournoiFormEdition" && <TournamentFormEdition />}
                {user && currentView === "matches" && <MatchesList  currentView={currentView} changeView={changeView}/>}
                {user && currentView === "matchadd" && <MatchAdd />}
                {user && currentView === "pool" && <PoolList currentView={currentView} changeView={changeView}/>}
                {user && currentView === "pooladd" && <PoolAdd />}
            </div>
        </main>
    );
};
