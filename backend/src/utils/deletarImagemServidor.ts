import fs from 'fs/promises';
import path from 'path';


export const deletarImagemServidor = async(imagem: string) => {
    const caminhoImagem = path.join(__dirname,'../../uploads/', imagem);

    try {
        await fs.unlink(caminhoImagem);
        console.log(`Imagem ${imagem} deletada com sucesso.`);
    } catch (error) {
        console.error(`Erro ao deletar a imagem ${imagem}:`, error);
    }

}
