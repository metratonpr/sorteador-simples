export function NameLists({ pendingNames, drawnNames, onReinclude, onRemovePending }) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-3xl bg-white/80 p-6 shadow-glow backdrop-blur">
        <header className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-xl text-primary">Ainda nao sorteados</h3>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {pendingNames.length}
          </span>
        </header>
        <ul className="flex max-h-64 flex-wrap gap-2 overflow-y-auto">
          {pendingNames.length === 0 && (
            <li className="text-sm text-slate-500">Nenhum nome aguardando sorteio.</li>
          )}
          {pendingNames.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-sm font-medium text-secondary"
            >
              <span>{name}</span>
              <button
                type="button"
                onClick={() => onRemovePending(name)}
                className="rounded-full bg-secondary px-2 text-xs font-bold text-white transition hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                aria-label={`Remover ${name} da lista de sorteio`}
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl bg-white/80 p-6 shadow-glow backdrop-blur">
        <header className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-xl text-purple-600">Ja sorteados</h3>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-600">
            {drawnNames.length}
          </span>
        </header>
        <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto">
          {drawnNames.length === 0 && (
            <li className="text-sm text-slate-500">Aguardando o primeiro sorteio...</li>
          )}
          {drawnNames.map((name) => (
            <li
              key={name}
              className="flex items-center justify-between gap-3 rounded-2xl bg-purple-200/60 px-4 py-2 text-sm font-medium text-purple-800"
            >
              <span>{name}</span>
              <button
                type="button"
                onClick={() => onReinclude(name)}
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-purple-700 transition hover:bg-purple-50"
                aria-label={`Recolocar ${name} na lista de sorteio`}
              >
                Recolocar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}



