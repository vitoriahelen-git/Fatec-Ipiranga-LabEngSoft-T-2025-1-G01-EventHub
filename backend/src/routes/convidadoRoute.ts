import express from 'express';
import ConvidadoController from '../controllers/ConvidadoController';
import { validarTokenAutenticacao } from '../middlewares/validarToken';

const route = express.Router();

const convidadoController = new ConvidadoController();

route.get('/obter-convidados/:idEvento', validarTokenAutenticacao, async (req, res) => {
    await convidadoController.obterConvidados(req, res);
  });
route.put('/atualizar-status-convidado/:idConvidado', validarTokenAutenticacao, convidadoController.atualizarStatusConvidadoController);
route.get('/gerar-lista-convidados/:idEvento', validarTokenAutenticacao, async(req, res) => {
  await convidadoController.gerarListaConvidados(req, res);
});

export default route;