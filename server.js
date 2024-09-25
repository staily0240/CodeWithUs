const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Staily123.',
  database: 'CodeWithUs',
});

// Conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rota para cadastro
app.post('/register', (req, res) => {
  const { email, senha, username, telefone } = req.body;

  // Logando os dados recebidos
  console.log({ email, senha, username, telefone });

  // Verificando se o e-mail já existe
  const checkQuery = 'SELECT * FROM cadastro WHERE email = ?';
  db.query(checkQuery, [email], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Erro ao verificar e-mail:", checkErr);
      return res.status(500).send("Erro ao verificar e-mail");
    }

    if (checkResults.length > 0) {
      return res.status(400).send("O e-mail já está cadastrado");
    }

    // Hash da senha
    bcrypt.hash(senha, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error("Erro ao hashear a senha:", hashErr);
        return res.status(500).send("Erro ao criar conta");
      }

      const query = "INSERT INTO cadastro (email, senha, username, telefone) VALUES (?, ?, ?, ?)";
      const values = [email, hashedPassword, username, telefone];

      db.query(query, values, (err, results) => {
        if (err) {
          console.error("Erro ao inserir dados:", err);
          return res.status(500).send("Erro ao inserir dados");
        }
        res.status(201).send("Cadastro realizado com sucesso");
      });
    });
  });
});

// Rota para login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Verificar se os campos estão preenchidos
  if (!email || !senha) {
    return res.status(400).send('Email e senha são obrigatórios');
  }

  const query = 'SELECT * FROM cadastro WHERE email = ?';
  db.query(query, [email], (error, results) => {
    if (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).send('Erro interno no login');
    }

    if (results.length > 0) {
      const user = results[0];
      // Verificando a senha
      bcrypt.compare(senha, user.senha, (compareErr, match) => {
        if (compareErr) {
          console.error('Erro ao comparar senhas:', compareErr);
          return res.status(500).send('Erro ao fazer login');
        }
        if (match) {
          return res.status(200).send('Login bem-sucedido');
        } else {
          return res.status(401).send('Email ou senha incorretos');
        }
      });
    } else {
      return res.status(401).send('Email ou senha incorretos');
    }
  });
});

// Inicializando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
