import api from './api';

export async function subirImagen(archivo) {
  const formData = new FormData();
  formData.append('imagen', archivo);

  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.url;
}