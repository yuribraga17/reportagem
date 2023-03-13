import express from 'express';
import bodyParser from 'body-parser';
import { createConnection } from 'mysql2';
import path from 'path';

const app = express();
const port = 3000;

// Configura o body-parser para lidar com requisições POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define a pasta para os arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

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

// Define a rota para a página de registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'register.html'));
});

// Define a rota para o envio do formulário de registro
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Insere o usuário no banco de dados
  connection.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    (err) => {
      if (err) {
        console.error('Erro ao inserir usuário no banco de dados', err);
        res.status(500).send('Erro interno do servidor');
        return;
      }
      console.log(`Usuário ${name} inserido com sucesso no banco de dados`);
      res.send('Usuário registrado com sucesso');
    }
  );
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});