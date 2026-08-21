/**
 * Operações CRUD para Cafés no LocalStorage.
 */
const CafesStorage = (function() {
    const CHAVE = APP_CONSTANTS.CHAVES_STORAGE.CAFES;

    function listarCafes() {
        const cafes = StorageCore.lerChave(CHAVE);
        return Array.isArray(cafes) ? cafes : [];
    }

    function buscarCafePorId(id) {
        const cafes = listarCafes();
        return cafes.find(cafe => cafe.id === id) || null;
    }

    function salvarCafe(cafe) {
        const cafes = listarCafes();
        if (cafe.id) {
            const index = cafes.findIndex(c => c.id === cafe.id);
            if (index >= 0) {
                cafe.dataAtualizacao = new Date().toISOString();
                cafes[index] = cafe;
            } else {
                cafe.dataCriacao = new Date().toISOString();
                cafe.dataAtualizacao = cafe.dataCriacao;
                cafes.push(cafe);
            }
        } else {
            cafe.id = StorageCore.gerarUUID();
            cafe.dataCriacao = new Date().toISOString();
            cafe.dataAtualizacao = cafe.dataCriacao;
            cafes.push(cafe);
        }
        return StorageCore.gravarChave(CHAVE, cafes) ? cafe : null;
    }

    function removerCafe(id) {
        let cafes = listarCafes();
        cafes = cafes.filter(cafe => cafe.id !== id);
        return StorageCore.gravarChave(CHAVE, cafes);
    }

    function listarCafesEmEstoque() {
        return listarCafes().filter(cafe => cafe.emEstoque === true);
    }

    // Inicializa chave se não existir
    StorageCore.inicializarChaveComArrayVazio(CHAVE);

    return {
        listarCafes,
        buscarCafePorId,
        salvarCafe,
        removerCafe,
        listarCafesEmEstoque
    };
})();

window.CafesStorage = CafesStorage;