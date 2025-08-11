import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PrivateRoute from './routes/PrivateRoute';
import { Login } from './paginas/Login/Login';
import { NovaSenha } from './paginas/NovaSenha/NovaSenha';
import { EsqueciMinhaSenha } from './paginas/EsqueciMinhaSenha/EsqueciMinhaSenha';
import { PaginaNaoEncontrada } from './paginas/PaginaNaoEncontrada/PaginaNaoEncontrada';

import { Usuarios } from './paginas/Usuarios/Usuarios';
import { NovoUsuario } from './paginas/NovoUsuario/NovoUsuario';
import { EditarUsuario } from './paginas/EditarUsuario/EditarUsuario';
// import { UsuarioCoordenador } from "./paginas/ClienteCoordenador/usuariosCoordenador";

import { Maquinas } from './paginas/Maquinas/Maquinas';
import { NovaMaquinas } from './paginas/NovaMaquinas/NovaMaquinas';
import { EditarMaquinas } from './paginas/EditarMaquinas/EditarMaquinas';
import { ConsultaMaquina } from './paginas/ConsultaMaquina/ConsultaMaquina';

import { Estabelecimentos } from './paginas/Estabelecimento/Estabelecimento';
import { NovoEstabelecimento } from './paginas/NovoEstabelecimento/NovoEstabelecimento';
import { EditarEstabelecimento } from './paginas/EditarEstabelecimento/EditarEstabelecimento';
import { ConsultaEstabelecimento } from './paginas/ConsultaEstabelecimento/ConsultaEstabelecimento';
import { EstabelecimentosCoordenador } from './paginas/ClienteCoordenador/estabelecimentosCoordenador.js';

import { Chamado } from './paginas/Chamados/Chamados';
import { NovoChamado } from './paginas/NovoChamado/NovoChamado';
import { EditarChamado } from './paginas/EditarChamado/EditarChamado';

import { Registros } from './paginas/Registros/Registros';
import { LogDeAcao } from './paginas/LogDeAcao/LogDeAcao';
import { UsuarioCoordenador } from './paginas/ClienteCoordenador/usuariosCoordenador.js';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/recuperar-senha" element={<EsqueciMinhaSenha />} />
        <Route path="/login/nova-senha" element={<NovaSenha />} />

        {/* Rota coringa (404) */}
        <Route path="*" element={<PaginaNaoEncontrada />} />

        {/* Rotas protegidas */}
        <Route element={<PrivateRoute />}>

          {/* Rotas protegidas */}
          <Route path="/" element={<Usuarios />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuario/novo" element={<NovoUsuario />} />
          <Route path="/usuario/editar" element={<EditarUsuario />} />
          <Route path="/usuario/coordenador" element={<UsuarioCoordenador />} />

          <Route path='/maquinas' element={<Maquinas />} />
          <Route path='/maquinas/nova' element={<NovaMaquinas />} />
          <Route path='/maquinas/editar' element={<EditarMaquinas />} />
          <Route path='/maquina/consulta/:id' element={<ConsultaMaquina />} />

          <Route path="/estabelecimentos" element={<Estabelecimentos />} />
          <Route path="/estabelecimento/novo" element={<NovoEstabelecimento />} />
          <Route path="/estabelecimento/editar" element={<EditarEstabelecimento />} />
          <Route path="/estabelecimento/consulta/:id" element={<ConsultaEstabelecimento />} />
          <Route path="/estabelecimentosCoordenador" element={<EstabelecimentosCoordenador />} />


          <Route path="/registros" element={<Registros />} />

          <Route path="/chamados" element={<Chamado />} />
          <Route path="/chamado/editar" element={<EditarChamado />} />
          <Route path="/chamado/novo" element={<NovoChamado />} />
          
          <Route path="/logs" element={<LogDeAcao />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;










// import './App.css';
// import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
// import { Home } from './paginas/Home/Home';
// import { Login } from './paginas/Login/Login';
// import { EsqueciMinhaSenha } from './paginas/EsqueciMinhaSenha/EsqueciMinhaSenha';
// import { Usuarios } from './paginas/Usuarios/Usuarios';
// import { NovoUsuario } from './paginas/NovoUsuario/NovoUsuario';
// import { EditarUsuario } from './paginas/EditarUsuario/EditarUsuario';
// import { Maquinas } from './paginas/Maquinas/Maquinas';
// import { NovaMaquinas } from './paginas/NovaMaquinas/NovaMaquinas';
// import { EditarMaquinas } from './paginas/EditarMaquinas/EditarMaquinas';
// import { ConsultaMaquina } from './paginas/ConsultaMaquina/ConsultaMaquina';
// import { Estabelecimentos } from './paginas/Estabelecimento/Estabelecimento';
// import { NovoEstabelecimento } from './paginas/NovoEstabelecimento/NovoEstabelecimento';
// import { EditarEstabelecimento } from './paginas/EditarEstabelecimento/EditarEstabelecimento';
// import { ConsultaEstabelecimento } from './paginas/ConsultaEstabelecimento/ConsultaEstabelecimento';
// import { Registros } from './paginas/Registros/Registros';
// import { Chamado } from './paginas/Chamados/Chamados';
// import { EditarChamado } from './paginas/EditarChamado/EditarChamado';
// import { LogDeAcao } from './paginas/LogDeAcao/LogDeAcao';
// import { NovoChamado } from './paginas/NovoChamado/NovoChamado';
// import PrivateRoute from './routes/PrivateRoute';



// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Rotas protegidas */}
//         <Route element={<PrivateRoute />}>
//         {/* <Route path="/" element={<Login />} /> */}
//         <Route path="/" element={<Usuarios />} />
//         {/* Adicione outras rotas privadas aqui */}
//         {/* <Route path="/" element={<Navigate to="/estabelecimentos" />} /> */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/login/recuperar-senha" element={<EsqueciMinhaSenha />} />
//         {/* <Route path="/usuarios" element={<Usuarios />} /> */}
//         <Route path="/usuarios" element={<Usuarios />} />
//         <Route path="/usuario/novo" element={<NovoUsuario />} />
//         <Route path="/usuario/editar" element={<EditarUsuario />} />
//         <Route path='/maquinas' element={<Maquinas />} />
//         <Route path='/maquinas/nova' element={<NovaMaquinas />} />
//         <Route path='/maquinas/editar' element={<EditarMaquinas />} />
//         <Route path='/maquina/consulta/:id' element={<ConsultaMaquina />} />
//         <Route path="/estabelecimentos" element={<Estabelecimentos />} />
//         <Route path="/estabelecimento/novo" element={<NovoEstabelecimento />} />
//         <Route path="/estabelecimento/editar" element={<EditarEstabelecimento />} />
//         <Route path="/estabelecimento/consulta/:id" element={<ConsultaEstabelecimento />} />
//         <Route path="/registros" element={<Registros />} />
//         <Route path="/chamados" element={<Chamado />} />
//         <Route path="/chamado/editar" element={<EditarChamado />} />
//         <Route path="/chamado/Novo" element={<NovoChamado />} />
//         <Route path="/logs" element={<LogDeAcao />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;