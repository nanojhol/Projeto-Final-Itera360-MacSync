import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./PaginaNaoEncontrada.module.css";
import { Topbar } from "../../componentes/Topbar/Topbar";

export function PaginaNaoEncontrada() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const timer = setTimeout(() => {
                navigate("/estabelecimentos");
            }, 5000); // 5000ms = 5 segundos

            return () => clearTimeout(timer); // limpa o timer se o componente for desmontado antes
        }
    }, []);

    return (
        <>
            <Topbar />
            <div className={style.container}>
                <h1>404 - Página não encontrada</h1>
                <p>A página que você tentou acessar não existe.</p>
                <Link to="/estabelecimentos">Voltar para a página inicial</Link>
            </div>
        </>
    );
}

