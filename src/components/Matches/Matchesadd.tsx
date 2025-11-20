import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as BackIcon, Save as SaveIcon } from "@mui/icons-material";
import { useNavigate } from "react-router";

// Types
interface Tournament {
  id: number;
  name: string;
}

interface Pool {
  id: number;
  name: string;
  tournament_id: number;
}

interface Player {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MatchAdd: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Données de référence
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  // Formulaire
  const [formData, setFormData] = useState({
    tournament_id: "",
    pool_id: "",
    player1_id: "",
    player2_id: "",
    round: "Poules",
    match_date: "",
    court: "",
  });

  // Charger les données de référence
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Charger les tournois
        const tournamentsRes = await fetch(`${API_URL}/tournaments`, {
          headers,
        });
        if (tournamentsRes.ok) {
          const tournamentsData = await tournamentsRes.json();
          setTournaments(tournamentsData);
        }

        // Charger les poules
        const poolsRes = await fetch(`${API_URL}/pools`, { headers });
        if (poolsRes.ok) {
          const poolsData = await poolsRes.json();
          setPools(poolsData);
        }

        // Charger les joueurs
        const playersRes = await fetch(`${API_URL}/players`, { headers });
        if (playersRes.ok) {
          const playersData = await playersRes.json();
          setPlayers(playersData);
        }
      } catch (err: any) {
        console.error("Erreur chargement données:", err);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Filtrer les poules du tournoi sélectionné
  const filteredPools = pools.filter(
    (p) => p.tournament_id === Number(formData.tournament_id)
  );

  // Filtrer les joueurs (si vous avez un lien tournament-player)
  const availablePlayers = players;

  // Joueurs disponibles pour joueur 2 (exclure joueur 1)
  const availablePlayers2 = availablePlayers.filter(
    (p) => p.id !== Number(formData.player1_id)
  );

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      // Validation
      if (!formData.tournament_id) {
        throw new Error("Veuillez sélectionner un tournoi");
      }

      const token = localStorage.getItem("token");

      // Préparer les données
      const payload = {
        tournament_id: Number(formData.tournament_id),
        pool_id: formData.pool_id ? Number(formData.pool_id) : null,
        player1_id: formData.player1_id ? Number(formData.player1_id) : null,
        player2_id: formData.player2_id ? Number(formData.player2_id) : null,
        round: formData.round,
        match_date: formData.match_date || null,
        court: formData.court || null,
      };

      const response = await fetch(`${API_URL}/matches`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création");
      }

      setSuccess(true);

      // Redirection après 2 secondes
      setTimeout(() => {
        navigate("/matches");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate("/matches")}
          variant="outlined"
        >
          Retour
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Créer un match
        </Typography>
      </Stack>

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Messages */}
            {error && <Alert severity="error">{error}</Alert>}
            {success && (
              <Alert severity="success">
                Match créé avec succès ! Redirection...
              </Alert>
            )}

            {/* Tournoi */}
            <TextField
              select
              label="Tournoi *"
              value={formData.tournament_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tournament_id: e.target.value,
                  pool_id: "",
                })
              }
              required
              fullWidth
            >
              <MenuItem value="">Sélectionner un tournoi</MenuItem>
              {tournaments.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Poule */}
            {filteredPools.length > 0 && (
              <TextField
                select
                label="Poule (optionnel)"
                value={formData.pool_id}
                onChange={(e) =>
                  setFormData({ ...formData, pool_id: e.target.value })
                }
                fullWidth
              >
                <MenuItem value="">Aucune poule</MenuItem>
                {filteredPools.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    Poule {p.name}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {/* Tour */}
            <TextField
              select
              label="Tour *"
              value={formData.round}
              onChange={(e) =>
                setFormData({ ...formData, round: e.target.value })
              }
              required
              fullWidth
            >
              <MenuItem value="Poules">Poules</MenuItem>
              <MenuItem value="1/16">1/16 de finale</MenuItem>
              <MenuItem value="1/8">1/8 de finale</MenuItem>
              <MenuItem value="1/4">1/4 de finale</MenuItem>
              <MenuItem value="1/2">1/2 finale</MenuItem>
              <MenuItem value="Finale">Finale</MenuItem>
            </TextField>

            {/* Joueur 1 */}
            <TextField
              select
              label="Joueur 1 (optionnel)"
              value={formData.player1_id}
              onChange={(e) =>
                setFormData({ ...formData, player1_id: e.target.value })
              }
              fullWidth
            >
              <MenuItem value="">À définir plus tard</MenuItem>
              {availablePlayers.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </MenuItem>
              ))}
            </TextField>

            {/* Joueur 2 */}
            <TextField
              select
              label="Joueur 2 (optionnel)"
              value={formData.player2_id}
              onChange={(e) =>
                setFormData({ ...formData, player2_id: e.target.value })
              }
              fullWidth
              disabled={!formData.player1_id}
            >
              <MenuItem value="">À définir plus tard</MenuItem>
              {availablePlayers2.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </MenuItem>
              ))}
            </TextField>

            {/* Date */}
            <TextField
              type="datetime-local"
              label="Date du match"
              value={formData.match_date}
              onChange={(e) =>
                setFormData({ ...formData, match_date: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            {/* Court */}
            <TextField
              label="Court"
              value={formData.court}
              onChange={(e) =>
                setFormData({ ...formData, court: e.target.value })
              }
              placeholder="ex: Central, Court 1..."
              fullWidth
            />

            {/* Boutons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate("/matches")}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? "Création..." : "Créer le match"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default MatchAdd;
