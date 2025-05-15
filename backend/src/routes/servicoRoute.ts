import express from "express";
import ServicoController from '../controllers/ServicoController';
import upload from "../config/multer";
import { validarTokenAutenticacao } from "../middlewares/validarToken";

const route = express.Router()

const servicoController = new ServicoController()

route.post('/services', validarTokenAutenticacao, upload.array('files',6) ,servicoController.cadastrarServico)
route.get('/:idUsuario/services/:idServico', validarTokenAutenticacao, servicoController.obterServico);
route.get('/services', validarTokenAutenticacao, servicoController.listarServicos);
route.put('/services/:idServico', validarTokenAutenticacao, upload.single("file"), async (req, res) => {
    await servicoController.editarServico(req, res);
});
route.delete('/:idUsuario/services/:idServico', validarTokenAutenticacao, servicoController.deletarServico);

export default route;