import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  SportsTennis as MatchIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router";
import { useUser } from "../../user";

const API_URL = "http://localhost:3000/api";

interface Pool {
  id: number;
  tournament_id: number;
  name: string;
  pool_order: number;
  tournament_name?: string;
  participants_count?: number;
  created_at?: string;
}

interface Match {
  id: number;
  tournament_id: number;
  pool_id: number;
  player1_id?: number;
  player2_id?: number;
  player1_name?: string;
  player2_name?: string;
  winner_name?: string | null;
  status?: string;
  scheduled_date?: string | null;
  completed_date?: string | null;
}

interface MatchResult {
  id: number;
  match_id: number;
  set_number: number;
  player1_score: number;
  player2_score: number;
  is_tiebreak?: number;
  is_super_tiebreak?: number;
}

const MatchesList: React.FC = () => {
  const { poolId } = useParams<{ poolId?: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMatches, setLoadingMatches] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [pools, setPools] = useState<Pool[]>([]);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchResultsMap, setMatchResultsMap] = useState<
    Record<number, MatchResult[]>
  >({});

  const getTokenOrRedirect = () => {
    const token = (user as any)?.token || localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return token;
  };

  const loadAllPools = async () => {
    try {
      setLoading(true);
      setError("");
      const token = getTokenOrRedirect();
      if (!token) return;

      const tRes = await fetch(`${API_URL}/tournaments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!tRes.ok)
        throw new Error(
          `Erreur HTTP ${tRes.status} lors du chargement des tournois`
        );
      const tData = await tRes.json();
      const tournaments = Array.isArray(tData.tournaments)
        ? tData.tournaments
        : Array.isArray(tData)
        ? tData
        : [];

      const poolPromises = tournaments.map(async (t: any) => {
        try {
          const pRes = await fetch(`${API_URL}/pools/tournament/${t.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!pRes.ok) return [];
          const pData = await pRes.json();
          const arr = Array.isArray(pData.pools) ? pData.pools : [];
          return arr.map((p: any) => ({ ...p, tournament_name: t.name }));
        } catch {
          return [];
        }
      });

      const poolsArrays = await Promise.all(poolPromises);
      const allPools = poolsArrays.flat();
      setPools(allPools);
    } catch (err: any) {
      console.error("Erreur chargement pools:", err);
      setError(err.message || "Erreur lors du chargement des poules");
      setPools([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPoolAndMatches = async (id: string) => {
    try {
      setLoading(true);
      setError("");
      const token = getTokenOrRedirect();
      if (!token) return;

      const poolRes = await fetch(`${API_URL}/pools/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!poolRes.ok)
        throw new Error(`Erreur HTTP ${poolRes.status} sur /pools/${id}`);
      const poolData = await poolRes.json();
      const pool = poolData.pool || null;
      setSelectedPool(pool);

      setLoadingMatches(true);
      const mRes = await fetch(`${API_URL}/matches/pool/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!mRes.ok)
        throw new Error(`Erreur HTTP ${mRes.status} sur /matches/pool/${id}`);
      const mData = await mRes.json();
      const matchesArr: Match[] = Array.isArray(mData.matches)
        ? mData.matches
        : [];
      const resultPromises = matchesArr.map(async (m) => {
        try {
          const rRes = await fetch(`${API_URL}/matches/${m.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!rRes.ok) return { matchId: m.id, results: [] as MatchResult[] };
          const rData = await rRes.json();
          const resultsArr: MatchResult[] = Array.isArray(rData.sets)
            ? rData.sets
            : [];
          return { matchId: m.id, results: resultsArr };
        } catch {
          return { matchId: m.id, results: [] as MatchResult[] };
        }
      });

      const resultsByMatch = await Promise.all(resultPromises);
      const map: Record<number, MatchResult[]> = {};
      resultsByMatch.forEach((r) => (map[r.matchId] = r.results));
      setMatchResultsMap(map);
      setMatches(matchesArr);
    } catch (err: any) {
      console.error("Erreur chargement pool/matchs:", err);
      setError(
        err.message || "Erreur lors du chargement de la poule ou des matchs"
      );
      setMatches([]);
      setMatchResultsMap({});
      setSelectedPool(null);
    } finally {
      setLoading(false);
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    if (poolId) {
      loadPoolAndMatches(poolId);
    } else {
      loadAllPools();
    }
  }, [poolId]);

  const formatSetsOptionC = (results: MatchResult[]) => {
    if (!Array.isArray(results) || results.length === 0)
      return { p1: "-", p2: "-" };
    const sorted = [...results].sort((a, b) => a.set_number - b.set_number);
    const p1 = sorted.map((s) => String(s.player1_score)).join(" / ");
    const p2 = sorted.map((s) => String(s.player2_score)).join(" / ");
    return { p1, p2 };
  };

  const handleOpenPool = (id: number) => {
    navigate(`/matches/pool/${id}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Chargement...</Typography>
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
            <MatchIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Matchs & Poules
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Voir les poules et leurs matchs. Cliquez sur une poule pour afficher
            ses matchs.
          </Typography>
        </Box>
        <Box>
          <Button variant="contained" onClick={() => navigate("/matches/add")}>
            Créer un match
          </Button>
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {!poolId && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Liste des poules
          </Typography>
          {pools.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography>Aucune poule disponible</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell>
                      <strong>Ordre</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Poule</strong>
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
                    .sort((a, b) => (a.pool_order || 0) - (b.pool_order || 0))
                    .map((pool) => (
                      <TableRow
                        key={pool.id}
                        hover
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOpenPool(pool.id)}
                      >
                        <TableCell>
                          <Chip
                            label={pool.pool_order}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{pool.name}</TableCell>
                        <TableCell>{pool.tournament_name || "—"}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={pool.participants_count ?? 0}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {pool.created_at
                            ? new Date(pool.created_at).toLocaleDateString(
                                "fr-FR"
                              )
                            : "—"}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/pools/${pool.id}`);
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/pools/edit/${pool.id}`);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {poolId && (
        <Paper sx={{ p: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h6">
                Matchs — Poule {selectedPool?.name ?? poolId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedPool?.tournament_name
                  ? `Tournoi: ${selectedPool.tournament_name}`
                  : ""}
              </Typography>
            </Box>
            <Box>
              <Button variant="outlined" onClick={() => navigate("/matches")}>
                Retour aux poules
              </Button>
            </Box>
          </Box>

          {loadingMatches ? (
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          ) : matches.length === 0 ? (
            <Typography>Aucun match pour cette poule.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Joueur 1</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Joueur 2</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Sets (J1)</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Sets (J2)</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date / Heure</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Statut</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Vainqueur</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matches.map((m) => {
                    const results = matchResultsMap[m.id] || [];
                    const sets = formatSetsOptionC(results);
                    return (
                      <TableRow key={m.id} hover>
                        <TableCell>{m.id}</TableCell>
                        <TableCell>
                          {m.player1_name ?? `#${m.player1_id ?? "-"}`}
                        </TableCell>
                        <TableCell>
                          {m.player2_name ?? `#${m.player2_id ?? "-"}`}
                        </TableCell>
                        <TableCell>{sets.p1}</TableCell>
                        <TableCell>{sets.p2}</TableCell>
                        <TableCell>
                          {m.scheduled_date
                            ? new Date(m.scheduled_date).toLocaleString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={m.status ?? "—"}
                            size="small"
                            color={
                              m.status === "completed"
                                ? "success"
                                : m.status === "pending"
                                ? "warning"
                                : "default"
                            }
                          />
                        </TableCell>
                        <TableCell>{m.winner_name ?? "-"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default MatchesList;
