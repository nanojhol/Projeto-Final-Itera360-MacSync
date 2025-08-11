import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import Form from "react-bootstrap/Form";
import UsuarioAPI from "../../services/usuarioAPI";
import style from "./EditarUsuario.module.css";
import { Row, Col } from "react-bootstrap";
import BotaoSalvar from "../../componentes/BotaoSalvar/BotaoSalvar";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";

export function EditarUsuario() {
    const location = useLocation();
    const navigate = useNavigate();
    const [id] = useState(location.state);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [tipoSelecionado, setTipoSelecionado] = useState('');
    const [tiposUsuario, setTiposUsuario] = useState([]);
    const [ativo, setAtivo] = useState(true);
    const [saldo, setSaldo] = useState(0);
    const [estabelecimentoId, setEstabelecimentoId] = useState(0);
    const [listaEstabelecimentos, setListaEstabelecimentos] = useState([]);

    const [showMensagem, setShowMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");

    useEffect(() => {
        const buscarTiposUsuarios = async () => {
            try {
                const tipos = await UsuarioAPI.listarTiposUsuarioAsync();
                setTiposUsuario(tipos);
            } catch (error) {
                console.error('Erro ao buscar tipos de usuários:', error);
            }
        };

        const buscarEstabelecimentos = async () => {
            try {
                const estabelecimentos = await UsuarioAPI.listarEstabelecimentosAsync();
                setListaEstabelecimentos(estabelecimentos);
            } catch (error) {
                console.error('Erro ao buscar estabelecimentos:', error);
            }
        };

        const buscarDadosUsuario = async () => {
            try {
                const usuario = await UsuarioAPI.obterAsync(id);
                setNome(usuario.nome);
                setEmail(usuario.email);
                setTipoSelecionado(usuario.tipoConta);
                setAtivo(usuario.ativo);
                setSaldo(usuario.saldo);
                setEstabelecimentoId(usuario.estabelecimentoId);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };

        buscarDadosUsuario();
        buscarTiposUsuarios();
        buscarEstabelecimentos();
    }, [id]);

    const isFormValid = () => {
        const nomeTrim = nome.trim();
        const emailTrim = email.trim();
        return (
            nomeTrim.length >= 3 &&
            emailTrim.length > 0 &&
            (senha === '' || senha.length <= 100) &&
            [1, 2, 3].includes(tipoSelecionado) &&
            saldo >= 0 &&
            estabelecimentoId > 0
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid()) {
            try {
                await UsuarioAPI.atualizarAsync(String(id).trim(), {
                    nome: nome.trim(),
                    email: email.trim(),
                    tipoConta: tipoSelecionado,
                    ativo,
                    saldo,
                    estabelecimentoId
                });

                setMensagem("Usuário atualizado com sucesso!");
                setTipoMensagem("sucesso");
                setShowMensagem(true);
                setTimeout(() => navigate('/usuarios'), 3000);
            } catch (error) {
                console.error("Erro detalhado:", error.response?.data || error.message);
                setMensagem("Erro ao atualizar usuário.");
                setTipoMensagem("erro");
                setShowMensagem(true);
            }

        } else {
            setMensagem("Por favor, preencha todos os campos corretamente.");
            setTipoMensagem("erro");
            setShowMensagem(true);
        }
    };

    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>
                <div className={style.form_container}>
                    <h3>Editar Usuário</h3>
                    <Form onSubmit={handleSubmit}>
                        <div className={style.filtros}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite o nome"
                                    value={nome}
                                    onChange={(e) => {
                                        const valor = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
                                        setNome(valor);
                                    }}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Digite o email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>
                        <Row>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo de Usuário</Form.Label>
                                    <Form.Select
                                        value={tipoSelecionado}
                                        onChange={(e) => setTipoSelecionado(Number(e.target.value))}
                                        required
                                    >
                                        {tiposUsuario.map((tipo) => (
                                            <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estabelecimento</Form.Label>
                                    <Form.Select
                                        value={estabelecimentoId}
                                        onChange={(e) => setEstabelecimentoId(Number(e.target.value))}
                                        required
                                    >
                                        <option value={0}>Selecione...</option>
                                        {listaEstabelecimentos.map((e) => (
                                            <option key={e.id} value={e.id}>{e.nome}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Saldo</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={saldo}
                                        onChange={(e) => setSaldo(parseFloat(e.target.value))}
                                        min={0}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        id="switch-ativo"
                                        label="Usuário Ativo"
                                        checked={ativo}
                                        onChange={() => setAtivo(!ativo)}
                                    />

                                </Form.Group>
                            </Col>
                        </Row>

                        <BotaoSalvar label="Salvar" variant="primary" type="submit" disabled={!isFormValid()} className="d-flex align-items-center gap-2 px-5 py-2">
                            Salvar
                        </BotaoSalvar>
                    </Form>
                </div>
            </div>

            <MensagemModal
                show={showMensagem}
                onClose={() => setShowMensagem(false)}
                titulo={tipoMensagem === 'sucesso' ? 'Sucesso' : 'Erro'}
                mensagem={mensagem}
                tipo={tipoMensagem}
                onClick={() => { if (tipoMensagem === 'sucesso') navigate('/usuarios'); }}
            />
        </Sidebar>
    );
}

export default EditarUsuario;
