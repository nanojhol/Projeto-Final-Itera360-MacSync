import { HTTPClient } from "./client";

const LoginAPI = {

    async fazerLogin(email, senha) {
        try {
            const usuarioLogar = { Email: email, Senha: senha };
            const response = await HTTPClient.post(`/Usuario/login`, usuarioLogar);
            return response.data;
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            throw error;
        }
    },

    async verificarEmail(email) {
        try {
            const response = await HTTPClient.post(`/Usuario/verificar-email`, { email });
            return response.data;
        } catch (error) {
            console.error("Erro ao verificar e-mail:", error);
            throw error;
        }
    },

    async inativarUsuarioPorEmail(email) {
        try {
            const response = await HTTPClient.post(`/usuario/inativar-por-email`, { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    async recuperarSenha(email) {
        try {
            const usuarioEmail = { Email: email };
            const response = await HTTPClient.post(`/Usuario/recuperar-senha`, usuarioEmail);
            return response.data;
        } catch (error) {
            console.error("Erro ao recuperar senha:", error);
            throw error;
        }
    },

    async atualizarSenhaComToken(token, novaSenha) {
        const requisicao = {
            token,
            novaSenha,
        };

        const resposta = await HTTPClient.post("/Usuario/nova-senha", requisicao);
        return resposta.data;
    },

};

export default LoginAPI;
