import { HTTPClient } from "./client";

const UsuarioAPI = {

    listarAsync: async (ativos = true) => {
        const response = await HTTPClient.get(`/Usuario/listar?ativos=${ativos}`);
        return response.data;
    },

    obterAsync: async (id) => {
        const response = await HTTPClient.get(`/Usuario/${id}`);
        return response.data;
    },

    criarAsync: async (nome, email, senha, tipoConta, estabelecimentoId) => {
        const usuarioCriar = {
            nome,
            email,
            senha,
            tipoConta,
            estabelecimentoId,
        };
        const response = await HTTPClient.post(`/Usuario`, usuarioCriar);
        return response.data;
    },

    atualizarAsync: async (id, payload) => {
        const response = await HTTPClient.put(`/Usuario/${id}`, payload);
        return response.data;
    },


    deletarDefinitivoAsync: async (usuarioId) => {
        const response = await HTTPClient.delete(`/Usuario/remover-definitivo/${usuarioId}`);
        return response.data;
    },

    deletarAsync: async (id) => {
        await HTTPClient.delete(`/Usuario/Desativa/${id}`);
    },

    desativarAsync: async (usuarioId) => {
        const response = await HTTPClient.delete(`/Usuario/desativa/${usuarioId}`);
        return response.data;
    },

    reativarAsync: async (usuarioId) => {
        const response = await HTTPClient.put(`/Usuario/reativar/${usuarioId}`);
        return response.data;
    },

    listarTiposUsuarioAsync: async () => {
        const response = await HTTPClient.get(`/Usuario/listar-tipos`);
        return response.data;
    },

    listarEstabelecimentosAsync: async () => {
        const response = await HTTPClient.get(`/Estabelecimento/listar`);
        return response.data;
    },

    listarPorEstabelecimentoAsync: async (estabelecimentoId, tipoConta = 2) => {
        const response = await HTTPClient.get(`/Usuario/listar-por-estabelecimento/${estabelecimentoId}?tipoConta=${tipoConta}`);
        return response.data;
    },

    async adicionarSaldo(id, valor) {
        const response = await HTTPClient.post(`/usuario/${id}/adicionar-saldo`, { valor });
        return response.data;
    },

    async descontarSaldo(id, valor) {
        const response = await HTTPClient.post(`/Usuario/descontar-saldo/${id}`, { valor });
        return response.data;
    }


};

export default UsuarioAPI;
