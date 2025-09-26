import { useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { ActivityManager } from './components/ActivityManager'
import { DrawPanel } from './components/DrawPanel'
import { NameInputPanel } from './components/NameInputPanel'
import { NameLists } from './components/NameLists'
import { TeamSection } from './components/TeamSection'
import { useSpinSound } from './hooks/useSpinSound'
import { mergeUniqueNames, shuffleArray } from './utils/nameUtils'

const TEAM_GRADIENTS = [
  'from-pink-500 to-rose-500',
  'from-sky-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-amber-500 to-orange-500',
  'from-lime-500 to-emerald-500',
  'from-fuchsia-500 to-pink-500',
  'from-blue-500 to-indigo-500',
]

const createId = () => `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`

export default function App() {
  const [allNames, setAllNames] = useState([])
  const [pendingNames, setPendingNames] = useState([])
  const [drawnNames, setDrawnNames] = useState([])
  const [displayName, setDisplayName] = useState('')
  const [isDrawing, setIsDrawing] = useState(false)
  const [shuffleBeforeDraw, setShuffleBeforeDraw] = useState(true)
  const [autoRemoveWinner, setAutoRemoveWinner] = useState(true)
  const [teamCount, setTeamCount] = useState(3)
  const [teams, setTeams] = useState([])
  const [activities, setActivities] = useState([])
  const [assignActivitiesOnDraw, setAssignActivitiesOnDraw] = useState(false)
  const [minSpinSeconds, setMinSpinSeconds] = useState(2)
  const [maxSpinSeconds, setMaxSpinSeconds] = useState(4)
  const [countdownValue, setCountdownValue] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [leaderId, setLeaderId] = useState(null)

  const { play: playSpin, stop: stopSpin } = useSpinSound()
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const countdownRef = useRef(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
      intervalRef.current = null
      timeoutRef.current = null
      countdownRef.current = null
      stopSpin()
    }
  }, [stopSpin])

  useEffect(() => {
    if (!soundEnabled) {
      stopSpin()
    }
  }, [soundEnabled, stopSpin])

  const handleAddNames = (names) => {
    setAllNames((prevAll) => {
      const mergedAll = mergeUniqueNames(prevAll, names)
      const newEntries = mergedAll.filter((name) => !prevAll.includes(name))
      if (newEntries.length) {
        setPendingNames((prevPending) => mergeUniqueNames(prevPending, newEntries))
      }
      return mergedAll
    })
  }

  const handleResetNames = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    intervalRef.current = null
    timeoutRef.current = null
    countdownRef.current = null
    stopSpin()
    setCountdownValue(null)
    setAllNames([])
    setPendingNames([])
    setDrawnNames([])
    setDisplayName('')
    setTeams([])
    setLeaderId(null)
  }

  const handleReinclude = (name) => {
    setPendingNames((prev) => mergeUniqueNames(prev, [name]))
    setDrawnNames((prev) => prev.filter((item) => item !== name))
  }

  const handleRemovePending = (name) => {
    setPendingNames((prev) => prev.filter((item) => item !== name))
    setAllNames((prev) => prev.filter((item) => item !== name))
    if (displayName === name) {
      setDisplayName('')
    }
  }

  const handleDraw = () => {
    if (isDrawing || pendingNames.length === 0) return

    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    intervalRef.current = null
    timeoutRef.current = null
    countdownRef.current = null

    const pool = shuffleBeforeDraw ? shuffleArray(pendingNames) : [...pendingNames]
    if (!pool.length) {
      setIsDrawing(false)
      return
    }

    const sequence = ['1', '2', '3', 'VALENDO!']
    const countdownIntervalMs = 600

    setIsDrawing(true)
    setDisplayName('')
    setCountdownValue(sequence[0])
    let step = 0

    const startSpin = () => {
      const minSeconds = Math.min(minSpinSeconds, maxSpinSeconds)
      const maxSeconds = Math.max(minSpinSeconds, maxSpinSeconds)
      const minMs = Math.max(500, Math.round(minSeconds * 1000))
      const maxMs = Math.max(minMs, Math.round(maxSeconds * 1000))
      const spinDuration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs

      if (soundEnabled) {
        playSpin()
      }
      let cursor = 0
      setDisplayName(pool[cursor % pool.length])
      intervalRef.current = setInterval(() => {
        cursor += 1
        setDisplayName(pool[cursor % pool.length])
      }, 100)

      timeoutRef.current = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        const winner = pool[Math.floor(Math.random() * pool.length)]
        setDisplayName(winner)
        stopSpin()
        setIsDrawing(false)

        setDrawnNames((prev) => {
          const filtered = prev.filter((item) => item !== winner)
          return [winner, ...filtered]
        })

        if (autoRemoveWinner) {
          setPendingNames((prev) => prev.filter((item) => item !== winner))
        }
      }, spinDuration)
    }

    countdownRef.current = setInterval(() => {
      step += 1
      if (step < sequence.length) {
        setCountdownValue(sequence[step])
      } else {
        if (countdownRef.current) clearInterval(countdownRef.current)
        countdownRef.current = null
        setCountdownValue(null)
        startSpin()
      }
    }, countdownIntervalMs)
  }

  const handleMinSpinChange = (value) => {
    const numeric = Number(value)
    if (Number.isNaN(numeric)) return
    const sanitized = Math.min(Math.max(numeric, 0.5), 15)
    setMinSpinSeconds(sanitized)
    setMaxSpinSeconds((prev) => (prev < sanitized ? sanitized : prev))
  }

  const handleMaxSpinChange = (value) => {
    const numeric = Number(value)
    if (Number.isNaN(numeric)) return
    const sanitized = Math.min(Math.max(numeric, 0.5), 15)
    setMaxSpinSeconds(sanitized)
    setMinSpinSeconds((prev) => (prev > sanitized ? sanitized : prev))
  }

  const handleGenerateTeams = () => {
    if (!allNames.length || teamCount < 1) return

    const participants = shuffleArray(allNames)
    const created = Array.from({ length: teamCount }, (_, index) => ({
      id: createId(),
      name: `Equipe ${index + 1}`,
      members: [],
      score: 0,
      activityId: null,
      activityLabel: null,
      createdOrder: index,
      color: TEAM_GRADIENTS[index % TEAM_GRADIENTS.length],
    }))

    participants.forEach((participant, index) => {
      created[index % teamCount].members.push(participant)
    })

    if (assignActivitiesOnDraw && activities.length) {
      const shuffledActivities = shuffleArray(activities)
      if (activities.length >= teamCount) {
        created.forEach((team, index) => {
          const activity = shuffledActivities[index]
          if (!activity) return
          team.activityId = activity.id
          team.activityLabel = activity.label
        })
      } else {
        created.forEach((team, index) => {
          const activity = shuffledActivities[index % shuffledActivities.length]
          team.activityId = activity.id
          team.activityLabel = activity.label
        })
      }
    }

    setTeams(created)
    setLeaderId(null)
  }

  const handleResetTeams = () => {
    setTeams([])
    setLeaderId(null)
  }

  const handleScoreDelta = (teamId, delta) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, score: team.score + delta } : team,
      ),
    )
  }

  const handleScoreSet = (teamId, score) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, score: Number.isNaN(score) ? 0 : score } : team,
      ),
    )
  }

  const handleAssignActivity = (teamId, activityId) => {
    setTeams((prev) =>
      prev.map((team) => {
        if (team.id !== teamId) return team
        if (!activityId) {
          return { ...team, activityId: null, activityLabel: null }
        }
        const activity = activities.find((item) => item.id === activityId)
        return {
          ...team,
          activityId,
          activityLabel: activity?.label ?? null,
        }
      }),
    )
  }

  const handleAddActivity = (label) => {
    const trimmed = label.trim()
    if (!trimmed) return
    setActivities((prev) => {
      const exists = prev.some((item) => item.label.toLowerCase() === trimmed.toLowerCase())
      if (exists) return prev
      return [...prev, { id: createId(), label: trimmed }]
    })
  }

  const handleRemoveActivity = (id) => {
    setActivities((prev) => prev.filter((item) => item.id !== id))
    setTeams((prev) =>
      prev.map((team) =>
        team.activityId === id
          ? { ...team, activityId: null, activityLabel: null }
          : team,
      ),
    )
  }

  const rankedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.createdOrder - b.createdOrder
    })
  }, [teams])

  useEffect(() => {
    if (!rankedTeams.length) return
    const currentLeader = rankedTeams[0]
    if (currentLeader.score <= 0) {
      setLeaderId(null)
      return
    }
    if (leaderId && leaderId === currentLeader.id) return

    setLeaderId(currentLeader.id)
    confetti({
      particleCount: 140,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#ffcb47', '#7a4bff', '#36c1ff'],
    })
  }, [rankedTeams, leaderId])

  const handleExportJson = async () => {
    const { exportAsJSON } = await import('./utils/downloadUtils')
    const payload = {
      geradoEm: new Date().toISOString(),
      nomes: {
        todos: allNames,
        pendentes: pendingNames,
        sorteados: drawnNames,
      },
      equipes: rankedTeams,
    }
    exportAsJSON(payload)
  }

  const handleExportCsv = async () => {
    const { exportTeamsAsCSV } = await import('./utils/downloadUtils')
    exportTeamsAsCSV(rankedTeams)
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-10 text-slate-900">
      <header className="rounded-3xl bg-white/80 p-6 shadow-glow backdrop-blur">
        <h1 className="font-display text-4xl text-primary">Sorteador Web</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Prepare sorteios divertidos, monte equipes equilibradas e acompanhe o placar em tempo real.
        </p>
      </header>

      <NameInputPanel
        onAddNames={handleAddNames}
        onReset={handleResetNames}
        totalCount={allNames.length}
      />

      <NameLists
        pendingNames={pendingNames}
        drawnNames={drawnNames}
        onReinclude={handleReinclude}
        onRemovePending={handleRemovePending}
      />

      <DrawPanel
        pendingCount={pendingNames.length}
        displayName={displayName}
        countdownValue={countdownValue}
        isDrawing={isDrawing}
        onDraw={handleDraw}
        shuffleBeforeDraw={shuffleBeforeDraw}
        onToggleShuffle={() => setShuffleBeforeDraw((prev) => !prev)}
        autoRemoveWinner={autoRemoveWinner}
        onToggleAutoRemove={() => setAutoRemoveWinner((prev) => !prev)}
        minSpinSeconds={minSpinSeconds}
        maxSpinSeconds={maxSpinSeconds}
        onMinSpinChange={handleMinSpinChange}
        onMaxSpinChange={handleMaxSpinChange}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      <ActivityManager
        activities={activities}
        onAddActivity={handleAddActivity}
        onRemoveActivity={handleRemoveActivity}
      />

      <TeamSection
        teams={teams}
        teamCount={teamCount}
        onTeamCountChange={setTeamCount}
        onGenerateTeams={handleGenerateTeams}
        onResetTeams={handleResetTeams}
        hasNames={allNames.length > 0}
        onScoreDelta={handleScoreDelta}
        onScoreSet={handleScoreSet}
        activities={activities}
        onAssignActivity={handleAssignActivity}
        assignActivitiesOnDraw={assignActivitiesOnDraw}
        onToggleAssignActivities={() => setAssignActivitiesOnDraw((prev) => !prev)}
      />

      <footer className="mt-6 flex flex-col items-start gap-3 rounded-3xl bg-white/80 p-6 shadow-glow backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-xl text-primary">Exportar resultados</h2>
          <p className="text-xs text-slate-500">Salve um registro das equipes e pontuacoes.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Baixar JSON
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-white transition hover:bg-secondary/90"
          >
            Baixar CSV
          </button>
        </div>
      </footer>
    </main>
  )
}














