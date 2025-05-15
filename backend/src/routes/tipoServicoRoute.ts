import TipoServicoController from '../controllers/TipoServicoController'
import express from "express";
import { validarTokenAutenticacao } from "../middlewares/validarToken";

const route = express.Router()

const tipoServicoController = new TipoServicoController()

route.get('/tipo-servico',validarTokenAutenticacao,tipoServicoController.listarTiposServico)

export default route