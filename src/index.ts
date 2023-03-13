import express from 'express';
import { createConnection } from 'mysql2';
import { App } from "./app/app"

const app = express();
const port = 3000;

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

// Define a rota para exibir todas as reportagens
app.get('/', (req, res) => {
  // Busca todas as reportagens no banco de dados
  connection.query(
    'SELECT * FROM posts',
    (err, results: RowDataPacket[]) => {
      if (err) {
        console.error('Erro ao buscar reportagens no banco de dados', err);
        res.status(500).send('Erro interno do servidor');
        return;
      }
      console.log(`Encontradas ${results.length} reportagens no banco de dados`);
      // Renderiza a página com a lista de reportagens
      res.render('index', { posts: results });
    }
  );
});


// Cria a rota para exibir uma reportagem específica
app.get('/reportagem/:id', (req, res) => {
  const reportagemId = req.params.id;
  // Busca a reportagem pelo ID no banco de dados
  connection.query(
    'SELECT * FROM posts WHERE id = ?',
    [reportagemId],
    (err, results) => {
      if (err) {
        console.error('Erro ao buscar reportagem no banco de dados', err);
        res.status(500).send('Erro interno do servidor');
        return;
      }
      if (results.length === 0) {
        console.error(`Reportagem com o ID ${reportagemId} não encontrada no banco de dados`);
        res.status(404).send('Reportagem não encontrada');
        return;
      }
      console.log(`Exibindo reportagem com o ID ${reportagemId}`);
      // Renderiza a página com os detalhes da reportagem
      res.render('reportagem', { reportagem: results[0] });
    }
  );
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
