import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Col, Row } from "react-bootstrap";
import ChamadosAPI from "../../services/chamadoAPI";
import estabelecimentoAPI from "../../services/estabelecimentoAPI";
import UsuarioAPI from "../../services/usuarioAPI";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
import style from "./NovoChamado.module.css";


export function NovoChamado() {

    const navigate = useNavigate();

    const [dados, setDados] = useState({
        estabelecimentoId: 0,
        tipo: "",
        mensagem: "",
        status: "Em aberto",
        ativo: true,
        usuarioId: 0
    });

    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [showMensagem, setShowMensagem] = useState(false);

    useEffect(() => {
        const carregarDados = async () => {
            const ests = await estabelecimentoAPI.listarAsync(true);
            const usrs = await UsuarioAPI.listarAsync(true);
            setEstabelecimentos(ests);
            setUsuarios(usrs);
        };

        carregarDados();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const novoValor = type === "checkbox" ? checked : value;

        setDados(prev => ({
            ...prev,
            [name]: name === "estabelecimentoId" || name === "usuarioId"
                ? Number(novoValor)
                : novoValor
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ChamadosAPI.criarAsync(dados);
            setMensagem("Chamado criado com sucesso!");
            setTipoMensagem("sucesso");
            setShowMensagem(true);
            setTimeout(() => navigate("/chamados"), 2000);
        } catch {
            setMensagem("Erro ao criar chamado.");
            setTipoMensagem("erro");
            setShowMensagem(true);
        }
    };

    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>
                <div className={style.form_container}>
                    <h3>Novo Chamado</h3>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Usuário</Form.Label>
                                <Form.Select
                                    name="usuarioId"
                                    value={dados.usuarioId}
                                    onChange={handleChange}
                                >
                                    <option value={0}>Selecione</option>
                                    {usuarios.map(u => (
                                        <option key={u.id} value={u.id}>{u.nome}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

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
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={dados.status}
                            onChange={handleChange}
                        >
                            <option value="Em aberto">Em aberto</option>
                            <option value="Em análise">Em análise</option>
                            <option value="Resolvido">Resolvido</option>
                            <option value="Fechado">Fechado</option>
                        </Form.Select>
                    </Form.Group>

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

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            name="ativo"
                            label={dados.ativo ? "Ativo" : "Inativo"}
                            checked={dados.ativo}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Criar Chamado
                    </Button>
                </Form>
                </div>

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
