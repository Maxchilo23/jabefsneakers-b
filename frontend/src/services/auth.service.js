import api from './api';

export async function login(usuario, password) {
  const { data } = await api.post('/auth/login', { usuario, password });
  return data;
}

export function guardarToken(token) {
  localStorage.setItem('admin_token', token);
}

export function obtenerToken() {
  return localStorage.getItem('admin_token');
}

export function cerrarSesion() {
  localStorage.removeItem('admin_token');
}

export function estaAutenticado() {
  return !!obtenerToken();
}