import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  IconButton,
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  EmojiEvents as TrophyIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";

// Types
interface Match {
  id: number;
  tournament_id: number;
  tournament_name?: string;
  pool_id?: number;
  pool_name?: string;
  player1_id?: number;
  player1_name?: string;
  player2_id?: number;
  player2_name?: string;
  round: string;
  match_date?: string;
  court?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  player1_score?: number;
  player2_score?: number;
  winner_id?: number;
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MatchList: React.FC = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtres
  const [statusFilter, setStatusFilter] = useState("");
  const [roundFilter, setRoundFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Charger les matches
  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      if (statusFilter) params.append("status", statusFilter);
      if (roundFilter) params.append("round", roundFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`${API_URL}/matches?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement");
      }

      const data = await response.json();
      setMatches(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [statusFilter, roundFilter, searchQuery]);

  // Supprimer un match
  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce match ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/matches/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      await loadMatches();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "in_progress":
        return "En cours";
      case "cancelled":
        return "Annulé";
      default:
        return "Programmé";
    }
  };

  // Formater la date
  const formatDate = (date?: string) => {
    if (!date) return "Date à définir";
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight="bold">
          🎾 Matches
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadMatches}
            variant="outlined"
          >
            Actualiser
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={() => navigate("/matches/add")}
            variant="contained"
          >
            Nouveau match
          </Button>
        </Stack>
      </Stack>

      {/* Filtres */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        sx={{ bgcolor: "background.paper", p: 2, borderRadius: 2 }}
      >
        {/* Recherche */}
        <TextField
          placeholder="Rechercher un joueur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />

        {/* Statut */}
        <TextField
          select
          label="Statut"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Tous</MenuItem>
          <MenuItem value="scheduled">Programmé</MenuItem>
          <MenuItem value="in_progress">En cours</MenuItem>
          <MenuItem value="completed">Terminé</MenuItem>
          <MenuItem value="cancelled">Annulé</MenuItem>
        </TextField>

        {/* Tour */}
        <TextField
          select
          label="Tour"
          value={roundFilter}
          onChange={(e) => setRoundFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Tous</MenuItem>
          <MenuItem value="Poules">Poules</MenuItem>
          <MenuItem value="1/8">1/8 de finale</MenuItem>
          <MenuItem value="1/4">1/4 de finale</MenuItem>
          <MenuItem value="1/2">1/2 finale</MenuItem>
          <MenuItem value="Finale">Finale</MenuItem>
        </TextField>
      </Stack>

      {/* Erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Liste vide */}
      {matches.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun match trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Créez votre premier match pour commencer
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => navigate("/matches/add")}
            variant="contained"
          >
            Créer un match
          </Button>
        </Box>
      ) : (
        // Grille des matches
        <Grid container spacing={3}>
          {matches.map((match) => (
            <Grid item xs={12} sm={6} md={4} key={match.id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  {/* Header */}
                  <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Box flex={1}>
                      <Typography variant="caption" color="text.secondary">
                        {match.tournament_name || "Tournoi"}
                        {match.pool_name && ` • Poule ${match.pool_name}`}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {match.round}
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusLabel(match.status)}
                      color={getStatusColor(match.status)}
                      size="small"
                    />
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  {/* Joueur 1 */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor:
                        match.winner_id === match.player1_id
                          ? "success.50"
                          : "grey.50",
                      border: "1px solid",
                      borderColor:
                        match.winner_id === match.player1_id
                          ? "success.main"
                          : "grey.300",
                      mb: 1,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                      >
                        {match.player1_name?.[0] || "J1"}
                      </Avatar>
                      <Typography
                        variant="body1"
                        fontWeight={
                          match.winner_id === match.player1_id
                            ? "bold"
                            : "normal"
                        }
                      >
                        {match.player1_name || "Joueur 1"}
                      </Typography>
                      {match.winner_id === match.player1_id && (
                        <TrophyIcon color="success" fontSize="small" />
                      )}
                    </Box>
                    {match.status === "completed" && (
                      <Typography variant="h6" fontWeight="bold">
                        {match.player1_score || 0}
                      </Typography>
                    )}
                  </Box>

                  {/* VS */}
                  <Box display="flex" justifyContent="center" my={1}>
                    <Chip label="VS" size="small" variant="outlined" />
                  </Box>

                  {/* Joueur 2 */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor:
                        match.winner_id === match.player2_id
                          ? "success.50"
                          : "grey.50",
                      border: "1px solid",
                      borderColor:
                        match.winner_id === match.player2_id
                          ? "success.main"
                          : "grey.300",
                      mb: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "secondary.main",
                        }}
                      >
                        {match.player2_name?.[0] || "J2"}
                      </Avatar>
                      <Typography
                        variant="body1"
                        fontWeight={
                          match.winner_id === match.player2_id
                            ? "bold"
                            : "normal"
                        }
                      >
                        {match.player2_name || "Joueur 2"}
                      </Typography>
                      {match.winner_id === match.player2_id && (
                        <TrophyIcon color="success" fontSize="small" />
                      )}
                    </Box>
                    {match.status === "completed" && (
                      <Typography variant="h6" fontWeight="bold">
                        {match.player2_score || 0}
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Infos */}
                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(match.match_date)}
                      </Typography>
                    </Box>
                    {match.court && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Court {match.court}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Actions */}
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" justifyContent="flex-end">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(match.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MatchList;
