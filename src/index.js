"use strict";
exports.__esModule = true;
var express_1 = require("express");
var mysql2_1 = require("mysql2");
var app = (0, express_1["default"])();
var port = 3000;
// Cria a conexão com o banco de dados
var connection = (0, mysql2_1.createConnection)({
    host: 'localhost',
    user: 'root',
    password: 'senha',
    database: 'mydb'
});
connection.connect(function (err) {
    if (err) {
        console.error('Erro ao conectar ao banco de dados', err);
        return;
    }
    console.log('Conexão bem sucedida ao banco de dados');
});
// Define a rota para exibir todas as reportagens
app.get('/', function (req, res) {
    // Busca todas as reportagens no banco de dados
    connection.query('SELECT * FROM posts', function (err, results) {
        if (err) {
            console.error('Erro ao buscar reportagens no banco de dados', err);
            res.status(500).send('Erro interno do servidor');
            return;
        }
        console.log("Encontradas ".concat(results.length, " reportagens no banco de dados"));
        // Renderiza a página com a lista de reportagens
        res.render('index', { posts: results });
    });
});
// Inicia o servidor na porta especificada
app.listen(port, function () {
    console.log("Servidor iniciado na porta ".concat(port));
});
