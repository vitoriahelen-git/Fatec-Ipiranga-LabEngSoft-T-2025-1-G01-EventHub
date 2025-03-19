import express from "express";
import EventoController from "../controllers/EventoController";

const route = express.Router()

const eventoController = new EventoController()

route.post('/:idUsuario/events', eventoController.cadastrarEvento)
route.get('/:idUsuario/events', eventoController.listarEventos)
route.get('/:idUsuario/events/:idEvento', eventoController.buscarEventoporId)
route.put('/:idUsuario/events/:idEvento', eventoController.editarEvento)
route.delete('/:idUsuario/events/:idEvento', eventoController.deletarEvento)

export default route;