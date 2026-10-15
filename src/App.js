import { Analytics } from "@vercel/analytics/react"
import { usePapelitos } from "./game/usePapelitos"
import GameOver from "./screens/GameOver"
import PaperInput from "./screens/PaperInput"
import Playing from "./screens/Playing"
import TeamSetup from "./screens/TeamSetup"
import TurnReady from "./screens/TurnReady"

export default function App() {
  const game = usePapelitos()

  return (
    <>
      {game.phase === "teamSetup" && (
        <TeamSetup
          teams={game.teams}
          gameDuration={game.gameDuration}
          onAddTeam={game.addTeam}
          onRemoveTeam={game.removeTeam}
          onDuration={game.setGameDuration}
          onContinue={game.proceedToSetup}
        />
      )}
      {game.phase === "setup" && (
        <PaperInput
          papers={game.papers}
          onAdd={game.addPaper}
          onUpdate={game.updatePaper}
          onRemove={game.removePaper}
          onStart={game.startGame}
          onBack={game.backToTeams}
        />
      )}
      {game.phase === "ready" && (
        <TurnReady
          teams={game.teams}
          currentTeamIndex={game.currentTeamIndex}
          round={game.round}
          bowlCount={game.bowl.length}
          onStart={game.startTurn}
        />
      )}
      {game.phase === "playing" && (
        <Playing
          teamName={game.teams[game.currentTeamIndex]?.name}
          timeLeft={game.timeLeft}
          isActive={game.isActive}
          currentPaper={game.currentPaper}
          onTogglePause={game.togglePause}
          onSkip={game.skipPaper}
          onCorrect={game.markCorrect}
          onCancel={game.resetGame}
        />
      )}
      {game.phase === "gameover" && <GameOver teams={game.teams} onRestart={game.resetGame} />}
      <Analytics />
    </>
  )
}
