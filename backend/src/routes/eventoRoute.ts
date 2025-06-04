import express from "express";
import EventoController from "../controllers/EventoController";
import upload from "../config/multer";
import { validarTokenAutenticacao } from "../middlewares/validarToken";

const route = express.Router()

const eventoController = new EventoController();

route.post('/:idUsuario/events', validarTokenAutenticacao, upload.single("file"), eventoController.cadastrarEvento);
route.get('/events', validarTokenAutenticacao, eventoController.listarEventos);
route.get('/:idUsuario/events/:idEvento', validarTokenAutenticacao, eventoController.buscarEventoporId);
route.put('/events/:idEvento', validarTokenAutenticacao, upload.single("file"), async (req, res) => {
    await eventoController.editarEvento(req, res);
});
route.delete('/:idUsuario/events/:idEvento', validarTokenAutenticacao, eventoController.deletarEvento);
route.put('/events/:idEvento/atualizar-acompanhantes', validarTokenAutenticacao, async (req, res) => {
    await eventoController.atualizarQtdMaxAcompanhantes(req,res);
});

export default route;