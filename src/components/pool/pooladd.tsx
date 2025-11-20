import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
  Alert,
  MenuItem,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useUser } from "../../user";

const API_URL = "http://localhost:3000/api";
interface Tournament {
  id: number;
  name: string;
  status: string;
}
interface FormData {
  tournament_id: string;
  name: string;
  pool_order: string;
}

const PoolAdd: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const [formData, setFormData] = useState<FormData>({
    tournament_id: "",
    name: "",
    pool_order: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoadingTournaments(true);

      const token = user?.token || localStorage.getItem("token");

      console.log("Token:", token ? "Présent " : "Absent ");
      console.log("URL:", `${API_URL}/tournaments`);

      if (!token) {
        setError("Vous devez être connecté");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/tournaments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(" Status:", response.status);
      console.log(" OK:", response.ok);

      if (!response.ok) {
        throw new Error("Erreur chargement tournois");
      }

      const data = await response.json();
      console.log("Données reçues:", data);

      const tournamentsArray = data.tournaments || [];
      console.log(" Tournois extraits:", tournamentsArray);

      setTournaments(
        tournamentsArray.filter((t: Tournament) => t.status !== "completed")
      );

      if (tournamentsArray.length === 0) {
        setError("Aucun tournoi actif disponible");
      }
    } catch (err: any) {
      console.error(" Erreur:", err);
      setError("Impossible de charger les tournois: " + err.message);
    } finally {
      setLoadingTournaments(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tournament_id) {
      newErrors.tournament_id = "Sélectionnez un tournoi";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.length < 2) {
      newErrors.name = "Le nom doit faire au moins 2 caractères";
    }

    if (!formData.pool_order) {
      newErrors.pool_order = "L'ordre de la poule est requis";
    } else if (parseInt(formData.pool_order) < 1) {
      newErrors.pool_order = "L'ordre doit être au moins 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = user?.token || localStorage.getItem("token");

      const response = await fetch(`${API_URL}/pools`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tournament_id: parseInt(formData.tournament_id),
          name: formData.name.trim(),
          pool_order: parseInt(formData.pool_order),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur création poule");
      }
      setSuccess(" Poule créée avec succès !");
      setTimeout(() => {
        navigate("/pools");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate("/poollist")}
          variant="outlined"
        >
          Retour
        </Button>
        <Box flex={1}>
          <Typography variant="h4" fontWeight="bold">
            Créer une Poule
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organisez vos joueurs en groupes pour la phase de poules
          </Typography>
        </Box>
      </Stack>
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
      <Paper elevation={2} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box
              sx={{
                p: 2,
                bgcolor: "info.50",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "info.main",
              }}
            ></Box>

            <Divider />
            <TextField
              select
              label="Tournoi *"
              value={formData.tournament_id}
              onChange={(e) =>
                setFormData({ ...formData, tournament_id: e.target.value })
              }
              error={!!errors.tournament_id}
              helperText={errors.tournament_id}
              fullWidth
              disabled={loadingTournaments || loading}
            >
              {loadingTournaments ? (
                <MenuItem disabled>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={20} />
                    <Typography>Chargement...</Typography>
                  </Stack>
                </MenuItem>
              ) : tournaments.length === 0 ? (
                <MenuItem disabled>Aucun tournoi disponible</MenuItem>
              ) : (
                tournaments.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      width="100%"
                    >
                      <Typography>{t.name}</Typography>
                      <Chip
                        label={t.status === "upcoming" ? "À venir" : "En cours"}
                        size="small"
                        color={t.status === "upcoming" ? "warning" : "info"}
                      />
                    </Stack>
                  </MenuItem>
                ))
              )}
            </TextField>
            <TextField
              label="Nom de la poule *"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!errors.name}
              helperText={
                errors.name || "Ex: Poule A, Groupe 1, Phase qualificative..."
              }
              placeholder="Poule A"
              fullWidth
              disabled={loading}
            />
            <TextField
              type="number"
              label="Ordre de la poule *"
              value={formData.pool_order}
              onChange={(e) =>
                setFormData({ ...formData, pool_order: e.target.value })
              }
              error={!!errors.pool_order}
              helperText={
                errors.pool_order ||
                "Numéro d'ordre pour trier les poules (1, 2, 3...)"
              }
              placeholder="1"
              fullWidth
              disabled={loading}
              InputProps={{ inputProps: { min: 1 } }}
            />

            <Divider />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate("/pools")}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  loading ? <CircularProgress size={20} /> : <SaveIcon />
                }
                disabled={loading || loadingTournaments}
              >
                {loading ? "Création..." : "Créer la poule"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default PoolAdd;
