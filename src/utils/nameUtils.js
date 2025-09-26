export const normalizeName = (rawName = '') => {
  const cleaned = rawName
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')

  if (!cleaned) return ''

  return cleaned
    .split(' ')
    .map((segment) =>
      segment.charAt(0).toLocaleUpperCase('pt-BR') + segment.slice(1).toLocaleLowerCase('pt-BR'),
    )
    .join(' ')
}

export const parseNamesFromText = (text = '') => {
  return text
    .split(/\r?\n|,|;/)
    .map((entry) => normalizeName(entry))
    .filter(Boolean)
}

export const mergeUniqueNames = (current = [], incoming = []) => {
  const seen = new Map()
  const ordered = []

  const push = (name) => {
    const key = name.toLocaleLowerCase('pt-BR')
    if (seen.has(key)) return
    seen.set(key, name)
    ordered.push(name)
  }

  current.forEach((name) => push(name))
  incoming.forEach((name) => push(name))

  return ordered
}

export const shuffleArray = (list = []) => {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}