import { HTTPClient } from "./client";

const maquinaAPI = {
    async obterAsync(maquinaId) {
        try {
            const response = await HTTPClient.get(`/Maquina/${maquinaId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter máquina:", error);
            throw error;
        }
    },

    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Maquina/Listar?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar máquinas:", error);
            throw error;
        }
    },

    async criarAsync(maquina) {
        try {
            const response = await HTTPClient.post(`/Maquina/`, maquina);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar máquina:", error);
            throw error;
        }
    },

    async atualizarAsync(maquina) {
        try {
            const response = await HTTPClient.put(`/Maquina/${maquina.id}`, maquina);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar máquina:", error);
            throw error;
        }
    },



    async deletarAsync(maquinaId) {
        try {
            const response = await HTTPClient.delete(`/Maquina/remover-definitivo/${maquinaId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar máquina:", error);
            throw error;
        }
    },

    async restaurarAsync(maquinaId) {
        try {
            const response = await HTTPClient.put(`/Maquina/Restaurar/${maquinaId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao restaurar máquina:", error);
            throw error;
        }
    },

    // ✅ Novo método para buscar estabelecimentos
    async listarEstabelecimentosAsync() {
        try {
            const response = await HTTPClient.get(`/Estabelecimento/Listar`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar estabelecimentos:", error);
            throw error;
        }
    },

    listarPorEstabelecimentoAsync: async (estabelecimentoId) => {
        const response = await HTTPClient.get(`/Maquina/listar-por-estabelecimento/${estabelecimentoId}`);
        return response.data;
    },

    async enviarComandoAsync(macAddress, acao) {
        try {
            const payload = {
                macAddress: macAddress,
                acao: acao
            };
            const response = await HTTPClient.post(`/Maquina/comando`, payload);
            return response.data;
        } catch (error) {
            console.error("Erro ao enviar comando para máquina:", error);
            throw error;
        }
    }


};

export default maquinaAPI;
