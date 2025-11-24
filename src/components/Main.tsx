import { useUser } from "../user";
import image1 from "../assets/1.png";
import { TournamentList } from "./Tournaments/tournamentList";
import { TournamentView } from "./Tournaments/TournamentView";
import MatchesList from "./Matches/MatchesList";
import PoolList from "./pool/poollist";
import { TournamentForm } from "./Tournaments/TournamentForm";
import { TournamentFormEdition } from "./Tournaments/TournamentFormEdition";
import MatchAdd from "./Matches/Matchesadd";
import PoolAdd from "./pool/pooladd";
import type { ViewProps } from "../utils/ViewProps"; 

export const Main = ({ currentView, changeView }: ViewProps) => {
    const { user } = useUser();

    return (
        <main className="main-content">
            <div className="main-content">

                {/* SI PAS CONNECTÉ */}
                {!user && (
                    <div className="main-unlogged">
                        <div><img src={image1} alt="" width={500} /></div>
                        <div className="main-text">
                            <p>
                                Tourneo est une application conçue pour faciliter
                                l’organisation et la gestion de tournois de tennis et de padel amateur.
                                Elle offre aux organisateurs la possibilité de créer des tournois auto-organisés,
                                dans lesquels les participants gèrent eux-mêmes leurs matchs.
                            </p>
                        </div>
                    </div>
                )}

                {/* VUE DYNAMIQUE */}
                {user && currentView === "tournois" && (
                    <TournamentList changeView={changeView} />
                )}

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
