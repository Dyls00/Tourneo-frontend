import { type FC, useEffect } from "react";
import { useNavigate } from "react-router";
import { FormControl, FormLabel } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTournament } from "../../tournoi";
import { useUser } from "../../user";

export const TournamentFormEdition: FC = () => {
    const navigate = useNavigate();
    const { tournament } = useTournament();
    const { user } = useUser();

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            start_date: "",
            end_date: "",
            min_players: 0,
            max_players: 0,
            etat: "registration",
            organizer_id: user?.id,
            default_win_score_set1: 0,
            default_win_score_set2: 0,
            default_loss_score_set1: 0,
            default_loss_score_set2: 0,
            forfeit_deadline_hours: 0,
        },
    });

    useEffect(() => {
        if (tournament) {
            form.reset(tournament);
        }
    }, [tournament]);

    const onEditTournament = async (data: any) => {
        if (!tournament) return;

        const res = await fetch(`http://localhost:3000/api/tournaments/${tournament.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!json.success) {
            alert(json.message);
            return;
        }

        alert("Tournoi mis à jour avec succès.");
        navigate("/");
    };

    return (
        <div className="tournament-form-edition">
            <div className="wrapper">
                <div className="card-switch">
                    <div className="flip-card__inner">
                        <div className="flip-card__front">
                            <div className="title">Modifier votre tournoi</div>

                            <form
                                className="flip-card__form"
                                onSubmit={form.handleSubmit(onEditTournament)}
                            >
                                <input className="flip-card__input" placeholder="Nom"
                                    {...form.register("name", { required: true })} />

                                <input className="flip-card__input" placeholder="Description"
                                    {...form.register("description")} />

                                <label>Date de début</label>
                                <input className="flip-card__input" type="date"
                                    {...form.register("start_date", { required: true })} />

                                <label>Date de fin</label>
                                <input className="flip-card__input" type="date"
                                    {...form.register("end_date", { required: true })} />

                                <input className="flip-card__input" type="number" placeholder="Joueurs min"
                                    {...form.register("min_players", { required: true })} />

                                <input className="flip-card__input" type="number" placeholder="Joueurs max"
                                    {...form.register("max_players", { required: true })} />

                                <FormControl>
                                    <FormLabel>Status</FormLabel>
                                    <select className="flip-card__input" {...form.register("etat")}>
                                        <option value="registration">Inscription</option>
                                        <option value="pools">Poules</option>
                                        <option value="finished">Terminé</option>
                                    </select>
                                </FormControl>

                                <button className="flip-card__btn" type="submit">Mettre à jour</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
