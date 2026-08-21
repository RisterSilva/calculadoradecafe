/**
 * Camada genérica de persistência no LocalStorage.
 * Responsável por leitura/gravação segura, geração de UUID e tratamento de erros.
 */
const StorageCore = (function() {
    function gerarUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function lerChave(chave) {
        try {
            const dados = localStorage.getItem(chave);
            if (dados === null) return null;
            return JSON.parse(dados);
        } catch (e) {
            console.error(`Erro ao ler chave ${chave}:`, e);
            return null;
        }
    }

    function gravarChave(chave, valor) {
        try {
            localStorage.setItem(chave, JSON.stringify(valor));
            return true;
        } catch (e) {
            console.error(`Erro ao gravar chave ${chave}:`, e);
            return false;
        }
    }

    function removerChave(chave) {
        try {
            localStorage.removeItem(chave);
            return true;
        } catch (e) {
            console.error(`Erro ao remover chave ${chave}:`, e);
            return false;
        }
    }

    function inicializarChaveComArrayVazio(chave) {
        if (lerChave(chave) === null) {
            gravarChave(chave, []);
        }
    }

    function verificarDisponibilidade() {
        try {
            const teste = '__teste_storage__';
            localStorage.setItem(teste, '1');
            localStorage.removeItem(teste);
            return true;
        } catch (e) {
            return false;
        }
    }

    return {
        gerarUUID,
        lerChave,
        gravarChave,
        removerChave,
        inicializarChaveComArrayVazio,
        verificarDisponibilidade
    };
})();

window.StorageCore = StorageCore;