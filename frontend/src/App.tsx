import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './paginas/Login/Login'
import CadastroUsuario from './paginas/CadastroUsuario/CadastroUsuario'
import CadastroEvento from './paginas/CadastroEvento/CadastroEvento'
import UsuarioLayout from './componentes/UsuarioLayout/UsuarioLayout'
import EsqueciSenha from './paginas/EsqueciSenha/EsqueciSenha'
import RedefinirSenha from './paginas/RedefinirSenha/RedefinirSenha'
import Erro404 from './paginas/Erro404/Erro404'
import MeuPerfil from './paginas/MeuPerfil/MeuPerfil'
import OrganizadorLayout from './componentes/OrganizadorLayout/OrganizadorLayout'
import ProtecaoDeRota from './componentes/ProtecaoDeRota/ProtecaoDeRota'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UsuarioLayout />}>
          <Route path='login' element={<Login />}/>
          <Route path='cadastro' element={<CadastroUsuario />}/>
          <Route path='esqueci-senha' element={<EsqueciSenha />}/>
          <Route path='redefinir-senha' element={<RedefinirSenha />}/>
          <Route path='*' element={<Erro404 />}/>
        </Route>
        <Route element={<ProtecaoDeRota />}>
          <Route element={<OrganizadorLayout />}>
            <Route path='criar-evento' element={<CadastroEvento />}/>
            <Route path='meu-perfil' element={<MeuPerfil />}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App