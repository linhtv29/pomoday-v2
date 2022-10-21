const baseApi = process.env.BASE_API || 'http://localhost:8080/api';
export const pullFromDB = (server, token) => {
  const url = server.replace(/\/$/, '') + '/list';
  return fetch(url, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  }).then(r => r.json());
};

export const pushToDB = (tasks, server, token) => {
  const url = server.replace(/\/$/, '') + '/list';
  const data = JSON.stringify({
    tasks: tasks.map(t => ({
      // This is a fallback layer for legacy version of Pomoday
      ...t,
      logs: t.logs || [],
      archived: t.archived || false,
      lastaction: t.lastaction || Date.now(),
    })),
  });
  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    method: 'PUT',
    body: data,
  }).then(r => r.json());
};

export const authenticateUser = (userName, password) => {
  const url = baseApi + '/auth/login';
  const data = JSON.stringify({
    userName,
    password,
  });
  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: data,
  }).then(r => r.json());
};

export const registerUser = (userName, password) => {
  const url = baseApi + '/auth/register';
  const data = JSON.stringify({
    userName,
    password,
  });
  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: data,
  }).then(r => r.json());
};
