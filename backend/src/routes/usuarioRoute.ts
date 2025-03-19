import express from 'express';
import UsuarioController from '../controllers/UsuarioController';
import validarTokenRedefinicaoSenha from '../middlewares/validarToken';

const route = express.Router();

const usuarioController = new UsuarioController();

route.post('/signup', usuarioController.cadastrarUsuario);
route.post("/signin", usuarioController.fazerLogin);
route.post("/forgot-password", usuarioController.esqueciSenha);
route.post("/reset-password/verify-token", validarTokenRedefinicaoSenha, usuarioController.verificarTokenRedefinicaoSenha);
route.put("/reset-password", validarTokenRedefinicaoSenha, usuarioController.redefinirSenha);
route.post("/validate-cpf", usuarioController.validarCpf);
route.post("/validate-cnpj", usuarioController.validarCnpj);
route.post("/validate-email", usuarioController.validarEmail);
route.get('/get-user/:emailUsu', usuarioController.buscarUsuarioPorEmail);
route.delete('/delete-user/:emailUsu', usuarioController.deletarUsuario);
route.put('/update-user/:emailUsu', usuarioController.atualizarUsuario);

export default route;