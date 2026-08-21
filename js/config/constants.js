/**
 * Constantes globais da aplicação.
 */
const APP_CONSTANTS = {
    CHAVES_STORAGE: {
        CAFES: 'coffeeFlow_cafes',
        METODOS: 'coffeeFlow_metodos',
        PREPARACOES: 'coffeeFlow_preparacoes',
        PREPARACAO_ATUAL: 'coffeeFlow_preparacao_atual',
        VERSAO: 'coffeeFlow_versao'
    },
    VERSAO: '1.0',
    STATUS_CAFE: {
        TENHO: 'tenho',
        TIVE: 'tive',
        LISTA_DESEJO: 'lista_desejo'
    },
    STATUS_PREPARACAO: {
        EM_ANDAMENTO: 'em_andamento',
        FINALIZADA: 'finalizada'
    },
    TIPOS_JORRADA: {
        INFUSAO: 'infusao',
        RESTANTE: 'restante'
    },
    CASAS_DECIMAIS_EXIBICAO: 1
};

// Tornar acessível globalmente
window.APP_CONSTANTS = APP_CONSTANTS;