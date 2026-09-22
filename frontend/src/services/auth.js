const TOKEN_KEY = 'ferrostock_token';
const USER_KEY = 'ferrostock_usuario';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuth() {
  const token = getToken();
  const raw = localStorage.getItem(USER_KEY);
  if (!token || !raw) return null;
  try {
    return { token, usuario: JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function setAuth(data) {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}