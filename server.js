const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Staily123.', 
    database: 'CodeWithUs' 
  });

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL!');
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('../html/cadastro.html', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  const query = 'INSERT INTO cadastro (email, senha) VALUES (?, ?)';
  
  db.query(query, [email, senha], (err, results) => {
    if (err) {
      console.error('Erro ao cadastrar:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar.' });
    }

    res.json({ message: 'Cadastro realizado com sucesso!' });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); 
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

