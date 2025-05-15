import express from "express";
import TipoEventoController from "../controllers/TipoEventoController";
import { validarTokenAutenticacao } from "../middlewares/validarToken";

const route = express.Router()

const tipoEventoController = new TipoEventoController()

route.get('/tipo-evento', validarTokenAutenticacao, tipoEventoController.listarTipoEvento);

export default route;