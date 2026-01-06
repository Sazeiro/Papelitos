"use client"

import { useState, useEffect, useRef } from "react"
import { Timer, Check, RotateCcw, Plus, Trash2, X, Sparkles, PartyPopper, Users, FileText, Pause, Play } from "lucide-react"

// --- FUN GAME STYLES ---
const styles = {
  container: {
    fontFamily: "'Fredoka', 'Comic Sans MS', cursive, sans-serif",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "30px",
    borderRadius: "25px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2), 0 0 0 5px rgba(255,255,255,0.3)",
    marginBottom: "20px",
    border: "4px solid #fbbf24",
    position: "relative",
    overflow: "hidden",
  },
  button: {
    padding: "14px 28px",
    fontSize: "18px",
    borderRadius: "50px",
    border: "none",
    cursor: "pointer",
    margin: "5px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "3px solid #fff",
  },
  successBtn: {
    background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    color: "white",
    border: "3px solid #fff",
  },
  dangerBtn: {
    background: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
    color: "white",
    border: "3px solid #fff",
  },
  warningBtn: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    color: "white",
    border: "3px solid #fff",
  },
  input: {
    padding: "15px 20px",
    borderRadius: "50px",
    border: "3px solid #fbbf24",
    width: "80%",
    fontSize: "18px",
    marginBottom: "15px",
    textAlign: "center",
    fontFamily: "inherit",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    outline: "none",
  },
  bigText: {
    fontSize: "42px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textShadow: "none",
  },
  titleEmoji: {
    fontSize: "60px",
    display: "block",
    marginBottom: "10px",
    animation: "bounce 2s infinite",
  },
  teamBadge: {
    display: "inline-block",
    padding: "8px 20px",
    borderRadius: "50px",
    background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    color: "#8b4513",
    fontWeight: "bold",
    margin: "5px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  },
  scoreCard: {
    backgroundColor: "#fff9e6",
    padding: "15px 25px",
    borderRadius: "20px",
    border: "3px dashed #fbbf24",
    display: "inline-block",
    margin: "10px",
  },
  roundBadge: {
    display: "inline-block",
    padding: "10px 25px",
    borderRadius: "50px",
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    color: "white",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "15px",
  },
  confetti: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    zIndex: 100,
  },
  smallText: { fontSize: "14px", color: "#64748b", marginTop: "10px" },
}

// Inject CSS animations
const injectStyles = () => {
  const styleSheet = document.createElement("style")
  styleSheet.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px) rotate(-2deg); }
      75% { transform: translateX(5px) rotate(2deg); }
    }
    
    @keyframes rainbow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      33% { transform: translateY(-5px) rotate(2deg); }
      66% { transform: translateY(3px) rotate(-2deg); }
    }
    
    button:hover {
      transform: scale(1.05) translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    }
    
    button:active {
      transform: scale(0.98);
    }
    
    input:focus {
      border-color: #764ba2;
      box-shadow: 0 0 0 4px rgba(118, 75, 162, 0.2);
    }
  `
  document.head.appendChild(styleSheet)
}

// --- GAME LOGIC ---

export default function PapelitosGame() {
  // Game State: 'teamSetup', 'setup', 'input', 'ready', 'playing', 'summary', 'gameover'
  const [phase, setPhase] = useState("teamSetup")

  // Data
  const [teams, setTeams] = useState([])
  const [teamNameInput, setTeamNameInput] = useState("")
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const [papers, setPapers] = useState([]) // All papers
  const [bowl, setBowl] = useState([]) // Current papers in the bowl
  const [inputValue, setInputValue] = useState("")

  // Round State
  const [round, setRound] = useState(1) // 1, 2, or 3
  const [currentPaper, setCurrentPaper] = useState(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [gameDuration, setGameDuration] = useState(60) // Default 60 seconds

  // Inject styles on mount
  useEffect(() => {
    injectStyles()
  }, [])

  // --- ROUND DESCRIPTIONS ---
  const getRoundInfo = (r) => {
    switch (r) {
      case 1:
        return { title: "🗣️ ¡Describilo!", desc: "Usá palabras para describir. ¡Sin sinónimos ni traducciones!", emoji: "💬", color: "#667eea" }
      case 2:
        return { title: "☝️ ¡Una Sola Palabra!", desc: "Solo podés decir UNA palabra. ¡Sin gestos!", emoji: "🎯", color: "#f093fb" }
      case 3:
        return { title: "🎭 ¡Decilo con Mímica!", desc: "Usá solo tu cuerpo. ¡Silencio total!", emoji: "🤫", color: "#38ef7d" }
      default:
        return { title: "Fin del Juego", desc: "", emoji: "🎉", color: "#fbbf24" }
    }
  }

  // --- HELPERS ---
  const shuffle = (array) => {
    return [...array].sort(() => Math.random() - 0.5)
  }

  // --- SOUND EFFECTS ---
  const tickAudioRef = useRef(null)

  const playSound = (type) => {
    try {
      // Stop any playing tick sound if we're playing 'end'
      if (type === 'end' && tickAudioRef.current) {
        tickAudioRef.current.pause()
        tickAudioRef.current = null
      }

      const audio = new Audio(`/${type}.mp3`)
      audio.volume = 0.5

      // Store reference for tick sounds so we can stop them
      if (type === 'tick') {
        // Stop previous tick if still playing
        if (tickAudioRef.current) {
          tickAudioRef.current.pause()
        }
        tickAudioRef.current = audio
      }

      audio.play().catch((error) => {
        console.warn(`Could not play ${type} sound:`, error)
      })
    } catch (error) {
      console.warn(`Error creating audio for ${type}:`, error)
    }
  }

  const stopTickSound = () => {
    if (tickAudioRef.current) {
      tickAudioRef.current.pause()
      tickAudioRef.current = null
    }
  }

  const addTeam = () => {
    if (!teamNameInput.trim()) return
    setTeams([...teams, { name: teamNameInput.trim(), score: 0 }])
    setTeamNameInput("")
  }

  const removeTeam = (index) => {
    setTeams(teams.filter((_, i) => i !== index))
  }

  const proceedToSetup = () => {
    if (teams.length < 2) return alert("¡Agregá al menos 2 equipos!")
    setPhase("setup")
  }

  // --- ACTIONS ---

  const addPaper = () => {
    if (!inputValue.trim()) return
    setPapers([...papers, inputValue.trim()])
    setInputValue("")
  }

  const startGame = () => {
    if (papers.length < 4) return alert("¡Agregá al menos 4 papelitos!")
    setBowl(shuffle(papers))
    setPhase("ready")
  }

  const startTurn = () => {
    setPhase("playing")
    setTimeLeft(gameDuration)
    setIsActive(true)
    pickPaper()
  }

  const pickPaper = (currentBowl = bowl) => {
    if (currentBowl.length === 0) {
      endRound()
      return
    }
    const nextPaper = currentBowl[0]
    setCurrentPaper(nextPaper)
  }

  const handleCorrect = () => {
    // Play correct sound
    playSound('correct')

    // 1. Give point to current team
    const newTeams = [...teams]
    newTeams[currentTeamIndex].score += 1
    setTeams(newTeams)

    // 2. Remove paper from CURRENT bowl (but keep in master list)
    const newBowl = bowl.slice(1)
    setBowl(newBowl)

    // 3. Pick next
    pickPaper(newBowl)
  }

  const handleSkip = () => {
    // Put current paper at the bottom of the bowl
    const skipped = bowl[0]
    const newBowl = [...bowl.slice(1), skipped]
    setBowl(newBowl)
    pickPaper(newBowl)
  }

  const endTurn = () => {
    stopTickSound()
    setIsActive(false)
    setCurrentTeamIndex((currentTeamIndex + 1) % teams.length)
    setPhase("ready")
  }

  const endRound = () => {
    setIsActive(false)
    if (round === 3) {
      setPhase("gameover")
    } else {
      setRound(round + 1)
      setBowl(shuffle(papers)) // Refill bowl with ALL papers for next round
      setPhase("summary")
    }
  }

  // --- TIMER ---
  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)

      // Play tick sound when under 10 seconds
      if (timeLeft < 10 && timeLeft > 0) {
        playSound('tick')
      }
    } else if (timeLeft === 0 && isActive) {
      playSound('end')
      endTurn() // Time runs out
    }
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft])

  // --- RENDERS ---

  if (phase === "teamSetup") {
    return (
      <div style={styles.container}>
        <div style={{ marginBottom: "20px" }}>
          <span style={styles.titleEmoji}>📝</span>
          <h1 style={{ ...styles.bigText, color: "white", WebkitTextFillColor: "white", textShadow: "3px 3px 0 rgba(0,0,0,0.2)" }}>
            ¡Papelitos!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px" }}>El Juego de las Fiestas Argentinas! 🇦🇷</p>
        </div>

        <div style={styles.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "15px" }}>
            <Users size={28} color="#764ba2" />
            <h3 style={{ margin: 0, color: "#764ba2" }}>¡Armá tus Equipos!</h3>
          </div>
          <p style={{ color: "#666" }}>Agregá 2 o más equipos para jugar 🎯</p>
          <input
            style={styles.input}
            value={teamNameInput}
            onChange={(e) => setTeamNameInput(e.target.value)}
            placeholder="Nombre del equipo..."
            onKeyDown={(e) => e.key === "Enter" && addTeam()}
          />
          <button style={{ ...styles.button, ...styles.primaryBtn }} onClick={addTeam}>
            <Plus size={18} style={{ display: "inline", marginRight: 5, verticalAlign: "middle" }} />
            Agregar Equipo
          </button>

          <div style={{ marginTop: 25 }}>
            <div style={styles.roundBadge}>
              <Sparkles size={14} style={{ marginRight: 5, verticalAlign: "middle" }} />
              Equipos: {teams.length}
            </div>
            <div style={{ marginTop: 15 }}>
              {teams.map((team, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 15px",
                    background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                    borderRadius: "15px",
                    marginBottom: "10px",
                    border: "2px solid #fbbf24",
                  }}
                >
                  <span style={{ fontWeight: "bold", fontSize: "18px", color: "#8b4513" }}>
                    🏆 {team.name}
                  </span>
                  <button
                    style={{
                      ...styles.button,
                      ...styles.dangerBtn,
                      padding: "8px 15px",
                      margin: 0,
                      fontSize: "14px",
                    }}
                    onClick={() => removeTeam(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Configuration */}
        <div style={{ ...styles.card, marginTop: "0", padding: "20px" }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#764ba2" }}>⏱️ Tiempo por Turno</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            {[30, 45, 60, 90, 120].map((seconds) => (
              <button
                key={seconds}
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  fontSize: "15px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: gameDuration === seconds
                    ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                    : "linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)",
                  color: gameDuration === seconds ? "white" : "#555",
                  boxShadow: gameDuration === seconds
                    ? "0 4px 15px rgba(17, 153, 142, 0.4)"
                    : "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease",
                }}
                onClick={() => setGameDuration(seconds)}
              >
                {seconds}
              </button>
            ))}
          </div>
          <p style={{ color: "#888", fontSize: "14px", marginTop: "10px" }}>
            Cada equipo tendrá {gameDuration} segundos para adivinar
          </p>
        </div>

        {/* Continue Button */}
        <button
          style={{
            ...styles.button,
            ...(teams.length >= 2 ? styles.successBtn : {}),
            fontSize: "20px",
            padding: "18px 40px",
            background: teams.length >= 2
              ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
              : "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
            cursor: teams.length >= 2 ? "pointer" : "not-allowed",
            opacity: teams.length >= 2 ? 1 : 0.7,
          }}
          onClick={proceedToSetup}
          disabled={teams.length < 2}
        >
          <FileText size={22} style={{ marginRight: 8, verticalAlign: "middle" }} />
          ¡Agregar Papelitos! →
        </button>
        {teams.length < 2 && (
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginTop: "8px" }}>
            Necesitás al menos 2 equipos para continuar
          </p>
        )}

        {/* Instructions Section */}
        <div style={{ ...styles.card, marginTop: "20px", padding: "20px", textAlign: "left" }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#764ba2", textAlign: "center" }}>📖 ¿Cómo se juega?</h3>

          <div style={{ fontSize: "15px", color: "#555", lineHeight: "1.6" }}>
            <p style={{ marginBottom: "12px" }}>
              <strong>1️⃣ Preparación:</strong> Cada jugador escribe palabras, frases, personas famosas, peliculas o lo que se le ocurra en papelitos secretos.
              <br />
              OJO! Todos los jugadores deben conocer lo que vas a escribir.
            </p>

            <p style={{ marginBottom: "12px" }}>
              <strong>2️⃣ Rondas:</strong> El juego tiene 3 rondas con los mismos papelitos:
            </p>

            <div style={{ marginLeft: "15px", marginBottom: "12px" }}>
              <p style={{ marginBottom: "8px" }}>🗣️ <strong>Ronda 1 - Describilo:</strong> Describí la palabra sin decir sinónimos ni traducciones.</p>
              <p style={{ marginBottom: "8px" }}>☝️ <strong>Ronda 2 - Una Palabra:</strong> Solo podés decir UNA palabra como pista.</p>
              <p style={{ marginBottom: "8px" }}>🎭 <strong>Ronda 3 - Mímica:</strong> ¡Actuá sin hacer ningún sonido!</p>
            </div>

            <p style={{ marginBottom: "12px" }}>
              <strong>3️⃣ Turnos:</strong> Cada equipo tiene 60 segundos para adivinar la mayor cantidad de papelitos posible.
            </p>

            <p style={{ marginBottom: "0" }}>
              <strong>4️⃣ Ganador:</strong> ¡El equipo con más puntos al final de las 3 rondas gana! 🏆
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 1. SETUP & INPUT
  if (phase === "setup" || phase === "input") {
    return (
      <div style={styles.container}>
        <div style={{ marginBottom: "20px" }}>
          <span style={styles.titleEmoji}>📝</span>
          <h1 style={{ ...styles.bigText, color: "white", WebkitTextFillColor: "white", textShadow: "3px 3px 0 rgba(0,0,0,0.2)" }}>
            ¡Agregá Papelitos!
          </h1>
        </div>

        <div style={styles.card}>
          <p style={{ color: "#666", fontSize: "16px", marginBottom: "20px" }}>
            🤫 Pasá el celular. ¡No dejes que vean lo que escribís!
          </p>
          <input
            style={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Batman, Pizza, Torre Eiffel..."
            onKeyDown={(e) => e.key === "Enter" && addPaper()}
          />
          <button style={{ ...styles.button, ...styles.primaryBtn }} onClick={addPaper}>
            <Plus size={18} style={{ marginRight: 5, verticalAlign: "middle" }} />
            Agregar Papelito
          </button>

          <div style={{ marginTop: 25 }}>
            <div style={styles.scoreCard}>
              <span style={{ fontSize: "32px" }}>🎫</span>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#764ba2" }}>{papers.length}</div>
              <div style={{ fontSize: "14px", color: "#666" }}>papelitos en el bowl</div>
            </div>
          </div>
        </div>

        {papers.length >= 4 && (
          <button
            style={{
              ...styles.button,
              ...styles.successBtn,
              fontSize: "22px",
              padding: "20px 50px",
              animation: "pulse 1s infinite"
            }}
            onClick={startGame}
          >
            🎮 ¡EMPEZAR JUEGO!
          </button>
        )}
      </div>
    )
  }

  // 2. READY SCREEN
  if (phase === "ready" || phase === "summary") {
    const roundInfo = getRoundInfo(round)
    return (
      <div style={styles.container}>
        <div style={styles.teamBadge}>
          ⏭️ Siguiente: <strong>{teams[currentTeamIndex].name}</strong>
        </div>

        <div style={{ ...styles.card, marginTop: "20px" }}>
          <span style={{ fontSize: "50px", display: "block", marginBottom: "10px" }}>{roundInfo.emoji}</span>
          <div style={{ ...styles.roundBadge, background: `linear-gradient(135deg, ${roundInfo.color} 0%, #f093fb 100%)` }}>
            Ronda {round} de 3
          </div>
          <h1 style={{ ...styles.bigText, fontSize: "32px", marginTop: "15px" }}>{roundInfo.title}</h1>
          <p style={{ color: "#666", fontSize: "16px" }}>{roundInfo.desc}</p>
          <hr style={{ margin: "20px 0", border: "none", borderTop: "2px dashed #fbbf24" }} />
          <div style={styles.scoreCard}>
            <div style={{ fontSize: "24px" }}>🎫 {bowl.length}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>papelitos restantes</div>
          </div>
        </div>

        <div style={{ ...styles.card, marginTop: "30px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#764ba2" }}>🏆 Puntajes</h3>
          {teams.map((team, index) => (
            <div
              key={index}
              style={{
                ...styles.teamBadge,
                background: index === currentTeamIndex
                  ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                  : "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                color: index === currentTeamIndex ? "white" : "#8b4513",
              }}
            >
              {team.name}: {team.score} ⭐
            </div>
          ))}
        </div>

        <button
          style={{
            ...styles.button,
            ...styles.successBtn,
            fontSize: "28px",
            padding: "25px 60px",
            marginTop: "25px",
            animation: "pulse 1s infinite"
          }}
          onClick={startTurn}
        >
          ¡DALE! ⏱️
        </button>
      </div>
    )
  }

  // 3. GAMEPLAY
  if (phase === "playing") {
    const handleCancelGame = () => {
      setShowCancelConfirm(false)
      setIsActive(false)
      window.location.reload()
    }

    const timerColor = timeLeft < 10 ? "#ef4444" : timeLeft < 20 ? "#f59e0b" : "#22c55e"
    const bgColor = timeLeft < 10
      ? "linear-gradient(135deg, #c0392b 0%, #922b21 100%)"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"

    return (
      <div style={{ ...styles.container, background: bgColor }}>
        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              ...styles.card,
              maxWidth: "320px",
              animation: "shake 0.5s",
            }}>
              <span style={{ fontSize: "50px" }}>😢</span>
              <h3 style={{ marginBottom: "15px", color: "#764ba2" }}>¿Cancelar Juego?</h3>
              <p style={{ color: "#666", marginBottom: "20px" }}>¡Se perderá todo el progreso! ¿Estás seguro?</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  style={{ ...styles.button, ...styles.primaryBtn }}
                  onClick={() => setShowCancelConfirm(false)}
                >
                  ¡Seguir Jugando!
                </button>
                <button
                  style={{ ...styles.button, ...styles.dangerBtn }}
                  onClick={handleCancelGame}
                >
                  Sí, Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 20 }}>
          <div style={{ ...styles.teamBadge, fontSize: "20px" }}>
            🎯 {teams[currentTeamIndex].name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Pause/Resume Button */}
            <button
              style={{
                ...styles.button,
                padding: "10px 15px",
                margin: 0,
                background: isActive
                  ? "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
                  : "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                border: "3px solid #fff",
              }}
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div style={{
              ...styles.scoreCard,
              margin: 0,
              padding: "10px 20px",
              background: timeLeft < 10 ? "#fee2e2" : "#fff9e6",
              border: `3px dashed ${timerColor}`,
              animation: timeLeft < 10 ? "shake 0.3s infinite" : "none",
              opacity: isActive ? 1 : 0.6,
            }}>
              <Timer size={24} color={timerColor} style={{ verticalAlign: "middle" }} />
              <span style={{
                fontWeight: "bold",
                fontSize: 28,
                color: timerColor,
                marginLeft: "8px"
              }}>
                {timeLeft}s
              </span>
              {!isActive && <span style={{ marginLeft: "8px", fontSize: "14px", color: "#f59e0b" }}>⏸️</span>}
            </div>
          </div>
        </div>

        <div
          style={{
            ...styles.card,
            height: "280px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "float 3s ease-in-out infinite"
          }}
        >
          <h1 style={{ fontSize: "44px", wordBreak: "break-word", color: "#764ba2" }}>{currentPaper}</h1>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            style={{ ...styles.button, ...styles.dangerBtn, flex: "0 0 35%", fontSize: "16px" }}
            onClick={handleSkip}
          >
            Pasar
          </button>
          <button
            style={{ ...styles.button, ...styles.successBtn, flex: "0 0 60%", height: "80px", fontSize: "20px" }}
            onClick={handleCorrect}
          >
            <Check size={28} style={{ marginRight: 8, verticalAlign: "middle" }} />
            ¡ADIVINÓ!
          </button>
        </div>

        {/* Cancel Game Button */}
        <button
          style={{
            ...styles.button,
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            marginTop: "25px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            border: "2px solid rgba(255,255,255,0.3)",
          }}
          onClick={() => setShowCancelConfirm(true)}
        >
          <X size={16} /> Cancelar Juego
        </button>
      </div>
    )
  }

  // 4. GAME OVER
  if (phase === "gameover") {
    const maxScore = Math.max(...teams.map((t) => t.score))
    const winners = teams.filter((t) => t.score === maxScore)
    const winnerText =
      winners.length === 1
        ? winners[0].name
        : winners.length === teams.length
          ? "¡Empate!"
          : winners.map((w) => w.name).join(" & ")

    return (
      <div style={styles.container}>
        <div style={{ marginBottom: "20px" }}>
          <span style={{ ...styles.titleEmoji, fontSize: "80px" }}>🎉</span>
          <h1 style={{ ...styles.bigText, color: "white", WebkitTextFillColor: "white", textShadow: "3px 3px 0 rgba(0,0,0,0.2)", fontSize: "48px" }}>
            ¡Fin del Juego!
          </h1>
        </div>

        <div style={styles.card}>
          <PartyPopper size={40} color="#fbbf24" style={{ marginBottom: "10px" }} />
          <h2 style={{ color: "#764ba2", margin: "10px 0" }}>🏆 Ganador 🏆</h2>
          <div style={{
            ...styles.teamBadge,
            fontSize: "24px",
            padding: "15px 30px",
            background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
          }}>
            {winnerText}
          </div>

          <hr style={{ margin: "25px 0", border: "none", borderTop: "2px dashed #fbbf24" }} />

          <h3 style={{ color: "#764ba2" }}>Puntajes Finales</h3>
          <div style={{ marginTop: 15 }}>
            {[...teams]
              .sort((a, b) => b.score - a.score)
              .map((team, index) => (
                <div key={index} style={{
                  ...styles.teamBadge,
                  display: "block",
                  marginBottom: "10px",
                  fontSize: index === 0 ? "20px" : "16px",
                }}>
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎖️"} {team.name}: {team.score} pts
                </div>
              ))}
          </div>
        </div>

        <button
          style={{
            ...styles.button,
            ...styles.primaryBtn,
            fontSize: "20px",
            padding: "18px 40px"
          }}
          onClick={() => window.location.reload()}
        >
          <RotateCcw size={22} style={{ marginRight: 8, verticalAlign: "middle" }} />
          ¡Jugar de Nuevo! 🎮
        </button>
      </div>
    )
  }
}
