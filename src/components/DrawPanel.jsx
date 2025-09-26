import { motion } from 'framer-motion'

export function DrawPanel({
  pendingCount,
  displayName,
  countdownValue,
  isDrawing,
  onDraw,
  shuffleBeforeDraw,
  onToggleShuffle,
  autoRemoveWinner,
  onToggleAutoRemove,
  minSpinSeconds,
  maxSpinSeconds,
  onMinSpinChange,
  onMaxSpinChange,
  soundEnabled,
  onToggleSound,
}) {
  const renderDisplayContent = () => {
    if (countdownValue) {
      const isGoSignal = countdownValue === 'VALENDO!'
      return (
        <motion.span
          key={`countdown-${countdownValue}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: isGoSignal ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          className={`font-display text-4xl drop-shadow-sm ${isGoSignal ? 'text-secondary' : 'text-primary'}`}
        >
          {countdownValue}
        </motion.span>
      )
    }

    if (displayName) {
      return (
        <motion.span
          key={displayName}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          className="font-display text-4xl text-primary drop-shadow-sm"
        >
          {displayName}
        </motion.span>
      )
    }

    return <span className="text-sm text-slate-500">Pronto para sortear</span>
  }

  return (
    <section className="mt-6 flex flex-col gap-6 rounded-3xl bg-white/80 p-6 shadow-glow backdrop-blur">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl text-primary">Sorteio individual</h2>
          <p className="text-sm text-slate-600">{pendingCount} nomes disponiveis.</p>
        </div>
        <button
          type="button"
          onClick={onDraw}
          disabled={isDrawing || pendingCount === 0}
          className="rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 font-display text-lg text-white shadow-lg transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Iniciar sorteio"
        >
          {isDrawing ? 'Sorteando...' : 'Sortear agora'}
        </button>
      </header>

      <div className="flex min-h-[120px] items-center justify-center rounded-3xl bg-primary/10 text-center">
        {renderDisplayContent()}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DurationField
          label="Tempo minimo"
          value={minSpinSeconds}
          onChange={onMinSpinChange}
          ariaLabel="Definir tempo minimo do sorteio"
        />
        <DurationField
          label="Tempo maximo"
          value={maxSpinSeconds}
          onChange={onMaxSpinChange}
          ariaLabel="Definir tempo maximo do sorteio"
        />
      </div>
      <p className="text-xs text-slate-500">
        O vencedor aparece depois de um tempo aleatorio entre os valores em segundos.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <ToggleButton
          isOn={shuffleBeforeDraw}
          onToggle={onToggleShuffle}
          label="Embaralhar antes do sorteio"
          description="Aumenta o suspense a cada rodada"
        />
        <ToggleButton
          isOn={autoRemoveWinner}
          onToggle={onToggleAutoRemove}
          label="Remover vencedor automaticamente"
          description="Move direto para a lista de sorteados"
        />
        <ToggleButton
          isOn={soundEnabled}
          onToggle={onToggleSound}
          label="Som da roleta"
          description="Ativa ou desliga o efeito sonoro"
        />
      </div>
    </section>
  )
}

function DurationField({ label, value, onChange, ariaLabel }) {
  return (
    <label className="flex flex-col gap-2 rounded-2xl border border-primary/20 bg-white/70 p-4 shadow-inner">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0.5}
          max={15}
          step={0.5}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-primary/20 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/60"
          aria-label={ariaLabel}
        />
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">seg</span>
      </div>
    </label>
  )
}

function ToggleButton({ isOn, onToggle, label, description }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={onToggle}
      className={`flex w-full items-center justify-between rounded-2xl border px-5 py-3 text-left transition ${
        isOn ? 'border-primary bg-primary/15' : 'border-slate-200 bg-white'
      }`}
    >
      <div>
        <p className="font-semibold text-slate-800">{label}</p>
        <span className="text-xs text-slate-500">{description}</span>
      </div>
      <span
        aria-hidden
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
          isOn ? 'bg-primary/80' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            isOn ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  )
}
