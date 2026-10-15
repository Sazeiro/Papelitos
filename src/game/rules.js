export function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5)
}

export function scorePoint(teams, teamIndex) {
  return teams.map((team, index) =>
    index === teamIndex ? { ...team, score: team.score + 1 } : team
  )
}

export function guess(bowl) {
  return bowl.slice(1)
}

export function skip(bowl) {
  if (bowl.length === 0) return []
  const [first, ...rest] = bowl
  return [...rest, first]
}

export function nextRound({ round, papers }) {
  if (round >= 3) {
    return { finished: true, round, bowl: [] }
  }
  return { finished: false, round: round + 1, bowl: shuffle(papers) }
}

export function winners(teams) {
  if (teams.length === 0) {
    return { type: "empty", teams: [], label: "¡Empate!" }
  }

  const maxScore = Math.max(...teams.map((team) => team.score))
  const winning = teams.filter((team) => team.score === maxScore)

  if (winning.length === teams.length) {
    return { type: "tie-all", teams: winning, label: "¡Empate!" }
  }
  if (winning.length === 1) {
    return { type: "winner", teams: winning, label: winning[0].name }
  }
  return {
    type: "tie",
    teams: winning,
    label: winning.map((team) => team.name).join(" & "),
  }
}

export function getRoundInfo(round) {
  switch (round) {
    case 1:
      return {
        title: "🗣️ ¡Describilo!",
        desc: "Usá palabras para describir. ¡Sin sinónimos ni traducciones!",
        emoji: "💬",
        color: "#667eea",
      }
    case 2:
      return {
        title: "☝️ ¡Una Sola Palabra!",
        desc: "Solo podés decir UNA palabra. ¡Sin gestos!",
        emoji: "🎯",
        color: "#f093fb",
      }
    case 3:
      return {
        title: "🎭 ¡Decilo con Mímica!",
        desc: "Usá solo tu cuerpo. ¡Silencio total!",
        emoji: "🤫",
        color: "#38ef7d",
      }
    default:
      return { title: "Fin del Juego", desc: "", emoji: "🎉", color: "#fbbf24" }
  }
}
