import { Plus } from 'lucide-react'
import { useState } from 'react'

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function getInitialForm() {
  return {
    difficulty: 'media',
    due_date: getToday(),
    importance: 'media',
    name: '',
  }
}

export function TaskForm({ isSaving, onCreateTask }) {
  const [form, setForm] = useState(getInitialForm)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    await onCreateTask({
      ...form,
      name: form.name.trim(),
    })

    setForm(getInitialForm())
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        <span>Nome da tarefa</span>
        <input
          minLength={3}
          name="name"
          onChange={handleChange}
          placeholder="Ex: revisar relatorio"
          required
          type="text"
          value={form.name}
        />
      </label>

      <div className="form-grid">
        <label>
          <span>Prazo</span>
          <input
            name="due_date"
            onChange={handleChange}
            required
            type="date"
            value={form.due_date}
          />
        </label>

        <label>
          <span>Dificuldade</span>
          <select name="difficulty" onChange={handleChange} value={form.difficulty}>
            <option value="baixa">Baixa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>

        <label>
          <span>Importancia</span>
          <select name="importance" onChange={handleChange} value={form.importance}>
            <option value="baixa">Baixa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>
      </div>

      <button className="primary-action" disabled={isSaving} type="submit">
        <Plus size={18} strokeWidth={2.2} />
        <span>{isSaving ? 'Salvando' : 'Cadastrar tarefa'}</span>
      </button>
    </form>
  )
}
