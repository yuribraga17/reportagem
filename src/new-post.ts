import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { createConnection } from 'mysql2';

const app = express();
const port = 3000;

// Configura o multer para lidar com o upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = uuidv4() + fileExtension;
    cb(null, fileName);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.mp4'];
  const fileExtension = path.extname(file.originalname);
  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limita o tamanho do arquivo em 10MB
});

// Configura o express para lidar com requisições POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cria a conexão com o banco de dados
const connection = createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados', err);
    return;
  }
  console.log('Conexão bem sucedida ao banco de dados');
});

// Define a rota de postagem de conteúdo
app.post('/post', upload.single('attachment'), (req, res) => {
  const { title, content } = req.body;

  const attachmentPath = req.file ? req.file.path.replace(/\\/g, '/') : null;

  // Insere a postagem no banco de dados
  connection.query(
    'INSERT INTO posts (title, content, attachment_path) VALUES (?, ?, ?)',
    [title, content, attachmentPath],
    (err) => {
      if (err) {
        console.error('Erro ao inserir postagem no banco de dados', err);
        res.status(500).send('Erro interno do servidor');
        return;
      }
      console.log(`Postagem "${title}" inserida com sucesso no banco de dados`);
      res.send('Postagem realizada com sucesso');
    }
  );
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
