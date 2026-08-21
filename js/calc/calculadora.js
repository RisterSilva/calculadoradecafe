/**
 * Cálculos matemáticos puros.
 * Fonte de verdade para todas as fórmulas.
 */
const Calculadora = (function() {
    /**
     * Calcula a água total.
     * @param {number} quantidadeCafe - gramas de café
     * @param {number} proporcao - proporção (ex: 16)
     * @returns {number} água total em ml
     */
    function calcularAguaTotal(quantidadeCafe, proporcao) {
        return quantidadeCafe * proporcao;
    }

    /**
     * Calcula a primeira jorrada (infusão).
     * @param {number} quantidadeCafe - gramas de café
     * @param {number} multiplicador - multiplicador (ex: 3)
     * @returns {number} volume da primeira jorrada em ml
     */
    function calcularPrimeiraJorrada(quantidadeCafe, multiplicador) {
        return quantidadeCafe * multiplicador;
    }

    return {
        calcularAguaTotal,
        calcularPrimeiraJorrada
    };
})();

window.Calculadora = Calculadora;