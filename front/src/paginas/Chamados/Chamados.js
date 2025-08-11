import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Modal, Form } from "react-bootstrap";
import Select from "react-select";

import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";

import ChamadosAPI from "../../services/chamadoAPI";
import UsuarioAPI from "../../services/usuarioAPI";
import EstabelecimentoAPI from "../../services/estabelecimentoAPI";

import style from "./Chamados.module.css";
import { MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import BotaoNovo from "../../componentes/BotaoNovo/BotaoNovo";

export function Chamado() {
    const navigate = useNavigate();

    const [chamados, setChamados] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [estabelecimentos, setEstabelecimentos] = useState([]);

    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);

    const [chamadoVisualizar, setChamadoVisualizar] = useState(null);
    const [mostrarModalVisualizacao, setMostrarModalVisualizacao] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");

    const opcoesUsuarios = usuarios.map(u => ({ value: u.id, label: u.nome }));
    const opcoesEstabelecimentos = estabelecimentos.map(e => ({ value: e.id, label: e.nome }));

    const chamadosFiltrados = chamados.filter(c =>
        (!usuarioSelecionado || c.usuarioId === usuarioSelecionado.value) &&
        (!estabelecimentoSelecionado || c.estabelecimentoId === estabelecimentoSelecionado.value)
    );
    const chamadosPorPagina = 10;
    const [paginaAtual, setPaginaAtual] = useState(1);
    const totalPaginas = Math.ceil(chamadosFiltrados.length / chamadosPorPagina);


    const carregarChamados = async () => {
        const lista = await ChamadosAPI.listarAsync();
        setChamados(lista);
    };

    const carregarUsuarios = async () => {
        const lista = await UsuarioAPI.listarAsync(true);
        setUsuarios(lista);
    };

    const carregarEstabelecimentos = async () => {
        const lista = await EstabelecimentoAPI.listarAsync(true);
        setEstabelecimentos(lista);
    };

    useEffect(() => {
        setPaginaAtual(1);
    }, [usuarioSelecionado, estabelecimentoSelecionado]);


    useEffect(() => {
        carregarChamados();
        carregarUsuarios();
        carregarEstabelecimentos();
    }, []);


    const handleEncerrar = async (id) => {
        try {
            await ChamadosAPI.encerrarAsync(id);
            setMensagem("Chamado encerrado com sucesso!");
            setTipoMensagem("sucesso");
            carregarChamados();
        } catch {
            setMensagem("Erro ao encerrar chamado.");
            setTipoMensagem("erro");
        } finally {
            setMostrarMensagem(true);
        }
    };

    const handleReativar = async (id) => {
        try {
            await ChamadosAPI.reativarAsync(id);
            setMensagem("Chamado reativado com sucesso!");
            setTipoMensagem("sucesso");
            carregarChamados();
        } catch {
            setMensagem("Erro ao reativar chamado.");
            setTipoMensagem("erro");
        } finally {
            setMostrarMensagem(true);
        }
    };

    const handleDeletar = async (id) => {
        if (!window.confirm("Tem certeza que deseja remover este chamado permanentemente?")) return;
        try {
            await ChamadosAPI.deletarAsync(id);
            setMensagem("Chamado deletado com sucesso!");
            setTipoMensagem("sucesso");
            carregarChamados();
        } catch {
            setMensagem("Erro ao deletar chamado.");
            setTipoMensagem("erro");
        } finally {
            setMostrarMensagem(true);
        }
    };

    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>

                <Form.Group>
                    <div className={style.pagina_cabecalho}>
                        <h3>Chamados de Suporte</h3>
                        <BotaoNovo label="Novo" onClick={() => navigate("/Chamado/novo")}>
                            Novo
                        </BotaoNovo>
                    </div>
                </Form.Group>

                <div className={style.filtros}>

                    <Select
                        options={opcoesUsuarios}
                        value={usuarioSelecionado}
                        onChange={setUsuarioSelecionado}
                        isClearable
                        placeholder="Filtrar por nome usuário..."
                        className={style.input_busca}
                    />

                    <Select
                        options={opcoesEstabelecimentos}
                        value={estabelecimentoSelecionado}
                        onChange={setEstabelecimentoSelecionado}
                        isClearable
                        placeholder="Filtrar por estabelecimento..."
                        className={style.input_busca}
                    />

                </div>

                <div className={style.tabela}>
                    <Table responsive>

                        <thead className={style.tabela_cabecalho}>
                            <tr>
                                <th>Usuário</th>
                                <th>Estabelecimento</th>
                                <th>Tipo</th>
                                {/* <th>Mensagem</th> */}
                                <th>Status</th>
                                {/* <th>Data</th> */}
                                <th className={style.cabecalho_tabela_usuarios}>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* {chamadosFiltrados.map((c, i) => ( */}
                            {chamadosFiltrados
                                .slice((paginaAtual - 1) * chamadosPorPagina, paginaAtual * chamadosPorPagina)
                                .map((c, i) => (

                                    <tr key={c.id || i}>
                                        <td>{usuarios.find(u => u.id === c.usuarioId)?.nome}</td>
                                        <td>{estabelecimentos.find(e => e.id === c.estabelecimentoId)?.nome}</td>
                                        <td>{c.tipo}</td>
                                        {/* <td>{c.mensagem}</td> */}

                                        <td>
                                            {c.status === "Em aberto" ? (
                                                <Button variant="outline-warning" className={style.botaoPequeno} onClick={() => handleEncerrar(c.id)}>
                                                    Encerrar
                                                </Button>
                                            ) : (
                                                <Button variant="outline-success" className={style.botaoPequeno} onClick={() => handleReativar(c.id)}>
                                                    Reativar
                                                </Button>
                                            )}
                                        </td>

                                        <td className={style.cabecalho_tabela_usuarios}>

                                            <button onClick={() => {
                                                setChamadoVisualizar(c);
                                                setMostrarModalVisualizacao(true);
                                            }} className={style.botao_icone}>
                                                <MdRemoveRedEye />
                                            </button>

                                            <Link to="/chamado/editar" state={c.id} className={style.botao_editar}>
                                                <MdEdit />
                                            </Link>


                                            <button onClick={() => handleDeletar(c.id)} className={style.botao_deletar}>
                                                <MdDelete />
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>

                    <div className={style.paginacao}>

                        <button
                            className={style.botao_paginacao}
                            onClick={() => setPaginaAtual(paginaAtual - 1)}
                            disabled={paginaAtual === 1}
                        >
                            Página anterior
                        </button>

                        <span style={{ margin: "0 10px" }}>
                            {totalPaginas > 1 ? `| ${paginaAtual} de ${totalPaginas} |` : `| ${paginaAtual} |`}
                        </span>

                        <button
                            className={style.botao_paginacao}
                            onClick={() => setPaginaAtual(paginaAtual + 1)}
                            disabled={paginaAtual >= totalPaginas}
                        >
                            Próxima página
                        </button>

                    </div>
                </div>


                <Modal
                    show={mostrarModalVisualizacao}
                    onHide={() => setMostrarModalVisualizacao(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Detalhes do Chamado</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p><strong>Usuário:</strong> {usuarios.find(u => u.id === chamadoVisualizar?.usuarioId)?.nome}</p>
                        <p><strong>Estabelecimento:</strong> {estabelecimentos.find(e => e.id === chamadoVisualizar?.estabelecimentoId)?.nome}</p>
                        <p><strong>Tipo:</strong> {chamadoVisualizar?.tipo}</p>
                        <p><strong>Mensagem:</strong> {chamadoVisualizar?.mensagem}</p>
                        <p><strong>Status:</strong> {chamadoVisualizar?.status}</p>
                        <p><strong>Data:</strong> {new Date(chamadoVisualizar?.dataCriacao).toLocaleString()}</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setMostrarModalVisualizacao(false)}>Fechar</Button>
                    </Modal.Footer>

                </Modal>

                <MensagemModal
                    show={mostrarMensagem}
                    onClose={() => setMostrarMensagem(false)}
                    titulo={tipoMensagem === "sucesso" ? "Sucesso" : "Erro"}
                    mensagem={mensagem}
                    tipo={tipoMensagem}
                    onClick={() => { if (tipoMensagem === 'sucesso') navigate('/chamados'); }}
                />
            </div>
        </Sidebar>
    );
}
