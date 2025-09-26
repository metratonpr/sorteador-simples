import { useMemo } from 'react'
import { TeamCard } from './TeamCard'

export function TeamSection({
  teams,
  teamCount,
  onTeamCountChange,
  onGenerateTeams,
  onResetTeams,
  hasNames,
  onScoreDelta,
  onScoreSet,
  activities,
  onAssignActivity,
  assignActivitiesOnDraw,
  onToggleAssignActivities,
}) {
  const orderedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }
      return a.createdOrder - b.createdOrder
    })
  }, [teams])

  const leaderId = orderedTeams[0]?.id

  return (
    <section className="flex flex-col gap-6">
      <div className="rounded-3xl bg-white/80 p-6 shadow-glow backdrop-blur">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl text-primary">Equipes e placar</h2>
            <p className="text-sm text-slate-600">Distribua os participantes em equipes equilibradas.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onGenerateTeams}
              disabled={!hasNames}
              className="rounded-full bg-gradient-to-r from-secondary to-primary px-6 py-3 font-semibold text-white shadow transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Sortear equipes
            </button>
            <button
              type="button"
              onClick={onResetTeams}
              className="rounded-full border border-primary/40 px-6 py-3 font-semibold text-primary transition hover:bg-primary/10"
            >
              Resetar equipes
            </button>
          </div>
        </header>

        <div className="mt-4 flex flex-col gap-2">
          <label
            className={`flex items-center gap-3 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
              assignActivitiesOnDraw ? 'border-secondary bg-secondary/15 text-secondary' : 'border-slate-200 bg-white text-slate-700'
            } ${!activities.length ? 'opacity-60' : ''}`}
          >
            <input
              type="checkbox"
              checked={assignActivitiesOnDraw}
              onChange={() => onToggleAssignActivities()}
              disabled={!activities.length}
              className="h-4 w-4 accent-secondary disabled:cursor-not-allowed"
              aria-label="Sortear atividades automaticamente ao criar equipes"
            />
            <span>Sortear atividades automaticamente</span>
          </label>
          <span className="text-xs text-slate-500">
            {activities.length
              ? 'Atividades extras ficam de fora; se houver menos atividades que equipes, elas podem se repetir.'
              : 'Cadastre ao menos uma atividade para habilitar o sorteio automatico.'}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <label className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Quantidade de equipes
            </span>
            <input
              type="range"
              min={2}
              max={12}
              value={teamCount}
              onChange={(event) => onTeamCountChange(Number(event.target.value))}
              aria-label="Selecionar quantidade de equipes"
              className="w-full accent-primary"
            />
            <span className="rounded-full bg-primary/15 px-4 py-1 font-semibold text-primary">
              {teamCount} equipes
            </span>
          </label>
          <span className="text-xs text-slate-500">
            Os participantes sao distribuidos de forma equilibrada. Ajuste o numero de equipes antes de sortear.
          </span>
        </div>
      </div>

      {orderedTeams.length > 0 && (
        <div className="grid gap-6 xl:grid-cols-2">
          {orderedTeams.map((team, index) => (
            <TeamCard
              key={team.id}
              team={team}
              position={index + 1}
              isLeader={team.id === leaderId}
              onScoreDelta={onScoreDelta}
              onScoreSet={onScoreSet}
              activities={activities}
              onAssignActivity={onAssignActivity}
            />
          ))}
        </div>
      )}
    </section>
  )
}




