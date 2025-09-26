import { useState } from 'react'
import { parseNamesFromText } from '../utils/nameUtils'

const ACCEPTED_TYPES = ['text/plain']

export function NameInputPanel({ onAddNames, onReset, totalCount }) {
  const [manualNames, setManualNames] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.endsWith('.txt')) {
      setFeedback('Use um arquivo .txt com um nome por linha.')
      return
    }

    const text = await file.text()
    const names = parseNamesFromText(text)

    if (!names.length) {
      setFeedback('Nenhum nome valido encontrado no arquivo.')
      return
    }

    onAddNames(names)
    setFeedback(`${names.length} nomes importados com sucesso!`)
    event.target.value = ''
  }

  const handleManualSubmit = () => {
    const names = parseNamesFromText(manualNames)
    if (!names.length) {
      setFeedback('Digite ao menos um nome valido.')
      return
    }

    onAddNames(names)
    setManualNames('')
    setFeedback(`${names.length} nomes adicionados!`)
  }

  return (
    <section className="rounded-3xl bg-slateGlass p-6 shadow-glow backdrop-blur-md">
      <header className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-primary">Entrada de nomes</h2>
          <p className="text-sm text-slate-700">Carregue um .txt ou digite nomes separados por linha.</p>
        </div>
        <button
          type="button"
          className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
          onClick={onReset}
          aria-label="Limpar todos os nomes"
        >
          Limpar
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-white/70 p-6 text-center text-primary transition hover:border-primary hover:bg-white">
          <input
            aria-label="Carregar arquivo de nomes"
            type="file"
            accept=".txt,text/plain"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="font-semibold">Carregar arquivo .txt</span>
          <span className="text-xs text-slate-600">Um nome por linha</span>
        </label>

        <div className="flex flex-col gap-2">
          <textarea
            value={manualNames}
            onChange={(event) => setManualNames(event.target.value)}
            rows={5}
            className="h-full w-full rounded-2xl border border-primary/20 bg-white/70 p-4 text-sm text-slate-800 shadow-inner"
            placeholder={`Ana\nBeatriz\nCarlos`}
            aria-label="Area para digitar nomes"
          />
          <button
            type="button"
            onClick={handleManualSubmit}
            className="rounded-full bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            Adicionar nomes
          </button>
        </div>
      </div>

      <footer className="mt-4 flex items-center justify-between text-sm text-slate-700">
        <span>Total atual: {totalCount}</span>
        <span className="text-secondary">{feedback}</span>
      </footer>
    </section>
  )
}

