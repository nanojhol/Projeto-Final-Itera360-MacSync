import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Col, Row } from "react-bootstrap";
import ChamadosAPI from "../../services/chamadoAPI";
import estabelecimentoAPI from "../../services/estabelecimentoAPI";
import UsuarioAPI from "../../services/usuarioAPI";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
import style from "./EditarChamado.module.css";

export function EditarChamado() {
    const navigate = useNavigate();
    const location = useLocation();
    const chamadoId = location.state;

    const [dados, setDados] = useState({
        estabelecimentoId: 0,
        tipo: "",
        mensagem: "",
        status: "",
        // ativo: false,
        usuarioId: 0,
        dataCriacao: ""
    });

    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [showMensagem, setShowMensagem] = useState(false);

    useEffect(() => {
        if (!chamadoId) {
            navigate("/chamados");
            return;
        }

        const carregarChamado = async () => {
            const todos = await ChamadosAPI.listarAsync();
            const chamado = todos.find(c => c.id === chamadoId);
            if (!chamado) {
                setMensagem("Chamado não encontrado.");
                setTipoMensagem("erro");
                setShowMensagem(true);
                return;
            }
            setDados({ ...chamado });
        };

        const carregarDados = async () => {
            const ests = await estabelecimentoAPI.listarAsync(true);
            const usrs = await UsuarioAPI.listarAsync(true);
            setEstabelecimentos(ests);
            setUsuarios(usrs);
        };

        carregarChamado();
        carregarDados();
    }, [chamadoId, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const novoValor = type === "checkbox" ? checked : value;

        setDados(prev => ({
            ...prev,
            [name]: name === "estabelecimentoId" ? Number(novoValor) : novoValor
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ChamadosAPI.atualizarAsync({ id: chamadoId, ...dados });
            setMensagem("Chamado atualizado com sucesso!");
            setTipoMensagem("sucesso");
            setShowMensagem(true);
            setTimeout(() => navigate("/chamados"), 1500);
        } catch {
            setMensagem("Erro ao atualizar chamado.");
            setTipoMensagem("erro");
            setShowMensagem(true);
        }
    };

    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>
                <h3>Editar Chamado</h3>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Usuário</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={usuarios.find(u => u.id === dados.usuarioId)?.nome || ""}
                                    readOnly
                                    style={{ backgroundColor: "#e9ecef", cursor: "not-allowed" }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Data de Criação</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={new Date(dados.dataCriacao).toLocaleString()}
                                    readOnly
                                    style={{ backgroundColor: "#e9ecef", cursor: "not-allowed" }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Estabelecimento</Form.Label>
                                <Form.Select
                                    name="estabelecimentoId"
                                    value={dados.estabelecimentoId}
                                    onChange={handleChange}

                                >
                                    <option value={0}>Selecione</option>
                                    {estabelecimentos.map(est => (
                                        <option key={est.id} value={est.id}>{est.nome}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={dados.status}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecione</option>
                                    <option value="Em aberto">Em aberto</option>
                                    <option value="Em análise">Em análise</option>
                                    <option value="Resolvido">Resolvido</option>
                                    <option value="Fechado">Fechado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                            name="tipo"
                            value={dados.tipo}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mensagem</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="mensagem"
                            value={dados.mensagem}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            name="ativo"
                            label={dados.ativo ? "Ativo" : "Inativo"}
                            checked={!dados.ativo}
                            onChange={handleChange}
                        />
                    </Form.Group> */}

                    <Button variant="primary" type="submit">
                        Salvar Alterações
                    </Button>
                </Form>

                <MensagemModal
                    show={showMensagem}
                    onClose={() => setShowMensagem(false)}
                    titulo={tipoMensagem === "sucesso" ? "Sucesso" : "Erro"}
                    mensagem={mensagem}
                    tipo={tipoMensagem}
                    onClick={() => { if (tipoMensagem === 'sucesso') navigate('/chamados'); }}
                />
            </div>
        </Sidebar>
    );
}
