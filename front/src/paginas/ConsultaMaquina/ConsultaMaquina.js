import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form, Button, Modal, Col, Row, Alert } from "react-bootstrap";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import MaquinaAPI from "../../services/maquinaAPI";
import RegistroAPI from "../../services/registroAPI";
import UsuarioAPI from "../../services/usuarioAPI";
import style from "./ConsultaMaquina.module.css";
import Table from "react-bootstrap/Table";
import GeminiAPI from "../../services/GeminiAPI";


export function ConsultaMaquina() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [maquina, setMaquina] = useState(null);



    // Carregar usuários
    const [saldoUsuario, setSaldoUsuario] = useState(0);
    const [usuarioId, setUsuarioId] = useState(null);
    const [usuarios, setUsuarios] = useState([]);

    const tipoConta = localStorage.getItem("usuarioTipo");

    const [sugestaoIA, setSugestaoIA] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const obterNomeUsuario = (usuarioId) => {
        if (!usuarios || usuarios.length === 0) return "Carregando...";
        const usuario = usuarios.find(u => u.id === usuarioId);
        return usuario ? usuario.nome : `ID ${usuarioId}`;
    };


    const [acao, setAcao] = useState("");
    const [registros, setRegistros] = useState([]);


    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [showMensagem, setShowMensagem] = useState(false);

    const comandosDisponiveis = [
        "Ligar",
        "Desligar",
        "Enviar Pulso",
        "Ligar Led",
        "Trocar Canal",
        "Acender",
        "Apagar",
        "Fechar",
        "Abrir",
        "Reiniciar",
        "Tocar"
    ];

    const formatarStatus = (status) => {
        switch (status) {
            case 1: return "Online";
            case 2: return "Offline";
            case 3: return "Manutenção";
            case 4: return "Desligado";
            default: return "Não especificado";
        }
    };

    const formatarStatusUtilizacao = (status) => {
        switch (status) {
            case 1: return "Livre";
            case 2: return "EmUso";
            case 3: return "Efetivada";
            case 4: return "NaoEfetivada";
            case 5: return "ErroNaUtilizacao";
            case 6: return "SaldoEstornado";
            default: return "Não especificado";
        }
    };


    useEffect(() => {
        if (maquina?.id) {
            carregarUltimaSugestao();
        }
    }, [maquina]);

    const carregarUltimaSugestao = async () => {
        try {
            const sugestoes = await GeminiAPI.listarSugestoesMaquinaAsync(maquina.id);
            if (sugestoes.length > 0) {
                const ultima = sugestoes[sugestoes.length - 1];
                setSugestaoIA(ultima);
            }
        } catch (e) {
            console.error('Erro ao carregar sugestões da IA', e);
        }
    };

    const gerarSugestao = async () => {
        try {
            setCarregando(true);
            setMensagem('');

            const sugestoes = await GeminiAPI.listarSugestoesMaquinaAsync(maquina.id);

            if (sugestoes.length > 0) {
                const ultima = sugestoes[sugestoes.length - 1];
                const dataUltima = new Date(ultima.dataHora);
                const agora = new Date();

                const diffEmHoras = (agora - dataUltima) / (1000 * 60 * 60);

                if (diffEmHoras < 24) {
                    const horasRestantes = Math.ceil(24 - diffEmHoras);
                    setMensagem(`Já existe uma sugestão. Você poderá gerar uma nova em aproximadamente ${horasRestantes}h.`);
                    setSugestaoIA(ultima);
                    return;
                }
            }

            await GeminiAPI.gerarSugestaoParaMaquinaAsync(maquina.id);
            const novas = await GeminiAPI.listarSugestoesMaquinaAsync(maquina.id);

            if (novas.length > 0) {
                const ultimaNova = novas[novas.length - 1];
                setSugestaoIA(ultimaNova);
                setMensagem('Sugestão gerada com sucesso!');
            }

        } catch (error) {
            console.error('Erro ao gerar sugestão:', error);
            setMensagem('Erro ao gerar sugestão da IA. Tente novamente mais tarde.');
        } finally {
            setCarregando(false);
        }
    };


    useEffect(() => {
        async function fetchMaquina() {
            try {
                const dados = await MaquinaAPI.obterAsync(id);
                console.log("Dados da máquina recebidos:", dados);
                setMaquina(dados);

                const usuariosData = await UsuarioAPI.listarAsync(true);
                setUsuarios(usuariosData);

                await carregarRegistrosDaMaquina();
            } catch (e) {
                setMensagem("Erro ao carregar máquina.");
                setTipoMensagem("erro");
                setShowMensagem(true);
            }
        }

        fetchMaquina();
    }, [id]);


    const carregarRegistrosDaMaquina = async () => {
        try {
            const lista = await RegistroAPI.listarPorMaquinaAsync(id);
            console.log("Dados de registro da máquina recebidos:", lista);
            setRegistros(lista);
        } catch (error) {
            console.error("Erro ao carregar registros:", error);
        }
    };

    const enviarComando = async () => {
        try {
            await MaquinaAPI.enviarComandoAsync(maquina.macAddress, acao);

            setMensagem("Comando enviado com sucesso!");
            setTipoMensagem("sucesso");
            setShowMensagem(true);

            await carregarRegistrosDaMaquina();

        } catch (e) {
            console.error("Erro ao enviar comando", e);
            setMensagem("Erro ao enviar comando.");
            setTipoMensagem("erro");
            setShowMensagem(true);
        }
    };



    const formatarData = (data) => {
        if (!data) return "Não especificada";
        return new Date(data).toLocaleString("pt-BR");
    };

    if (!maquina) return <p>Carregando...</p>;





    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>

                <div className={style.container}>
                    <div
                        className={style.card_maquina}

                        onClick={() => {
                            const tipoConta = localStorage.getItem("usuarioTipo");

                            if (tipoConta === "Master" || tipoConta === "Usuario") {
                                navigate("/maquinas");
                            } else if (tipoConta === "Coordenador") {
                                navigate("/estabelecimentosCoordenador");
                            }
                        }}

                        style={{ cursor: "pointer" }}
                    >
                        <h5><strong>{maquina.tipoDispositivo}</strong></h5>
                        <p><strong>IP:</strong> {maquina.ip}</p>
                        <p><strong>MAC:</strong> {maquina.macAddress}</p>
                        <p><strong>Status:</strong> {formatarStatus(maquina.statusDispositivo)}</p>
                        <p><strong>Utilização:</strong> {formatarStatusUtilizacao(maquina.statusUtilizacao)}</p>
                        <p><strong>Estabelecimento:</strong> {maquina.estabelecimentoNome}</p>
                        <p><strong>Ativo:</strong> {maquina.ativo ? "Sim" : "Não"}</p>
                        <p><strong>1ª Ativação:</strong> {formatarData(maquina.primeiraAtivacao)}</p>
                        <p><strong>Última Atualização:</strong> {formatarData(maquina.ultimaAtualizacao)}</p>

                    </div>

                    <div className={style.card_comando}>
                        <Form.Group className="mb-3">
                            <Form.Label>Comandos disponíveis</Form.Label>
                            <div className={style.linhaComando}>
                                <Form.Select
                                    name="comandos"
                                    value={acao}
                                    onChange={(e) => setAcao(e.target.value)}
                                    className={style.selectComando}
                                >
                                    <option value="">Selecione um comando</option>
                                    {comandosDisponiveis.map((comando, index) => (
                                        <option key={index} value={comando}>
                                            {comando}
                                        </option>
                                    ))}
                                </Form.Select>

                                <Button
                                    onClick={enviarComando}
                                    disabled={!acao}
                                    className={style.botaoComando}
                                >
                                    Enviar
                                </Button>
                            </div>
                        </Form.Group>

                        {/* Bloco de informações da IA */}
                        <div className={style.informacoesIa}>

                            <p><strong>Disco:</strong> {sugestaoIA?.disco} GB</p>
                            <p><strong>Memória:</strong> {sugestaoIA?.memoria} GB</p>

                            <Button onClick={gerarSugestao} disabled={carregando}>
                                {carregando ? 'Gerando...' : 'Sugestão da IA'}
                            </Button>

                            {sugestaoIA && (
                                <div className="mt-3">
                                    <h5>🔍 Informações da IA:</h5>
                                    <p>{sugestaoIA?.tipoInsight || 'Sem detalhes'}</p>
                                </div>
                            )}

                            {mensagem && <Alert variant="info">{mensagem}</Alert>}
                            
                            <p><strong>Gerado em:</strong> {new Date(sugestaoIA?.dataGeracao).toLocaleString()}</p>
                        </div>
                    </div>

                </div>

                <div className={style.tabela}>
                    <h5>Registros da Máquina</h5>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Usuário</th>
                                <th>Data/Hora</th>
                                <th>Status</th>
                                <th>Valor Cobrado</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.length === 0 ? (
                                <tr>
                                    <td colSpan="3">Nenhum registro encontrado.</td>
                                </tr>
                            ) : (
                                registros.map((reg, index) => (
                                    <tr key={index}>
                                        <td>{obterNomeUsuario(reg.usuarioId)}</td>
                                        <td>{new Date(reg.dataHora).toLocaleString("pt-BR")}</td>
                                        <td>{formatarStatus(reg.status)}</td>
                                        <td>R$ {reg.valorCobrado.toFixed(2)}</td>
                                        <td>{reg.acaoRealizada}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            <MensagemModal
                show={showMensagem}
                onClose={() => setShowMensagem(false)}
                titulo={tipoMensagem === "sucesso" ? "Sucesso" : "Erro"}
                mensagem={mensagem}
                tipo={tipoMensagem}
            />
        </Sidebar>
    );
}
