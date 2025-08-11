import { useEffect, useState } from "react";
import { Topbar } from "../../componentes/Topbar/Topbar";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Modal, Button } from "react-bootstrap";
import MensagemModal from "../../componentes/MensagemModal/MensagemModal";

import UsuarioAPI from "../../services/usuarioAPI";
import style from "./UsuarioCoordenador.module.css";

export function UsuarioCoordenador() {

  const [busca, setBusca] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioVisualizar, setUsuarioVisualizar] = useState(null);
  const [mostrarModalVisualizacao, setMostrarModalVisualizacao] = useState(false);
  const [showMensagem, setShowMensagem] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("sucesso");

  const [usuarioLogado, setUsuarioLogado] = useState(null);
  // const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  // const estabelecimentoIdDoCoordenador = usuarioLogado?.estabelecimentoId;

  const carregarUsuarios = async (estabelecimentoId) => {
    try {
      const lista = await UsuarioAPI.listarAsync(true);

      const clientesRelevantes = lista.filter((u) =>
        u.tipoConta === 3 &&
        (

          u.estabelecimentoId === estabelecimentoId || // vinculados
          // u.historicoEstabelecimentos?.includes(estabelecimentoId) // já usaram alguma máquina
          // u.historicoEstabelecimentos && u.historicoEstabelecimentos.includes(estabelecimentoId)
          u.estabelecimentoId === estabelecimentoId || u.historicoEstabelecimentos.includes(estabelecimentoId)

        )
      );

      setUsuarios(clientesRelevantes);
    } catch (error) {
      setMensagem("Erro ao carregar usuários");
      setTipoMensagem("erro");
      setShowMensagem(true);
    }
  };



  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
    if (usuarioLocal) {
      setUsuarioLogado(usuarioLocal);
      carregarUsuarios(usuarioLocal.estabelecimentoId);
    }

  }, []);
  useEffect(() => {
    if (usuarioLogado?.estabelecimentoId) {
      carregarUsuarios(usuarioLogado.estabelecimentoId);
    }
  }, [usuarioLogado]);



  const usuariosFiltrados = usuarios.filter((u) =>
    u.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Sidebar>
      <Topbar />
      <div className={style.pagina_conteudo}>
        <h3>Clientes da Loja</h3>

        <div className={style.filtros}>
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={style.input_busca}
          />
          <button onClick={() => setBusca("")} className={style.botao_limpar}>
            ✕
          </button>
        </div>

        {usuarioLogado && (
          <div className={`${style.card_estabelecimento} ${usuarioLogado.ativo ? style.ativo : style.inativo}`}>
            <h5>{usuarioLogado.nome} (Você)</h5>
            <p>{usuarioLogado.email}</p>
            <p>
              <strong>Saldo:</strong>{" "}
              {usuarioLogado.saldo.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            <p>Status: {usuarioLogado.ativo ? "Ativo" : "Inativo"}</p>
          </div>
        )}


        <div className={style.grid_cards}>
          {usuariosFiltrados.map((usuario) => (
            <div
              key={usuario.id}
              className={`${style.card_estabelecimento} ${usuario.ativo ? style.ativo : style.inativo
                }`}
              onClick={() => {
                setUsuarioVisualizar(usuario);
                setMostrarModalVisualizacao(true);
              }}
            >
              <h5>{usuario.nome}</h5>
              <p>{usuario.email}</p>
              <p>
                <strong>Saldo:</strong>{" "}
                {usuario.saldo.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
              <p>Status: {usuario.ativo ? "Ativo" : "Inativo"}</p>
            </div>
          ))}
        </div>

        {/* Modal Visualização */}
        <Modal show={mostrarModalVisualizacao} onHide={() => setMostrarModalVisualizacao(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Dados do Cliente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Nome:</strong> {usuarioVisualizar?.nome}</p>
            <p><strong>Email:</strong> {usuarioVisualizar?.email}</p>
            <p><strong>Saldo:</strong> R$ {usuarioVisualizar?.saldo}</p>
            <p><strong>Status:</strong> {usuarioVisualizar?.ativo ? "Ativo" : "Inativo"}</p>
            <p><strong>Último Login:</strong> {usuarioVisualizar?.ultimoLogin}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarModalVisualizacao(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Mensagem */}
        <MensagemModal
          show={showMensagem}
          onClose={() => setShowMensagem(false)}
          titulo={tipoMensagem === "sucesso" ? "Sucesso" : "Erro"}
          mensagem={mensagem}
          tipo={tipoMensagem}
        />
      </div>
    </Sidebar>
  );
}
