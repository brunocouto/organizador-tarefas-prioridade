const optionLabels = {
  alta: 'Alta',
  baixa: 'Baixa',
  media: 'Media',
}

export function translateOption(value) {
  return optionLabels[value] ?? value
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00`))
}

export function getPriorityClass(priority) {
  return `priority-badge ${priority}`
}
