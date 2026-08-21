/**
 * Operações CRUD para Métodos no LocalStorage.
 */
const MetodosStorage = (function() {
    const CHAVE = APP_CONSTANTS.CHAVES_STORAGE.METODOS;

    function listarMetodos() {
        const metodos = StorageCore.lerChave(CHAVE);
        return Array.isArray(metodos) ? metodos : [];
    }

    function buscarMetodoPorId(id) {
        const metodos = listarMetodos();
        return metodos.find(metodo => metodo.id === id) || null;
    }

    function salvarMetodo(metodo) {
        const metodos = listarMetodos();
        if (metodo.id) {
            const index = metodos.findIndex(m => m.id === metodo.id);
            if (index >= 0) {
                metodo.dataAtualizacao = new Date().toISOString();
                metodos[index] = metodo;
            } else {
                metodo.dataCriacao = new Date().toISOString();
                metodo.dataAtualizacao = metodo.dataCriacao;
                metodos.push(metodo);
            }
        } else {
            metodo.id = StorageCore.gerarUUID();
            metodo.dataCriacao = new Date().toISOString();
            metodo.dataAtualizacao = metodo.dataCriacao;
            metodos.push(metodo);
        }
        return StorageCore.gravarChave(CHAVE, metodos) ? metodo : null;
    }

    function removerMetodo(id) {
        let metodos = listarMetodos();
        metodos = metodos.filter(metodo => metodo.id !== id);
        return StorageCore.gravarChave(CHAVE, metodos);
    }

    StorageCore.inicializarChaveComArrayVazio(CHAVE);

    return {
        listarMetodos,
        buscarMetodoPorId,
        salvarMetodo,
        removerMetodo
    };
})();

window.MetodosStorage = MetodosStorage;