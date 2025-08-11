import { HTTPClient } from "./client";

const estabelecimentoAPI = {
    async obterAsync(estabelecimentoId) {
        try {
            const response = await HTTPClient.get(`/Estabelecimento/${estabelecimentoId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter estabelecimento:", error);
            throw error;
        }
    },

    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Estabelecimento/Listar?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar estabelecimentos:", error);
            throw error;
        }
    },

    async criarAsync(estabelecimento) {
        try {
            const response = await HTTPClient.post(`/Estabelecimento/`, estabelecimento);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar estabelecimento:", error);
            throw error;
        }
    },

    async atualizarAsync(estabelecimento) {
        try {
            const response = await HTTPClient.put(`/Estabelecimento/${estabelecimento.id}`, {
                nome: estabelecimento.nome,
                endereco: estabelecimento.endereco,
                telefone: estabelecimento.telefone,
                ativo: estabelecimento.ativo
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar estabelecimento:", error);
            throw error;
        }
    },


    async deletarAsync(estabelecimentoId) {
        try {
            const response = await HTTPClient.delete(`/Estabelecimento/remover-definitivo/${estabelecimentoId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar estabelecimento:", error);
            throw error;
        }
    },

    async restaurarAsync(estabelecimentoId) {
        try {
            const response = await HTTPClient.put(`/Estabelecimento/Restaurar/${estabelecimentoId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao restaurar estabelecimento:", error);
            throw error;
        }
    },
};

export default estabelecimentoAPI;
