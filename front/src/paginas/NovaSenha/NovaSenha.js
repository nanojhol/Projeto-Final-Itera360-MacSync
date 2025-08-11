import BotaoLogin from "../../componentes/BotaoLogin/BotaoLogin";
import { useNavigate, useLocation } from "react-router-dom";
import LoginAPI from "../../services/loginAPI";
import style from "./NovaSenha.module.css";
import Logo from "../../assets/Logo3.png";
import gear from "../../assets/gear1.png";
import { useState } from "react";

export function NovaSenha() {

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const navigate = useNavigate();

    const handleAtualizarSenha = async () => {
        setErro("");

        if (!token) {
            setErro("Token de recuperação inválido.");
            return;
        }

        if (novaSenha.length < 4) {
            setErro("A senha deve ter no mínimo 4 caracteres.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        try {
            await LoginAPI.atualizarSenhaComToken(token, novaSenha);
            setSucesso(true);

            setTimeout(() => {
                navigate("/login");
            }, 10000);
        } catch (e) {
            setErro("Erro ao atualizar senha. Verifique se o link ainda é válido.");
        }
    };


    return (
        <div className={style.container}>
            <div className={style.card}>

                <div className={style.logo_container}>
                    <img src={Logo} alt="Logo" className={style.logo} />
                </div>

                <img src={gear} alt="Engrenagem" className={style.gearImg} />

                {sucesso ? (
                    <>
                        <p className={style.sucesso}>Senha atualizada com sucesso!</p>
                        <p className={style.link}>Você será redirecionado em 5 segundos...</p>
                    </>
                ) : (
                    <>
                        <p className={style.labelEsquerda}>Nova Senha:</p>
                        <input
                            type="password"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            placeholder="Digite a nova senha"
                            className={erro ? style.erroInput : ""}
                        />

                        <p className={style.labelEsquerda}>Confirmar Senha:</p>
                        <input
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            placeholder="Confirme a nova senha"
                            className={erro ? style.erroInput : ""}
                        />


                        {erro && <p className={style.erroMensagem}>{erro}</p>}

                        <BotaoLogin
                            label="Atualizar Senha"
                            variant="primary"
                            type="button"
                            onClick={handleAtualizarSenha}
                        >
                            Confirme
                        </BotaoLogin>
                    </>
                )}
            </div>
        </div >
    );
}
