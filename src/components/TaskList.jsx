import { CalendarDays } from 'lucide-react'
import { formatDate, getPriorityClass, translateOption } from '../utils/formatters'

export function TaskList({ isLoading, tasks }) {
  if (isLoading) {
    return <p className="empty-state">Carregando tarefas.</p>
  }

  if (tasks.length === 0) {
    return <p className="empty-state">Nenhuma tarefa cadastrada.</p>
  }

  return (
    <section className="task-list" aria-label="Tarefas cadastradas">
      {tasks.map((task) => (
        <article className="task-card" key={task.id}>
          <div className="task-heading">
            <h2>{task.name}</h2>
            <span className={getPriorityClass(task.priority_label)}>
              {translateOption(task.priority_label)}
            </span>
          </div>
          <div className="task-meta">
            <span>
              <CalendarDays size={15} strokeWidth={2.1} />
              {formatDate(task.due_date)}
            </span>
            <span>Dificuldade: {translateOption(task.difficulty)}</span>
            <span>Importancia: {translateOption(task.importance)}</span>
          </div>
        </article>
      ))}
    </section>
  )
}
