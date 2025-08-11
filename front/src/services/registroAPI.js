import { HTTPClient } from "./client";

const RegistroAPI = {
    // ✅ Criar novo registro
    criarAsync: async (registro) => {
        const response = await HTTPClient.post(`/RegistroUtilizacao`, registro);
        return response.data;
    },

    // ✅ Obter registro por ID
    obterAsync: async (id) => {
        const response = await HTTPClient.get(`/RegistroUtilizacao/${id}`);
        return response.data;
    },

    // ✅ Listar todos os registros
    listarAsync: async () => {
        const response = await HTTPClient.get(`/RegistroUtilizacao/listar`);
        return response.data;
    },

    // ✅ Listar registros por usuário
    listarPorUsuarioAsync: async (usuarioId) => {
        const response = await HTTPClient.get(`/RegistroUtilizacao/por-usuario/${usuarioId}`);
        return response.data;
    },

    // ✅ Listar registros por máquina
    listarPorMaquinaAsync: async (maquinaId) => {
        const response = await HTTPClient.get(`/RegistroUtilizacao/por-maquina/${maquinaId}`);
        return response.data;
    },

    // ✅ Atualizar um registro
    atualizarAsync: async (id, payload) => {
        const response = await HTTPClient.put(`/RegistroUtilizacao/${id}`, payload);
        return response.data;
    },

    // ✅ Remover um registro
    deletarAsync: async (id) => {
        const response = await HTTPClient.delete(`/RegistroUtilizacao/${id}`);
        return response.data;
    },

    listarPorMaquinaAsync: async (maquinaId) => {
        const response = await HTTPClient.get(`/RegistroUtilizacao/por-maquina/${maquinaId}`);
        return response.data;
    }


};

export default RegistroAPI;
