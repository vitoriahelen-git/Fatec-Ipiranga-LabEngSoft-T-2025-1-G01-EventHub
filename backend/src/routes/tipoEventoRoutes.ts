import express from "express";
import TipoEventoController from "../controllers/TipoEventoController";

const route = express.Router()

const tipoEventoController = new TipoEventoController()

route.get('/tipo-evento', tipoEventoController.listarTipoEvento);

export default route;