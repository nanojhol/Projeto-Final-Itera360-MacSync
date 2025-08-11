import { HTTPClient } from "./client";

const LogDeAcaoAPI = {
  // Criar um novo log
  criarAsync: async (dados) => {
    const resposta = await HTTPClient.post("/logdeacao", dados);
    return resposta.data;
  },

  // Listar todos os logs
  listarAsync: async () => {
    const resposta = await HTTPClient.get("/logdeacao/listar");
    return resposta.data;
  },

  // Obter log por ID
  obterPorIdAsync: async (id) => {
    const resposta = await HTTPClient.get(`/logdeacao/${id}`);
    return resposta.data;
  },

  // Listar logs por usuário
  listarPorUsuarioAsync: async (usuarioId) => {
    const resposta = await HTTPClient.get(`/logdeacao/por-usuario/${usuarioId}`);
    return resposta.data;
  },

  // Listar logs por entidade (ex: 'Maquina', 'Usuario'...)
  listarPorEntidadeAsync: async (entidade) => {
    const resposta = await HTTPClient.get(`/logdeacao/por-entidade?nome=${entidade}`);
    return resposta.data;
  },

  // Listar logs por período (datas no formato ISO ex: "2025-07-18T00:00:00")
  listarPorPeriodoAsync: async (inicio, fim) => {
    const resposta = await HTTPClient.get(`/logdeacao/por-periodo?inicio=${inicio}&fim=${fim}`);
    return resposta.data;
  },
};

export default LogDeAcaoAPI;
