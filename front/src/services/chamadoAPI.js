import { HTTPClient } from "./client";

const ChamadosAPI = {

  criarAsync: async (dados) => {
    const resposta = await HTTPClient.post("/chamadosuporte", dados);
    return resposta.data;
  },

  listarAsync: async () => {
    const resposta = await HTTPClient.get("/chamadosuporte/listar");
    return resposta.data;
  },

  atualizarAsync: async (dados) => {
    const resposta = await HTTPClient.put(`/chamadosuporte/${dados.id}`, dados);
    return resposta.data;
  },

  listarPorUsuarioAsync: async (usuarioId) => {
    const resposta = await HTTPClient.get(`/chamadosuporte/por-usuario/${usuarioId}`);
    return resposta.data;
  },

  listarPorEstabelecimentoAsync: async (estabelecimentoId) => {
    const resposta = await HTTPClient.get(`/chamadosuporte/por-estabelecimento/${estabelecimentoId}`);
    return resposta.data;
  },

  encerrarAsync: async (id) => {
    const resposta = await HTTPClient.put(`/chamadosuporte/encerrar/${id}`);
    return resposta.data;
  },

  reativarAsync: async (id) => {
    const resposta = await HTTPClient.put(`/chamadosuporte/reativar/${id}`);
    return resposta.data;
  },

  deletarAsync: async (id) => {
    const resposta = await HTTPClient.delete(`/chamadosuporte/${id}`);
    return resposta.data;
  }
};

export default ChamadosAPI;
