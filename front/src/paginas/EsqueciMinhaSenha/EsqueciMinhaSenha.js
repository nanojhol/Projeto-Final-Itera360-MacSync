import BotaoLogin from "../../componentes/BotaoLogin/BotaoLogin";
import style from "./EsqueciMinhaSenha.module.css"; // reutilizando o estilo do login
import LoginAPI from "../../services/loginAPI";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import gear from "../../assets/gear1.png";
import Logo from "../../assets/Logo3.png";

export function EsqueciMinhaSenha() {

    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [enviado, setEnviado] = useState(false);
    const navigate = useNavigate();

    async function handleEnviar() {
        setErro("");
        setMensagem("");

        if (!email.includes("@")) {
            setErro("Digite um e-mail válido.");
            return;
        }

        try {
            await LoginAPI.recuperarSenha(email);
            setEnviado(true);
            setMensagem("Verifique seu e-mail para redefinir a senha.");
        } catch (err) {
            setErro("Erro ao enviar solicitação. Tente novamente.");
        }
    }

    useEffect(() => {
        if (enviado) {
            const timer = setTimeout(() => {
                navigate("/login");
            }, 5000);
            return () => clearTimeout(timer); // limpa caso o componente seja desmontado antes
        }
    }, [enviado, navigate]);

    return (
        <div className={style.container}>
            <div className={style.card}>

                <div className={style.logo_container}>
                    <img src={Logo} alt="Logo" className={style.logo} />
                </div>

                <img src={gear} alt="Engrenagem" className={`${style.gear} ${style.placeholder}`} />

                {!enviado ? (
                    <>
                        <p>Enviar email de recuperação</p>
                        <input
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={erro ? style.erroInput : ""}
                        />
                        {erro && <p className={style.erroMensagem}>{erro}</p>}

                        <BotaoLogin
                            label="Enviar"
                            variant="primary"
                            type="button"
                            onClick={handleEnviar}
                        >
                            Enviar...
                        </BotaoLogin>
                    </>
                ) : (
                    <>
                        {enviado ? (
                            <>
                                <p className={style.sucesso}>{mensagem}</p>
                                <p >Você será redirecionado para o login em 10 segundos...</p>
                            </>
                        ) : (
                            <>
                                <input
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={erro ? style.erroInput : ""}
                                />
                                {erro && <p className={style.erroMensagem}>{erro}</p>}

                                <BotaoLogin
                                    label="Enviar"
                                    variant="primary"
                                    type="button"
                                    onClick={handleEnviar}
                                />
                            </>
                        )}

                    </>
                )}
            </div>
        </div>
    );
}
