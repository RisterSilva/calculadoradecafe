/**
 * Operações CRUD para Preparações no LocalStorage.
 */
const PreparacoesStorage = (function() {
    const CHAVE = APP_CONSTANTS.CHAVES_STORAGE.PREPARACOES;
    const CHAVE_ATUAL = APP_CONSTANTS.CHAVES_STORAGE.PREPARACAO_ATUAL;

    function listarPreparacoes() {
        const preparacoes = StorageCore.lerChave(CHAVE);
        return Array.isArray(preparacoes) ? preparacoes : [];
    }

    function buscarPreparacaoPorId(id) {
        const preparacoes = listarPreparacoes();
        return preparacoes.find(prep => prep.id === id) || null;
    }

    function salvarPreparacao(preparacao) {
        const preparacoes = listarPreparacoes();
        if (preparacao.id) {
            const index = preparacoes.findIndex(p => p.id === preparacao.id);
            if (index >= 0) {
                preparacao.dataAtualizacao = new Date().toISOString();
                preparacoes[index] = preparacao;
            } else {
                preparacao.dataCriacao = new Date().toISOString();
                preparacao.dataAtualizacao = preparacao.dataCriacao;
                preparacoes.push(preparacao);
            }
        } else {
            preparacao.id = StorageCore.gerarUUID();
            preparacao.dataCriacao = new Date().toISOString();
            preparacao.dataAtualizacao = preparacao.dataCriacao;
            preparacoes.push(preparacao);
        }
        return StorageCore.gravarChave(CHAVE, preparacoes) ? preparacao : null;
    }

    function removerPreparacao(id) {
        let preparacoes = listarPreparacoes();
        preparacoes = preparacoes.filter(prep => prep.id !== id);
        return StorageCore.gravarChave(CHAVE, preparacoes);
    }

    function getPreparacaoAtual() {
        return StorageCore.lerChave(CHAVE_ATUAL);
    }

    function setPreparacaoAtual(preparacao) {
        return StorageCore.gravarChave(CHAVE_ATUAL, preparacao);
    }

    function clearPreparacaoAtual() {
        return StorageCore.removerChave(CHAVE_ATUAL);
    }

    function moverParaHistorico(preparacao) {
        const copia = { ...preparacao };
        copia.status = APP_CONSTANTS.STATUS_PREPARACAO.FINALIZADA;
        copia.dataFinalizacao = new Date().toISOString();
        copia.dataAtualizacao = copia.dataFinalizacao;
        const salvo = salvarPreparacao(copia);
        if (salvo) {
            clearPreparacaoAtual();
        }
        return salvo;
    }

    StorageCore.inicializarChaveComArrayVazio(CHAVE);

    return {
        listarPreparacoes,
        buscarPreparacaoPorId,
        salvarPreparacao,
        removerPreparacao,
        getPreparacaoAtual,
        setPreparacaoAtual,
        clearPreparacaoAtual,
        moverParaHistorico
    };
})();

window.PreparacoesStorage = PreparacoesStorage;