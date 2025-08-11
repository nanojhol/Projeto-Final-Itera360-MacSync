import { useEffect, useState } from "react";
import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
import LogDeAcaoAPI from "../../services/LogDeAcaoAPI";
import UsuarioAPI from "../../services/usuarioAPI";
import Select from "react-select";
import style from "./LogDeAcao.module.css";
import { Link, } from "react-router-dom";
import { MdRemoveRedEye } from "react-icons/md";

export function LogDeAcao() {
    const [logs, setLogs] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [entidadeSelecionada, setEntidadeSelecionada] = useState("");

    const [logVisualizar, setLogVisualizar] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalVisualizacao, setMostrarModalVisualizacao] = useState(false);
    const [showMensagem, setShowMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");

    const logsFiltrados = logs.filter((log) =>
        (!usuarioSelecionado || log.usuarioId === usuarioSelecionado.value) &&
        (!entidadeSelecionada || log.entidadeAfetada.toLowerCase().includes(entidadeSelecionada.toLowerCase()))
    );

    const opcoesUsuarios = usuarios.map((u) => ({
        value: u.id,
        label: u.nome
    }));

    const logsPorPagina = 10;
    const [paginaAtual, setPaginaAtual] = useState(1);
    const totalPaginas = Math.ceil(logsFiltrados.length / logsPorPagina);


    useEffect(() => {
        setPaginaAtual(1);
    }, [usuarioSelecionado, entidadeSelecionada]);

    useEffect(() => {
        async function carregarDados() {
            try {
                const [logsData, usuariosData] = await Promise.all([
                    LogDeAcaoAPI.listarAsync(),
                    UsuarioAPI.listarAsync(true),
                ]);
                setLogs(logsData);
                setUsuarios(usuariosData);
            } catch (error) {
                setMensagem("Erro ao carregar logs.");
                setTipoMensagem("erro");
                setShowMensagem(true);
                console.error(error);
            }
        }

        carregarDados();
    }, []);


    const obterNomeUsuario = (id) => {
        const usuario = usuarios.find((u) => u.id === id);
        return usuario ? usuario.nome : `ID ${id}`;
    };

    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>

                <Form.Group className="mb-3">
                    <div className={style.pagina_cabecalho}>
                        <h3>Logs de Ação</h3>
                    </div>
                </Form.Group>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-1">

                            <div className={style.filtros}>
                                <Col md={5}>

                                    <Select
                                        options={opcoesUsuarios}
                                        value={usuarioSelecionado}
                                        onChange={setUsuarioSelecionado}
                                        isClearable
                                        placeholder="Busca por usuário..."
                                        className={style.input_busca}
                                    />
                                </Col>
                                
                                <Col md={6}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Busca por entidade..."
                                        value={entidadeSelecionada}
                                        onChange={(e) => setEntidadeSelecionada(e.target.value)}
                                        className={style.input_busca}
                                    />
                                </Col>
                            </div>

                        </Form.Group>
                    </Col>
                </Row>

                <div className={style.tabela}>
                    <Table responsive>

                        <thead className={style.tabela_cabecalho}>
                            <tr>
                                <th>Usuário</th>
                                <th>evento</th>
                                <th>Entidade</th>
                                {/* <th>ID Entidade</th> */}
                                <th>Data/Hora</th>
                                <th className={style.cabecalho_tabela_usuarios}>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logsFiltrados
                                .slice((paginaAtual - 1) * logsPorPagina, paginaAtual * logsPorPagina)
                                .map((log) => (

                                    <tr key={log.id}>
                                        <td>{obterNomeUsuario(log.usuarioId)}</td>
                                        <td>{log.acao}</td>
                                        <td>{log.entidadeAfetada}</td>
                                        <td>{new Date(log.dataHora).toLocaleString()}</td>

                                        <td className={style.cabecalho_tabela_usuarios}>
                                            <button onClick={() => {
                                                setLogVisualizar(log);
                                                setMostrarModalVisualizacao(true);
                                            }} className={style.botao_icone}>
                                                <MdRemoveRedEye />
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

                <Modal show={mostrarModalVisualizacao}
                    onHide={() => setMostrarModalVisualizacao(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Detalhes do Log</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {logVisualizar && (
                            <>
                                <p><strong>Usuário:</strong> {obterNomeUsuario(logVisualizar.usuarioId)}</p>
                                <p><strong>Ação:</strong> {logVisualizar.acao}</p>
                                <p><strong>Entidade:</strong> {logVisualizar.entidadeAfetada}</p>
                                <p><strong>ID Entidade:</strong> {logVisualizar.entidadeIdAfetada}</p>
                                {logVisualizar.descricaoDetalhada && (
                                    <p><strong>Descrição:</strong> {logVisualizar.descricaoDetalhada}</p>
                                )}
                                <p><strong>Data/Hora:</strong> {new Date(logVisualizar.dataHora).toLocaleString()}</p>
                            </>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <MensagemModal
                    show={showMensagem}
                    onClose={() => setShowMensagem(false)}
                    titulo={tipoMensagem === "erro" ? "Erro" : "Sucesso"}
                    mensagem={mensagem}
                    tipo={tipoMensagem}
                />
            </div>
        </Sidebar >
    );
}
