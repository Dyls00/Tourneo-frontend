import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Stack,
  Breadcrumbs,
  Link,
  Chip,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  SportsBaseball as MatchIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useUser } from "../../user";

const API_URL = "http://localhost:3000/api";

interface Tournament {
  id: number;
  name: string;
  status: string;
}

interface Pool {
  id: number;
  name: string;
  tournament_id: number;
  pool_order: number;
}

interface Player {
  user_id: number;
  username: string;
  full_name?: string;
}

interface MatchFormData {
  tournament_id: string;
  pool_id: string;
  player1_id: string;
  player2_id: string;
  match_date: string;
  match_time: string;
  court_number: string;
  round: string;
}

const MatchAdd: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [formData, setFormData] = useState<MatchFormData>({
    tournament_id: "",
    pool_id: "",
    player1_id: "",
    player2_id: "",
    match_date: "",
    match_time: "",
    court_number: "1",
    round: "1",
  });

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadTournaments();
  }, []);

  useEffect(() => {
    if (formData.tournament_id) {
      loadPools(parseInt(formData.tournament_id));
    }
  }, [formData.tournament_id]);

  useEffect(() => {
    if (formData.pool_id) {
      loadPlayers(parseInt(formData.pool_id));
    }
  }, [formData.pool_id]);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const token = user?.token || localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      console.log("Chargement des tournois...");
      const response = await fetch(`${API_URL}/tournaments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log(" Réponse API tournois:", data);

      let tournamentsData: Tournament[] = [];
      if (Array.isArray(data)) {
        tournamentsData = data;
      } else if (data.tournaments && Array.isArray(data.tournaments)) {
        tournamentsData = data.tournaments;
      } else if (data.data && Array.isArray(data.data)) {
        tournamentsData = data.data;
      }

      console.log(" Tournois chargés:", tournamentsData);
      setTournaments(tournamentsData);
      setError("");
    } catch (err) {
      console.error(" Erreur chargement tournois:", err);
      setError("Erreur lors du chargement des tournois");
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPools = async (tournamentId: number) => {
    try {
      const token = user?.token || localStorage.getItem("token");
      if (!token) return;

      console.log(" Chargement des poules pour tournoi:", tournamentId);
      const response = await fetch(
        `${API_URL}/pools/tournament/${tournamentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log(" Réponse API poules:", data);
      let poolsData: Pool[] = [];
      if (Array.isArray(data)) {
        poolsData = data;
      } else if (data.pools && Array.isArray(data.pools)) {
        poolsData = data.pools;
      } else if (data.data && Array.isArray(data.data)) {
        poolsData = data.data;
      }

      console.log(" Poules chargées:", poolsData);
      setPools(poolsData);
      setFormData((prev) => ({ ...prev, pool_id: "" }));
    } catch (err) {
      console.error("Erreur chargement poules:", err);
      setError("Erreur lors du chargement des poules");
      setPools([]);
    }
  };

  const loadPlayers = async (poolId: number) => {
    try {
      const token = user?.token || localStorage.getItem("token");
      if (!token) return;

      console.log(" Chargement des joueurs pour poule:", poolId);
      const response = await fetch(`${API_URL}/pools/${poolId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log(" Réponse API joueurs:", data);
      let playersData: Player[] = [];
      if (Array.isArray(data)) {
        playersData = data;
      } else if (data.players && Array.isArray(data.players)) {
        playersData = data.players;
      } else if (data.data && Array.isArray(data.data)) {
        playersData = data.data;
      }

      console.log(" Joueurs chargés:", playersData);
      setPlayers(playersData);
      setFormData((prev) => ({ ...prev, player1_id: "", player2_id: "" }));
    } catch (err) {
      console.error(" Erreur chargement joueurs:", err);
      setError("Erreur lors du chargement des joueurs");
      setPlayers([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.player1_id === formData.player2_id) {
      setError("Les deux joueurs doivent être différents");
      return;
    }

    try {
      setSaving(true);
      const token = user?.token || localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const matchData = {
        tournament_id: parseInt(formData.tournament_id),
        pool_id: parseInt(formData.pool_id),
        player1_id: parseInt(formData.player1_id),
        player2_id: parseInt(formData.player2_id),
        match_date: formData.match_date || null,
        match_time: formData.match_time || null,
        court_number: formData.court_number
          ? parseInt(formData.court_number)
          : null,
        round: parseInt(formData.round),
        status: "scheduled",
      };

      console.log("Envoi des données:", matchData);

      const response = await fetch(`${API_URL}/matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la création du match"
        );
      }

      const result = await response.json();
      console.log("Match créé:", result);

      setSuccess("Match créé avec succès !");
      setTimeout(() => {
        navigate("/matches");
      }, 1500);
    } catch (err: any) {
      console.error(" Erreur création match:", err);
      setError(err.message || "Erreur lors de la création du match");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate("/")}
          underline="hover"
          color="inherit"
        >
          Accueil
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate("/matches")}
          underline="hover"
          color="inherit"
        >
          Matchs
        </Link>
        <Typography color="primary">Nouveau match</Typography>
      </Breadcrumbs>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          <MatchIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Créer un nouveau match
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              select
              label="Tournoi"
              name="tournament_id"
              value={formData.tournament_id}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="">
                <em>Sélectionnez un tournoi</em>
              </MenuItem>
              {tournaments.length > 0 ? (
                tournaments.map((tournament) => (
                  <MenuItem
                    key={tournament.id}
                    value={tournament.id.toString()}
                  >
                    {tournament.name}
                    <Chip
                      label={tournament.status}
                      size="small"
                      sx={{ ml: 1 }}
                      color={
                        tournament.status === "ongoing"
                          ? "success"
                          : tournament.status === "upcoming"
                          ? "info"
                          : "default"
                      }
                    />
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  <em>Aucun tournoi disponible</em>
                </MenuItem>
              )}
            </TextField>
            <TextField
              select
              label="Poule"
              name="pool_id"
              value={formData.pool_id}
              onChange={handleChange}
              fullWidth
              required
              disabled={!formData.tournament_id}
              helperText={
                !formData.tournament_id
                  ? "Sélectionnez d'abord un tournoi"
                  : pools.length === 0
                  ? "Aucune poule disponible pour ce tournoi"
                  : ""
              }
            >
              <MenuItem value="">
                <em>Sélectionnez une poule</em>
              </MenuItem>
              {pools.map((pool) => (
                <MenuItem key={pool.id} value={pool.id.toString()}>
                  {pool.name} (Ordre: {pool.pool_order})
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                select
                label="Joueur 1"
                name="player1_id"
                value={formData.player1_id}
                onChange={handleChange}
                fullWidth
                required
                disabled={!formData.pool_id}
              >
                <MenuItem value="">
                  <em>Sélectionnez le joueur 1</em>
                </MenuItem>
                {players
                  .filter((p) => p.user_id.toString() !== formData.player2_id)
                  .map((player) => (
                    <MenuItem
                      key={player.user_id}
                      value={player.user_id.toString()}
                    >
                      {player.username}
                      {player.full_name && ` (${player.full_name})`}
                    </MenuItem>
                  ))}
              </TextField>

              <TextField
                select
                label="Joueur 2"
                name="player2_id"
                value={formData.player2_id}
                onChange={handleChange}
                fullWidth
                required
                disabled={!formData.pool_id}
              >
                <MenuItem value="">
                  <em>Sélectionnez le joueur 2</em>
                </MenuItem>
                {players
                  .filter((p) => p.user_id.toString() !== formData.player1_id)
                  .map((player) => (
                    <MenuItem
                      key={player.user_id}
                      value={player.user_id.toString()}
                    >
                      {player.username}
                      {player.full_name && ` (${player.full_name})`}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Round/Tour"
                name="round"
                type="number"
                value={formData.round}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 1 }}
                helperText="Numéro du tour (1, 2, 3...)"
              />
              <TextField
                label="Numéro de court"
                name="court_number"
                type="number"
                value={formData.court_number}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 1 }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Date du match"
                name="match_date"
                type="date"
                value={formData.match_date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Heure du match"
                name="match_time"
                type="time"
                value={formData.match_time}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 4 }}
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate("/matches")}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={saving}
            >
              {saving ? "Création..." : "Créer le match"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default MatchAdd;
