// db.js
const mysql = require('mysql');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_mvc'
});

conexao.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao banco de dados:', erro);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida!');
});

module.exports = conexao;