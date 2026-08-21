/**
 * Funções de validação reutilizáveis.
 * Cada função retorna { valido: boolean, mensagem: string }.
 */
const Validators = (function() {
    function validarNome(valor, campo = 'Nome') {
        if (!valor || valor.trim() === '') {
            return { valido: false, mensagem: `${campo} é obrigatório.` };
        }
        if (valor.trim().length > 255) {
            return { valido: false, mensagem: `${campo} deve ter no máximo 255 caracteres.` };
        }
        return { valido: true, mensagem: '' };
    }

    function validarNumeroPositivo(valor, campo = 'Valor') {
        const num = Number(valor);
        if (isNaN(num) || num <= 0) {
            return { valido: false, mensagem: `${campo} deve ser um número maior que zero.` };
        }
        return { valido: true, mensagem: '' };
    }

    function validarNumeroMaiorOuIgual(valor, minimo, campo = 'Valor') {
        const num = Number(valor);
        if (isNaN(num) || num < minimo) {
            return { valido: false, mensagem: `${campo} deve ser um número >= ${minimo}.` };
        }
        return { valido: true, mensagem: '' };
    }

    function validarProporcao(valor) {
        return validarNumeroPositivo(valor, 'Proporção');
    }

    function validarJorradas(valor) {
        const num = Number(valor);
        if (isNaN(num) || !Number.isInteger(num) || num < 1) {
            return { valido: false, mensagem: 'Quantidade de jorradas deve ser um inteiro >= 1.' };
        }
        return { valido: true, mensagem: '' };
    }

    function validarMultiplicador(valor) {
        return validarNumeroPositivo(valor, 'Multiplicador');
    }

    function validarNota(valor, campo = 'Nota') {
        const num = Number(valor);
        if (isNaN(num) || !Number.isInteger(num) || num < 1 || num > 5) {
            return { valido: false, mensagem: `${campo} deve ser um inteiro entre 1 e 5.` };
        }
        return { valido: true, mensagem: '' };
    }

    function validarData(valor) {
        if (!valor) return { valido: true, mensagem: '' }; // opcional
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(valor)) {
            return { valido: false, mensagem: 'Data deve estar no formato AAAA-MM-DD.' };
        }
        const data = new Date(valor + 'T00:00:00');
        if (isNaN(data.getTime())) {
            return { valido: false, mensagem: 'Data inválida.' };
        }
        return { valido: true, mensagem: '' };
    }

    function validarEstoque(valor) {
        if (typeof valor !== 'boolean') {
            return { valido: false, mensagem: 'Estoque deve ser true ou false.' };
        }
        return { valido: true, mensagem: '' };
    }

    function validarStatusCafe(valor) {
        const statusValidos = Object.values(APP_CONSTANTS.STATUS_CAFE);
        if (!statusValidos.includes(valor)) {
            return { valido: false, mensagem: 'Status inválido.' };
        }
        return { valido: true, mensagem: '' };
    }

    return {
        validarNome,
        validarNumeroPositivo,
        validarNumeroMaiorOuIgual,
        validarProporcao,
        validarJorradas,
        validarMultiplicador,
        validarNota,
        validarData,
        validarEstoque,
        validarStatusCafe
    };
})();

window.Validators = Validators;