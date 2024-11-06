const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

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

// Rota para inserir o progresso na coluna html
app.post('/atualizar-progresso', (req, res) => {
  const valor_html = 33;
  const valor_css = 0;
  const valor_javascript = 0;
  const valor_mysql = 0;
  const valor_git = 0;

  const insertSql = `INSERT INTO progresso (html, css, javascript, mysql, git) VALUES (?, ?, ?, ?, ?)`;

  db.query(insertSql, [valor_html, valor_css, valor_javascript, valor_mysql, valor_git], (err, insertResult) => {
    if (err) {
      console.error("Erro ao inserir:", err);
      return res.status(500).json({ status: 'erro', message: err.message });
    }

  });
});

// Rota para atualizar o valor onde o id é 1
app.post('/update-value', (req, res) => {
  const newValue = 66;
  const updateQuery = 'UPDATE progresso SET html = ? WHERE id = 1';

  db.query(updateQuery, [newValue], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar o valor:', err);
      return res.status(500).send('Erro ao atualizar o valor');
    }

    res.send('Valor atualizado com sucesso');
  });
});

// Rota para atualizar o valor onde o id é 1 (para o botão 91)
app.post('/update-value-91', (req, res) => {
  const newValue = 100;
  const updateQuery = 'UPDATE progresso SET html = ? WHERE id = 1';

  db.query(updateQuery, [newValue], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar o valor para o botão 91:', err);
      return res.status(500).send('Erro ao atualizar o valor para o botão 91');
    }
  });
});

// Rota para obter o progresso
app.get('/get-progress', (req, res) => {
  const query = 'SELECT html FROM progresso WHERE id = 1';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Erro ao buscar o progresso:', err);
      return res.status(500).send('Erro ao buscar o progresso');
    }

    if (result.length > 0) {
      res.json({ progress: result[0].html });
    } else {
      res.status(404).send('Progresso não encontrado');
    }
  });
});

// Rota para buscar os dados
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT username, email, telefone FROM cadastro WHERE id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      res.status(500).send('Erro ao buscar dados do usuário');
    } else {
      res.json(results[0]); // Retorna o primeiro resultado como JSON
    }
  });
});

// Rota para Atualizar os Dados
app.use(express.json());

app.post('/update-user', async (req, res) => {
  const { userId, field, value } = req.body;

  try {
    let query;
    let values;

    if (field === 'password') {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(value, saltRounds);
      query = 'UPDATE cadastro SET senha = ? WHERE id = ?';
      values = [hashedPassword, userId];
    } else if (field === 'nickname') {
      query = 'UPDATE cadastro SET username = ? WHERE id = ?';
      values = [value, userId];
    } else if (field === 'phone') {
      query = 'UPDATE cadastro SET telefone = ? WHERE id = ?';
      values = [value, userId];
    } else {
      return res.status(400).json({ success: false, message: 'Campo inválido' });
    }

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Erro ao atualizar o banco de dados:', err);
        res.status(500).json({ success: false });
      } else {
        res.json({ success: true });
      }
    });
  } catch (error) {
    console.error('Erro ao criptografar a senha:', error);
    res.status(500).json({ success: false });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
