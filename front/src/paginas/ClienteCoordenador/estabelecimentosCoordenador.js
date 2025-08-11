import { useEffect, useState } from "react";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import Form from "react-bootstrap/Form";
import { Table, Modal, Button } from "react-bootstrap";
import { MdEdit, MdDelete, MdRemoveRedEye } from "react-icons/md";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import BotaoNovo from "../../componentes/BotaoNovo/BotaoNovo";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
import EstabelecimentoAPI from "../../services/estabelecimentoAPI";
import { traduzirTipoConta } from "../../utils/tipoContaHelper";
import style from "./Estabelecimento.module.css";
import UsuarioAPI from "../../services/usuarioAPI";
import maquinaAPI from "../../services/maquinaAPI";

export function EstabelecimentosCoordenador() {

    const navigate = useNavigate();
    const [busca, setBusca] = useState("");

    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [showMensagem, setShowMensagem] = useState(false);

    const [coordenadores, setCoordenadores] = useState([]);
    const [maquinas, setMaquinas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    // const [usuariosTipo, setUsuariosTipo] = useState([]);
    const [usuariosResponsaveis, setUsuariosResponsaveis] = useState([]);
    const [usuariosVinculados, setUsuariosVinculados] = useState([]);


    const [todosUsuarios, setTodosUsuarios] = useState([]);

    // useEffect(() => {
    //     const carregarDadosDoEstabelecimento = async () => {
    //         const estabelecimentoId = localStorage.getItem("estabelecimentoId");
    //         if (!estabelecimentoId) return;

    //         try {
    //             const [est, maquinasAPI, todosUsuariosAPI] = await Promise.all([
    //                 EstabelecimentoAPI.obterAsync(estabelecimentoId),
    //                 maquinaAPI.listarPorEstabelecimentoAsync(estabelecimentoId),
    //                 UsuarioAPI.listarAsync(true)
    //             ]);

    //             setEstabelecimentos([est]);
    //             setMaquinas(maquinasAPI);

    //             // Separar usuários
    //             const responsaveis = todosUsuariosAPI.filter(
    //                 u => (u.tipoConta === 1 || u.tipoConta === 2) && u.estabelecimentoId === parseInt(estabelecimentoId)
    //             );

    //             const vinculados = todosUsuariosAPI.filter(
    //                 u => u.tipoConta === 3 && u.estabelecimentoId === parseInt(estabelecimentoId)
    //             );

    //             setUsuariosResponsaveis(responsaveis);
    //             setUsuariosVinculados(vinculados);

    //         } catch (error) {
    //             console.error("Erro ao carregar dados:", error);
    //         }
    //     };

    //     carregarDadosDoEstabelecimento();
    // }, []);


    useEffect(() => {
        const carregarDadosDoEstabelecimento = async () => {
            const estabelecimentoId = localStorage.getItem("estabelecimentoId");
            if (!estabelecimentoId) return;

            try {
                const [est, maquinasAPI, todosUsuariosAPI] = await Promise.all([
                    EstabelecimentoAPI.obterAsync(estabelecimentoId),
                    maquinaAPI.listarPorEstabelecimentoAsync(estabelecimentoId),
                    UsuarioAPI.listarAsync(true)
                ]);

                setEstabelecimentos([est]);
                setMaquinas(maquinasAPI);


                // Separar usuários
                const coordenadores = todosUsuariosAPI.filter(
                    // u => (u.tipoConta === 1 || u.tipoConta === 2) && u.estabelecimentoId === parseInt(estabelecimentoId)
                    u => (u.tipoConta === 2) && u.estabelecimentoId === parseInt(estabelecimentoId)
                );

                const responsaveis = coordenadores.length > 0
                    ? coordenadores
                    : vinculados.filter(u => u.tipoConta === 1);


                const vinculados = todosUsuariosAPI.filter(
                    u => (u.tipoConta === 1 || u.tipoConta === 2 || u.tipoConta === 3) && u.estabelecimentoId === parseInt(estabelecimentoId)
                );

                setUsuariosResponsaveis(responsaveis);
                setUsuariosVinculados(vinculados);

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };

        carregarDadosDoEstabelecimento();
    }, []);

    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [usuarioVisualizar, setUsuarioVisualizar] = useState(null);
    const [mostrarModalVisualizacao, setMostrarModalVisualizacao] = useState(false);


    const usuariosFiltrados = usuarios.filter(u =>
        u.nome.toLowerCase().includes(busca.toLowerCase())
    );


    const tipoUsuarioLogado = localStorage.getItem("usuarioTipo");
    const tipoConta = localStorage.getItem("usuarioTipo");
    const usuariosPorPagina = 10;
    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
    const [paginaAtual, setPaginaAtual] = useState(1);

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

    const formatarData = (data) => {
        if (!data) return "Não especificada";
        const d = new Date(data);
        return d.toLocaleString("pt-BR", {
            day: "2-digit",
            monli: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };


    useEffect(() => {
        const carregarDadosDoEstabelecimento = async () => {
            const estabelecimentoId = localStorage.getItem("estabelecimentoId");

            if (!estabelecimentoId) {
                console.warn("Coordenador não está vinculado a um estabelecimento.");
                setEstabelecimentos([]);
                return;
            }

            try {
                const [est, coordenadores, maquinas, todosUsuarios] = await Promise.all([
                    EstabelecimentoAPI.obterAsync(estabelecimentoId),
                    UsuarioAPI.listarPorEstabelecimentoAsync(estabelecimentoId, 1), // Coordenadores
                    maquinaAPI.listarPorEstabelecimentoAsync(estabelecimentoId),
                    UsuarioAPI.listarAsync(true) // Todos ativos
                ]);

                setEstabelecimentos([est]);
                setCoordenadores(coordenadores);
                setMaquinas(maquinas);

                const usuariosComuns = todosUsuarios.filter(
                    u => (u.tipoConta === 1 || u.tipoConta === 2) && u.estabelecimentoId === parseInt(estabelecimentoId)
                    // u => (u.tipoConta === 2) && u.estabelecimentoId === parseInt(estabelecimentoId)
                );
                setUsuarios(usuariosComuns);

            } catch (error) {
                console.error("Erro ao carregar os dados do coordenador", error);
            }
        };

        carregarDadosDoEstabelecimento();
    }, []);


    const estabelecimentosFiltrados = estabelecimentos.filter(e =>
        e.ativo || e.Telefone || e.Telefone !== ""
    );


    const alternarStatusEstabelecimento = async (est) => {
        try {
            const atualizado = { ...est, ativo: !est.ativo };
            await EstabelecimentoAPI.atualizarAsync(atualizado);
            setEstabelecimentos((prev) =>
                prev.map((e) => (e.id === est.id ? atualizado : e))
            );
        } catch (error) {
            console.error("Erro ao atualizar status do estabelecimento:", error);
        }
    };

    const alternarStatusMaquina = async (m) => {
        try {
            const atualizado = { ...m, ativo: !m.ativo };
            await maquinaAPI.atualizarAsync(atualizado);
            setMaquinas((prev) =>
                prev.map((maq) => (maq.id === m.id ? atualizado : maq))
            );
        } catch (error) {
            console.error("Erro ao atualizar status da máquina:", error);
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

    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>
                <div className={style.pagina_cabecalho}>

                    <h3>Meu Estabelecimento</h3>

                    <div className={style.cards_container}>
                        {estabelecimentosFiltrados.map(est => (
                            <div
                                key={est.id}
                            >
                                <button
                                    className={style.botao_status_loja}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        alternarStatusEstabelecimento(est);
                                    }}
                                >
                                    {est.ativo ? "Desativar Estabelecimento" : "Ativar Estabelecimento"}
                                </button>
                            </div>
                        ))}
                    </div>

                    {estabelecimentosFiltrados.map(est => (
                        <div
                            key={est.id}
                        >
                            <BotaoNovo
                                onClick={(e) => {
                                    navigate("/estabelecimento/editar", { state: est.id });
                                }}
                            >
                                Editar Estabelecimento
                            </BotaoNovo>
                        </div>
                    ))}
                </div>

                <div className={style.tabela}>
                    <div className={style.pagina_cabecalho}>
                        {estabelecimentosFiltrados.map(est => (

                            <div
                                key={est.id}
                                className={`${style.card_estabelecimento}
                                            ${est.ativo ? style.ativo : style.inativo}
                                `}
                                onClick={() => navigate("/estabelecimentos")}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={style.filtros}>
                                    {estabelecimentos.length > 0 && estabelecimentos.map(est => (
                                        <div key={est.id}>
                                            <h3>{est.nome}</h3>
                                            <p><strong>Status da Loja:</strong> {est.ativo ? "Ativa" : "Inativa"}</p>
                                            <p><strong>Endereço:</strong> {est.Endereço || est.endereco || "N/A"}</p>
                                            <p><strong>Telefone:</strong> {est.Telefone || est.telefone || "N/A"}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className={style.card_estabelecimento}>
                            <h5>Responsável:</h5>
                            <ul>
                                {usuariosResponsaveis.map(usuario => (
                                    <li key={usuario.id}>
                                        <p><strong>{usuario.nome}</strong> - {usuario.ativo ? "Ativo" : "Inativo"}</p>
                                        <p><strong>Email:</strong> {usuario.email}</p>
                                        <p><strong>Tipo:</strong> {traduzirTipoConta(usuario.tipoConta)}</p>
                                        <p><strong>Estabelecimento:</strong> {usuario.nomeEstabelecimento}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>


                        <div className={style.card_estabelecimento}>
                            <h5>Máquinas:</h5>
                            <ul>
                                {maquinas.map(maq => (
                                    <li key={maq.id}>
                                        <strong>{maq.tipoDispositivo}</strong> ({maq.ativo ? "Ativo" : "Inativo"})</li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    <div className={style.lista_cards}>
                        {maquinas.map((m, i) => (
                            <div key={i} className={`${style.card_maquina} ${m.ativo ? style.ativo : style.inativo}`}
                                onClick={() => m.ativo && navigate(`/maquina/consulta/${m.id}`)}
                            >
                                <h5><strong>{m.tipoDispositivo || "Dispositivo"}</strong></h5>
                                <p><strong>IP:</strong> {m.ip || "Não especificado"}</p>
                                <p><strong>MAC:</strong> {m.macAddress}</p>
                                <p><strong>Status do dispositivo:</strong> {formatarStatus(m.statusDispositivo)}</p>
                                <p><strong>Status de utilização:</strong> {formatarStatusUtilizacao(m.statusUtilizacao)}</p>
                                <p><strong>Estabelecimento:</strong> {m.estabelecimentoNome || "Não especificado"}</p>

                                <p>
                                    <strong>Status:</strong>
                                    <button
                                        className={style.botao_status_maquina}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            alternarStatusMaquina(m);
                                        }}
                                    >
                                        {m.ativo ? "Desativar" : "Ativar"}
                                    </button>
                                </p>

                                <p><strong>1ª Ativação:</strong> {m.primeiraAtivacao ? formatarData(m.primeiraAtivacao) : "Não especificada"}</p>
                                <p><strong>Última Ativação:</strong> {formatarData(m.ultimaAtualizacao)}</p>

                                <div className={style.acoes}>
                                    <Link to="/maquinas/editar"
                                        state={m.id}
                                        onClick={(e) => e.stopPropagation()}
                                        className={style.botao_editar}
                                    >
                                        <MdEdit />
                                    </Link>

                                    <Link onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickDeletar(m);
                                    }}
                                        className={style.botao_deletar}
                                    >
                                        <MdDelete />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>



                    <Form.Group className="mb-3">

                        <h3>Usuários Vinculados:</h3>

                        <Table responsive>
                            <thead className={style.tabela_cabecalho}>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Tipo</th>
                                    <th>Status</th>
                                    <th className={style.cabecalho_tabela_usuarios}>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {usuariosVinculados
                                    .filter(u => u.nome.toLowerCase().includes(busca.toLowerCase()))
                                    .map(usuario => (
                                        <tr key={usuario.id}>
                                            <td>{usuario.nome}</td>
                                            <td>{usuario.email}</td>
                                            <td>{traduzirTipoConta(usuario.tipoConta)}</td>
                                            <td>{usuario.ativo ? "Ativo" : "Inativo"}</td>

                                            <td className={style.registros_tabela_usuarios}>
                                                <Link onClick={() => {
                                                    setUsuarioVisualizar(usuario);
                                                    setMostrarModalVisualizacao(true);
                                                }}
                                                    className={style.botao_icone}
                                                >
                                                    <MdRemoveRedEye />
                                                </Link>

                                                <Link to="/usuario/editar"
                                                    state={usuario.id}
                                                    className={style.botao_editar}
                                                >
                                                    <MdEdit />
                                                </Link>

                                                <Link onClick={() =>
                                                    handleClickDeletar(usuario)}
                                                    className={style.botao_deletar}
                                                >
                                                    <MdDelete />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </Form.Group>

                </div>
            </div>
        </Sidebar>
    );
}
