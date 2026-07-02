import { useEffect, useMemo, useState } from 'react'
import { ClipboardList, LayoutDashboard, ListChecks, PlusCircle } from 'lucide-react'
import { createTask, listTasks } from './api/tasks'
import { PriorityPanel } from './components/PriorityPanel'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'

const tabs = [
  { id: 'create', label: 'Cadastro', icon: PlusCircle },
  { id: 'list', label: 'Lista', icon: ListChecks },
  { id: 'priority', label: 'Painel', icon: LayoutDashboard },
]

function App() {
  const [activeTab, setActiveTab] = useState('create')
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((first, second) => {
        if (second.priority_score !== first.priority_score) {
          return second.priority_score - first.priority_score
        }

        return new Date(first.due_date) - new Date(second.due_date)
      }),
    [tasks],
  )

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await listTasks()
        setTasks(response)
      } catch {
        setError('Nao foi possivel carregar as tarefas.')
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  async function handleCreateTask(payload) {
    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      const task = await createTask(payload)
      setTasks((currentTasks) => [task, ...currentTasks])
      setMessage('Tarefa cadastrada.')
    } catch {
      setError('Nao foi possivel cadastrar a tarefa.')
    } finally {
      setIsSaving(false)
    }
  }

  function renderContent() {
    if (activeTab === 'create') {
      return <TaskForm isSaving={isSaving} onCreateTask={handleCreateTask} />
    }

    if (activeTab === 'list') {
      return <TaskList isLoading={isLoading} tasks={tasks} />
    }

    return <PriorityPanel isLoading={isLoading} tasks={sortedTasks} />
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">
          <ClipboardList size={28} strokeWidth={2.2} />
        </div>
        <div>
          <p className="eyebrow">Organizador de tarefas</p>
          <h1>Priorizacao inteligente</h1>
        </div>
      </header>

      <nav className="tab-bar" aria-label="Navegacao principal">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              aria-current={isActive ? 'page' : undefined}
              className={isActive ? 'tab-button active' : 'tab-button'}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              type="button"
            >
              <Icon size={18} strokeWidth={2.1} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>

      {(message || error) && (
        <div className={error ? 'status-message error' : 'status-message'}>
          {error || message}
        </div>
      )}

      <section className="workspace">{renderContent()}</section>
    </main>
  )
}

export default App
