import { BsCashCoin } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Modal, Button } from "react-bootstrap";
import { MdEdit, MdDelete, MdRemoveRedEye } from "react-icons/md";

import { Topbar } from "../../componentes/Topbar/Topbar";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import BotaoNovo from "../../componentes/BotaoNovo/BotaoNovo";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";

import { traduzirTipoConta } from "../../utils/tipoContaHelper";
import UsuarioAPI from "../../services/usuarioAPI";
import style from "./Usuarios.module.css";

export function Usuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState('');
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [usuarioVisualizar, setUsuarioVisualizar] = useState(null);
    const [atualizarUsuarios, setAtualizarUsuarios] = useState(false);


    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalVisualizacao, setMostrarModalVisualizacao] = useState(false);
    const [showMensagem, setShowMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");

    const [mostrarModalCredito, setMostrarModalCredito] = useState(false);
    const [usuarioParaCreditar, setUsuarioParaCreditar] = useState(null);
    const [valorSelecionado, setValorSelecionado] = useState(0);

    const [mostrarModalDebito, setMostrarModalDebito] = useState(false);
    const [usuarioParaDebitar, setUsuarioParaDebitar] = useState(null);
    const [valorDebitoSelecionado, setValorDebitoSelecionado] = useState(0);

    const usuariosFiltrados = usuarios.filter(u =>
        u.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const usuariosPorPagina = 10;
    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
    const [paginaAtual, setPaginaAtual] = useState(1);

    const navigate = useNavigate();

    const carregarUsuarios = async () => {
        try {
            const lista = await UsuarioAPI.listarAsync(true);
            setUsuarios(lista);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }
    };

    const abrirModalCredito = (usuario) => {
        if (!usuario.ativo) {
            setMensagem("Usuário inativo não pode receber crédito.");
            setTipoMensagem("erro");
            setShowMensagem(true);
            return;
        }

        setUsuarioParaCreditar(usuario); // CORRETO
        setMostrarModalCredito(true);
    };

    const abrirModalDebito = (usuario) => {
        if (!usuario.ativo) {
            setMensagem("Usuário inativo não pode ter saldo descontado.");
            setTipoMensagem("erro");
            setShowMensagem(true);
            return;
        }

        setUsuarioParaDebitar(usuario); // CORRETO AGORA
        setMostrarModalDebito(true);
    };


    const handleEncerrar = async (id) => {
        try {
            await UsuarioAPI.desativarAsync(id);
            carregarUsuarios();
        } catch (err) {
            setMensagem("Erro ao encerrar usuário.");
            setTipoMensagem("erro");
            setShowMensagem(true);
        }
    };

    const handleReativar = async (id) => {
        try {
            await UsuarioAPI.reativarAsync(id);
            carregarUsuarios();
        } catch (err) {
            setMensagem("Erro ao reativar usuário.");
            setTipoMensagem("erro");
            setShowMensagem(true);
        }
    };


    const handleClickDeletar = (usuario) => {
        setUsuarioSelecionado(usuario);
        setMostrarModal(true);
    };

    const handleDeletar = async () => {
        try {
            await UsuarioAPI.deletarDefinitivoAsync(usuarioSelecionado.id);
            setUsuarios(prev => prev.filter(u => u.id !== usuarioSelecionado.id));
            setMensagem("Usuário deletado com sucesso!");
            setTipoMensagem("sucesso");
        } catch {
            setMensagem("Erro ao deletar usuário.");
            setTipoMensagem("erro");
        } finally {
            setShowMensagem(true);
            setMostrarModal(false);
        }
    };

    useEffect(() => {
        setPaginaAtual(1);
    }, [busca]);


    useEffect(() => {
        carregarUsuarios();
    }, [atualizarUsuarios]);

    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>
                <div className={style.pagina_cabecalho}>
                    <h3>Usuários</h3>
                    <BotaoNovo lacabel="Novo" onClick={() => navigate("/usuario/novo")}>
                        Novo
                    </BotaoNovo>
                </div>

                <div className={style.filtros}>
                    <input
                        type="text"
                        placeholder="Buscar usuário..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))}
                        maxLength={100}
                        className={style.input_busca}
                    />
                    <button onClick={() => setBusca('')} className={style.botao_limpar}>✕</button>
                </div>

                <div className={style.tabela}>
                    <Table responsive>

                        <thead className={style.tabela_cabecalho}>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th>Saldo</th>
                                <th>Creditos</th>
                                <th className={style.cabecalho_tabela_usuarios}>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {usuariosFiltrados
                                .slice((paginaAtual - 1) * usuariosPorPagina, paginaAtual * usuariosPorPagina)
                                .map(usuario => (

                                    <tr key={usuario.id}>
                                        <td>{usuario.nome}</td>
                                        <td className={style.tabela_email}>{usuario.email}</td>
                                        <td>{traduzirTipoConta(usuario.tipoConta)}</td>

                                        <td >
                                            {usuario.ativo ? (
                                                <Button
                                                    variant="outline-warning"
                                                    className={style.botaoPequeno}
                                                    onClick={() => handleEncerrar(usuario.id)}
                                                >
                                                    Encerrar
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline-success"
                                                    className={style.botaoPequeno}
                                                    onClick={() => handleReativar(usuario.id)}
                                                >
                                                    Reativar
                                                </Button>
                                            )}
                                        </td>


                                        <td className={style.Cash}>
                                            {usuario.saldo.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </td>

                                        <td className={style.cabecalho_tabela}>
                                            <button onClick={() => abrirModalCredito(usuario)} className={style.botao_credito}>
                                                <BsCashCoin size={22} style={{ color: "#22c55e" }} />
                                            </button>


                                            <button onClick={() => abrirModalDebito(usuario)} className={style.botao_debito}>
                                                <BsCashCoin size={22} style={{ color: "#ff0000" }} />
                                            </button>
                                        </td>

                                        <td className={style.cabecalho_tabela_usuarios}>
                                            <button onClick={() => {
                                                setUsuarioVisualizar(usuario);
                                                setMostrarModalVisualizacao(true);
                                            }} className={style.botao_icone}>
                                                <MdRemoveRedEye />
                                            </button>

                                            <Link to="/usuario/editar" state={usuario.id} className={style.botao_editar}>
                                                <MdEdit />
                                            </Link>

                                            <button onClick={() => handleClickDeletar(usuario)} className={style.botao_deletar}>
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

                {/* Modal Visualização */}
                <Modal
                    show={mostrarModalVisualizacao}
                    onHide={() => setMostrarModalVisualizacao(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Visualizar Usuário</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p><strong>Nome:</strong> {usuarioVisualizar?.nome}</p>
                        <p><strong>Email:</strong> {usuarioVisualizar?.email}</p>
                        <p><strong>Tipo:</strong> {traduzirTipoConta(usuarioVisualizar?.tipoConta)}</p>
                        <p><strong>Saldo:</strong> {usuarioVisualizar?.saldo}</p>
                        <p><strong>Estabelecimento:</strong> {usuarioVisualizar?.nomeEstabelecimento}</p>
                        <p><strong>Ultimo Login:</strong> {usuarioVisualizar?.ultimoLogin}</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setMostrarModalVisualizacao(false)}>Fechar</Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Confirmação Exclusão */}
                <Modal
                    show={mostrarModal}
                    onHide={() =>
                        setMostrarModal(false)}
                    centered
                >

                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar exclusão</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        Deseja deletar o usuário <strong>{usuarioSelecionado?.nome}</strong>?
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
                        <Button variant="danger" onClick={handleDeletar}>Deletar</Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Mensagem */}
                <MensagemModal
                    show={showMensagem}
                    onClose={() => setShowMensagem(false)}
                    titulo={tipoMensagem === 'sucesso' ? 'Sucesso' : 'Erro'}
                    mensagem={mensagem}
                    tipo={tipoMensagem}
                />
            </div>

            {/* Modal Compra de Creditos */}
            <Modal
                show={mostrarModalCredito}
                onHide={() =>
                    setMostrarModalCredito(false)}
                centered
            >

                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Créditos</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Escolha um valor para adicionar ao saldo de <strong>{usuarioParaCreditar?.nome}</strong>:</p>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        {[10, 20, 50, 100].map((valor) => (
                            <Button
                                key={valor}
                                variant={valorSelecionado === valor ? "success" : "outline-primary"}
                                onClick={() => setValorSelecionado(valor)}
                            >
                                R$ {valor}
                            </Button>
                        ))}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() =>
                            setMostrarModalCredito(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="success"
                        disabled={!valorSelecionado}
                        onClick={async () => {
                            try {
                                await UsuarioAPI.adicionarSaldo(usuarioParaCreditar.id, valorSelecionado);
                                setMensagem("Crédito adicionado com sucesso!");
                                setTipoMensagem("sucesso");
                                setShowMensagem(true);
                                setMostrarModalCredito(false);
                                setAtualizarUsuarios(prev => !prev); // <- Aqui é o gatilho!
                            } catch {
                                setMensagem("Erro ao adicionar saldo.");
                                setTipoMensagem("erro");
                                setShowMensagem(true);
                            }
                        }}
                    >
                        Confirmar
                    </Button>

                </Modal.Footer>
            </Modal>

            {/* Modal Debitar credito */}
            <Modal
                show={mostrarModalDebito}
                onHide={() => setMostrarModalDebito(false)}
                centered
            >

                <Modal.Header closeButton>
                    <Modal.Title>Descontar Créditos</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Escolha um valor para descontar do saldo de <strong>{usuarioParaDebitar?.nome}</strong>:</p>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        {[10, 20, 50, 100].map((valor) => (
                            <Button
                                key={valor}
                                variant={valorDebitoSelecionado === valor ? "danger" : "outline-danger"}
                                onClick={() => setValorDebitoSelecionado(valor)}
                            >
                                R$ {valor}
                            </Button>
                        ))}
                    </div>
                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={() => setMostrarModalDebito(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="danger"
                        disabled={!valorDebitoSelecionado}
                        onClick={async () => {
                            try {
                                await UsuarioAPI.descontarSaldo(usuarioParaDebitar.id, valorDebitoSelecionado);
                                setMensagem("Valor descontado com sucesso!");
                                setTipoMensagem("sucesso");
                                setShowMensagem(true);
                                setMostrarModalDebito(false);
                                setAtualizarUsuarios(prev => !prev); // <- Aqui também!
                            } catch {
                                setMensagem("Erro ao descontar saldo.");
                                setTipoMensagem("erro");
                                setShowMensagem(true);
                            }
                        }}
                    >
                        Confirmar
                    </Button>

                </Modal.Footer>
            </Modal>
        </Sidebar>
    );
}
