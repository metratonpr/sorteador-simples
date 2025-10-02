import { motion } from 'framer-motion'

export function TeamCard({
  team,
  position,
  isLeader,
  onScoreDelta,
  onScoreSet,
  activities,
  onAssignActivity,
}) {
  const gradient = team.color ?? 'from-primary to-secondary'

  return (
    <motion.article
      layout
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      className={`relative flex flex-col gap-4 rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg`}
    >
      {isLeader && (
        <span className="absolute -right-3 -top-3" aria-hidden>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 25.5 9 12l6 5.5 3-8 3 8 6-5.5 2 13.5H7Z"
              fill="#ffe27a"
              stroke="#facc15"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}

      <header className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-2xl">
            {position}. {team.name}
          </h3>
          <p className="text-sm text-white/80">Integrantes: {team.members.length}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onScoreDelta(team.id, -1)}
            className="h-10 w-10 rounded-full bg-white/25 text-2xl font-bold text-white transition hover:bg-white/40"
            aria-label={`Remover um ponto da ${team.name}`}
          >
            -
          </button>
          <input
            type="number"
            value={team.score}
            onChange={(event) => onScoreSet(team.id, Number(event.target.value) || 0)}
            aria-label={`Pontuacao da ${team.name}`}
            className="h-12 w-20 rounded-2xl bg-white/80 text-center text-xl font-semibold text-primary"
          />
          <button
            type="button"
            onClick={() => onScoreDelta(team.id, 1)}
            className="h-10 w-10 rounded-full bg-white/25 text-2xl font-bold text-white transition hover:bg-white/40"
            aria-label={`Adicionar um ponto a ${team.name}`}
          >
            +
          </button>
        </div>
      </header>

      <div>
        <h4 className="font-semibold uppercase tracking-wide text-white/80">Integrantes</h4>
        <ul className="mt-2 flex flex-wrap gap-2">
          {team.members.length ? (
            team.members.map((member) => (
              <li
                key={member}
                className="rounded-full bg-white/25 px-3 py-1 text-base font-3xl text-white"
              >
                {member}
              </li>
            ))
          ) : (
            <li className="text-sm text-white/80">Sem integrantes ainda.</li>
          )}
        </ul>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-white/20 p-4">
        <label className="text-sm font-semibold uppercase tracking-wide text-white/80" htmlFor={`activity-${team.id}`}>
          Atividade
        </label>
        <select
          id={`activity-${team.id}`}
          value={team.activityId ?? ''}
          onChange={(event) => onAssignActivity(team.id, event.target.value)}
          className="h-11 rounded-2xl border-none bg-white/90 px-3 text-slate-800 focus:outline-none"
          aria-label={`Selecionar atividade para ${team.name}`}
        >
          <option value="">Sem atividade atribuida</option>
          {activities.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.label}
            </option>
          ))}
        </select>
        {team.activityLabel && (
          <p className="rounded-2xl bg-white/15 px-3 py-2 text-sm">
            Atual: <span className="font-semibold">{team.activityLabel}</span>
          </p>
        )}
      </div>
    </motion.article>
  )
}