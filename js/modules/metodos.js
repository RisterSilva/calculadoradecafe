/**
 * Lógica de negócio de Métodos.
 */
const MetodosModule = (function() {
    function criarSnapshotMetodo(metodo) {
        return {
            id: metodo.id,
            nome: metodo.nome,
            tempo: metodo.tempo || null,
            extracao: metodo.extracao || null,
            moagem: metodo.moagem || null,
            proporcaoSugerida: metodo.proporcao !== undefined ? metodo.proporcao : null,
            resultadoXicara: metodo.resultadoXicara || null
        };
    }

    function validarMetodo(dados) {
        const erros = [];
        const valNome = Validators.validarNome(dados.nome, 'Nome');
        if (!valNome.valido) erros.push({ campo: 'nome', mensagem: valNome.mensagem });

        const valTempo = Validators.validarNome(dados.tempo, 'Tempo');
        if (!valTempo.valido) erros.push({ campo: 'tempo', mensagem: valTempo.mensagem });

        if (dados.proporcao !== null && dados.proporcao !== undefined && dados.proporcao !== '') {
            const valProp = Validators.validarProporcao(dados.proporcao);
            if (!valProp.valido) erros.push({ campo: 'proporcao', mensagem: valProp.mensagem });
        }

        return erros;
    }

    return {
        criarSnapshotMetodo,
        validarMetodo
    };
})();

window.MetodosModule = MetodosModule;