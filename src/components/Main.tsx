import { useUser } from "../user";
import image1 from "../assets/1.png";
import { TournamentForm } from "./Tournaments/TournamentForm";
import { TournamentList } from "./Tournaments/tournamentList";

type MainProps = {
    currentView: string;
};

export const Main = ({ currentView }: MainProps) => {
    const { user } = useUser();

    return (
        <main>
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
                {user && currentView === "tournois" && <TournamentList />}
                {user && currentView === "tournoiForm" && <TournamentForm />}

            </div>
        </main>
    );
};
