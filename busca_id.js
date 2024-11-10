const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Criar a conexão com o banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Staily123.',
    database: 'CodeWithUs'
});

// Função para buscar a imagem pelo ID
function buscarImagemPorId(userId, callback) {
    const sql = "SELECT imagem FROM faceid WHERE id = ?";
    
    connection.execute(sql, [userId], (err, results) => {
        if (err) {
            console.error("Erro ao buscar imagem:", err);
            callback(err, null);
            return;
        }

        if (results.length > 0) {
            // A imagem será retornada como Buffer
            const imagemBuffer = results[0].imagem;
            callback(null, imagemBuffer);
        } else {
            callback("ID não encontrado!", null);
        }
    });
}

// Função para garantir que a pasta exista
function garantirPastaExistente(caminho) {
    if (!fs.existsSync(caminho)) {
        fs.mkdirSync(caminho, { recursive: true });
    }
}

// Exemplo de uso: buscar imagem com o ID 1
const userId = 1;

// Caminho da pasta onde as imagens serão salvas
const pastaImgsFaceId = path.join(__dirname, 'imgs_faceid');

// Garantir que a pasta exista
garantirPastaExistente(pastaImgsFaceId);

// Buscar a imagem e salvar na pasta imgs_faceid
buscarImagemPorId(userId, (err, imagemBuffer) => {
    if (err) {
        console.log("Erro:", err);
    } else {
        // Definir o caminho para salvar a imagem
        const caminhoImagem = path.join(pastaImgsFaceId, `imagem_face_id_${userId}.jpg`);
        
        // Salvar a imagem em um arquivo dentro da pasta imgs_faceid
        fs.writeFile(caminhoImagem, imagemBuffer, (err) => {
            if (err) {
                console.error("Erro ao salvar a imagem:", err);
            } else {
                console.log(`Imagem salva como ${caminhoImagem}`);
            }
        });
    }
});

// Fechar a conexão ao banco de dados
connection.end();
