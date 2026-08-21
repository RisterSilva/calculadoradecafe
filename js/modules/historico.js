/**
 * Lógica de consulta ao histórico.
 */
const HistoricoModule = (function() {
    function listarPreparacoesOrdenadas() {
        const preparacoes = PreparacoesStorage.listarPreparacoes();
        return preparacoes.sort((a, b) => new Date(b.dataFinalizacao) - new Date(a.dataFinalizacao));
    }

    function filtrarPreparacoes(preparacoes, filtros) {
        return preparacoes.filter(prep => {
            if (filtros.nomeCafe && !prep.cafe.nome.toLowerCase().includes(filtros.nomeCafe.toLowerCase())) return false;
            if (filtros.nomeMetodo && prep.metodo && !prep.metodo.nome.toLowerCase().includes(filtros.nomeMetodo.toLowerCase())) return false;
            if (filtros.dataInicio && new Date(prep.dataFinalizacao) < new Date(filtros.dataInicio)) return false;
            if (filtros.dataFim && new Date(prep.dataFinalizacao) > new Date(filtros.dataFim)) return false;
            if (filtros.notaMinima !== undefined && filtros.notaMinima !== null && filtros.notaMinima !== '') {
                const min = Number(filtros.notaMinima);
                if (!prep.avaliacao) return false;
                const media = (prep.avaliacao.olfato + prep.avaliacao.paladar + prep.avaliacao.tato + prep.avaliacao.finalizacao) / 4;
                if (media < min) return false;
            }
            return true;
        });
    }

    return {
        listarPreparacoesOrdenadas,
        filtrarPreparacoes
    };
})();

window.HistoricoModule = HistoricoModule;