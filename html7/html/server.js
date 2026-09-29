const http = require('http');
const fs = require('fs');
const path = require('path');

const PORTA = 3000;
// Garante o caminho absoluto correto para o arquivo 'linha.json'
const caminhoJson = path.join(__dirname, 'linha.json');

const servidor = http.createServer((req, res) => {
    // Configura os cabeçalhos para responder JSON e aceitar conexões do Live Server (CORS)
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    // Trata requisições OPTIONS (comum quando o Live Server faz requisições)
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    }

    // Verifica se a URL acessada começa com a rota correta da sua API
    if (req.url.startsWith('/api/rota/')) {
        // Extrai o ID digitado na URL (ex: de '/api/rota/101' extrai '101')
        const urlPartes = req.url.split('/');
        const idBuscado = urlPartes[urlPartes.length - 1];

        // Verifica se o arquivo de dados existe na pasta
        if (!fs.existsSync(caminhoJson)) {
            res.statusCode = 404;
            return res.end(JSON.stringify({
                "erro": "Banco de dados interno 'linhas.json' não foi localizado no servidor."
            }));
        }

        try {
            // Lê o arquivo JSON
            const dadosArquivo = fs.readFileSync(caminhoJson, 'utf8');
            const listaLinhas = JSON.parse(dadosArquivo);

            // Procura no JSON a linha que tem o ID correspondente
            const linhaEncontrada = listaLinhas.find(l => l.id == idBuscado);

            if (linhaEncontrada) {
                res.statusCode = 200;
                return res.end(JSON.stringify(linhaEncontrada));
            } else {
                res.statusCode = 404;
                return res.end(JSON.stringify({ "erro": `Linha com ID ${idBuscado} não foi encontrada.` }));
            }

        } catch (erro) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ "erro": "Erro interno ao ler o banco de dados." }));
        }
    }

    // Se acessar qualquer outra rota que não seja /api/rota/:id
    res.statusCode = 404;
    res.end(JSON.stringify({ "erro": "Rota não encontrada. Use /api/rota/:id" }));
});

servidor.listen(PORTA, () => {
    console.log("=========================================");
    console.log("Servidor de Telemetria Operacional Ativo!");
    console.log(`Endpoint: http://localhost:${PORTA}/api/rota/:id`);
    console.log("=========================================");
});
