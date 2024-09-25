create database CodeWithUs;

use CodeWithUs;

CREATE TABLE IF NOT EXISTS login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    criado_as TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cadastro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE, 
    telefone VARCHAR(20),                  
    criado_as TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progresso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    html INT NOT NULL,
    css INT NOT NULL,
    javascript INT NOT NULL,
    mysql INT NOT NULL,
    git INT NOT NULL
);

INSERT INTO login (email, senha) VALUES ('exemplo@dominio.com', 'senha123');
INSERT INTO cadastro (email, senha) VALUES ('exemplo2@dominio.com', 'senha456');

INSERT INTO progresso (html, css, javascript, mysql, git) 
VALUES (80, 90, 75, 60, 85);

truncate table login;