import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import BotaoSalvar from "../../componentes/BotaoSalvar/BotaoSalvar";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
import EstabelecimentoAPI from "../../services/estabelecimentoAPI";
import style from "./NovoEstabelecimento.module.css";

export function NovoEstabelecimento() {
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [ativo, setAtivo] = useState(true);
    const [showMensagem, setShowMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");

    const isFormValid = () => {
        return (
            nome.trim().length >= 3 && nome.length <= 100
            && (telefone.trim().length === 0 || telefone.trim().length <= 20)
            && (endereco.trim().length === 0 || endereco.trim().length <= 200)
            && (ativo !== null)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            setMensagem("Por favor, preencha todos os campos obrigatórios corretamente.");
            setTipoMensagem("erro");
            setShowMensagem(true);
            return;
        }

        try {
            await EstabelecimentoAPI.criarAsync({
                nome: nome.trim(),
                endereco: endereco.trim() || null,
                telefone: telefone.trim() || null,
                ativo: ativo
            });

            setMensagem("Estabelecimento criado com sucesso!");
            setTipoMensagem("sucesso");
            setShowMensagem(true);
            setTimeout(() => navigate("/estabelecimentos"), 2000);
        } catch (error) {
            console.error("Erro ao criar estabelecimento:", error);
            setMensagem("Erro ao criar estabelecimento.");
            setTipoMensagem("erro");
            setShowMensagem(true);
        }
    };

    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>
                <div className={style.form_container}>
                    <h3>Novo Estabelecimento</h3>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite o nome do estabelecimento"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        maxLength={100}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Telefone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="(DDD) 99999-9999"
                                        value={telefone}
                                        onChange={(e) => setTelefone(e.target.value)}
                                        maxLength={20}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Endereço</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Rua, número, bairro..."
                                        value={endereco}
                                        onChange={(e) => setEndereco(e.target.value)}
                                        maxLength={200}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        id="switch-ativo"
                                        label="Estabelecimento Ativo"
                                        checked={ativo}
                                        onChange={() => setAtivo(!ativo)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <BotaoSalvar
                            label="Salvar"
                            variant="primary"
                            type="submit"
                            disabled={!isFormValid()}
                            className="d-flex align-items-center gap-2 px-5 py-2"
                        >
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
                onClick={() => { if (tipoMensagem === 'sucesso') navigate('/estabelecimentos'); }}
            />
        </Sidebar>
    );
}
