import { useState } from "react"
import Check from "lucide-react/dist/esm/icons/check"
import Pause from "lucide-react/dist/esm/icons/pause"
import Play from "lucide-react/dist/esm/icons/play"
import Timer from "lucide-react/dist/esm/icons/timer"
import X from "lucide-react/dist/esm/icons/x"

export default function Playing({ teamName, timeLeft, isActive, currentPaper, onTogglePause, onSkip, onCorrect, onCancel }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const urgency = timeLeft < 10 ? "danger" : timeLeft < 20 ? "warning" : "normal"

  return (
    <div className={urgency === "danger" ? "screen screen-danger" : "screen"}>
      {showCancelConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="round-emoji">😢</span>
            <h2 className="card-title">¿Cancelar Juego?</h2>
            <p className="hint">¡Se perderá todo el progreso! ¿Estás seguro?</p>
            <div className="modal-actions">
              <button className="btn btn-primary" type="button" onClick={() => setShowCancelConfirm(false)}>
                ¡Seguir Jugando!
              </button>
              <button className="btn btn-danger" type="button" onClick={onCancel}>
                Sí, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="play-top">
        <div className="team-badge team-playing">🎯 {teamName}</div>
        <div className="play-controls">
          <button
            className={isActive ? "btn btn-pause" : "btn btn-success btn-icon"}
            type="button"
            aria-label={isActive ? "Pausar" : "Reanudar"}
            onClick={onTogglePause}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <div className={`timer-box timer-${urgency}${isActive ? "" : " is-paused"}`}>
            <Timer size={24} />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      <section className="card paper-card float">
        <h1>{currentPaper}</h1>
      </section>

      <div className="play-actions">
        <button className="btn btn-danger" type="button" onClick={onSkip}>
          Pasar
        </button>
        <button className="btn btn-success btn-guess" type="button" onClick={onCorrect}>
          <Check size={28} />
          ¡ADIVINÓ!
        </button>
      </div>

      <div className="actions">
        <button className="btn btn-back" type="button" onClick={() => setShowCancelConfirm(true)}>
          <X size={16} />
          Cancelar Juego
        </button>
      </div>
    </div>
  )
}
