import { useState } from "react"
import FileText from "lucide-react/dist/esm/icons/file-text"
import Plus from "lucide-react/dist/esm/icons/plus"
import Sparkles from "lucide-react/dist/esm/icons/sparkles"
import Trash2 from "lucide-react/dist/esm/icons/trash-2"
import Users from "lucide-react/dist/esm/icons/users"

const DURATIONS = [30, 45, 60, 90, 120]

export default function TeamSetup({ teams, gameDuration, onAddTeam, onRemoveTeam, onDuration, onContinue }) {
  const [teamName, setTeamName] = useState("")
  const canContinue = teams.length >= 2

  const addTeam = () => {
    onAddTeam(teamName)
    setTeamName("")
  }

  return (
    <div className="screen">
      <header className="hero">
        <span className="emoji-bounce">📝</span>
        <h1 className="title-white">¡Papelitos!</h1>
        <p className="subtitle">El Juego de las Fiestas Argentinas! 🇦🇷</p>
      </header>

      <section className="card">
        <div className="section-heading">
          <Users size={28} color="#764ba2" />
          <h2>¡Armá tus Equipos!</h2>
        </div>
        <p className="hint">Agregá 2 o más equipos para jugar 🎯</p>
        <input
          className="field"
          value={teamName}
          onChange={(event) => setTeamName(event.target.value)}
          placeholder="Nombre del equipo..."
          onKeyDown={(event) => event.key === "Enter" && addTeam()}
        />
        <button className="btn btn-primary" type="button" onClick={addTeam}>
          <Plus size={18} />
          Agregar Equipo
        </button>

        <div className="team-count">
          <div className="round-badge">
            <Sparkles size={14} />
            Equipos: {teams.length}
          </div>
          <div className="team-list">
            {teams.map((team, index) => (
              <div className="team-row" key={`${team.name}-${index}`}>
                <span>🏆 {team.name}</span>
                <button className="btn btn-danger btn-icon" type="button" aria-label={`Borrar ${team.name}`} onClick={() => onRemoveTeam(index)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">⏱️ Tiempo por Turno</h2>
        <div className="duration-grid">
          {DURATIONS.map((seconds) => (
            <button
              key={seconds}
              type="button"
              className={seconds === gameDuration ? "duration-btn is-selected" : "duration-btn"}
              onClick={() => onDuration(seconds)}
            >
              {seconds}
            </button>
          ))}
        </div>
        <p className="hint">Cada equipo tendrá {gameDuration} segundos para adivinar</p>
      </section>

      <div className="actions">
        <button className="btn btn-success btn-lg" type="button" onClick={onContinue} disabled={!canContinue}>
          <FileText size={22} />
          ¡Agregar Papelitos! →
        </button>
        {!canContinue && <p className="footnote">Necesitás al menos 2 equipos para continuar</p>}
      </div>

      <section className="card help">
        <h2 className="card-title">📖 ¿Cómo se juega?</h2>
        <p>
          <strong>1️⃣ Preparación:</strong> Cada jugador escribe palabras, frases, personas famosas, peliculas o lo que se le ocurra en papelitos secretos.
          <br />
          OJO! Todos los jugadores deben conocer lo que vas a escribir.
        </p>
        <p>
          <strong>2️⃣ Rondas:</strong> El juego tiene 3 rondas con los mismos papelitos:
        </p>
        <div className="rules">
          <p>🗣️ <strong>Ronda 1 - Describilo:</strong> Describí la palabra sin decir sinónimos ni traducciones.</p>
          <p>☝️ <strong>Ronda 2 - Una Palabra:</strong> Solo podés decir UNA palabra como pista.</p>
          <p>🎭 <strong>Ronda 3 - Mímica:</strong> ¡Actuá sin hacer ningún sonido!</p>
        </div>
        <p>
          <strong>3️⃣ Turnos:</strong> Cada equipo tiene {gameDuration} segundos para adivinar la mayor cantidad de papelitos posible.
        </p>
        <p>
          <strong>4️⃣ Ganador:</strong> ¡El equipo con más puntos al final de las 3 rondas gana! 🏆
        </p>
      </section>
    </div>
  )
}
