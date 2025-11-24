import { useEffect, useState } from "react";
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

export const TournamentList = ({ changeView }) => {
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

    function onSelectTournament(t: Tournament) {
        setTournament(t);
        window.location.href = `/tournament/${t.id}`;
    }


     async function deleteTournament(id: number) {
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce tournoi ?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:3000/api/tournaments/${id}`, {
                method: "DELETE",
            });

            const json = await res.json();

            if (json.success === false) {
                alert(json.message);
                return;
            }

            setTournaments((prev) => prev.filter((t) => t.id !== id));

            alert("Tournoi supprimé avec succès.");
        } catch (err) {
            console.error("Erreur suppression tournoi :", err);
            alert("Impossible de supprimer le tournoi.");
        }
    }

    return (
        <div className="main-tournois">
            <div className="col-1">
                <p className="t-footer t-size">Liste des tournois</p>
            </div>

            {user?.role === "organizer" && (
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-right"
                onClick={() => changeView("tournoiForm")}>Créer
                </button>
            )}

            <div className="col-2 mt-8">
                <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl">
                    <table className="w-full text-left table-auto min-w-max">
                        <thead className="bg-gray-300">
                            <tr>
                                <th className="p-4 border-b bg-blue-gray-50">Nom du tournoi</th>
                                <th className="p-4 border-b bg-blue-gray-50">Description</th>
                                <th className="p-4 border-b bg-blue-gray-50">Début</th>
                                <th className="p-4 border-b bg-blue-gray-50">Fin</th>
                                <th className="p-4 border-b bg-blue-gray-50">Organisateur</th>
                                <th className="p-4 border-b bg-blue-gray-50">État</th>
                                <th className="p-4 border-b bg-blue-gray-50">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center">
                                        Chargement...
                                    </td>
                                </tr>
                            ) : tournaments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center">
                                        Aucun tournoi trouvé
                                    </td>
                                </tr>
                            ) : (
                                tournaments.map((t) => (
                                    <tr key={t.id}>
                                        <td className="p-4 border-b">{t.name}</td>
                                        <td className="p-4 border-b">{t.description || "-"}</td>
                                        <td className="p-4 border-b">
                                            {new Date(t.start_date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 border-b">
                                            {new Date(t.end_date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 border-b">{t.organizer_name}</td>
                                        <td className="p-4 border-b">{t.etat}</td>
                                        {user?.role == "player" &&
                                            <td className="p-4 border-b">
                                                 <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => onSelectTournament(t)}>
                                                    Voir
                                                </button>
                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => onSelectTournament(t)}>
                                                    Participer
                                                </button>
                                            </td>
                                        }
                                        {user?.role == "organizer" &&
                                            <td className="p-4 border-b">
                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => onSelectTournament(t)}>
                                                    Modifier
                                                </button>
                                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => deleteTournament(t.id)}>
                                                    Supprimer
                                                </button>
                                            </td>
                                        }
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
