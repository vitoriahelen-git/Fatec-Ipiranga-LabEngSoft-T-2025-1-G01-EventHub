import 'dotenv/config';
import express from 'express';
import { sincronizarBanco } from './config/database';
import cors from 'cors';
import usuarioRoute from './routes/usuarioRoute';
import eventoRoute from './routes/eventoRoute';
import convidadoRoute from './routes/convidadoRoute';
import tipoEventoRoute from './routes/tipoEventoRoutes';
import conviteRoute from './routes/ConviteRoute';
import servicoRoute from './routes/servicoRoute';
import tipoServicoRoute from './routes/tipoServicoRoute'

const app = express();

const {
    SERVER_PORT,
    URL_FRONTEND
} = process.env;

app.use(cors({origin:URL_FRONTEND}));
app.use(express.json());
app.use('/', express.static('public'));
app.use('/files', express.static('uploads'));
app.use('/users', usuarioRoute);
app.use('/users', eventoRoute);
app.use('/users', convidadoRoute);
app.use('/users',tipoEventoRoute);
app.use('/users', conviteRoute);
app.use('/users',servicoRoute);
app.use('/users',tipoServicoRoute);

sincronizarBanco();

app.listen(SERVER_PORT, () => console.log(`Servidor aberto na porta ${SERVER_PORT}`));