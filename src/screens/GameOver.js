import PartyPopper from "lucide-react/dist/esm/icons/party-popper"
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw"
import { winners } from "../game/rules"

const MEDALS = ["🥇", "🥈", "🥉"]

export default function GameOver({ teams, onRestart }) {
  const result = winners(teams)
  const ranking = [...teams].sort((a, b) => b.score - a.score)

  return (
    <div className="screen">
      <header className="hero">
        <span className="emoji-bounce emoji-large">🎉</span>
        <h1 className="title-white title-end">¡Fin del Juego!</h1>
      </header>

      <section className="card">
        <PartyPopper size={40} color="#fbbf24" />
        <h2 className="card-title">🏆 Ganador 🏆</h2>
        <div className="team-badge winner-name">{result.label}</div>
        <hr className="dashed" />
        <h3 className="card-title">Puntajes Finales</h3>
        <div className="ranking">
          {ranking.map((team, index) => (
            <div className={index === 0 ? "score-pill rank-first" : "score-pill"} key={`${team.name}-${index}`}>
              {MEDALS[index] ?? "🎖️"} {team.name}: {team.score} pts
            </div>
          ))}
        </div>
      </section>

      <div className="actions">
        <button className="btn btn-primary btn-lg" type="button" onClick={onRestart}>
          <RotateCcw size={22} />
          ¡Jugar de Nuevo! 🎮
        </button>
      </div>
    </div>
  )
}
