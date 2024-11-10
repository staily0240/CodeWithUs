const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Staily123.',
    database: 'CodeWithUs'
});

function buscarImagemPorId(userId, callback) {
    const sql = "SELECT imagem FROM faceid WHERE id = ?";
    
    connection.execute(sql, [userId], (err, results) => {
        if (err) {
            console.error("Erro ao buscar imagem:", err);
            callback(err, null);
            return;
        }

        if (results.length > 0) {
            const imagemBuffer = results[0].imagem;
            callback(null, imagemBuffer);
        } else {
            callback("ID não encontrado!", null);
        }
    });
}

function garantirPastaExistente(caminho) {
    if (!fs.existsSync(caminho)) {
        fs.mkdirSync(caminho, { recursive: true });
    }
}

const userId = 1;

const pastaImgsFaceId = path.join(__dirname, 'imgs_faceid');

garantirPastaExistente(pastaImgsFaceId);

buscarImagemPorId(userId, (err, imagemBuffer) => {
    if (err) {
        console.log("Erro:", err);
    } else {
        const caminhoImagem = path.join(pastaImgsFaceId, `imagem_face_id_${userId}.jpg`);
        
        fs.writeFile(caminhoImagem, imagemBuffer, (err) => {
            if (err) {
                console.error("Erro ao salvar a imagem:", err);
            } else {
                console.log(`Imagem salva como ${caminhoImagem}`);
            }
        });
    }
});

connection.end();
