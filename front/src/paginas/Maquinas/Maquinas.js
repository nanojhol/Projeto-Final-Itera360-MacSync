import { Link } from "react-router-dom";
import FormSelect from "react-bootstrap/FormSelect";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./Maquinas.module.css";
import { MdEdit, MdDelete, MdRemoveRedEye } from "react-icons/md";
import { useState, useEffect } from "react";
import MaquinaAPI from "../../services/maquinaAPI";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import BotaoNovo from "../../componentes/BotaoNovo/BotaoNovo";
import { useNavigate } from 'react-router-dom';
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";

export function Maquinas() {

    const [maquina, setMaquina] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);
    const [busca, setBusca] = useState('');


    const [listaEstabelecimentos, setListaEstabelecimentos] = useState([]);
    const [filtroEstabelecimentoId, setFiltroEstabelecimentoId] = useState(0);

    const maquinasFiltradas = maquina.filter((m) =>
        filtroEstabelecimentoId === 0 || m.estabelecimentoId === filtroEstabelecimentoId
    );


    const [maquinaVisualizar, setMaquinaVisualizar] = useState(null);
    const [mostrarModalVisualizacao, setMostrarModalVisualizacao] = useState(false);
    const [showMensagem, setShowMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const navigate = useNavigate();



    const handleClickDeletar = (maquina) => {
        setMaquinaSelecionada(maquina)
        setMostrarModal(true);
    };

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

    function formatarData(data) {
        if (!data) return "Não especificada";
        const d = new Date(data);
        return d.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }




    const handleDeletar = async () => {
        try {
            await MaquinaAPI.deletarAsync(maquinaSelecionada.id);
            setMaquina(maquina.filter(u => u.id !== maquinaSelecionada.id));
            setMensagem("Máquina deletada com sucesso!");
            setTipoMensagem("sucesso");
            setShowMensagem(true);
            setTimeout(() => navigate('/maquinas'), 3000);
        } catch (error) {
            setMensagem("Erro ao deletar máquina.");
            setTipoMensagem("erro");
            setShowMensagem(true);
        } finally {
            handleFecharModal();
        }
    };

    const handleFecharModal = () => {
        setMostrarModal(false);
        setMaquinaSelecionada(null);
    };


    useEffect(() => {
        let intervalo;

        const carregarMaquinas = async () => {
            try {
                const resposta = await MaquinaAPI.listarAsync(true);
                setMaquina(resposta);
            } catch (error) {
                console.error("Erro ao carregar máquinas:", error);
            }
        };

        const carregarEstabelecimentos = async () => {
            try {
                const estabelecimentos = await MaquinaAPI.listarEstabelecimentosAsync();
                setListaEstabelecimentos(estabelecimentos);
            } catch (error) {
                console.error("Erro ao carregar estabelecimentos:", error);
            }
        };

        carregarMaquinas(); // carrega imediatamente
        carregarEstabelecimentos();

        // atualiza a lista a cada 10 segundos (10000 ms)
        intervalo = setInterval(() => {
            carregarMaquinas();
        }, 10000);

        // limpa o intervalo ao desmontar o componente
        return () => clearInterval(intervalo);
    }, []);



    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>
                <div className={style.pagina_cabecalho}>
                    <h3>Máquinas</h3>
                    <BotaoNovo label="Novo" onClick={() => navigate("/maquinas/nova")}>
                        Novo
                    </BotaoNovo>
                </div>
                <div className={style.filtros}>

                    <FormSelect
                        value={filtroEstabelecimentoId}
                        onChange={(e) => setFiltroEstabelecimentoId(Number(e.target.value))}
                        className={style.input_busca}
                    >
                        <option value={0}>Todos os Estabelecimentos</option>
                        {listaEstabelecimentos.map(est => (
                            <option key={est.id} value={est.id}>
                                {est.nome}
                            </option>
                        ))}
                    </FormSelect>

                </div>
                <div className={style.tabela}>

                    <div className={style.lista_cards}>

                        {maquinasFiltradas.map((m, i) => (
                            <div key={i} className={`${style.card_maquina} ${m.ativo ? style.ativo : style.inativo}`}
                                onClick={() => navigate(`/maquina/consulta/${m.id}`)}>

                                <h5><strong>{m.tipoDispositivo || "Dispositivo"}</strong></h5>
                                <p><strong>IP:</strong> {m.ip || "Não especificado"}</p>
                                <p><strong>MAC:</strong> {m.macAddress}</p>
                                <p><strong>Status do dispositivo:</strong> {formatarStatus(m.statusDispositivo)}</p>
                                <p><strong>Status de utilização:</strong> {formatarStatusUtilizacao(m.statusUtilizacao)}</p>
                                <p><strong>Estabelecimento:</strong> {m.estabelecimentoNome || "Não especificado"}</p>
                                <p><strong>Status:</strong> {m.ativo ? "Ativo" : "Inativo"}</p>
                                <p><strong>1ª Ativação:</strong> {m.primeiraAtivacao ? formatarData(m.primeiraAtivacao) : "Não especificada"}</p>
                                <p><strong>Última Ativação:</strong> {formatarData(m.ultimaAtualizacao)}</p>

                                <div className={style.acoes}>

                                    <Link
                                        to="/maquinas/editar"
                                        state={m.id}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MdEdit />
                                    </Link>


                                    <Link onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickDeletar(m);
                                    }}
                                        className={style.botao_deletar}>
                                        <MdDelete />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <Modal show={mostrarModal} onHide={handleFecharModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar exclusão</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Tem certeza que deseja deletar a máquina <strong>{maquinaSelecionada?.nome}</strong>?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleFecharModal}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleDeletar}>
                            Deletar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <MensagemModal
                    show={showMensagem}
                    onClose={() => setShowMensagem(false)}
                    titulo={tipoMensagem === 'sucesso' ? 'Sucesso' : 'Erro'}
                    mensagem={mensagem}
                    tipo={tipoMensagem}
                    onClick={() => { if (tipoMensagem === 'sucesso') navigate('/maquinas'); }}
                />
            </div>
        </Sidebar>
    );
}
