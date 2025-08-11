import { useState } from "react";
import style from "./Login.module.css";
import Logo from "../../assets/Logo3.png";
import gear from "../../assets/gear1.png";
import { useNavigate } from "react-router-dom";
import BotaoLogin from "../../componentes/BotaoLogin/BotaoLogin";
import LoginAPI from "../../services/loginAPI";

export function Login() {

  const [etapa, setEtapa] = useState(1);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailErro, setEmailErro] = useState("");
  const [senhaErro, setSenhaErro] = useState("");
  const [tentativas, setTentativas] = useState(0);

  const navigate = useNavigate();


  async function nextStep() {
    setEmailErro(""); // limpa erro anterior

    if (!email.includes("@")) {
      setEmailErro("Digite um e-mail válido!");
      return;
    }


    try {
      const existe = await LoginAPI.verificarEmail(email);
      if (existe) {
        setEtapa(2); // segue normalmente
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setEmailErro("Este e-mail não está cadastrado.");
      } else if (error.response?.status === 423) {
        setEmailErro("Usuário bloqueado. Entre em contato com o suporte.");
      } else {
        setEmailErro("Erro ao verificar o e-mail. Tente novamente.");
      }
    }

  }

  async function loginValid() {
    if (senha.length < 3) {
      setSenhaErro("Senha inválida.");
      return;
    }
    
    setLoading(true);
    try {
      const resposta = await LoginAPI.fazerLogin(email, senha);
      
      // Login bem-sucedido
      localStorage.setItem("token", resposta.token);
      localStorage.setItem("usuarioId", resposta.id);
      localStorage.setItem("usuarioNome", resposta.nome);
      localStorage.setItem("usuarioTipo", resposta.tipoUsuario);
      
      if (resposta.estabelecimentoId) {
        localStorage.setItem("estabelecimentoId", resposta.estabelecimentoId);
        console.log("resposta do login", resposta);
      }

      // alert("Login realizado com sucesso!");
      navigate("/usuarios");

    } catch (error) {
      const novasTentativas = tentativas + 1;
      setTentativas(novasTentativas);

      if (novasTentativas >= 3) {
        setSenhaErro("Usuário bloqueado. Entre em contato com o suporte.");
        alert("Usuário bloqueado. Entre em contato em '4002-8922'");

        try {
          await LoginAPI.inativarUsuarioPorEmail(email); // 👈 função nova na API
        } catch (erroInterno) {
          console.error("Erro ao inativar usuário:", erroInterno);
        }

      } else {
        setSenhaErro(`Senha incorreta. Tentativa ${novasTentativas} de 3.`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={style.container}>
      <div className={style.card}>

        <div className={style.logo_container}>
          <img src={Logo} alt="Logo" className={style.logo} />
        </div>

        {etapa === 1 && (
          <div>
            <img src={gear} alt="Engrenagem" className={`${style.gear} ${style.placeholder}`} />

            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={emailErro ? style.erroInput : ""}
            />
            {emailErro && <p className={style.erroMensagem}>{emailErro}</p>}


            <BotaoLogin
              label="Avançar"
              variant="primary"
              type="button"
              onClick={nextStep}
            >
              Avançar
            </BotaoLogin>
          </div>
        )}

        {etapa === 2 && (
          <div>
            <img src={gear} alt="Engrenagem" className={style.gearImg} />
            <p id="emailDisplay">{email}</p>

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setSenhaErro(""); // limpa erro ao digitar novamente
              }}
              className={senhaErro ? style.erroInput : ""}
            />
            {senhaErro && <p className={style.erroMensagem}>{senhaErro}</p>}

            <BotaoLogin
              label={loading ? "Entrando..." : "Entrar"}
              variant="primary"
              type="button"
              onClick={loginValid}
              disabled={loading || tentativas >= 3}
              className={tentativas >= 3 ? style.botaoDesativado : ""}
            >Avançar
            </BotaoLogin>

            {tentativas < 3 && (
              <p className={style.link}>
                <a href="/login/recuperar-senha">Esqueci minha senha</a>
              </p>
            )}

          </div>
        )}
      </div>
    </div>
  );
}










// import { useState } from "react";
// import style from "./Login.module.css";
// import gear from "../../assets/gear1.png";
// import { useNavigate } from "react-router-dom";
// import BotaoLogin from "../../componentes/BotaoLogin/BotaoLogin";

// export function Login() {
//   const [etapa, setEtapa] = useState(1);
//   const [email, setEmail] = useState("");
//   const [senha, setSenha] = useState("");
//   const navigate = useNavigate();

//   const usuariosMock = [
//     { email: "nanojhol@gmail.com", senha: "123456" }
//   ];

//   function nextStep() {
//     if (!email.includes("@")) {
//       alert("Digite um e-mail válido!");
//       return;
//     }
//     setEtapa(2);
//   }

//   function loginValid() {
//     const usuarioValido = usuariosMock.find(
//       (u) => u.email === email && u.senha === senha
//     );

//     if (usuarioValido) {
//       alert("Login realizado com sucesso!");
//       navigate("/");
//     } else {
//       alert("E-mail ou senha incorretos!");
//     }
//   }

//   return (
//     <div className={style.container}>
//       <div className={style.card}>
//         <h1 className={style.logo}>Mac<span>Sinc</span></h1>

//         {etapa === 1 && (
//           <div>
//             <img src={gear} alt="Engrenagem" className={`${style.gear} ${style.placeholder}`} />
//             <input
//               type="email"
//               placeholder="Digite seu e-mail"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />


//             <BotaoLogin
//               label="Salvar"
//               variant="primary"
//               type="submit"
//               onClick={nextStep}
//             >
//               Avançar
//             </BotaoLogin>
//           </div>
//         )}

//         {etapa === 2 && (
//           <div>
//             <img src={gear} alt="Engrenagem" className={style.gearImg} />
//             <p id="emailDisplay">{email}</p>
//             <input
//               type="password"
//               placeholder="Senha"
//               value={senha}
//               onChange={(e) => setSenha(e.target.value)}
//             />
//             <BotaoLogin
//               label="Salvar"
//               variant="primary"
//               type="submit"
//               onClick={loginValid}
//               className={style.link}
//             >
//               Avançar
//             </BotaoLogin>

//             <p><a href="#">Esqueci minha senha</a> </p>
//           </div>
//         )}
//       </div>
//     </div >
//   );
// }











// import { useState } from "react";
// import style from "./Login.module.css";
// import gear from "../../assets/gear1.png"; // substitui por seu caminho real da engrenagem
// import { Navigate } from "react-router-dom";

// export function Login() {
//     const [etapa, setEtapa] = useState(1);
//     const [email, setEmail] = useState("");
//     const [senha, setSenha] = useState("");

//     function nextStep() {
//         if (!email.includes("@")) {
//             alert("Digite um e-mail válido!");
//             return;
//         }
//         setEtapa(2);
//     }

//     function loginValid() {
//         if (senha.length < 3) {
//             alert("Senha muito curta!");
//         } else {
//             alert("Login realizado com sucesso!");
//             // Aqui pode redirecionar ou usar fetch
//         }
//     }

//     return (
//         <div className={style.container}>
//             <div className={style.card}>
//                 <h1 className={style.logo}>Mac<span>Sinc</span></h1>

//                 {etapa === 1 && (
//                     <div>
//                         <img src={gear} alt="Engrenagem" className={`${style.gear} ${style.placeholder}`} />
//                         <input
//                             type="email"
//                             placeholder="Digite seu e-mail"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//                         <button onClick={nextStep}>Avançar</button>
//                     </div>
//                 )}

//                 {etapa === 2 && (
//                     <div>
//                         <img src={gear} alt="Engrenagem" className={style.gearImg} />
//                         <p>{email}</p>
//                         <input
//                             type="password"
//                             placeholder="Senha"
//                             value={senha}
//                             onChange={(e) => setSenha(e.target.value)}
//                         />
//                         <button onClick={Navigate("/estabelecimento/editar")} className={style.botao_icone} >Entrar</button>
//                         <p className={style.link}>
// {/*
//                             <button
//                                 className={style.botao_icone}
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     navigate("/estabelecimento/editar", { state: est.id });
//                                 }}
//                             ></button> */}
//                             <a href="#">Esqueci minha senha</a>
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }










// import Logo from "../../assets/LogoAzul.png";
// import style from "./Login.module.css";
// import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// import { useNavigate, Link } from 'react-router-dom'
// import { useEffect, useState } from "react";
// import LoginAPI from "../../services/loginAPI";

// export function Login() {

//     const [email, setEmail] = useState('');
//     const [senha, setSenha] = useState('');

//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (isFormValid()) {
//             //await LoginAPI.fazerLogin(email, senha);
//             navigate('/usuarios');
//         } else {
//             alert('Por favor, preencha todos os campos.');
//         }
//     };

//     const isFormValid = () => {
//         //return email && senha;
//         return true;
//     };

//     return (
//         <div className={style.background}>
//         <div className="d-flex justify-content-center align-items-center w-100 h-100">
//             <Container>
//             <Row className="justify-content-center">
//                 <Col xs={10} sm={8} md={5} lg={4}>
//                 <Form onSubmit={handleSubmit}>
//                     <Button type="submit" className={style.btnlaranja}>
//                     Entrar
//                     </Button>
//                 </Form>
//                 </Col>
//             </Row>
//             </Container>
//         </div>
//         </div>
//     );
// }

// export default Login;
