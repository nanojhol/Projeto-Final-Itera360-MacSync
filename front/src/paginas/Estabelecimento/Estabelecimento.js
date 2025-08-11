import { useEffect, useState } from "react";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import { Table, Modal, Button } from "react-bootstrap";
import { MdEdit, MdDelete } from "react-icons/md";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import BotaoNovo from "../../componentes/BotaoNovo/BotaoNovo";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
import EstabelecimentoAPI from "../../services/estabelecimentoAPI";
import style from "./Estabelecimento.module.css";

export function Estabelecimentos() {

    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [busca, setBusca] = useState("");

    const location = useLocation();
    const estabelecimentoId = location.state;
    const { id } = useParams();

    const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [showMensagem, setShowMensagem] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        carregarEstabelecimentos();
    }, []);

    const carregarEstabelecimentos = async () => {
        try {
            const lista = await EstabelecimentoAPI.listarAsync(true);
            setEstabelecimentos(lista);
        } catch (error) {
            console.error("Erro ao carregar estabelecimentos", error);
        }
    };

    const estabelecimentosFiltrados = estabelecimentos.filter(e =>
        e.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const handleDeletar = async () => {
        try {
            await EstabelecimentoAPI.deletarAsync(estabelecimentoSelecionado.id);
            setEstabelecimentos(prev => prev.filter(e => e.id !== estabelecimentoSelecionado.id));
            setMensagem("Estabelecimento deletado com sucesso!");
            setTipoMensagem("sucesso");
        } catch {
            setMensagem("Erro ao deletar estabelecimento.");
            setTipoMensagem("erro");
        } finally {
            setShowMensagem(true);
            setMostrarModal(false);
        }
    };

    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>
                <div className={style.pagina_cabecalho}>
                    <h3>Estabelecimentos</h3>
                    <BotaoNovo label="Novo" onClick={() => navigate("/estabelecimento/novo")} >
                        Novo
                    </BotaoNovo>
                </div>

                <div className={style.filtros}>
                    <input
                        type="text"
                        placeholder="Buscar estabelecimento..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className={style.input_busca}
                    />
                    <button onClick={() => setBusca('')} className={style.botao_limpar}>✕</button>
                </div>

                <div className={style.tabela}>

                    <div className={style.cards_container}>
                        {estabelecimentosFiltrados.map(est => (
                            <div
                                key={est.id}
                                className={`${style.card_estabelecimento} 
                                            ${est.ativo ? style.ativo : style.inativo}`}
                                onClick={() => est.ativo && navigate(`/estabelecimento/consulta/${est.id}`)}
                            >
                                <h5>{est.nome}</h5>
                                <span>Status: {est.ativo ? "Ativo" : "Inativo"}</span>


                                <button
                                    className={style.botao_icone}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate("/estabelecimento/editar", { state: est.id });
                                    }}
                                >
                                    <MdEdit />
                                </button>


                                <Link
                                    className={style.botao_deletar}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEstabelecimentoSelecionado(est);
                                        setMostrarModal(true);
                                    }}
                                >
                                    <MdDelete />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal Exclusão */}
                <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar exclusão</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Deseja deletar o estabelecimento <strong>{estabelecimentoSelecionado?.nome}</strong>?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
                        <Button variant="danger" onClick={handleDeletar}>Deletar</Button>
                    </Modal.Footer>
                </Modal>

                <MensagemModal
                    show={showMensagem}
                    onClose={() => setShowMensagem(false)}
                    titulo={tipoMensagem === 'sucesso' ? 'Sucesso' : 'Erro'}
                    mensagem={mensagem}
                    tipo={tipoMensagem}
                />
            </div>
        </Sidebar>
    );
}
