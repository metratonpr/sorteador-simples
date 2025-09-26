import { useState } from 'react'

export function ActivityManager({ activities, onAddActivity, onRemoveActivity }) {
  const [activity, setActivity] = useState('')

  const handleAdd = () => {
    const value = activity.trim()
    if (!value) return
    onAddActivity(value)
    setActivity('')
  }

  return (
    <section className="rounded-3xl bg-white/80 p-6 shadow-glow backdrop-blur">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-primary">Atividades</h2>
          <p className="text-sm text-slate-600">Cadastre desafios para atribuir as equipes.</p>
        </div>
      </header>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={activity}
          onChange={(event) => setActivity(event.target.value)}
          placeholder="Ex: Responder quiz relampago"
          className="flex-1 rounded-2xl border border-primary/20 bg-white/70 px-4 py-3 text-sm text-slate-700"
          aria-label="Nova atividade"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-full bg-secondary px-5 py-3 font-semibold text-white transition hover:bg-secondary/90"
          aria-label="Adicionar atividade"
        >
          Adicionar
        </button>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {activities.length === 0 && <li className="text-sm text-slate-500">Nenhuma atividade cadastrada.</li>}
        {activities.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary"
          >
            <span>{item.label}</span>
            <button
              type="button"
              onClick={() => onRemoveActivity(item.id)}
              className="rounded-full bg-secondary/30 px-1 text-white"
              aria-label={`Remover atividade ${item.label}`}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}