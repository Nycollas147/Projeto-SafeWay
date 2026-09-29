from http.server import HTTPServer, BaseHTTPRequestHandler
import os
import json

PORTA = 3000
# Define o caminho absoluto correto do arquivo JSON
DIRETORIO_ATUAL = os.path.dirname(os.path.abspath(__file__))
CAMINHO_JSON = os.path.join(DIRETORIO_ATUAL, 'linhas.json')

class ManipuladorServidor(BaseHTTPRequestHandler):
    def do_GET(self):
        # Configura os cabeçalhos de resposta
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_headers()

        # Verifica se o arquivo existe na pasta
        if not os.path.exists(CAMINHO_JSON):
            resposta_erro = {
                "erro": "Banco de dados interno 'linhas.json' não foi localizado no servidor."
            }
            self.wfile.write(json.dumps(resposta_erro, ensure_ascii=False).encode('utf-8'))
            return

        try:
            # Lê o JSON e envia para o navegador/cliente
            with open(CAMINHO_JSON, 'r', encoding='utf-8') as arquivo:
                dados = arquivo.read()
                self.wfile.write(dados.encode('utf-8'))
        except Exception:
            resposta_erro = {"erro": "Erro interno ao ler o banco de dados."}
            self.wfile.write(json.dumps(resposta_erro).encode('utf-8'))

if __name__ == '__main__':
    servidor = HTTPServer(('localhost', PORTA), ManipuladorServidor)
    print(f"Servidor rodando em http://localhost:{PORTA}")
    servidor.serve_forever()
