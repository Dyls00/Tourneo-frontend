import { type FC, useEffect, useState } from "react";
import { useUser } from "../../user";
import { useTournament } from "../../tournoi";

type Tournament = {
    id: number;
    name: string;
    description?: string;
    start_date: string;
    end_date: string;
    min_players: number;
    max_players: number;
    etat: "registration" | "pools" | "finished";
    organizer_name: string;
    organizer_id: number;
    default_win_score_set1: number;
    default_win_score_set2: number;
    default_loss_score_set1: number;
    default_loss_score_set2: number;
    forfeit_deadline_hours: number;
    created_at: string;
    updated_at: string;
};

export const TournamentView: FC = () => {
    const { user } = useUser();
    const { setTournament } = useTournament();

    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/tournaments");
                const json = await res.json();

                if (json.success === false) {
                    alert(json.message);
                } else {
                    setTournaments(json.data);
                }
            } catch (err) {
                console.error("Erreur API :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTournaments();
    }, []);

    return (
        <div className="main-tournois">
            <div className="col-1">
                <p className="t-footer t-size">Tournoi</p>
            </div>

            {user?.role === "organizer" && (
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-right"
                ><a href="/TournamentForm">Créer</a>
                </button>
            )}

            <div className="col-2 mt-8">
                <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl">
                    <table className="table-auto">
  <thead>
    <tr>
      <th>Song</th>
      <th>Artist</th>
      <th>Year</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
      <td>Malcolm Lockyer</td>
      <td>1961</td>
    </tr>
    <tr>
      <td>Witchy Woman</td>
      <td>The Eagles</td>
      <td>1972</td>
    </tr>
    <tr>
      <td>Shining Star</td>
      <td>Earth, Wind, and Fire</td>
      <td>1975</td>
    </tr>
  </tbody>
</table>
                </div>
            </div>
        </div>
    );
};
