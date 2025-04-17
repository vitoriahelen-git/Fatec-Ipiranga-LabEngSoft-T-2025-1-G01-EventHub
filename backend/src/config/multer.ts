import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file,cb)=>{
        const novoNome = file.originalname.split('.')
        cb(null, uuidv4() + '.' + novoNome[novoNome.length - 1]);
    }
});

const upload = multer({
    storage: storage
}) 
export default upload;
