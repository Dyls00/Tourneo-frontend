import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router";
import { useUser } from "../../user";
interface MatchResult {
  set_number: number;
  player1_score: number;
  player2_score: number;
}

interface Match {
  id: number;
  player1_name?: string;
  player2_name?: string;
}

const API_URL = "http://localhost:3000/api";

const MatchResultForm: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  console.log("matchId:", matchId);
  const navigate = useNavigate();

  const [match, setMatch] = useState<Match | null>(null);
  const [sets, setSets] = useState<MatchResult[]>([
    { set_number: 1, player1_score: 0, player2_score: 0 },
    { set_number: 2, player1_score: 0, player2_score: 0 },
    { set_number: 3, player1_score: 0, player2_score: 0 },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { user } = useUser();
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        if (!matchId) throw new Error("matchId manquant");
        setLoading(true);
        const token = user?.token;
        console.log("token:", user?.token);
        if (!token) throw new Error("Utilisateur non authentifié");

        const res = await fetch(`${API_URL}/matches/${matchId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        const data = await res.json();
        setMatch(data.match);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [matchId]);

  const handleChangeSet = (
    index: number,
    field: "player1_score" | "player2_score",
    value: number
  ) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const handleSubmit = async () => {
    try {
      if (!match) return;
      const token = user?.token;
      if (!token) throw new Error("Utilisateur non authentifié");

      for (const s of sets) {
        const res = await fetch(`${API_URL}/matches/${match.id}/result`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(s),
        });
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      }
      navigate("/matches");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement des sets");
    }
  };

  if (loading) return <CircularProgress />;

  if (!match) return <Typography>Match non trouvé</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Saisie des résultats - {match.player1_name} vs {match.player2_name}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {sets.map((s, index) => (
          <Box
            key={s.set_number}
            sx={{ display: "flex", gap: 2, alignItems: "center" }}
          >
            <Typography sx={{ minWidth: 60 }}>Set {s.set_number}</Typography>
            <TextField
              label={match.player1_name || "Joueur 1"}
              type="number"
              value={s.player1_score}
              onChange={(e) =>
                handleChangeSet(
                  index,
                  "player1_score",
                  parseInt(e.target.value) || 0
                )
              }
              sx={{ flex: 1 }}
            />
            <TextField
              label={match.player2_name || "Joueur 2"}
              type="number"
              value={s.player2_score}
              onChange={(e) =>
                handleChangeSet(
                  index,
                  "player2_score",
                  parseInt(e.target.value) || 0
                )
              }
              sx={{ flex: 1 }}
            />
          </Box>
        ))}

        <Button variant="contained" onClick={handleSubmit}>
          Enregistrer les résultats
        </Button>
      </Stack>
    </Box>
  );
};

export default MatchResultForm;
