import bcrypt from 'bcrypt'

const criptografarSenha = async (senha: string) => {
    return await bcrypt.hash(senha, 10)
}

const compararSenha = async (senha: string, senhaHash: string) => {
    return await bcrypt.compare(senha, senhaHash)
}

export { 
    criptografarSenha, 
    compararSenha 
}