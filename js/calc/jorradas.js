/**
 * Lógica de divisão e recálculo de jorradas.
 */
const Jorradas = (function() {
    /**
     * Arredonda um número para exibição (padrão 1 casa decimal).
     */
    function arredondarExibicao(valor) {
        return Math.round(valor * 10) / 10;
    }

    /**
     * Calcula as jorradas planejadas.
     * @param {number} aguaTotal - água total planejada
     * @param {number} quantidadeJorradas - total de jorradas
     * @param {number} primeiraJorrada - volume da primeira jorrada (ou null se 1 jorrada)
     * @returns {Array} array de objetos de jorrada planejada
     */
    function calcularJorradas(aguaTotal, quantidadeJorradas, primeiraJorrada) {
        if (quantidadeJorradas === 1) {
            return [{
                numero: 1,
                tipo: APP_CONSTANTS.TIPOS_JORRADA.RESTANTE,
                volumePlanejado: arredondarExibicao(aguaTotal),
                volumeRealizado: null,
                cumulativoPlanejado: arredondarExibicao(aguaTotal),
                cumulativoRealizado: null
            }];
        }

        const jorradas = [];
        // Primeira jorrada
        jorradas.push({
            numero: 1,
            tipo: APP_CONSTANTS.TIPOS_JORRADA.INFUSAO,
            volumePlanejado: arredondarExibicao(primeiraJorrada),
            volumeRealizado: null,
            cumulativoPlanejado: arredondarExibicao(primeiraJorrada),
            cumulativoRealizado: null
        });

        const aguaRestante = aguaTotal - primeiraJorrada;
        const jorradasRestantes = quantidadeJorradas - 1;
        const cadaRestante = aguaRestante / jorradasRestantes;

        for (let i = 2; i <= quantidadeJorradas; i++) {
            let volume = arredondarExibicao(cadaRestante);
            if (i === quantidadeJorradas) {
                // Ajuste da última jorrada para garantir soma exata
                const somaAnterior = jorradas.reduce((acc, j) => acc + j.volumePlanejado, 0);
                volume = arredondarExibicao(aguaTotal - somaAnterior);
            }
            const cumulativo = jorradas.reduce((acc, j) => acc + j.volumePlanejado, 0) + volume;
            jorradas.push({
                numero: i,
                tipo: APP_CONSTANTS.TIPOS_JORRADA.RESTANTE,
                volumePlanejado: arredondarExibicao(volume),
                volumeRealizado: null,
                cumulativoPlanejado: arredondarExibicao(cumulativo),
                cumulativoRealizado: null
            });
        }

        return jorradas;
    }

    /**
     * Recalcula as jorradas com base nos valores realizados.
     * @param {Array} jorradasAtuais - array atual de jorradas
     * @param {number} aguaTotal - água total planejada
     * @param {number} quantidadeJorradas - total de jorradas
     * @returns {Array} novo array de jorradas recalculado
     */
    function recalcularJorradas(jorradasAtuais, aguaTotal, quantidadeJorradas) {
        if (quantidadeJorradas === 1) {
            return jorradasAtuais;
        }

        // Identificar realizados
        const realizados = jorradasAtuais.filter(j => j.volumeRealizado !== null && j.volumeRealizado !== undefined);
        const somaRealizados = realizados.reduce((acc, j) => acc + j.volumeRealizado, 0);
        
        if (somaRealizados > aguaTotal + 0.01) {
            // Erro: soma dos realizados excede o total
            throw new Error('A soma das jorradas realizadas excede a água total planejada.');
        }

        const jorradasRestantes = quantidadeJorradas - realizados.length;
        if (jorradasRestantes > 0) {
            const aguaRestante = aguaTotal - somaRealizados;
            const cadaRestante = aguaRestante / jorradasRestantes;

            // Reconstruir array
            const novasJorradas = [];
            let cumulativo = 0;
            for (let i = 0; i < quantidadeJorradas; i++) {
                const jorradaAtual = jorradasAtuais[i];
                const numero = i + 1;
                let volumePlanejado;
                let volumeRealizado = jorradaAtual ? jorradaAtual.volumeRealizado : null;

                if (volumeRealizado !== null && volumeRealizado !== undefined) {
                    volumePlanejado = volumeRealizado;
                } else {
                    // É uma jorrada restante
                    let volume = cadaRestante;
                    // Ajuste da última restante
                    const restantesRestantes = quantidadeJorradas - novasJorradas.length - 1;
                    if (restantesRestantes === 0) {
                        // Última jorrada: ajustar para completar total
                        volume = aguaTotal - cumulativo;
                    } else {
                        volume = arredondarExibicao(cadaRestante);
                    }
                    volumePlanejado = arredondarExibicao(volume);
                }

                cumulativo += volumePlanejado;
                novasJorradas.push({
                    numero: numero,
                    tipo: numero === 1 ? APP_CONSTANTS.TIPOS_JORRADA.INFUSAO : APP_CONSTANTS.TIPOS_JORRADA.RESTANTE,
                    volumePlanejado: arredondarExibicao(volumePlanejado),
                    volumeRealizado: volumeRealizado !== null ? volumeRealizado : null,
                    cumulativoPlanejado: arredondarExibicao(cumulativo),
                    cumulativoRealizado: volumeRealizado !== null ? arredondarExibicao(cumulativo) : null
                });
            }

            // Atualizar cumulativos realizados
            let cumulativoRealizado = 0;
            novasJorradas.forEach(j => {
                if (j.volumeRealizado !== null) {
                    cumulativoRealizado += j.volumeRealizado;
                    j.cumulativoRealizado = arredondarExibicao(cumulativoRealizado);
                }
            });

            return novasJorradas;
        } else {
            // Todas as jorradas já realizadas; apenas atualizar cumulativos
            let cumulativo = 0;
            let cumulativoRealizado = 0;
            return jorradasAtuais.map(j => {
                cumulativo += j.volumePlanejado;
                if (j.volumeRealizado !== null) {
                    cumulativoRealizado += j.volumeRealizado;
                }
                return {
                    ...j,
                    cumulativoPlanejado: arredondarExibicao(cumulativo),
                    cumulativoRealizado: j.volumeRealizado !== null ? arredondarExibicao(cumulativoRealizado) : null
                };
            });
        }
    }

    return {
        arredondarExibicao,
        calcularJorradas,
        recalcularJorradas
    };
})();

window.Jorradas = Jorradas;