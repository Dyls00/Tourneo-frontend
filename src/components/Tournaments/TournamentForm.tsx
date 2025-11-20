import { type FC } from "react";
import { useNavigate } from "react-router";
import {
    FormControl,
    FormLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useTournament } from "../../tournoi";
import { useUser } from "../../user";

export const TournamentForm: FC = () => {

const navigate = useNavigate();
const { setTournament } = useTournament();
const { user } = useUser();

const tournamentForm = useForm({
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

const onCreateTournament = async (data: any) => {
    const res = await fetch("http://localhost:3000/api/tournaments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const json = await res.json();
    console.log(json);
    console.log(data);
    

    if (json.success === false) {
        alert(json.message);
        return;
    }

    if (json?.data?.tournament) {
        setTournament(json.data.tournament);
        navigate(`/`);
        //navigate(`/tournament/${json.data.tournament.id}`);
    }
};


    return (
        <div className="tournament-form">
            <div className="wrapper">
                <div className="card-switch">
                    <div className="flip-card__inner">
                        <div className="flip-card__front">
                            <div className="title">Votre tournoi</div>
                            <form
                                className="flip-card__form"
                                action="POST"
                                onSubmit={tournamentForm.handleSubmit(onCreateTournament)}
                            >
                                <input
                                    className="flip-card__input"
                                    placeholder="Nom du tournoi"
                                    type="name"
                                    defaultValue=""
                                    {...tournamentForm.register("name", { required: true })} />
                                <input
                                    className="flip-card__input"
                                    placeholder="Description"
                                    type="text"
                                    defaultValue=""
                                    {...tournamentForm.register("description", { required: true })} />
                                    <label>Date de début</label>
                                    <input
                                    className="flip-card__input"
                                    type="date"
                                    defaultValue=""
                                    {...tournamentForm.register("start_date", { required: true })} />
                                    <label>Date de fin</label>
                                    <input
                                    className="flip-card__input"
                                    placeholder=""
                                    type="date"
                                    defaultValue=""
                                    {...tournamentForm.register("end_date", { required: true })} />
                                    <input
                                    className="flip-card__input"
                                    placeholder="Joueurs maximum"
                                    type="number"
                                    defaultValue=""
                                    {...tournamentForm.register("max_players", { required: true })} />
                                <input
                                    className="flip-card__input"
                                    placeholder="Joueurs minimum"
                                    type="number"
                                    defaultValue=""
                                    {...tournamentForm.register("min_players", { required: true })} />
                                <FormControl>
                                    <FormLabel id="demo-radio">Status</FormLabel>
                                    <select
                                        className="flip-card__input"
                                        {...tournamentForm.register("etat")}>
                                        <option value="registration">Inscription</option>
                                        <option value="pools">Poules</option>
                                        <option value="finished">Terminé</option>
                                    </select>
                                </FormControl>
                                <button className="flip-card__btn" type="submit">Confirm!</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
