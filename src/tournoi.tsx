import { createContext, useContext, useReducer, useEffect } from "react";

type Tournament = {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  min_players: number;
  max_players: number;
  etat: "registration" | "pools" | "finished";
  organizer_id: number;
  organizer_name?: string;
  default_win_score_set1: number;
  default_win_score_set2: number;
  default_loss_score_set1: number;
  default_loss_score_set2: number;
  forfeit_deadline_hours: number;
  created_at: string;
  updated_at: string;
};

type TournamentContextType = {
  tournament: Tournament | null;
  setTournament: (t: Tournament) => void;
  clearTournament: () => void;
};

export const TournamentContext = createContext<TournamentContextType>({
  tournament: null,
  setTournament: () => {},
  clearTournament: () => {},
});

export function useTournament() {
  return useContext(TournamentContext);
}

// Reducer
function tournamentReducer(
  state: Tournament | null,
  action: { type: string; payload?: Tournament }
) {
  switch (action.type) {
    case "set":
      return action.payload || null;
    case "clear":
      return null;
    default:
      return state;
  }
}

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const storedTournament =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("tournament") || "null")
      : null;

  const [tournament, dispatch] = useReducer(tournamentReducer, storedTournament);

  useEffect(() => {
    if (tournament) {
      localStorage.setItem("tournament", JSON.stringify(tournament));
    } else {
      localStorage.removeItem("tournament");
    }
  }, [tournament]);

  function setTournament(t: Tournament) {
    dispatch({ type: "set", payload: t });
  }

  function clearTournament() {
    dispatch({ type: "clear" });
  }

  return (
    <TournamentContext.Provider
      value={{ tournament, setTournament, clearTournament }}
    >
      {children}
    </TournamentContext.Provider>
  );
}
