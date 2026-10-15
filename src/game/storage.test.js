import { loadGame, saveGame, STORAGE_KEY } from "./storage"

const playing = {
  phase: "playing",
  teams: [
    { name: "Rojos", score: 2 },
    { name: "Azules", score: 1 },
  ],
  papers: ["Batman", "Pizza", "Torre", "Mate"],
  bowl: ["Pizza", "Torre"],
  round: 2,
  currentTeamIndex: 0,
  currentPaper: "Pizza",
  timeLeft: 12,
  gameDuration: 45,
}

beforeEach(() => {
  localStorage.clear()
})

test("un turno guardado se reanuda en pausa", () => {
  saveGame(playing)

  expect(loadGame()).toMatchObject({
    phase: "playing",
    isActive: false,
    timeLeft: 12,
    currentPaper: "Pizza",
    gameDuration: 45,
    round: 2,
  })
})

test("jugar de nuevo borra la partida guardada", () => {
  saveGame(playing)
  saveGame({
    phase: "teamSetup",
    teams: [],
    papers: [],
    bowl: [],
    round: 1,
    currentTeamIndex: 0,
    currentPaper: null,
    timeLeft: 60,
    gameDuration: 60,
  })

  expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  expect(loadGame()).toBeNull()
})

test("ignora una partida guardada que no se puede jugar", () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ phase: "playing", teams: [], papers: [], bowl: [] }))
  expect(loadGame()).toBeNull()
})
