export const STORAGE_KEY = "papelitos-game"

const PHASES = ["teamSetup", "setup", "ready", "playing", "gameover"]

function asTextList(value) {
  if (!Array.isArray(value)) return null
  if (!value.every((item) => typeof item === "string")) return null
  return value
}

function asTeams(value) {
  if (!Array.isArray(value)) return null
  const teams = []
  for (const team of value) {
    if (!team || typeof team.name !== "string" || !team.name.trim()) return null
    const score = Number(team.score)
    teams.push({ name: team.name, score: Number.isFinite(score) ? score : 0 })
  }
  return teams
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const data = JSON.parse(raw)
    if (!data || typeof data !== "object" || !PHASES.includes(data.phase)) return null

    const teams = asTeams(data.teams)
    const papers = asTextList(data.papers)
    const bowl = asTextList(data.bowl)
    if (!teams || !papers || !bowl) return null

    const needsTeams = data.phase === "ready" || data.phase === "playing" || data.phase === "gameover"
    if (needsTeams && teams.length < 2) return null
    if ((data.phase === "ready" || data.phase === "playing") && papers.length < 4) return null

    const gameDuration = Number(data.gameDuration)
    const duration = [30, 45, 60, 90, 120].includes(gameDuration) ? gameDuration : 60
    const timeLeft = Number(data.timeLeft)
    const round = Number(data.round)
    const index = Number(data.currentTeamIndex)

    return {
      phase: data.phase,
      teams,
      papers,
      bowl,
      round: round === 1 || round === 2 || round === 3 ? round : 1,
      currentTeamIndex: teams.length === 0 ? 0 : (Number.isInteger(index) ? index % teams.length : 0),
      currentPaper: typeof data.currentPaper === "string" ? data.currentPaper : null,
      timeLeft: Number.isFinite(timeLeft) ? timeLeft : duration,
      gameDuration: duration,
      isActive: false,
    }
  } catch {
    return null
  }
}

export function saveGame(state) {
  const pristine =
    state.phase === "teamSetup" &&
    state.teams.length === 0 &&
    state.papers.length === 0 &&
    state.gameDuration === 60 &&
    state.round === 1

  if (pristine) {
    clearGame()
    return
  }

  const payload = {
    phase: state.phase,
    teams: state.teams,
    papers: state.papers,
    bowl: state.bowl,
    round: state.round,
    currentTeamIndex: state.currentTeamIndex,
    currentPaper: state.currentPaper,
    timeLeft: state.timeLeft,
    gameDuration: state.gameDuration,
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Si el navegador bloquea el almacenamiento, la partida sigue en memoria.
  }
}

export function clearGame() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Si el navegador bloquea el almacenamiento, no hay una partida que recuperar.
  }
}
