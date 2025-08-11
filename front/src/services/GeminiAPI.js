import { HTTPClient } from "./client";

const GeminiAPI = {
  gerarSugestaoParaMaquinaAsync: async (maquinaId) => {
    const response = await HTTPClient.post(`/SugestaoIA/gerar/${maquinaId}`);
    return response.data;
  },

  gerarSugestaoParaUsuarioAsync: async (usuarioId) => {
    const response = await HTTPClient.post(`/SugestaoIA/usuario/${usuarioId}`);
    return response.data;
  },

  listarSugestoesMaquinaAsync: async (maquinaId) => {
    const response = await HTTPClient.get(`/SugestaoIA/maquina/${maquinaId}`);
    return response.data;
  },

  listarTodasSugestoesAsync: async () => {
    const response = await HTTPClient.get(`/SugestaoIA`);
    return response.data;
  }
};

export default GeminiAPI;
