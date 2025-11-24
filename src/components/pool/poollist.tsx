import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Stack,
  TextField,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Groups as GroupsIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useUser } from "../../user";
import type { ViewProps } from "../../utils/ViewProps";

const API_URL = "http://localhost:3000/api";

interface Pool {
  id: number;
  tournament_id: number;
  tournament_name?: string;
  name: string;
  pool_order: number;
  participants_count?: number;
  created_at: string;
}

interface Tournament {
  id: number;
  name: string;
  status: string;
}

const PoolList: React.FC<ViewProps> = ({ changeView }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [pools, setPools] = useState<Pool[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterTournament, setFilterTournament] = useState<string>("all");

  useEffect(() => {
    loadTournaments();
  }, []);

  useEffect(() => {
    if (tournaments.length > 0) {
      loadPools();
    }
  }, [tournaments, filterTournament]);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = user?.token || localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/tournaments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des tournois");
      }

      const data = await response.json();
      console.log(" Tournois chargés:", data);

      setTournaments(data.tournaments || []);
    } catch (err: any) {
      console.error(" Erreur:", err);
      setError(err.message || "Erreur lors du chargement des tournois");
    } finally {
      setLoading(false);
    }
  };

  const loadPools = async () => {
    try {
      setLoading(true);
      setError("");

      const token = user?.token || localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      let allPools: Pool[] = [];
      if (filterTournament !== "all") {
        const response = await fetch(
          `${API_URL}/pools/tournament/${filterTournament}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(" Poules du tournoi:", data);

          const poolsWithTournament = (data.pools || []).map((pool: Pool) => ({
            ...pool,
            tournament_name:
              tournaments.find((t) => t.id === pool.tournament_id)?.name || "",
          }));

          allPools = poolsWithTournament;
          console.log(" Total poules chargées:", poolsWithTournament);
        }
      } else {
        const poolPromises = tournaments.map(async (tournament) => {
          try {
            const response = await fetch(
              `${API_URL}/pools/tournament/${tournament.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              return (data.pools || []).map((pool: Pool) => ({
                ...pool,
                tournament_name: tournament.name,
              }));
            }
            return [];
          } catch {
            return [];
          }
        });

        const poolsArrays = await Promise.all(poolPromises);
        allPools = poolsArrays.flat();
      }

      console.log(" Total poules chargées:", allPools.length);
      setPools(allPools);
    } catch (err: any) {
      console.error(" Erreur:", err);
      setError(err.message || "Erreur lors du chargement des poules");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (poolId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette poule ?")) {
      return;
    }

    try {
      const token = user?.token || localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/pools/${poolId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      setSuccess("Poule supprimée avec succès ");
      loadPools();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression");
      setTimeout(() => setError(""), 5000);
    }
  };
  const stats = {
    totalPools: pools.length,
    totalTournaments: new Set(pools.map((p) => p.tournament_id)).size,
    totalParticipants: pools.reduce(
      (sum, p) => sum + (p.participants_count || 0),
      0
    ),
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Chargement des poules...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            <GroupsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Gestion des Poules
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organisez vos tournois en poules et gérez les participants
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => changeView("pooladd")}
        >
          Nouvelle Poule
        </Button>
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={4} justifyContent="space-around">
          <Box textAlign="center">
            <Typography variant="h3" color="primary">
              {stats.totalPools}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Poules actives
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h3" color="secondary">
              {stats.totalTournaments}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tournois concernés
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h3" color="success.main">
              {stats.totalParticipants}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Participants totaux
            </Typography>
          </Box>
        </Stack>
      </Paper>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TrophyIcon color="action" />
          <TextField
            select
            label="Filtrer par tournoi"
            value={filterTournament}
            onChange={(e) => setFilterTournament(e.target.value)}
            size="small"
            sx={{ minWidth: 300 }}
          >
            <MenuItem value="all">
              <em>Tous les tournois</em>
            </MenuItem>
            {tournaments.map((t) => (
              <MenuItem key={t.id} value={t.id.toString()}>
                {t.name}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="body2" color="text.secondary">
            {pools.length} poule(s) affichée(s)
          </Typography>
        </Stack>
      </Paper>
      {pools.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <GroupsIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucune poule trouvée
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {filterTournament === "all"
              ? "Commencez par créer votre première poule"
              : "Aucune poule pour ce tournoi"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/pools/add")}
          >
            Créer une poule
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell>
                  <strong>Ordre</strong>
                </TableCell>
                <TableCell>
                  <strong>Nom de la poule</strong>
                </TableCell>
                <TableCell>
                  <strong>Tournoi</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Participants</strong>
                </TableCell>
                <TableCell>
                  <strong>Créée le</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pools
                .sort((a, b) => a.pool_order - b.pool_order)
                .map((pool) => (
                  <TableRow key={pool.id} hover>
                    <TableCell>
                      <Chip
                        label={pool.pool_order}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {pool.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {pool.tournament_name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={<GroupsIcon />}
                        label={pool.participants_count || 0}
                        size="small"
                        color={
                          !pool.participants_count
                            ? "default"
                            : pool.participants_count < 4
                            ? "warning"
                            : "success"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(pool.created_at).toLocaleDateString("fr-FR")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Voir les détails">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => navigate(`/pools/${pool.id}`)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/pools/edit/${pool.id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(pool.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default PoolList;