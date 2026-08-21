const PreparacaoModule = (function() {
    function criarNovaPreparacao() {
        const preparacao = {
            id: StorageCore.gerarUUID(),
            dataHora: null,
            cafe: null,
            metodo: null,
            quantidadeCafe: null,
            proporcao: null,
            aguaTotal: null,
            quantidadeJorradas: null,
            multiplicadorPrimeira: null,
            jorradas: [],
            status: APP_CONSTANTS.STATUS_PREPARACAO.EM_ANDAMENTO,
            dataFinalizacao: null,
            avaliacao: null,
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString()
        };
        return preparacao;
    }

    function atualizarPreparacao(preparacao, dados) {
        Object.assign(preparacao, dados);
        preparacao.dataAtualizacao = new Date().toISOString();
        return preparacao;
    }

    function validarPreparacao(preparacao) {
        const erros = [];
        if (!preparacao.cafe) erros.push({ campo: 'cafe', mensagem: 'Selecione um café.' });
        if (preparacao.cafe && preparacao.cafe.emEstoque === false) {
            erros.push({ campo: 'cafe', mensagem: 'Café sem estoque não pode ser usado.' });
        }
        if (!preparacao.metodo) erros.push({ campo: 'metodo', mensagem: 'Selecione um método.' });
        const valQtdCafe = Validators.validarNumeroPositivo(preparacao.quantidadeCafe, 'Quantidade de café');
        if (!valQtdCafe.valido) erros.push({ campo: 'quantidadeCafe', mensagem: valQtdCafe.mensagem });
        const valProp = Validators.validarProporcao(preparacao.proporcao);
        if (!valProp.valido) erros.push({ campo: 'proporcao', mensagem: valProp.mensagem });
        const valJorradas = Validators.validarJorradas(preparacao.quantidadeJorradas);
        if (!valJorradas.valido) erros.push({ campo: 'quantidadeJorradas', mensagem: valJorradas.mensagem });
        if (preparacao.quantidadeJorradas > 1) {
            const valMult = Validators.validarMultiplicador(preparacao.multiplicadorPrimeira);
            if (!valMult.valido) erros.push({ campo: 'multiplicadorPrimeira', mensagem: valMult.mensagem });
        }
        return erros;
    }

    function gerarJorradasPlanejadas(preparacao) {
        const aguaTotal = Calculadora.calcularAguaTotal(preparacao.quantidadeCafe, preparacao.proporcao);
        let primeiraJorrada = 0;
        if (preparacao.quantidadeJorradas > 1) {
            primeiraJorrada = Calculadora.calcularPrimeiraJorrada(preparacao.quantidadeCafe, preparacao.multiplicadorPrimeira);
        }
        preparacao.aguaTotal = aguaTotal;
        preparacao.jorradas = Jorradas.calcularJorradas(aguaTotal, preparacao.quantidadeJorradas, primeiraJorrada);
        return preparacao;
    }

    function registrarValorRealizado(preparacao, numeroJorrada, valorRealizado) {
        if (valorRealizado === '' || valorRealizado === null || valorRealizado === undefined || isNaN(Number(valorRealizado))) {
            preparacao.jorradas[numeroJorrada - 1].volumeRealizado = null;
            preparacao.jorradas[numeroJorrada - 1].cumulativoRealizado = null;
        } else {
            const valorNum = Number(valorRealizado);
            if (valorNum < 0) {
                throw new Error('Volume realizado não pode ser negativo.');
            }
            preparacao.jorradas[numeroJorrada - 1].volumeRealizado = valorNum;
        }
        preparacao.jorradas = Jorradas.recalcularJorradas(
            preparacao.jorradas,
            preparacao.aguaTotal,
            preparacao.quantidadeJorradas
        );
        preparacao.dataAtualizacao = new Date().toISOString();
        return preparacao;
    }

    function finalizarPreparacao(preparacao) {
        preparacao.status = APP_CONSTANTS.STATUS_PREPARACAO.FINALIZADA;
        preparacao.dataHora = new Date().toISOString();
        preparacao.dataFinalizacao = preparacao.dataHora;
        preparacao.dataAtualizacao = preparacao.dataHora;
        // Salvar no histórico e limpar preparação atual
        const preparacaoSalva = PreparacoesStorage.moverParaHistorico(preparacao);
        return preparacaoSalva;
    }

    function descartarPreparacaoAtual() {
        PreparacoesStorage.clearPreparacaoAtual();
    }

    return {
        criarNovaPreparacao,
        atualizarPreparacao,
        validarPreparacao,
        gerarJorradasPlanejadas,
        registrarValorRealizado,
        finalizarPreparacao,
        descartarPreparacaoAtual
    };
})();

window.PreparacaoModule = PreparacaoModule;