import { useEffect, useState } from "react";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import Form from "react-bootstrap/Form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Table, Modal, Button } from "react-bootstrap";
import { MdEdit, MdDelete, MdRemoveRedEye } from "react-icons/md";
import EstabelecimentoAPI from "../../services/estabelecimentoAPI";
import UsuarioAPI from "../../services/usuarioAPI";
import maquinaAPI from "../../services/maquinaAPI";
import { traduzirTipoConta } from "../../utils/tipoContaHelper";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
import BotaoNovo from "../../componentes/BotaoNovo/BotaoNovo";
import style from "./ConsultaEstabelecimento.module.css";

export function ConsultaEstabelecimento() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [estabelecimento, setEstabelecimento] = useState({});
    const [coordenadores, setCoordenadores] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [maquinas, setMaquinas] = useState([]);

    const [busca, setBusca] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const usuariosPorPagina = 10;

    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [usuarioVisualizar, setUsuarioVisualizar] = useState(null);

    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalVisualizacao, setMostrarModalVisualizacao] = useState(false);
    const [showMensagem, setShowMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");

    const tipoConta = parseInt(localStorage.getItem("usuarioTipo"));

    const usuariosFiltrados = usuarios.filter(u =>
        u.nome.toLowerCase().includes(busca.toLowerCase())
    );
    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

    const carregarDados = async () => {
        try {
            const [est, tipo1, tipo2, tipo3, maquinasAPI] = await Promise.all([
                EstabelecimentoAPI.obterAsync(id),
                UsuarioAPI.listarPorEstabelecimentoAsync(id, 1), // Master
                UsuarioAPI.listarPorEstabelecimentoAsync(id, 2), // Coordenador
                UsuarioAPI.listarPorEstabelecimentoAsync(id, 3), // Comum
                maquinaAPI.listarPorEstabelecimentoAsync(id),
            ]);

            setEstabelecimento(est);
            setCoordenadores([...tipo1, ...tipo2]);
            setUsuarios([...tipo1, ...tipo2, ...tipo3]);
            setMaquinas(maquinasAPI);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    };

    useEffect(() => {
        carregarDados();
    }, [id]);

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
        return d.toLocaleString("pt-BR");
    };

    const alternarStatusEstabelecimento = async () => {
        try {
            const atualizado = { ...estabelecimento, ativo: !estabelecimento.ativo };
            await EstabelecimentoAPI.atualizarAsync(atualizado);
            setEstabelecimento(atualizado);
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

                    <h3>Estabelecimento</h3>

                    <div className={style.cards_container}>

                        <button
                            className={style.botao_status_loja}
                            onClick={(e) => {
                                e.stopPropagation();
                                alternarStatusEstabelecimento()
                            }}
                        >
                            {estabelecimento?.ativo ? "Desativar Estabelecimento" : "Ativar Estabelecimento"}
                        </button>
                    </div>

                    <BotaoNovo onClick={() =>
                        navigate("/estabelecimento/editar", { state: estabelecimento.id })}
                    >
                        Editar Estabelecimento
                    </BotaoNovo>
                </div>

                <div className={style.tabela}>
                    <div className={style.pagina_cabecalho}>
                        <div
                            className={`${style.card_estabelecimento}
                                        ${estabelecimento.ativo ? style.ativo : style.inativo}`}
                            onClick={() => navigate("/estabelecimentos")}
                            style={{ cursor: 'pointer' }}
                        >

                            <div className={style.filtros}>

                                <h3>{estabelecimento?.nome}</h3>
                                <p><strong>Status:</strong> {estabelecimento?.ativo ? "Ativo" : "Inativo"}</p>
                                <p><strong>Endereço:</strong> {estabelecimento?.endereco}</p>
                                <p><strong>Telefone:</strong> {estabelecimento?.telefone}</p>
                            </div>

                        </div>

                        <div className={style.card_estabelecimento}>
                            <h5>Responsavel:</h5>

                            {coordenadores.map(coord => (
                                <p
                                    key={coord.id}
                                    onClick={() => {
                                        setUsuarioVisualizar(coord); // passa o objeto inteiro!
                                        setMostrarModalVisualizacao(true);
                                    }}
                                    style={{ cursor: "pointer", color: "blue" }}
                                >
                                    <strong>{coord.nome}</strong> - {coord.ativo ? "Ativo" : "Inativo"}
                                </p>
                            ))}

                        </div>

                        <div className={style.card_estabelecimento}>
                            <h5>Máquinas:</h5>
                            <ul>
                                {maquinas.map(m => (
                                    <li key={m.id}>
                                        <strong>{m.tipoDispositivo}</strong> ({m.ativo ? "Ativo" : "Inativo"})</li>
                                ))}
                            </ul>
                        </div>

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



                <Form.Group className="mb-1">
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
                            {usuariosFiltrados
                                .slice((paginaAtual - 1) * usuariosPorPagina, paginaAtual * usuariosPorPagina)
                                .map(usuario => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.nome}</td>
                                        <td>{usuario.email}</td>
                                        <td>{traduzirTipoConta(usuario.tipoConta)}</td>
                                        <td>{usuario.ativo ? "Ativo" : "Inativo"}</td>

                                        <td className={style.cabecalho_tabela_usuarios}>
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

                {/* Modal Visualização */}
                <Modal show={mostrarModalVisualizacao} onHide={() => setMostrarModalVisualizacao(false)} centered>
                    <Modal.Header closeButton><Modal.Title>Visualizar Usuário</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <p><strong>Nome:</strong> {usuarioVisualizar?.nome}</p>
                        <p><strong>Email:</strong> {usuarioVisualizar?.email}</p>
                        <p><strong>Tipo:</strong> {traduzirTipoConta(usuarioVisualizar?.tipoConta)}</p>
                        <p><strong>Saldo:</strong> R$ {usuarioVisualizar?.saldo?.toFixed(2)}</p>
                        <p><strong>Estabelecimento:</strong> {usuarioVisualizar?.nomeEstabelecimento}</p>
                        <p><strong>Último login:</strong> {usuarioVisualizar?.ultimoLogin}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setMostrarModalVisualizacao(false)}>Fechar</Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Exclusão */}
                <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
                    <Modal.Header closeButton><Modal.Title>Confirmar Exclusão</Modal.Title></Modal.Header>
                    <Modal.Body>Deseja deletar o usuário <strong>{usuarioSelecionado?.nome}</strong>?</Modal.Body>
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
        </Sidebar>
    );
}














// import { useEffect, useState } from "react";
// import { Sidebar } from "../../componentes/Sidebar/Sidebar";
// import { Topbar } from "../../componentes/Topbar/Topbar";
// import Form from "react-bootstrap/Form";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { Table, Modal, Button } from "react-bootstrap";
// import { MdEdit, MdDelete, MdRemoveRedEye } from "react-icons/md";
// import EstabelecimentoAPI from "../../services/estabelecimentoAPI";
// import UsuarioAPI from "../../services/usuarioAPI";
// import maquinaAPI from "../../services/maquinaAPI";
// import { traduzirTipoConta } from "../../utils/tipoContaHelper";
// import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
// import BotaoNovo from "../../componentes/BotaoNovo/BotaoNovo";
// import style from "./ConsultaEstabelecimento.module.css";

// export function ConsultaEstabelecimento() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [estabelecimento, setEstabelecimento] = useState({});
//   const [usuarios, setUsuarios] = useState([]);
//   const [maquinas, setMaquinas] = useState([]);
//   const [busca, setBusca] = useState("");
//   const [paginaAtual, setPaginaAtual] = useState(1);
//   const usuariosPorPagina = 10;

//   const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
//   const [usuarioVisualizar, setUsuarioVisualizar] = useState(null);
//   const [mostrarModal, setMostrarModal] = useState(false);
//   const [mostrarModalVisualizacao, setMostrarModalVisualizacao] = useState(false);
//   const [showMensagem, setShowMensagem] = useState(false);
//   const [mensagem, setMensagem] = useState("");
//   const [tipoMensagem, setTipoMensagem] = useState("sucesso");
//   const tipoConta = localStorage.getItem("usuarioTipo");

//   const usuariosFiltrados = usuarios.filter(u =>
//     u.nome.toLowerCase().includes(busca.toLowerCase())
//   );

//   const carregarDados = async () => {
//     try {
//       const [est, tipo1, tipo2, tipo3, maquinasAPI] = await Promise.all([
//         EstabelecimentoAPI.obterAsync(id),
//         UsuarioAPI.listarPorEstabelecimentoAsync(id, 1),
//         UsuarioAPI.listarPorEstabelecimentoAsync(id, 2),
//         UsuarioAPI.listarPorEstabelecimentoAsync(id, 3),
//         maquinaAPI.listarPorEstabelecimentoAsync(id),
//       ]);

//       setEstabelecimento(est);
//       setUsuarios([...tipo1, ...tipo2, ...tipo3]);
//       setMaquinas(maquinasAPI);
//     } catch (error) {
//       console.error("Erro ao carregar dados:", error);
//     }
//   };

//   useEffect(() => {
//     carregarDados();
//   }, [id]);

//   const formatarStatus = (status) => {
//     switch (status) {
//       case 1: return "Online";
//       case 2: return "Offline";
//       case 3: return "Manutenção";
//       case 4: return "Desligado";
//       default: return "Não especificado";
//     }
//   };

//   const formatarStatusUtilizacao = (status) => {
//     switch (status) {
//       case 1: return "Livre";
//       case 2: return "EmUso";
//       case 3: return "Efetivada";
//       case 4: return "NaoEfetivada";
//       case 5: return "ErroNaUtilizacao";
//       case 6: return "SaldoEstornado";
//       default: return "Não especificado";
//     }
//   };

//   const formatarData = (data) => {
//     if (!data) return "Não especificada";
//     const d = new Date(data);
//     return d.toLocaleString("pt-BR");
//   };

//   const alternarStatusEstabelecimento = async () => {
//     try {
//       const atualizado = { ...estabelecimento, ativo: !estabelecimento.ativo };
//       await EstabelecimentoAPI.atualizarAsync(atualizado);
//       setEstabelecimento(atualizado);
//     } catch (error) {
//       console.error("Erro ao atualizar status do estabelecimento:", error);
//     }
//   };

//   const alternarStatusMaquina = async (m) => {
//     try {
//       const atualizado = { ...m, ativo: !m.ativo };
//       await maquinaAPI.atualizarAsync(atualizado);
//       setMaquinas((prev) => prev.map((maq) => (maq.id === m.id ? atualizado : maq)));
//     } catch (error) {
//       console.error("Erro ao atualizar status da máquina:", error);
//     }
//   };

//   const handleClickDeletar = (usuario) => {
//     setUsuarioSelecionado(usuario);
//     setMostrarModal(true);
//   };

//   const handleDeletar = async () => {
//     try {
//       await UsuarioAPI.deletarDefinitivoAsync(usuarioSelecionado.id);
//       setUsuarios(prev => prev.filter(u => u.id !== usuarioSelecionado.id));
//       setMensagem("Usuário deletado com sucesso!");
//       setTipoMensagem("sucesso");
//     } catch {
//       setMensagem("Erro ao deletar usuário.");
//       setTipoMensagem("erro");
//     } finally {
//       setShowMensagem(true);
//       setMostrarModal(false);
//     }
//   };

//   return (
//     <Sidebar>
//       <Topbar />
//       <div className={style.pagina_conteudo}>
//         <div className={style.pagina_cabecalho}>
//           <h3>Estabelecimento</h3>

//           <div className={style.cards_container}>
//             <div>
//               <button className={style.botao_status_loja} onClick={alternarStatusEstabelecimento}>
//                 {estabelecimento?.ativo ? "Desativar Estabelecimento" : "Ativar Estabelecimento"}
//               </button>
//             </div>
//             <div>
//               <BotaoNovo onClick={() => navigate("/estabelecimento/editar", { state: estabelecimento.id })}>
//                 Editar Estabelecimento
//               </BotaoNovo>
//             </div>
//           </div>
//         </div>

//         <div className={style.tabela}>
//           <div className={style.pagina_cabecalho}>
//             <div
//               className={`${style.card_estabelecimento} ${estabelecimento?.ativo ? style.ativo : style.inativo}`}
//               onClick={() => navigate("/estabelecimentos")}
//               style={{ cursor: 'pointer' }}
//             >
//               <h5>{estabelecimento?.nome}</h5>
//               <p><span>Status: </span>{estabelecimento?.ativo ? "Ativo" : "Inativo"}</p>
//               <p><span>Endereço: </span>{estabelecimento?.endereco}</p>
//               <p><span>Telefone: </span>{estabelecimento?.telefone}</p>
//             </div>

//             <div className={style.card_estabelecimento}>
//               <h5>Coordenador Responsável:</h5>
//               <ul>
//                 {usuariosFiltrados.map(usuario => (
//                   <li key={usuario.id}>
//                     <p><strong>{usuario.nome}</strong> - {usuario.ativo ? "Ativo" : "Inativo"}</p>
//                     <p><strong>Email:</strong> {usuario.email}</p>
//                     <p><strong>Tipo:</strong> {traduzirTipoConta(usuario.tipoConta)}</p>
//                     {(tipoConta === "1" || tipoConta === "2") && (
//                       <p><strong>Saldo:</strong> R$ {usuario.saldo?.toFixed(2)}</p>
//                     )}
//                     <p><strong>Estabelecimento:</strong> {usuario.nomeEstabelecimento}</p>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className={style.card_estabelecimento}>
//               <h5>Máquinas:</h5>
//               <ul>
//                 {maquinas.map(maq => (
//                   <li key={maq.id}>{maq.tipoDispositivo} ({maq.ativo ? "Ativo" : "Inativo"})</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         <MensagemModal
//           show={showMensagem}
//           onClose={() => setShowMensagem(false)}
//           titulo={tipoMensagem === 'sucesso' ? 'Sucesso' : 'Erro'}
//           mensagem={mensagem}
//           tipo={tipoMensagem}
//         />
//       </div>
//     </Sidebar>
//   );
// }















// // import { useEffect, useState } from "react";
// // import { Sidebar } from "../../componentes/Sidebar/Sidebar";
// // import { Topbar } from "../../componentes/Topbar/Topbar";
// // import Form from "react-bootstrap/Form";
// // import { Link, useNavigate, useParams } from "react-router-dom";
// // import { Table, Modal, Button } from "react-bootstrap";
// // import { MdEdit, MdDelete, MdRemoveRedEye } from "react-icons/md";
// // import EstabelecimentoAPI from "../../services/estabelecimentoAPI";
// // import style from "./ConsultaEstabelecimento.module.css";
// // import UsuarioAPI from "../../services/usuarioAPI";
// // import maquinaAPI from "../../services/maquinaAPI";
// // import { traduzirTipoConta } from "../../utils/tipoContaHelper";
// // import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
// // import BotaoNovo from "../../componentes/BotaoNovo/BotaoNovo";


// // export function ConsultaEstabelecimento() {

// //     const { id } = useParams();

// //     const navigate = useNavigate();
// //     const [busca, setBusca] = useState('');

// //     const [estabelecimento, setEstabelecimento] = useState({});
// //     const [coordenadores, setCoordenadores] = useState([]);
// //     const [maquinas, setMaquinas] = useState([]);

// //     const [usuarios, setUsuarios] = useState([]);
// //     const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
// //     const [usuarioVisualizar, setUsuarioVisualizar] = useState(null);

// //     const [mostrarModal, setMostrarModal] = useState(false);
// //     const [mostrarModalVisualizacao, setMostrarModalVisualizacao] = useState(false);
// //     const [showMensagem, setShowMensagem] = useState(false);
// //     const [mensagem, setMensagem] = useState("");
// //     const [tipoMensagem, setTipoMensagem] = useState("sucesso");

// //     const usuariosFiltrados = usuarios.filter(u =>
// //         u.nome.toLowerCase().includes(busca.toLowerCase())
// //     );

// //     const tipoUsuarioLogado = localStorage.getItem("usuarioTipo");
// //     const tipoConta = localStorage.getItem("usuarioTipo");
// //     const usuariosPorPagina = 10;
// //     const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
// //     const [paginaAtual, setPaginaAtual] = useState(1);


// //     const [estabelecimentos, setEstabelecimentos] = useState([]);
// //     const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);

// //     const formatarStatus = (status) => {
// //         switch (status) {
// //             case 1: return "Online";
// //             case 2: return "Offline";
// //             case 3: return "Manutenção";
// //             case 4: return "Desligado";
// //             default: return "Não especificado";
// //         }
// //     };

// //     const formatarStatusUtilizacao = (status) => {
// //         switch (status) {
// //             case 1: return "Livre";
// //             case 2: return "EmUso";
// //             case 3: return "Efetivada";
// //             case 4: return "NaoEfetivada";
// //             case 5: return "ErroNaUtilizacao";
// //             case 6: return "SaldoEstornado";
// //             default: return "Não especificado";
// //         }
// //     };

// //     const formatarData = (data) => {
// //         if (!data) return "Não especificada";
// //         const d = new Date(data);
// //         return d.toLocaleString("pt-BR", {
// //             day: "2-digit",
// //             monli: "2-digit",
// //             year: "numeric",
// //             hour: "2-digit",
// //             minute: "2-digit"
// //         });
// //     };

// //     useEffect(() => {
// //         const carregarUsuarios = async () => {
// //             try {
// //                 const lista = await UsuarioAPI.listarAsync(true);

// //                 // Aqui filtra por tipoConta === 3 e que sejam do mesmo estabelecimento
// //                 const comunsDoEstabelecimento = lista.filter(
// //                     u => u.tipoConta === 3 && u.estabelecimentoId === parseInt(id)
// //                 );

// //                 setUsuarios(comunsDoEstabelecimento);
// //             } catch (error) {
// //                 console.error("Erro ao carregar usuários:", error);
// //             }
// //         };

// //         async function carregarDados() {
// //             try {
// //                 const [dadosEst, coordenadores, maquinas] = await Promise.all([
// //                     EstabelecimentoAPI.obterAsync(id),
// //                     UsuarioAPI.listarPorEstabelecimentoAsync(id, 1), // continua trazendo só coordenadores
// //                     maquinaAPI.listarPorEstabelecimentoAsync(id)
// //                 ]);

// //                 setEstabelecimento(dadosEst);
// //                 setCoordenadores(coordenadores);
// //                 setMaquinas(maquinas);
// //             } catch (error) {
// //                 console.error("Erro ao carregar dados:", error);
// //             }
// //         }

// //         const carregarDadosDoEstabelecimento = async () => {
// //             const estabelecimentoId = localStorage.getItem("estabelecimentoId");

// //             if (!estabelecimentoId) {
// //                 console.warn("Coordenador não está vinculado a um estabelecimento.");
// //                 setEstabelecimentos([]);
// //                 return;
// //             }

// //             try {
// //                 const [est, coordenadores, maquinas, todosUsuarios] = await Promise.all([
// //                     EstabelecimentoAPI.obterAsync(estabelecimentoId),
// //                     UsuarioAPI.listarPorEstabelecimentoAsync(estabelecimentoId, 1), // Coordenadores
// //                     maquinaAPI.listarPorEstabelecimentoAsync(estabelecimentoId),
// //                     UsuarioAPI.listarAsync(true) // Todos ativos
// //                 ]);

// //                 setEstabelecimentos([est]);
// //                 setCoordenadores(coordenadores);
// //                 setMaquinas(maquinas);

// //                 const usuariosComuns = todosUsuarios.filter(
// //                     u => u.tipoConta === 3 && u.estabelecimentoId === parseInt(estabelecimentoId)
// //                 );
// //                 setUsuarios(usuariosComuns);

// //             } catch (error) {
// //                 console.error("Erro ao carregar os dados do coordenador", error);
// //             }
// //         };


// //         carregarDados();
// //         carregarUsuarios();
// //         carregarDadosDoEstabelecimento();
// //     }, [id]);


// //     const estabelecimentosFiltrados = estabelecimentos.filter(e =>
// //         e.ativo || e.Telefone || e.Telefone !== ""
// //     );


// //     const alternarStatusEstabelecimento = async (est) => {
// //         try {
// //             const atualizado = { ...est, ativo: !est.ativo };
// //             await EstabelecimentoAPI.atualizarAsync(atualizado);
// //             setEstabelecimentos((prev) =>
// //                 prev.map((e) => (e.id === est.id ? atualizado : e))
// //             );
// //         } catch (error) {
// //             console.error("Erro ao atualizar status do estabelecimento:", error);
// //         }
// //     };

// //     const alternarStatusMaquina = async (m) => {
// //         try {
// //             const atualizado = { ...m, ativo: !m.ativo };
// //             await maquinaAPI.atualizarAsync(atualizado);
// //             setMaquinas((prev) =>
// //                 prev.map((maq) => (maq.id === m.id ? atualizado : maq))
// //             );
// //         } catch (error) {
// //             console.error("Erro ao atualizar status da máquina:", error);
// //         }
// //     };


// //     const handleClickDeletar = (usuario) => {
// //         setUsuarioSelecionado(usuario);
// //         setMostrarModal(true);
// //     };

// //     const handleDeletar = async () => {
// //         try {
// //             await UsuarioAPI.deletarDefinitivoAsync(usuarioSelecionado.id);
// //             setUsuarios(prev => prev.filter(u => u.id !== usuarioSelecionado.id));
// //             setMensagem("Usuário deletado com sucesso!");
// //             setTipoMensagem("sucesso");
// //         } catch {
// //             setMensagem("Erro ao deletar usuário.");
// //             setTipoMensagem("erro");
// //         } finally {
// //             setShowMensagem(true);
// //             setMostrarModal(false);
// //         }
// //     };

// //     return (
// //         <Sidebar>
// //             <Topbar />
// //             <div className={style.pagina_conteudo}>
// //                 <div className={style.pagina_cabecalho}>

// //                     <h3>Estabelecimento</h3>

// //                     <div className={style.cards_container}>
// //                         {estabelecimentosFiltrados.map(est => (
// //                             <div
// //                                 key={est.id}
// //                             >
// //                                 <button
// //                                     className={style.botao_status_loja}
// //                                     onClick={(e) => {
// //                                         e.stopPropagation();
// //                                         alternarStatusEstabelecimento(est);
// //                                     }}
// //                                 >
// //                                     {est.ativo ? "Desativar Estabelecimento" : "Ativar Estabelecimento"}
// //                                 </button>
// //                             </div>
// //                         ))}
// //                     </div>

// //                     {estabelecimentosFiltrados.map(est => (
// //                         <div
// //                             key={est.id}
// //                         >
// //                             <BotaoNovo
// //                                 onClick={(e) => {
// //                                     navigate("/estabelecimento/editar", { state: est.id });
// //                                 }}
// //                             >
// //                                 Editar Estabelecimento
// //                             </BotaoNovo>
// //                         </div>
// //                     ))}

// //                 </div>

// //                 <div className={style.tabela}>
// //                     <div className={style.pagina_cabecalho}>
// //                         {estabelecimentosFiltrados.map(est => (

// //                             <div
// //                                 key={est.id}
// //                                 className={`${style.card_estabelecimento}
// //                                 ${est.ativo ? style.ativo : style.inativo}
// //                                                                 `}
// //                             >
// //                                 <div className={style.filtros}>:
// //                                     {estabelecimentos.length > 0 && estabelecimentos.map(est => (
// //                                         <div key={est.id}>
// //                                             <h3>Estabelecimento: {est.nome}</h3>
// //                                             <p><strong>Status da Loja:</strong> {est.ativo ? "Ativa" : "Inativa"}</p>
// //                                             <p><strong>Endereço:</strong> {est.Endereço || est.endereco || "N/A"}</p>
// //                                             <p><strong>Telefone:</strong> {est.Telefone || est.telefone || "N/A"}</p>
// //                                         </div>
// //                                     ))}
// //                                 </div>
// //                             </div>
// //                         ))}

// //                         <div className={style.card_estabelecimento}>

// //                             <h5>Coordenador Responsavel:</h5>

// //                             <ul>
// //                                 {usuariosFiltrados
// //                                     .slice((paginaAtual - 1) * usuariosPorPagina, paginaAtual * usuariosPorPagina)
// //                                     .map((usuario) => (
// //                                         <li key={usuario.id}>
// //                                             <p><strong>{usuario.nome}</strong> - {usuario.ativo ? "Ativo" : "Inativo"}</p>
// //                                             <p><strong>Email:</strong> {usuario.email}</p>
// //                                             <p><strong>Tipo:</strong> {tipoUsuarioLogado}</p>

// //                                             {(tipoConta === "Master" || tipoConta === "Coordenador") && (
// //                                                 <p><strong>Saldo:</strong> R$ {usuario.saldo?.toFixed(2)}</p>
// //                                             )}

// //                                             <p><strong>Estabelecimento:</strong> {usuario.nomeEstabelecimento}</p>
// //                                         </li>
// //                                     ))}
// //                             </ul>
// //                         </div>

// //                         <div className={style.card_estabelecimento}>
// //                             <h5>Máquinas:</h5>
// //                             <ul>
// //                                 {maquinas.map(maq => (
// //                                     <li key={maq.id}>{maq.tipoDispositivo} ({maq.ativo ? "Ativo" : "Inativo"})</li>
// //                                 ))}
// //                             </ul>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 <div className={style.lista_cards}>
// //                     {maquinas.map((m, i) => (
// //                         <div key={i} className={`${style.card_maquina} ${m.ativo ? style.ativo : style.inativo}`}
// //                             onClick={() => m.ativo && navigate(`/maquina/consulta/${m.id}`)}
// //                         >
// //                             <h5><strong>{m.tipoDispositivo || "Dispositivo"}</strong></h5>
// //                             <p><strong>IP:</strong> {m.ip || "Não especificado"}</p>
// //                             <p><strong>MAC:</strong> {m.macAddress}</p>
// //                             <p><strong>Status do dispositivo:</strong> {formatarStatus(m.statusDispositivo)}</p>
// //                             <p><strong>Status de utilização:</strong> {formatarStatusUtilizacao(m.statusUtilizacao)}</p>
// //                             <p><strong>Estabelecimento:</strong> {m.estabelecimentoNome || "Não especificado"}</p>

// //                             <p>
// //                                 <strong>Status:</strong>
// //                                 <button
// //                                     className={style.botao_status_maquina}
// //                                     onClick={(e) => {
// //                                         e.stopPropagation();
// //                                         alternarStatusMaquina(m);
// //                                     }}
// //                                 >
// //                                     {m.ativo ? "Desativar" : "Ativar"}
// //                                 </button>
// //                             </p>

// //                             <p><strong>1ª Ativação:</strong> {m.primeiraAtivacao ? formatarData(m.primeiraAtivacao) : "Não especificada"}</p>
// //                             <p><strong>Última Ativação:</strong> {formatarData(m.ultimaAtualizacao)}</p>

// //                             <div className={style.acoes}>

// //                                 <Link to="/maquinas/editar"
// //                                     state={m.id}
// //                                     onClick={(e) => e.stopPropagation()}
// //                                     className={style.botao_editar}>
// //                                     <MdEdit />
// //                                 </Link>

// //                                 <Link onClick={(e) => {
// //                                     e.stopPropagation();
// //                                     handleClickDeletar(m);
// //                                 }}
// //                                     className={style.botao_deletar}>
// //                                     <MdDelete />
// //                                 </Link>
// //                             </div>

// //                         </div>
// //                     ))}
// //                 </div>

// //                 <div className={style.tabela}>
// //                     <Form.Group className="mb-3">
// //                         <h3>Usuarios:</h3>

// //                         <Table responsive>
// //                             <thead className={style.tabela_cabecalho}>
// //                                 <tr>
// //                                     <th>Nome</th>
// //                                     <th>Email</th>
// //                                     <th>Tipo</th>
// //                                     <th>Status</th>
// //                                     <th className={style.cabecalho_tabela}>Ações</th>
// //                                 </tr>
// //                             </thead>

// //                             <tbody>
// //                                 {usuariosFiltrados.map(usuario => (
// //                                     <tr key={usuario.id}>
// //                                         <td>{usuario.nome}</td>
// //                                         <td className={style.tabela_email}>{usuario.email}</td>
// //                                         <td>{traduzirTipoConta(usuario.tipoConta)}</td>
// //                                         <td>{usuario.ativo ? "Ativo" : "Inativo"}</td>
// //                                         <td className={style.registros_tabela}>

// //                                             <Link onClick={() => {
// //                                                 setUsuarioVisualizar(usuario);
// //                                                 setMostrarModalVisualizacao(true);
// //                                             }} className={style.botao_icone}>
// //                                                 <MdRemoveRedEye />
// //                                             </Link>

// //                                             <Link to="/usuario/editar" state={usuario.id} className={style.botao_editar}>
// //                                                 <MdEdit />
// //                                             </Link>

// //                                             <Link onClick={() => handleClickDeletar(usuario)} className={style.botao_deletar}>
// //                                                 <MdDelete />
// //                                             </Link>
// //                                         </td>
// //                                     </tr>
// //                                 ))}
// //                             </tbody>
// //                         </Table>
// //                     </Form.Group>
// //                 </div>

// //                 {/* Modal Visualização */}
// //                 <Modal
// //                     show={mostrarModalVisualizacao}
// //                     onHide={() => setMostrarModalVisualizacao(false)}
// //                     centered
// //                 >
// //                     <Modal.Header closeButton>
// //                         <Modal.Title>Visualizar Usuário</Modal.Title>
// //                     </Modal.Header>

// //                     <Modal.Body>
// //                         <p><strong>Nome:</strong> {usuarioVisualizar?.nome}</p>
// //                         <p><strong>Email:</strong> {usuarioVisualizar?.email}</p>
// //                         <p><strong>Tipo:</strong> {traduzirTipoConta(usuarioVisualizar?.tipoConta)}</p>
// //                         <p><strong>Saldo:</strong> {usuarioVisualizar?.saldo}</p>
// //                         <p><strong>Estabelecimento:</strong> {usuarioVisualizar?.nomeEstabelecimento}</p>
// //                         <p><strong>Ultimo Login:</strong> {usuarioVisualizar?.ultimoLogin}</p>
// //                     </Modal.Body>

// //                     <Modal.Footer>
// //                         <Button variant="secondary" onClick={() => setMostrarModalVisualizacao(false)}>Fechar</Button>
// //                     </Modal.Footer>
// //                 </Modal>

// //                 {/* Modal Confirmação Exclusão */}
// //                 <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
// //                     <Modal.Header closeButton>
// //                         <Modal.Title>Confirmar exclusão</Modal.Title>
// //                     </Modal.Header>

// //                     <Modal.Body>
// //                         Deseja deletar o usuário <strong>{usuarioSelecionado?.nome}</strong>?
// //                     </Modal.Body>

// //                     <Modal.Footer>
// //                         <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
// //                         <Button variant="danger" onClick={handleDeletar}>Deletar</Button>
// //                     </Modal.Footer>
// //                 </Modal>

// //                 {/* Modal Mensagem */}
// //                 <MensagemModal
// //                     show={showMensagem}
// //                     onClose={() => setShowMensagem(false)}
// //                     titulo={tipoMensagem === 'sucesso' ? 'Sucesso' : 'Erro'}
// //                     mensagem={mensagem}
// //                     tipo={tipoMensagem}
// //                 />
// //             </div>
// //         </Sidebar >
// //     );
// // }















// // // import { useEffect, useState } from "react";
// // // import { Sidebar } from "../../componentes/Sidebar/Sidebar";
// // // import { Topbar } from "../../componentes/Topbar/Topbar";
// // // import Form from "react-bootstrap/Form";
// // // import { Link, useNavigate, useParams } from "react-router-dom";
// // // import { Table, Modal, Button } from "react-bootstrap";
// // // import { MdEdit, MdDelete, MdRemoveRedEye } from "react-icons/md";
// // // import EstabelecimentoAPI from "../../services/estabelecimentoAPI";
// // // import style from "./ConsultaEstabelecimento.module.css";
// // // import UsuarioAPI from "../../services/usuarioAPI";
// // // import maquinaAPI from "../../services/maquinaAPI";
// // // import { traduzirTipoConta } from "../../utils/tipoContaHelper";
// // // import MensagemModal from "../../componentes/MensagemModal/MensagemModal";


// // // export function ConsultaEstabelecimento() {

// // //     const { id } = useParams();

// // //     const [estabelecimento, setEstabelecimento] = useState({});

// // //     const [coordenadores, setCoordenadores] = useState([]);
// // //     const [maquinas, setMaquinas] = useState([]);

// // //     const [usuarios, setUsuarios] = useState([]);
// // //     const [busca, setBusca] = useState('');
// // //     const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
// // //     const [usuarioVisualizar, setUsuarioVisualizar] = useState(null);

// // //     const [mostrarModal, setMostrarModal] = useState(false);
// // //     const [mostrarModalVisualizacao, setMostrarModalVisualizacao] = useState(false);
// // //     const [showMensagem, setShowMensagem] = useState(false);
// // //     const [mensagem, setMensagem] = useState("");
// // //     const [tipoMensagem, setTipoMensagem] = useState("sucesso");

// // //     const navigate = useNavigate();

// // //     const usuariosFiltrados = usuarios.filter(u =>
// // //         u.nome.toLowerCase().includes(busca.toLowerCase())
// // //     );

// // //     useEffect(() => {
// // //         const carregarUsuarios = async () => {
// // //             try {
// // //                 const lista = await UsuarioAPI.listarAsync(true);

// // //                 // Aqui filtra por tipoConta === 3 e que sejam do mesmo estabelecimento
// // //                 const comunsDoEstabelecimento = lista.filter(
// // //                     u => (u.tipoConta === 1 || u.tipoConta === 2 || u.tipoConta === 3) && u.estabelecimentoId === parseInt(id)
// // //                 );

// // //                 setUsuarios(comunsDoEstabelecimento);
// // //             } catch (error) {
// // //                 console.error("Erro ao carregar usuários:", error);
// // //             }
// // //         };

// // //         async function carregarDados() {
// // //             try {
// // //                 const [dadosEst, tipo1, tipo2, tipo3, maquinas] = await Promise.all([
// // //                     EstabelecimentoAPI.obterAsync(id),
// // //                     UsuarioAPI.listarPorEstabelecimentoAsync(id, 1),
// // //                     UsuarioAPI.listarPorEstabelecimentoAsync(id, 2),
// // //                     UsuarioAPI.listarPorEstabelecimentoAsync(id, 3),
// // //                     maquinaAPI.listarPorEstabelecimentoAsync(id)
// // //                 ]);

// // //                 setEstabelecimento(dadosEst);
// // //                 setCoordenadores([...tipo1, ...tipo2]); // Tipo 1 (Master) e Tipo 2 (Coordenador)
// // //                 setUsuarios([...tipo3]); // Tipo 3 (Comuns)
// // //                 setMaquinas(maquinas);

// // //                 console.log("Retorno da API - Estabelecimento:", dadosEst);

// // //             } catch (error) {
// // //                 console.error("Erro ao carregar dados:", error);
// // //             }
// // //         }

// // //         carregarDados();
// // //         carregarUsuarios();
// // //     }, [id]);





// // //     const alternarStatusEstabelecimento = async (est) => {
// // //         try {
// // //             const atualizado = { ...est, ativo: !est.ativo };
// // //             await EstabelecimentoAPI.atualizarAsync(atualizado);
// // //             setEstabelecimento((prev) =>
// // //                 prev.map((e) => (e.id === est.id ? atualizado : e))
// // //             );
// // //         } catch (error) {
// // //             console.error("Erro ao atualizar status do estabelecimento:", error);
// // //         }
// // //     };

// // //     const alternarStatusMaquina = async (m) => {
// // //         try {
// // //             const atualizado = { ...m, ativo: !m.ativo };
// // //             await maquinaAPI.atualizarAsync(atualizado);
// // //             setMaquinas((prev) =>
// // //                 prev.map((maq) => (maq.id === m.id ? atualizado : maq))
// // //             );
// // //         } catch (error) {
// // //             console.error("Erro ao atualizar status da máquina:", error);
// // //         }
// // //     };



// // //     const handleClickDeletar = (usuario) => {
// // //         setUsuarioSelecionado(usuario);
// // //         setMostrarModal(true);
// // //     };

// // //     const handleDeletar = async () => {
// // //         try {
// // //             await UsuarioAPI.deletarDefinitivoAsync(usuarioSelecionado.id);
// // //             setUsuarios(prev => prev.filter(u => u.id !== usuarioSelecionado.id));
// // //             setMensagem("Usuário deletado com sucesso!");
// // //             setTipoMensagem("sucesso");
// // //         } catch {
// // //             setMensagem("Erro ao deletar usuário.");
// // //             setTipoMensagem("erro");
// // //         } finally {
// // //             setShowMensagem(true);
// // //             setMostrarModal(false);
// // //         }
// // //     };

// // //     return (
// // //         <Sidebar>
// // //             <Topbar />
// // //             <div className={style.pagina_conteudo}>
// // //                 <Form.Group className="mb-3">
// // //                     <div className={style.pagina_cabecalho}>

// // //                         <div
// // //                             className={`${style.card_estabelecimento}
// // //                                         ${estabelecimento?.ativo ? style.ativo : style.inativo}`}
// // //                             onClick={() => navigate("/estabelecimentos")}
// // //                             style={{ cursor: 'pointer' }}
// // //                         >
// // //                             <h5>{estabelecimento?.nome}</h5>
// // //                             <p><span>Status: </span>{estabelecimento?.ativo ? "Ativo" : "Inativo"}</p>
// // //                             <p><span>Endereço: </span>{estabelecimento?.endereco}</p>
// // //                             <p><span>Telefone: </span>{estabelecimento?.telefone}</p>
// // //                         </div>

// // //                         <div className={`${style.card_estabelecimento} ${coordenadores?.ativo ? style.ativo : style.inativo}`}>
// // //                             <h5>Responsavel Estabelecimento:</h5>
// // //                             <ul>
// // //                                 {coordenadores.map(coord => (
// // //                                     <li key={coord.id}>
// // //                                         {coord.nome} - {coord.ativo ? "Ativo" : "Inativo"}
// // //                                     </li>
// // //                                 ))}
// // //                             </ul>
// // //                         </div>

// // //                         <div className={`${style.card_estabelecimento} ${maquinas?.ativo ? style.ativo : style.inativo}`}>
// // //                             <h4>Máquinas:</h4>
// // //                             <ul>
// // //                                 {maquinas.map(maquina => (
// // //                                     <li key={maquina.id}>
// // //                                         {maquina.tipoDispositivo} ({maquina.ativo ? "Ativa" : "Inativa"})
// // //                                     </li>
// // //                                 ))}
// // //                             </ul>
// // //                         </div>
// // //                     </div>
// // //                 </Form.Group>

// // //                 <h3>Usuarios:</h3>

// // //                 <Form.Group className="mb-3">

// // //                     <Table responsive>
// // //                         <thead className={style.tabela_cabecalho}>
// // //                             <tr>
// // //                                 <th>Nome</th>
// // //                                 <th>Email</th>
// // //                                 <th>Tipo</th>
// // //                                 <th>Status</th>
// // //                                 <th className={style.cabecalho_tabela}>Ações</th>
// // //                             </tr>
// // //                         </thead>
// // //                         <tbody>
// // //                             {usuariosFiltrados.map(usuario => (
// // //                                 <tr key={usuario.id}>
// // //                                     <td>{usuario.nome}</td>
// // //                                     <td className={style.tabela_email}>{usuario.email}</td>
// // //                                     <td>{traduzirTipoConta(usuario.tipoConta)}</td>
// // //                                     <td>{usuario.ativo ? "Ativo" : "Inativo"}</td>
// // //                                     <td className={style.registros_tabela}>
// // //                                         <Link onClick={() => {
// // //                                             setUsuarioVisualizar(usuario);
// // //                                             setMostrarModalVisualizacao(true);
// // //                                         }} className={style.botao_icone}>
// // //                                             <MdRemoveRedEye />
// // //                                         </Link>

// // //                                         <Link to="/usuario/editar" state={usuario.id} className={style.botao_editar}>
// // //                                             <MdEdit />
// // //                                         </Link>

// // //                                         <Link onClick={() => handleClickDeletar(usuario)} className={style.botao_deletar}>
// // //                                             <MdDelete />
// // //                                         </Link>
// // //                                     </td>
// // //                                 </tr>
// // //                             ))}
// // //                         </tbody>
// // //                     </Table>
// // //                 </Form.Group>

// // //                 {/* Modal Visualização */}
// // //                 <Modal
// // //                     show={mostrarModalVisualizacao}
// // //                     onHide={() => setMostrarModalVisualizacao(false)}
// // //                     centered
// // //                 >
// // //                     <Modal.Header closeButton>
// // //                         <Modal.Title>Visualizar Usuário</Modal.Title>
// // //                     </Modal.Header>

// // //                     <Modal.Body>
// // //                         <p><strong>Nome:</strong> {usuarioVisualizar?.nome}</p>
// // //                         <p><strong>Email:</strong> {usuarioVisualizar?.email}</p>
// // //                         <p><strong>Tipo:</strong> {traduzirTipoConta(usuarioVisualizar?.tipoConta)}</p>
// // //                         <p><strong>Saldo:</strong> {usuarioVisualizar?.saldo}</p>
// // //                         <p><strong>Estabelecimento:</strong> {usuarioVisualizar?.nomeEstabelecimento}</p>
// // //                         <p><strong>Ultimo Login:</strong> {usuarioVisualizar?.ultimoLogin}</p>
// // //                     </Modal.Body>

// // //                     <Modal.Footer>
// // //                         <Button variant="secondary" onClick={() => setMostrarModalVisualizacao(false)}>Fechar</Button>
// // //                     </Modal.Footer>
// // //                 </Modal>

// // //                 {/* Modal Confirmação Exclusão */}
// // //                 <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
// // //                     <Modal.Header closeButton>
// // //                         <Modal.Title>Confirmar exclusão</Modal.Title>
// // //                     </Modal.Header>

// // //                     <Modal.Body>
// // //                         Deseja deletar o usuário <strong>{usuarioSelecionado?.nome}</strong>?
// // //                     </Modal.Body>

// // //                     <Modal.Footer>
// // //                         <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
// // //                         <Button variant="danger" onClick={handleDeletar}>Deletar</Button>
// // //                     </Modal.Footer>
// // //                 </Modal>

// // //                 {/* Modal Mensagem */}
// // //                 <MensagemModal
// // //                     show={showMensagem}
// // //                     onClose={() => setShowMensagem(false)}
// // //                     titulo={tipoMensagem === 'sucesso' ? 'Sucesso' : 'Erro'}
// // //                     mensagem={mensagem}
// // //                     tipo={tipoMensagem}
// // //                 />

// // //             </div>
// // //         </Sidebar >
// // //     );
// // // }
