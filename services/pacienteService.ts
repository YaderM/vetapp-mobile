import axios from 'axios';

const API_URL = 'https://vetapp-web-completo.vercel.app/api';

export const loginUsuario = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data; // Aquí es donde viene el token real (ej: data.token)
};