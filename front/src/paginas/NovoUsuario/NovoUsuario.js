import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import Form from "react-bootstrap/Form";
import UsuarioAPI from "../../services/usuarioAPI";
import style from "./NovoUsuario.module.css";
import { Row, Col } from "react-bootstrap";
import BotaoSalvar from "../../componentes/BotaoSalvar/BotaoSalvar";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";

export function NovoUsuario() {
    const navigate = useNavigate();

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
        const carregarDadosIniciais = async () => {
            try {
                const tipos = await UsuarioAPI.listarTiposUsuarioAsync();
                setTiposUsuario(tipos);

                const estabelecimentos = await UsuarioAPI.listarEstabelecimentosAsync();
                setListaEstabelecimentos(estabelecimentos);
            } catch (error) {
                console.error("Erro ao carregar tipos ou estabelecimentos:", error);
            }
        };

        carregarDadosIniciais();
    }, []);

    const isFormValid = () => {
        const nomeTrim = nome.trim();
        const emailTrim = email.trim();
        return (
            nomeTrim.length >= 3 && nomeTrim.length <= 50 &&
            emailTrim.length >= 3 && emailTrim.length <= 50 &&
            senha.trim().length >= 4 && senha.length <= 100 &&
            tipoSelecionado > 0  &&
            estabelecimentoId > 0
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid()) {
            try {
                await UsuarioAPI.criarAsync(
                    nome.trim(),
                    email.trim(),
                    senha.trim(),
                    tipoSelecionado,
                    estabelecimentoId
                );

                setMensagem("Usuário criado com sucesso!");
                setTipoMensagem("sucesso");
                setShowMensagem(true);
                setTimeout(() => navigate('/usuarios'), 3000);
            } catch (error) {
                console.error("Erro ao criar usuário:", error);
                setMensagem("Erro ao criar usuário.");
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
                    <h3>Novo Usuário</h3>
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
                                    <Form.Label>Senha</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Digite a senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo de Usuário</Form.Label>
                                    <Form.Select
                                        value={tipoSelecionado}
                                        onChange={(e) => setTipoSelecionado(Number(e.target.value))}
                                        required
                                    >
                                        <option value="">Selecione...</option>
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

                            {/* <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Saldo</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={saldo === '' ? '' : saldo}
                                        onChange={(e) => {
                                            const valor = e.target.value;
                                            setSaldo(valor === '' ? '' : parseFloat(valor));
                                        }}
                                        min={0}
                                    />
                                </Form.Group>
                            </Col> */}

                            <Col md={6}>
                                <Form.Group className="mb-4">
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

export default NovoUsuario;
