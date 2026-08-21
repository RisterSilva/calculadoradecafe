/**
 * Lógica de avaliação.
 */
const AvaliacaoModule = (function() {
    function validarAvaliacao(dados) {
        const erros = [];
        const campos = [
            { nome: 'olfato', label: 'Olfato' },
            { nome: 'paladar', label: 'Paladar' },
            { nome: 'tato', label: 'Tato' },
            { nome: 'finalizacao', label: 'Finalização' }
        ];
        campos.forEach(campo => {
            const val = Validators.validarNota(dados[campo.nome], campo.label);
            if (!val.valido) erros.push({ campo: campo.nome, mensagem: val.mensagem });
        });
        return erros;
    }

    function criarAvaliacao(dados) {
        return {
            olfato: Number(dados.olfato),
            paladar: Number(dados.paladar),
            tato: Number(dados.tato),
            finalizacao: Number(dados.finalizacao),
            comentario: dados.comentario || '',
            dataHora: new Date().toISOString()
        };
    }

    function vincularAvaliacao(preparacao, avaliacao) {
        preparacao.avaliacao = avaliacao;
        preparacao.dataAtualizacao = new Date().toISOString();
        return preparacao;
    }

    return {
        validarAvaliacao,
        criarAvaliacao,
        vincularAvaliacao
    };
})();

window.AvaliacaoModule = AvaliacaoModule;