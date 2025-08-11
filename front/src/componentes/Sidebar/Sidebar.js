import { useState } from "react";
import { Link } from "react-router-dom";
import style from "./Sidebar.module.css";
import Logo from "../../assets/Logo2.png";
import { SidebarItem } from "../SidebarItem/SidebarItem";
import { TbHomeDollar } from "react-icons/tb";
import {
  MdStoreMallDirectory,
  MdAddToQueue,
  MdPerson,
  MdOutlineAssignment,
  MdOutlineTty,
  MdOutlineViewTimeline,
} from "react-icons/md";

export function Sidebar({ children }) {

  const [expandida, setExpandida] = useState(false);
  const tipoConta = localStorage.getItem("usuarioTipo");
  // const tipoConta = parseInt(localStorage.getItem("usuarioTipo")); Buscar Por ID
  // console.log("tipoConta", tipoConta); // DEBUG

  return (
    <div>
      <div
        className={`${style.sidebar_conteudo} ${expandida ? style.expandida : ""}`}
        onMouseEnter={() => setExpandida(true)}
        onMouseLeave={() => setExpandida(false)}
      >
        {/* Visível para todos os tipos */}
        <SidebarItem expandida={expandida} icon={<MdStoreMallDirectory />} text="Estabelecimentos" link="/estabelecimentos" />
        {/* <SidebarItem expandida={expandida} text={tipoConta} /> */}

        {tipoConta === "Master" && (
          <>
            {/* <SidebarItem expandida={expandida} icon={<MdStoreMallDirectory />} text="Estabelecimentos" link="/estabelecimentos" /> */}
            <SidebarItem expandida={expandida} icon={<TbHomeDollar />} text="Minhas Lojas" link="/estabelecimentosCoordenador" />
            <SidebarItem expandida={expandida} icon={<MdAddToQueue />} text="Máquinas" link="/maquinas" />
            <SidebarItem expandida={expandida} icon={<MdPerson />} text="Usuários" link="/usuarios" />
            <SidebarItem expandida={expandida} icon={<MdOutlineAssignment />} text="Registros" link="/registros" />
            <SidebarItem expandida={expandida} icon={<MdOutlineTty />} text="Suporte" link="/chamados" />
            <SidebarItem expandida={expandida} icon={<MdOutlineViewTimeline />} text="Logs" link="/Logs" />

            {/* <SidebarItem expandida={expandida} text="______________________________" /> */}

            {/* <SidebarItem expandida={expandida} icon={<MdPerson />} text="Cliente da Loja" link="/usuarioCoordenador" /> */}
            {/* <SidebarItem expandida={expandida} icon={<MdOutlineAssignment />} text="Registros da Loja" link="/registrosCoordenador" /> */}
            {/* <SidebarItem expandida={expandida} icon={<MdOutlineTty />} text="Chamados da Loja" link="/chamadosCoordenador" /> */}

            {/* <SidebarItem expandida={expandida} text="______________________________" /> */}

            {/* <SidebarItem expandida={expandida} icon={<MdStoreMallDirectory />} text="Estabelecimentos" link="/estabelecimentosCliente" /> */}
            {/* <SidebarItem expandida={expandida} icon={<MdPerson />} text="Minha Conta" link="/usuariosCliente" /> */}
            {/* <SidebarItem expandida={expandida} icon={<MdOutlineAssignment />} text="Meus Registros" link="/registrosCliente" /> */}
            {/* <SidebarItem expandida={expandida} icon={<MdOutlineTty />} text="Suporte" link="/chamadosCliente" /> */}
          </>
        )}

        {tipoConta === "Coordenador" && (
          <>
            <SidebarItem expandida={expandida} icon={<TbHomeDollar />} text="Minhas Lojas" link="/estabelecimentosCoordenador" />
            <SidebarItem expandida={expandida} icon={<MdPerson />} text="Usuários" link="/usuarios" />
            <SidebarItem expandida={expandida} icon={<MdOutlineAssignment />} text="Registros" link="/registros" />
            <SidebarItem expandida={expandida} icon={<MdOutlineTty />} text="Suporte" link="/chamados" />
            <SidebarItem expandida={expandida} icon={<MdOutlineViewTimeline />} text="Logs" link="/Logs" />
            {/* <SidebarItem expandida={expandida} icon={<MdPerson />} text="Cliente da Loja" link="/usuario/coordenador" /> */}
            {/* <SidebarItem expandida={expandida} icon={<MdOutlineAssignment />} text="Registros da Loja" link="/registrosCoordenador" /> */}
            {/* <SidebarItem expandida={expandida} icon={<MdOutlineTty />} text="Chamados da Loja" link="/chamadosCoordenador" /> */}
          </>
        )}

        {tipoConta === "Usuario" && (
          <>
            <SidebarItem expandida={expandida} icon={<MdPerson />} text="Usuários" link="/usuarios" />
            <SidebarItem expandida={expandida} icon={<MdOutlineAssignment />} text="Registros" link="/registros" />
            <SidebarItem expandida={expandida} icon={<MdOutlineTty />} text="Suporte" link="/chamados" />
            <SidebarItem expandida={expandida} icon={<MdOutlineViewTimeline />} text="Logs" link="/Logs" />
            {/* <SidebarItem expandida={expandida} icon={<MdStoreMallDirectory />} text="Estabelecimentos" link="/estabelecimentosCliente" />
            <SidebarItem expandida={expandida} icon={<MdPerson />} text="Minha Conta" link="/usuariosCliente" />
            <SidebarItem expandida={expandida} icon={<MdOutlineAssignment />} text="Meus Registros" link="/registrosCliente" />
            <SidebarItem expandida={expandida} icon={<MdOutlineTty />} text="Suporte" link="/chamadosCliente" /> */}
          </>
        )}

      </div>

      <div className={style.pagina_conteudo}>
        {children}
      </div>

    </div>
  );
}