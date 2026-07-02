const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

export function listTasks() {
  return request('/api/tasks')
}

export function createTask(payload) {
  return request('/api/tasks', {
    body: JSON.stringify(payload),
    method: 'POST',
  })
}
