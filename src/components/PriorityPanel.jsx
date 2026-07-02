import { BarChart3, CalendarDays, Gauge } from 'lucide-react'
import { formatDate, getPriorityClass, translateOption } from '../utils/formatters'

function countByPriority(tasks, priority) {
  return tasks.filter((task) => task.priority_label === priority).length
}

export function PriorityPanel({ isLoading, tasks }) {
  if (isLoading) {
    return <p className="empty-state">Carregando tarefas.</p>
  }

  if (tasks.length === 0) {
    return <p className="empty-state">Nenhuma tarefa cadastrada.</p>
  }

  const highPriorityCount = countByPriority(tasks, 'alta')
  const mediumPriorityCount = countByPriority(tasks, 'media')
  const lowPriorityCount = countByPriority(tasks, 'baixa')

  return (
    <div className="priority-layout">
      <section className="metrics-grid" aria-label="Resumo de prioridades">
        <article className="metric">
          <Gauge size={20} strokeWidth={2.1} />
          <div>
            <span>Alta</span>
            <strong>{highPriorityCount}</strong>
          </div>
        </article>
        <article className="metric">
          <BarChart3 size={20} strokeWidth={2.1} />
          <div>
            <span>Media</span>
            <strong>{mediumPriorityCount}</strong>
          </div>
        </article>
        <article className="metric">
          <CalendarDays size={20} strokeWidth={2.1} />
          <div>
            <span>Baixa</span>
            <strong>{lowPriorityCount}</strong>
          </div>
        </article>
      </section>

      <section className="priority-list" aria-label="Ordem sugerida">
        {tasks.map((task, index) => (
          <article className="priority-row" key={task.id}>
            <div className="rank">{index + 1}</div>
            <div className="priority-content">
              <div className="task-heading">
                <h2>{task.name}</h2>
                <span className={getPriorityClass(task.priority_label)}>
                  {translateOption(task.priority_label)}
                </span>
              </div>
              <p>{task.rationale}</p>
              <div className="task-meta">
                <span>Prazo: {formatDate(task.due_date)}</span>
                <span>Dificuldade: {translateOption(task.difficulty)}</span>
                <span>Importancia: {translateOption(task.importance)}</span>
              </div>
              <div className="score-track" aria-label={`Pontuacao ${task.priority_score}`}>
                <span style={{ width: `${task.priority_score}%` }} />
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
