import { Plus, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function getInitialForm(task) {
  return {
    description: task?.description ?? '',
    difficulty: task?.difficulty ?? 'media',
    due_date: task?.due_date ?? getToday(),
    importance: task?.importance ?? 'media',
    name: task?.name ?? '',
    project: task?.project ?? 'pessoal',
    source: task?.source ?? 'entrada',
  }
}

export function TaskForm({ isSaving, onCancelEdit, onCreateTask, onUpdateTask, taskToEdit }) {
  const isEditing = Boolean(taskToEdit)
  const [form, setForm] = useState(() => getInitialForm(taskToEdit))

  useEffect(() => {
    setForm(getInitialForm(taskToEdit))
  }, [taskToEdit])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      ...form,
      description: form.description.trim(),
      name: form.name.trim(),
    }

    if (isEditing) {
      await onUpdateTask(taskToEdit.id, payload)
      return
    }

    await onCreateTask(payload)
    setForm(getInitialForm())
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div>
          <h1>{isEditing ? 'Editar tarefa' : 'Criar tarefa'}</h1>
          <p>{isEditing ? 'Altere os dados e salve a tarefa.' : 'Cadastre a tarefa com projeto e origem.'}</p>
        </div>
        {isEditing && (
          <button className="ghost-action" onClick={onCancelEdit} type="button">
            <X size={17} strokeWidth={2.2} />
            <span>Cancelar</span>
          </button>
        )}
      </div>

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

      <label>
        <span>O que e a tarefa</span>
        <textarea
          minLength={10}
          name="description"
          onChange={handleChange}
          placeholder="Ex: revisar o texto, corrigir erros e conferir se esta pronto para entrega"
          required
          rows={4}
          value={form.description}
        />
      </label>

      <div className="form-grid">
        <label>
          <span>Projeto</span>
          <select name="project" onChange={handleChange} value={form.project}>
            <option value="trabalho">Trabalho</option>
            <option value="marca_nova">Marca nova</option>
            <option value="atualizacao_site">Atualizacao do site</option>
            <option value="pessoal">Pessoal</option>
          </select>
        </label>

        <label>
          <span>Origem</span>
          <select name="source" onChange={handleChange} value={form.source}>
            <option value="entrada">Caixa de entrada</option>
            <option value="equipe">Caixa da equipe</option>
          </select>
        </label>

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
        {isEditing ? <Save size={18} strokeWidth={2.2} /> : <Plus size={18} strokeWidth={2.2} />}
        <span>{isSaving ? 'Salvando' : isEditing ? 'Salvar alteracoes' : 'Cadastrar tarefa'}</span>
      </button>
    </form>
  )
}
