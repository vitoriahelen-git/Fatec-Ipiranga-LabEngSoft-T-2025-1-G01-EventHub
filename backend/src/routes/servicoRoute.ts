import express from "express";
import ServicoController from '../controllers/ServicoController';
import upload from "../config/multer";
import { validarTokenAutenticacao } from "../middlewares/validarToken";

const route = express.Router()

const servicoController = new ServicoController()

route.post('/services', validarTokenAutenticacao, upload.array('files',6) ,servicoController.cadastrarServico)
route.get('/:idUsuario/services/:idServico', validarTokenAutenticacao, servicoController.obterServico);
route.get('/services', validarTokenAutenticacao, servicoController.listarServicos);
route.put('/services/:idServico', validarTokenAutenticacao, upload.array("files"), async (req, res) => {
    await servicoController.editarServico(req, res);
});
route.delete('/:idUsuario/services/:idServico', validarTokenAutenticacao, servicoController.deletarServico);
route.put('/services/:idServico/anunciar', validarTokenAutenticacao, async (req, res) => {
        await servicoController.anunciarServico(req, res);
});
route.put('/services/:idServico/encerrar-anuncio', validarTokenAutenticacao, async (req, res) => {
    await servicoController.encerrarAnuncioServico(req, res);
}
);
route.get('/services/obter-anuncios', validarTokenAutenticacao, async (req, res) => {
    await servicoController.consultarServicosAnunciados(req, res);
});
export default route;