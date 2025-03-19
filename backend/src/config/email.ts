import 'dotenv/config';
import nodemailer from "nodemailer";

const {
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_HOST,
    EMAIL_PORT,
} = process.env;

const transportador = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: true
    }
});

export default transportador;