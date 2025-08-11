import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Modal, Col, Row } from "react-bootstrap";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";
import MaquinaAPI from "../../services/maquinaAPI";
import EstabelecimentoAPI from "../../services/estabelecimentoAPI";

import style from "./EditarMaquinas.module.css";

export function EditarMaquinas() {
    
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state;
    
    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [showMensagem, setShowMensagem] = useState(false);
    
    const tipoConta = localStorage.getItem("usuarioTipo");
    
    const [dados, setDados] = useState({
        ip: "",
        statusDispositivo: 1,
        statusUtilizacao: 1,
        tipoDispositivo: "",
        acaoPendente: "",
        estabelecimentoId: 0,
        ativo: true
    });

    const camposNumericos = [
        "statusDispositivo", 
        "statusUtilizacao", 
        "estabelecimentoId", 
        "valorUtilizacao"];

    useEffect(() => {
        if (!id) {
            navigate("/maquinas");
            return;
        }

        async function carregar() {
            try {
                const resposta = await MaquinaAPI.obterAsync(id);
                setDados({
                    ip: resposta.ip || "",
                    statusDispositivo: resposta.statusDispositivo,
                    statusUtilizacao: resposta.statusUtilizacao,
                    tipoDispositivo: resposta.tipoDispositivo || "",
                    acaoPendente: resposta.acaoPendente || "",
                    estabelecimentoId: resposta.estabelecimentoId || 0,
                    ativo: resposta.ativo
                });
            } catch (e) {
                // console.error("Erro ao carregar máquina", e);
                setMensagem("Erro ao carregar máquina.");
                setTipoMensagem("erro");
                setShowMensagem(true);
            }
        }

        async function carregarEstabelecimentos() {
            try {
                const lista = await EstabelecimentoAPI.listarAsync(true);
                setEstabelecimentos(lista);
            } catch (e) {
                console.error("Erro ao carregar estabelecimentos", e);
            }
        }

        carregar();
        carregarEstabelecimentos();
    }, [id, navigate]);


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

    const handleChangeEstabelecimento = (e) => {
        const novoId = parseInt(e.target.value);
        if (novoId !== dados.estabelecimentoId) {
            const confirmar = window.confirm("Você tem certeza que deseja trocar o estabelecimento?");
            if (!confirmar) return; // cancela se não confirmar
        }

        setDados(prev => ({
            ...prev,
            estabelecimentoId: novoId
        }));
    };

    const handleTrocarEstabelecimento = (e) => {
        const novoId = parseInt(e.target.value);
        if (novoId !== dados.estabelecimentoId) {
            const confirmar = window.confirm("Deseja realmente trocar o estabelecimento?");
            if (!confirmar) return; // cancela mudança
        }

        setDados(prev => ({
            ...prev,
            estabelecimentoId: novoId
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await MaquinaAPI.atualizarAsync({ id, ...dados });
            setMensagem("Máquina atualizada com sucesso!");
            setTipoMensagem("sucesso");
            setShowMensagem(true);
            setTimeout(() => navigate("/maquinas"), 1000); // volta com leve delay
        } catch (e) {
            console.error("Erro ao atualizar", e);
            setMensagem("Erro ao atualizar máquina.");
            setTipoMensagem("erro");
            setShowMensagem(true);
        }
    };

    return (
        <Sidebar>
            <Topbar />
            <div className={style.pagina_conteudo}>
                <h3>Editar Máquina</h3>

                <Form onSubmit={handleSubmit}>
                    <div className={style.filtros}>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Alterar IP</Form.Label>
                                <Form.Control name="ip" value={dados.ip} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo de Dispositivo</Form.Label>
                                <Form.Control name="tipoDispositivo" value={dados.tipoDispositivo} onChange={handleChange} />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status do Dispositivo</Form.Label>
                                <Form.Select
                                    name="statusDispositivo"
                                    value={dados.statusDispositivo}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecione</option>
                                    <option value={1}>Online</option>
                                    <option value={2}>Offline</option>
                                    <option value={3}>Manutenção</option>
                                    <option value={4}>Desligado</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Status de Utilização</Form.Label>
                                <Form.Select
                                    name="statusUtilizacao"
                                    value={dados.statusUtilizacao}
                                    onChange={handleChange}
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
                    </div>

                    <div className={style.filtros}>
                        {tipoConta === "Master" && ( // Apenas Master pode ver
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Trocar Estabelecimento</Form.Label>
                                    <Form.Select
                                        name="estabelecimentoId"
                                        value={dados.estabelecimentoId}
                                        onChange={handleTrocarEstabelecimento}
                                    >
                                        <option value={0}>Selecione</option>
                                        {estabelecimentos.map(est => (
                                            <option key={est.id} value={est.id}>{est.nome}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        )}
                        
                        {tipoConta === "Master" && ( // Apenas Master pode ver
                            <Col md={6}>
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
                            </Col>
                        )}
                    </div>

                    <Button type="submit" variant="primary">Salvar Alterações</Button>

                    <MensagemModal
                        show={showMensagem}
                        onClose={() => setShowMensagem(false)}
                        titulo={tipoMensagem === "sucesso" ? "Sucesso" : "Erro"}
                        mensagem={mensagem}
                        tipo={tipoMensagem}
                    />
                </Form>
            </div>
        </Sidebar >
    );
}
