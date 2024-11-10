const fs = require('fs');
const mysql = require('mysql2');

const imagem = fs.readFileSync('imgs/pessoacerta.jpg');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Staily123.',
    database: 'CodeWithUs'
});

const sql = "INSERT INTO faceid (imagem) VALUES (?)";
connection.execute(sql, [imagem], (err, results) => {
    if (err) {
        console.error("Erro ao salvar a imagem:", err);
    } else {
        console.log("Imagem salva no banco com sucesso!");
    }
    connection.end();
});
