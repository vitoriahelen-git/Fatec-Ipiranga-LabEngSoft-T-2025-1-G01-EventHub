import express from 'express';
import UsuarioController from '../controllers/UsuarioController';
import {validarTokenAutenticacao, validarTokenRedefinicaoSenha} from '../middlewares/validarToken';
import upload from '../config/multer';

const route = express.Router();

const usuarioController = new UsuarioController();

route.post('/signup', usuarioController.cadastrarUsuario);
route.post("/signin", usuarioController.fazerLogin);
route.post("/forgot-password", usuarioController.esqueciSenha);
route.post("/reset-password/verify-token", validarTokenRedefinicaoSenha, usuarioController.verificarTokenRedefinicaoSenha);
route.put("/reset-password", validarTokenRedefinicaoSenha, usuarioController.redefinirSenha);
route.get("/authenticate", validarTokenAutenticacao, usuarioController.autenticarUsuario);
route.post("/validate-cpf", usuarioController.validarCpf);
route.post("/validate-cnpj", usuarioController.validarCnpj);
route.post("/validate-email", usuarioController.validarEmail);
route.get('/get-user', validarTokenAutenticacao, usuarioController.buscarUsuarioPorEmail);
route.delete('/delete-user', validarTokenAutenticacao, usuarioController.deletarUsuario);
route.put('/update-user', validarTokenAutenticacao, usuarioController.atualizarUsuario);
route.put('/update-image', validarTokenAutenticacao, upload.single('file'), usuarioController.alterarFotoUsuario);
route.put('/update-image-empresa', validarTokenAutenticacao, upload.single('file'), usuarioController.alterarFotoPrestador);

export default route;

