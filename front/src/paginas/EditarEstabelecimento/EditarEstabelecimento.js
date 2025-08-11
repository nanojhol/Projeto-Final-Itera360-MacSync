import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import BotaoSalvar from "../../componentes/BotaoSalvar/BotaoSalvar";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
import EstabelecimentoAPI from "../../services/estabelecimentoAPI";
import style from "./EditarEstabelecimento.module.css";

export function EditarEstabelecimento() {

    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state;

    const [usuario, setUsuario] = useState('')
    
    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [ativo, setAtivo] = useState(true);
    const [showMensagem, setShowMensagem] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");

    const tipoConta = localStorage.getItem("usuarioTipo");

    useEffect(() => {
        if (!id) {
            navigate("/estabelecimentos");
            return;
        }

        async function carregarEstabelecimento() {
            try {
                const est = await EstabelecimentoAPI.obterAsync(id);
                setNome(est.nome || '');
                setEndereco(est.endereco || '');
                setTelefone(est.telefone || '');
                setAtivo(est.ativo);
            } catch (error) {
                console.error("Erro ao carregar estabelecimento:", error);
                setMensagem("Erro ao carregar dados.");
                setTipoMensagem("erro");
                setShowMensagem(true);
            }
        }

        carregarEstabelecimento();
    }, [id, navigate]);

    const isFormValid = () => {
        return nome.trim().length >= 3 && nome.length <= 100;
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
            await EstabelecimentoAPI.atualizarAsync({
                id,
                nome,
                telefone,
                endereco,
                ativo
            });

            setMensagem("Estabelecimento atualizado com sucesso!");
            setTipoMensagem("sucesso");
            setShowMensagem(true);
            setTimeout(() => navigate("/estabelecimentos"), 2000);
        } catch (error) {
            console.error("Erro ao atualizar estabelecimento:", error);
            setMensagem("Erro ao atualizar estabelecimento.");
            setTipoMensagem("erro");
            setShowMensagem(true);
        }
    };

    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>
                <div className={style.form_container}>
                    <h3>Editar Estabelecimento</h3>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome*</Form.Label>
                                    <Form.Control
                                        type="text"
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
                                        value={endereco}
                                        onChange={(e) => setEndereco(e.target.value)}
                                        maxLength={200}
                                    />
                                </Form.Group>
                            </Col>

                            {tipoConta === "Master" && ( // Apenas Master pode ver
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
                            )}

                        </Row>

                        <BotaoSalvar
                            label="Salvar"
                            variant="primary"
                            type="submit"
                            disabled={!isFormValid()}
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
