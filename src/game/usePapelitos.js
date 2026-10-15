import { useEffect, useRef, useState } from "react"
import { guess, nextRound, scorePoint, shuffle, skip } from "./rules"
import { clearGame, loadGame, saveGame } from "./storage"

function createSounds() {
  let tickAudio = null

  return {
    play(type) {
      try {
        if (type === "end" && tickAudio) {
          tickAudio.pause()
          tickAudio = null
        }

        const audio = new Audio(`/${type}.mp3`)
        audio.volume = 0.5

        if (type === "tick") {
          if (tickAudio) tickAudio.pause()
          tickAudio = audio
        }

        audio.play().catch(() => {})
      } catch {
        // El navegador puede bloquear el audio hasta que haya un gesto.
      }
    },
    stopTick() {
      if (tickAudio) {
        tickAudio.pause()
        tickAudio = null
      }
    },
  }
}

const DEFAULTS = {
  phase: "teamSetup",
  teams: [],
  currentTeamIndex: 0,
  papers: [],
  bowl: [],
  round: 1,
  currentPaper: null,
  timeLeft: 60,
  gameDuration: 60,
}

export function usePapelitos() {
  const [saved] = useState(() => loadGame())
  const initial = saved ?? DEFAULTS

  const [phase, setPhase] = useState(initial.phase)
  const [teams, setTeams] = useState(initial.teams)
  const [currentTeamIndex, setCurrentTeamIndex] = useState(initial.currentTeamIndex)
  const [papers, setPapers] = useState(initial.papers)
  const [bowl, setBowl] = useState(initial.bowl)
  const [round, setRound] = useState(initial.round)
  const [currentPaper, setCurrentPaper] = useState(initial.currentPaper)
  const [timeLeft, setTimeLeft] = useState(initial.timeLeft)
  const [isActive, setIsActive] = useState(false)
  const [gameDuration, setGameDuration] = useState(initial.gameDuration)

  const soundsRef = useRef(null)
  if (soundsRef.current === null) soundsRef.current = createSounds()

  const teamsRef = useRef(teams)
  teamsRef.current = teams
  const roundRef = useRef(round)
  roundRef.current = round
  const papersRef = useRef(papers)
  papersRef.current = papers
  const expiredRef = useRef(false)
  const endTurnRef = useRef(() => {})

  const finishRound = () => {
    soundsRef.current.stopTick()
    setIsActive(false)
    const result = nextRound({ round: roundRef.current, papers: papersRef.current })
    setCurrentPaper(null)
    if (result.finished) {
      setPhase("gameover")
      return
    }
    setRound(result.round)
    setBowl(result.bowl)
    setPhase("ready")
  }

  endTurnRef.current = () => {
    soundsRef.current.stopTick()
    setIsActive(false)
    setCurrentPaper(null)
    setCurrentTeamIndex((index) => (index + 1) % Math.max(teamsRef.current.length, 1))
    setPhase("ready")
  }

  useEffect(() => {
    if (!isActive) return undefined
    const interval = setInterval(() => {
      setTimeLeft((time) => (time <= 1 ? 0 : time - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    if (phase === "playing" && isActive && timeLeft > 0 && timeLeft < 10) {
      soundsRef.current.play("tick")
    }
  }, [phase, isActive, timeLeft])

  useEffect(() => {
    if (!(isActive && timeLeft === 0)) {
      if (timeLeft > 0) expiredRef.current = false
      return
    }
    if (expiredRef.current) return
    expiredRef.current = true
    soundsRef.current.stopTick()
    soundsRef.current.play("end")
    endTurnRef.current()
  }, [isActive, timeLeft])

  useEffect(() => {
    if (phase !== "playing" || !isActive) soundsRef.current.stopTick()
  }, [phase, isActive])

  useEffect(() => {
    saveGame({
      phase,
      teams,
      papers,
      bowl,
      round,
      currentTeamIndex,
      currentPaper,
      timeLeft,
      gameDuration,
    })
  }, [phase, teams, papers, bowl, round, currentTeamIndex, currentPaper, timeLeft, gameDuration])

  const addTeam = (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setTeams((current) => [...current, { name: trimmed, score: 0 }])
  }

  const removeTeam = (index) => {
    setTeams((current) => current.filter((_, i) => i !== index))
  }

  const proceedToSetup = () => {
    if (teams.length < 2) return
    setPhase("setup")
  }

  const backToTeams = () => setPhase("teamSetup")

  const addPaper = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return false
    setPapers((current) => [...current, trimmed])
    return true
  }

  const updatePaper = (index, text) => {
    const trimmed = text.trim()
    if (!trimmed) return false
    setPapers((current) => current.map((paper, i) => (i === index ? trimmed : paper)))
    return true
  }

  const removePaper = (index) => {
    setPapers((current) => current.filter((_, i) => i !== index))
  }

  const startGame = () => {
    if (papers.length < 4) return
    setBowl(shuffle(papers))
    setRound(1)
    setCurrentTeamIndex(0)
    setCurrentPaper(null)
    setPhase("ready")
  }

  const startTurn = () => {
    if (bowl.length === 0) {
      finishRound()
      return
    }
    expiredRef.current = false
    setCurrentPaper(bowl[0])
    setTimeLeft(gameDuration)
    setIsActive(true)
    setPhase("playing")
  }

  const markCorrect = () => {
    soundsRef.current.play("correct")
    setTeams((current) => scorePoint(current, currentTeamIndex))
    const nextBowl = guess(bowl)
    setBowl(nextBowl)
    if (nextBowl.length === 0) {
      finishRound()
      return
    }
    setCurrentPaper(nextBowl[0])
  }

  const skipPaper = () => {
    const nextBowl = skip(bowl)
    setBowl(nextBowl)
    setCurrentPaper(nextBowl[0] ?? null)
  }

  const togglePause = () => {
    setIsActive((active) => {
      if (active) soundsRef.current.stopTick()
      return !active
    })
  }

  const resetGame = () => {
    soundsRef.current.stopTick()
    clearGame()
    setPhase(DEFAULTS.phase)
    setTeams(DEFAULTS.teams)
    setCurrentTeamIndex(DEFAULTS.currentTeamIndex)
    setPapers(DEFAULTS.papers)
    setBowl(DEFAULTS.bowl)
    setRound(DEFAULTS.round)
    setCurrentPaper(DEFAULTS.currentPaper)
    setTimeLeft(DEFAULTS.timeLeft)
    setIsActive(false)
    setGameDuration(DEFAULTS.gameDuration)
  }

  return {
    phase,
    teams,
    currentTeamIndex,
    papers,
    bowl,
    round,
    currentPaper,
    timeLeft,
    isActive,
    gameDuration,
    addTeam,
    removeTeam,
    setGameDuration,
    proceedToSetup,
    backToTeams,
    addPaper,
    updatePaper,
    removePaper,
    startGame,
    startTurn,
    markCorrect,
    skipPaper,
    togglePause,
    resetGame,
  }
}
