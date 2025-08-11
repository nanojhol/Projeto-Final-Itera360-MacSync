import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Col, Row } from "react-bootstrap";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
import MaquinaAPI from "../../services/maquinaAPI";
import EstabelecimentoAPI from "../../services/estabelecimentoAPI";
import style from "./NovaMaquinas.module.css";
import BotaoSalvar from "../../componentes/BotaoSalvar/BotaoSalvar";

export function NovaMaquinas() {
    const navigate = useNavigate();

    const [dados, setDados] = useState({
        macAddress: "",
        ip: "",
        tipoDispositivo: "",
        statusDispositivo: 0,
        statusUtilizacao: 0,
        valorUtilizacao: 0,
        acaoPendente: "",
        estabelecimentoId: 0,
        ativo: true
    });

    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [showMensagem, setShowMensagem] = useState(false);

    useEffect(() => {
        async function carregarEstabelecimentos() {
            try {
                const lista = await EstabelecimentoAPI.listarAsync(true);
                setEstabelecimentos(lista);
            } catch (e) {
                console.error("Erro ao carregar estabelecimentos", e);
            }
        }

        carregarEstabelecimentos();
    }, []);

    const camposNumericos = ["statusDispositivo", "statusUtilizacao", "estabelecimentoId", "valorUtilizacao"];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const novoValor =
            type === "checkbox"
                ? checked
                : camposNumericos.includes(name)
                    ? Number(value)
                    : value;

        setDados(prev => ({
            ...prev,
            [name]: novoValor
        }));
        console.log({ name, value, novoValor })
        console.log(dados)
    };




    const isFormValid = () => {
        return (
            dados.macAddress.length >= 12 && dados.macAddress.length <= 17 &&
            dados.ip.length >= 7 && dados.ip.length <= 15 &&
            dados.tipoDispositivo.length >= 3 && dados.tipoDispositivo.length <= 50 &&
            dados.estabelecimentoId > 0 &&
            dados.statusDispositivo !== "" &&
            dados.statusUtilizacao !== ""
        );
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await MaquinaAPI.criarAsync(dados);
            setMensagem("Máquina cadastrada com sucesso!");
            setTipoMensagem("sucesso");
            setShowMensagem(true);
            setTimeout(() => navigate("/maquinas"), 1500);
        } catch (e) {
            console.error("Erro ao cadastrar máquina", e);
            setMensagem("Erro ao cadastrar máquina.");
            setTipoMensagem("erro");
            setShowMensagem(true);
        }
    };

    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>
                <div className={style.form_container}>
                    <h3>Cadastrar Nova Máquina</h3>

                    <Form onSubmit={handleSubmit}>
                        <div className={style.filtros}>

                            <Form.Group className="mb-3">
                                <Form.Label>MAC Address</Form.Label>
                                <Form.Control
                                    name="macAddress"
                                    value={dados.macAddress}
                                    onChange={handleChange}
                                    placeholder="EX: 00:11:22:33:44:55"
                                    minLength={12}
                                    maxLength={17}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>IP</Form.Label>
                                <Form.Control
                                    name="ip"
                                    value={dados.ip}
                                    onChange={handleChange}
                                    placeholder="EX: 192.168.0.255"
                                    minLength={8}
                                    maxLength={15}
                                    required
                                />
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de Dispositivo</Form.Label>
                            <Form.Control
                                name="tipoDispositivo"
                                value={dados.tipoDispositivo}
                                onChange={handleChange}
                                placeholder="EX: Desktop, Arduino, Android..."
                                minLength={3}
                                maxLength={50}
                                required
                            />
                        </Form.Group>


                    </Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status do Dispositivo</Form.Label>
                                <Form.Select
                                    name="statusDispositivo"
                                    value={dados.statusDispositivo}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value={1}>Online</option>
                                    <option value={2}>Offline</option>
                                    <option value={3}>Manutenção</option>
                                    <option value={4}>Desligado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status de Utilização</Form.Label>
                                <Form.Select
                                    name="statusUtilizacao"
                                    value={dados.statusUtilizacao}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value={1}>Livre</option>
                                    <option value={2}>EmUso</option>
                                    <option value={3}>Efetivada</option>
                                    <option value={4}>NaoEfetivada</option>
                                    <option value={5}>ErroNaUtilizacao</option>
                                    <option value={6}>SaldoEstornado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Valor da Utilização (R$)</Form.Label>
                        <Form.Control
                            type="number"
                            name="valorUtilizacao"
                            value={dados.valorUtilizacao}
                            onChange={handleChange}
                            min={0.00}
                            step={0.01}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Ação Pendente</Form.Label>
                        <Form.Control name="acaoPendente" value={dados.acaoPendente} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Estabelecimento</Form.Label>
                        <Form.Select
                            name="estabelecimentoId"
                            value={dados.estabelecimentoId}
                            onChange={handleChange}
                            required
                        >
                            <option value={0}>Selecione</option>
                            {estabelecimentos.map(est => (
                                <option key={est.id} value={est.id}>{est.nome}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ativo</Form.Label>
                        <Form.Check
                            type="switch"
                            name="ativo"
                            label={dados.ativo ? "Sim" : "Não"}
                            checked={dados.ativo}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <BotaoSalvar
                        label="Salvar"
                        variant="primary"
                        type="submit"
                        disabled={!isFormValid()}
                        className="d-flex align-items-center gap-2 px-5 py-2"
                    >
                        Salvar
                    </BotaoSalvar>

                    <MensagemModal
                        show={showMensagem}
                        onClose={() => setShowMensagem(false)}
                        titulo={tipoMensagem === "sucesso" ? "Sucesso" : "Erro"}
                        mensagem={mensagem}
                        tipo={tipoMensagem}
                        onClick={() => { if (tipoMensagem === 'sucesso') navigate('/maquinas'); }}
                    />
                </div>
            </div>
        </Sidebar >
    );
}
