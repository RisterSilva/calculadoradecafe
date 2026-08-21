/**
 * Lógica de negócio de Cafés.
 */
const CafesModule = (function() {
    function criarSnapshotCafe(cafe) {
        return {
            id: cafe.id,
            nome: cafe.nome,
            dataCompra: cafe.dataCompra || null,
            torra: cafe.torra || null,
            sensorial: cafe.sensorial || null,
            notas: cafe.notas || null,
            corpo: cafe.corpo || null,
            finalizacao: cafe.finalizacao || null,
            variedade: cafe.variedade || null,
            processo: cafe.processo || null,
            propriedade: cafe.propriedade || null,
            cidade: cafe.cidade || null,
            regiao: cafe.regiao || null,
            altitude: cafe.altitude || null
        };
    }

    function validarCafe(dados) {
        const erros = [];
        const valNome = Validators.validarNome(dados.nome, 'Nome');
        if (!valNome.valido) erros.push({ campo: 'nome', mensagem: valNome.mensagem });

        const valValor = Validators.validarNumeroMaiorOuIgual(dados.valorPago, 0, 'Valor pago');
        if (!valValor.valido) erros.push({ campo: 'valorPago', mensagem: valValor.mensagem });

        const valGramatura = Validators.validarNumeroPositivo(dados.gramatura, 'Gramatura');
        if (!valGramatura.valido) erros.push({ campo: 'gramatura', mensagem: valGramatura.mensagem });

        const valStatus = Validators.validarStatusCafe(dados.status);
        if (!valStatus.valido) erros.push({ campo: 'status', mensagem: valStatus.mensagem });

        const valEstoque = Validators.validarEstoque(dados.emEstoque);
        if (!valEstoque.valido) erros.push({ campo: 'emEstoque', mensagem: valEstoque.mensagem });

        if (dados.dataCompra) {
            const valData = Validators.validarData(dados.dataCompra);
            if (!valData.valido) erros.push({ campo: 'dataCompra', mensagem: valData.mensagem });
        }

        return erros;
    }

    function filtrarCafes(cafes, filtros) {
        return cafes.filter(cafe => {
            if (filtros.nome && !cafe.nome.toLowerCase().includes(filtros.nome.toLowerCase())) return false;
            if (filtros.status && cafe.status !== filtros.status) return false;
            if (filtros.emEstoque !== undefined && filtros.emEstoque !== null && filtros.emEstoque !== '') {
                const bool = filtros.emEstoque === true || filtros.emEstoque === 'true';
                if (cafe.emEstoque !== bool) return false;
            }
            if (filtros.dataCompra && cafe.dataCompra !== filtros.dataCompra) return false;
            return true;
        });
    }

    return {
        criarSnapshotCafe,
        validarCafe,
        filtrarCafes
    };
})();

window.CafesModule = CafesModule;