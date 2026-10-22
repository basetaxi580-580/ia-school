const API_BASE = '/api/students';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = payload?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

export const api = {
  list: () => request(''),
  summary: () => request('/summary'),
  create: (student) => request('', { method: 'POST', body: JSON.stringify(student) }),
  update: (id, student) => request(`/${id}`, { method: 'PUT', body: JSON.stringify(student) }),
  remove: (id) => request(`/${id}`, { method: 'DELETE' }),
};
