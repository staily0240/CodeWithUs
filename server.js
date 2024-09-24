const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: 'Staily123.', 
  database: 'CodeWithUs',
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rota cadastro
app.post('/register', (req, res) => {
  const { email, senha } = req.body;

  const checkEmailQuery = 'SELECT * FROM cadastro WHERE email = ?';
  db.query(checkEmailQuery, [email], (error, results) => {
    if (error) {
      console.error('Erro ao verificar e-mail:', error);
      return res.status(500).send(); 
    }

    if (results.length > 0) {
      return res.status(409).send(); 
    }

    const insertQuery = 'INSERT INTO cadastro (email, senha) VALUES (?, ?)';
    db.query(insertQuery, [email, senha], (insertError) => {
      if (insertError) {
        console.error('Erro ao inserir dados:', insertError);
        return res.status(500).send(); 
      }
      res.status(201).send();
    });
  });
});

// Rota para login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const query = 'SELECT * FROM cadastro WHERE email = ? AND senha = ?';
  db.query(query, [email, senha], (error, results) => {
    if (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).send(); // Retorna 500 sem mensagem
    }

    if (results.length > 0) {
      return res.status(200).send(); // Usuário encontrado, login bem-sucedido
    } else {
      return res.status(401).send(); // Não autorizado (401), credenciais inválidas
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
