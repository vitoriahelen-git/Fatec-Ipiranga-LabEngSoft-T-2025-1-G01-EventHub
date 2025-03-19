import 'dotenv/config';
import express from 'express';
import { sincronizarBanco } from './config/database';
import cors from 'cors';
import usuarioRoute from './routes/usuarioRoute';
import eventoRoute from './routes/eventoRoute';

const app = express();

const {
    SERVER_PORT,
    URL_FRONTEND
} = process.env;

app.use(cors({origin:URL_FRONTEND}));
app.use(express.json());
app.use('/users', usuarioRoute);
app.use('/users', eventoRoute);

sincronizarBanco();

app.listen(SERVER_PORT, () => console.log(`Servidor aberto na porta ${SERVER_PORT}`));