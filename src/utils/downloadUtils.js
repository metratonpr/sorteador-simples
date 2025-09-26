const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export const exportAsJSON = (payload, filename = 'sorteador-dados.json') => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  triggerDownload(blob, filename)
}

export const exportTeamsAsCSV = (teams = [], filename = 'sorteador-equipes.csv') => {
  const headers = ['Equipe', 'Integrantes', 'Pontuacao', 'Atividade']
  const rows = teams.map((team) => [
    team.name,
    team.members.join(' | '),
    team.score,
    team.activityLabel ?? '',
  ])

  const csv = [headers, ...rows]
    .map((line) =>
      line
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(';'),
    )
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, filename)
}