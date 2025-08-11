import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import style from "./Topbar.module.css";
import Logo from "../../assets/Logo3.png";
import { MdOutlineDangerous } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export function Topbar({ children }) {

  const navigate = useNavigate();

  const tempoLimite = 1000 * 60 * 10; // 10 minutos
  const avisoAntecipado = 1000 * 10;  // 10 segundos antes do logout


  const usuarioNome = localStorage.getItem("usuarioNome");
  const usuarioTipo = localStorage.getItem("usuarioTipo");

  const timeoutAvisoRef = useRef(null);
  const timeoutLogoutRef = useRef(null);

  const [mostrarModalExpiracao, setMostrarModalExpiracao] = useState(false);

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  useEffect(() => {
    timeoutAvisoRef.current = setTimeout(() => {
      setMostrarModalExpiracao(true);
    }, tempoLimite - avisoAntecipado);

    timeoutLogoutRef.current = setTimeout(() => {
      localStorage.clear();
      navigate("/login");
    }, tempoLimite);

    const resetarTemporizador = () => {
      clearTimeout(timeoutAvisoRef.current);
      clearTimeout(timeoutLogoutRef.current);

      timeoutAvisoRef.current = setTimeout(() => {
        setMostrarModalExpiracao(true);
      }, tempoLimite - avisoAntecipado);

      timeoutLogoutRef.current = setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, tempoLimite);
    };

    window.addEventListener("mousemove", resetarTemporizador);
    window.addEventListener("keydown", resetarTemporizador);

    return () => {
      window.removeEventListener("mousemove", resetarTemporizador);
      window.removeEventListener("keydown", resetarTemporizador);
      clearTimeout(timeoutAvisoRef.current);
      clearTimeout(timeoutLogoutRef.current);
    };
  }, []);


  return (
    <div>
      <div className={style.topbar_conteudo}>

        <div className={style.logo_container}>
          <Link to="/estabelecimentos">
            <img src={Logo} alt="Logo" className={style.logo} />
          </Link>
        </div>

        <div className={style.usuario_info}>
          <span className={style.usuario_nome}>
            Usuário: {usuarioNome || "Usuário"}
          </span>

          <span className={style.usuario_tipo}>
            Tipo de conta: {usuarioTipo || "Conta"}
          </span>
        </div>

        <div className={style.logout_container}>
          <button onClick={logout} className={style.botao_deslogar} title="Sair">
            <MdOutlineDangerous size={24} />
          </button>
        </div>

      </div>

      <div className={style.pagina_conteudo}>{children}</div>

      <Modal show={mostrarModalExpiracao} onHide={() => setMostrarModalExpiracao(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sessão prestes a expirar</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Sua sessão irá expirar em 10 minutos por inatividade.
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            setMostrarModalExpiracao(false);
            clearTimeout(timeoutAvisoRef.current);
            clearTimeout(timeoutLogoutRef.current);
            timeoutAvisoRef.current = setTimeout(() => {
              setMostrarModalExpiracao(true);
            }, tempoLimite - avisoAntecipado);
            timeoutLogoutRef.current = setTimeout(() => {
              logout();
            }, tempoLimite);
          }}>
            Continuar conectado
          </Button>
        </Modal.Footer>

      </Modal>
    </div>
  );
}
