import { useEffect, useState } from "react";
import { Table, Modal, Button, Row, Col } from "react-bootstrap";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import BotaoNovo from "../../componentes/BotaoNovo/BotaoNovo";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
import RegistroAPI from "../../services/registroAPI";
import style from "./Registros.module.css";
import { Link, useNavigate } from "react-router-dom";
import UsuarioAPI from "../../services/usuarioAPI";
import MaquinaAPI from "../../services/maquinaAPI";
import Form from "react-bootstrap/Form";
import Select from "react-select";



export function Registros() {

    const navigate = useNavigate();

    const [registros, setRegistros] = useState([]);
    const [buscaUsuario, setBuscaUsuario] = useState("");
    const [buscaMaquina, setBuscaMaquina] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [maquinas, setMaquinas] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);

    const [registroVisualizar, setRegistroVisualizar] = useState(null);
    const [mostrarModalVisualizacao, setMostrarModalVisualizacao] = useState(false);
    const [showMensagem, setShowMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");

    const registrosFiltrados = registros.filter(r =>
        (!usuarioSelecionado || r.usuarioId === usuarioSelecionado.value) &&
        (!maquinaSelecionada || r.maquinaId === maquinaSelecionada.value)
    );

    const registrosPorPagina = 10;
    const totalPaginas = Math.ceil(registrosFiltrados.length / registrosPorPagina);
    const [paginaAtual, setPaginaAtual] = useState(1);



    const carregarRegistros = async () => {
        try {
            const lista = await RegistroAPI.listarAsync();
            setRegistros(lista);
        } catch (error) {
            console.error("Erro ao carregar registros:", error);
        }
    };


    const opcoesUsuarios = usuarios.map(u => ({
        value: u.id,
        label: u.nome
    }));

    const opcoesMaquinas = maquinas.map(m => ({
        value: m.id,
        label: m.tipoDispositivo || `Máquina ${m.id}`
    }));

    useEffect(() => {
        setPaginaAtual(1);
    }, [usuarioSelecionado, maquinaSelecionada]);


    useEffect(() => {
        async function carregarTudo() {
            try {
                const [registrosLista, usuariosLista, maquinasLista] = await Promise.all([
                    RegistroAPI.listarAsync(),
                    UsuarioAPI.listarAsync(true),
                    MaquinaAPI.listarAsync(true)
                ]);

                setRegistros(registrosLista);
                setUsuarios(usuariosLista);
                setMaquinas(maquinasLista);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        }

        carregarTudo();
    }, []);

    const obterNomeUsuario = (id) => {
        const usuario = usuarios.find(u => u.id === id);
        return usuario ? usuario.nome : `ID ${id}`;
    };

    const obterNomeMaquina = (id) => {
        const maquina = maquinas.find(m => m.id === id);
        return maquina ? maquina.tipoDispositivo : `ID ${id}`;
    };

    const formatarStatus = (status) => {
        switch (status) {
            case 1: return "Online";
            case 2: return "Erro";
            case 3: return "Aguardando";
            case 4: return "Off";
            default: return "Desconhecido";
        }
    };

    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>

                <Form.Group className="mb-3">
                    <div className={style.pagina_cabecalho}>
                        <h3>Registros de Utilização Geral</h3>
                    </div>
                </Form.Group>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <div className={style.filtros}>
                                <Select
                                    options={opcoesUsuarios}
                                    value={usuarioSelecionado}
                                    onChange={setUsuarioSelecionado}
                                    isClearable
                                    placeholder="Busca por nome do usuário..."
                                    className={style.input_busca}
                                />
                                <Select
                                    options={opcoesMaquinas}
                                    value={maquinaSelecionada}
                                    onChange={setMaquinaSelecionada}
                                    isClearable
                                    placeholder="Busca por nome da máquina..."
                                    className={style.input_busca}
                                    
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <div className={style.tabela}>
                    <Table responsive>
                        
                        <thead className={style.tabela_cabecalho}>
                            <tr>
                                <th>Usuário</th>
                                <th>Máquina</th>
                                <th>Data/Hora</th>
                                <th>Ação Realizada</th>
                                <th>Status</th>
                                <th className={style.cabecalho_tabela_usuarios} >Valor Cobrado</th>

                            </tr>
                        </thead>

                        <tbody>
                            {registrosFiltrados
                                .slice((paginaAtual - 1) * registrosPorPagina, paginaAtual * registrosPorPagina)
                                .map((reg, index) => {
                                    return (
                                        <tr key={reg.id || `registro-${index}`}>
                                            <td>{obterNomeUsuario(reg.usuarioId)}</td>
                                            <td>{obterNomeMaquina(reg.maquinaId)}</td>
                                            <td>{new Date(reg.dataHora).toLocaleString()}</td>
                                            <td>{reg.acaoRealizada || "—"}</td>
                                            <td>{formatarStatus(reg.status)}</td>
                                            <td className={style.cabecalho_tabela_usuarios} >R$ {reg.valorCobrado.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
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

                {/* Modal de visualização */}
                <Modal
                    show={mostrarModalVisualizacao}
                    onHide={() => setMostrarModalVisualizacao(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Visualizar Registro</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {registroVisualizar && (
                            <>
                                {/* <p><strong>ID:</strong> {registroVisualizar.id}</p> */}
                                <p><strong>Usuário:</strong> {registroVisualizar.usuarioId}</p>
                                <p><strong>Máquina:</strong> {registroVisualizar.maquinaId}</p>
                                <p><strong>Data/Hora:</strong> {new Date(registroVisualizar.dataHora).toLocaleString()}</p>
                                <p><strong>Status:</strong> {formatarStatus(registroVisualizar.status)}</p>
                                <p><strong>Valor Cobrado:</strong> R$ {registroVisualizar.valorCobrado.toFixed(2)}</p>
                            </>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setMostrarModalVisualizacao(false)}>Fechar</Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal de mensagens */}
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
