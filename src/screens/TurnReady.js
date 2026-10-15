import { getRoundInfo } from "../game/rules"

export default function TurnReady({ teams, currentTeamIndex, round, bowlCount, onStart }) {
  const roundInfo = getRoundInfo(round)
  const currentTeam = teams[currentTeamIndex]

  return (
    <div className="screen">
      <div className="team-badge">
        ⏭️ Siguiente: <strong>{currentTeam?.name}</strong>
      </div>

      <section className="card">
        <span className="round-emoji">{roundInfo.emoji}</span>
        <div
          className="round-badge"
          style={{ background: `linear-gradient(135deg, ${roundInfo.color} 0%, #f093fb 100%)` }}
        >
          Ronda {round} de 3
        </div>
        <h1 className="title-gradient title-round">{roundInfo.title}</h1>
        <p className="hint">{roundInfo.desc}</p>
        <hr className="dashed" />
        <div className="score-card">
          <div className="bowl-count">🎫 {bowlCount}</div>
          <div className="score-label">papelitos restantes</div>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">🏆 Puntajes</h2>
        <div className="score-list">
          {teams.map((team, index) => (
            <div className={index === currentTeamIndex ? "score-pill is-current" : "score-pill"} key={`${team.name}-${index}`}>
              {team.name}: {team.score} ⭐
            </div>
          ))}
        </div>
      </section>

      <div className="actions">
        <button className="btn btn-success btn-xl pulse" type="button" onClick={onStart}>
          ¡DALE! ⏱️
        </button>
      </div>
    </div>
  )
}
