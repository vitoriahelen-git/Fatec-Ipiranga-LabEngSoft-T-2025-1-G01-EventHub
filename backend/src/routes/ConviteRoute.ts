import express from 'express';
import ConviteController from '../controllers/ConviteController';
import { validarTokenAutenticacao } from '../middlewares/validarToken';

const route = express.Router();

const conviteController = new ConviteController();

route.get('/obter-convites/:idEvento', validarTokenAutenticacao, async (req, res) => {
    await conviteController.obterConvite(req, res);
  });

route.post('/gerar-convite/:idEvento', validarTokenAutenticacao, async (req, res) => {
    await conviteController.gerarConvite(req, res);
});

route.delete('/deletar-convite/:idConvite', validarTokenAutenticacao, async (req, res) => {
    await conviteController.deletarConvite(req, res);
});

route.get('/convites/:idConvite', conviteController.buscarEventoPorConvite); 

route.post("/confirmar-convite/:idConvite", conviteController.confirmarConvite); 

route.get('/verificar-convite/:idConvite', conviteController.verificarConvite);



export default route;