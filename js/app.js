/**
 * Inicialização da aplicação e navegação.
 */
(function() {
    'use strict';

    const ROTAS = {
        'preparar': { viewId: 'view-preparar', render: () => PreparacaoView.renderizar() },
        'cafes': { viewId: 'view-cafes', render: () => CafeView.renderizar() },
        'metodos': { viewId: 'view-metodos', render: () => MetodoView.renderizar() },
        'historico': { viewId: 'view-historico', render: () => HistoricoView.renderizar() }
    };
    const ROTA_PADRAO = 'preparar';

    function obterRotaAtual() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#/')) {
            const rota = hash.substring(2).trim();
            if (ROTAS[rota]) return rota;
        }
        return ROTA_PADRAO;
    }

    function exibirView(rota) {
        const config = ROTAS[rota];
        if (!config) return;

        // Esconder todas as views
        document.querySelectorAll('.view').forEach(v => v.hidden = true);

        // Mostrar a view atual
        const viewEl = document.getElementById(config.viewId);
        if (viewEl) viewEl.hidden = false;

        // Atualizar navegação
        document.querySelectorAll('.app-nav__link').forEach(link => {
            const linkRota = link.getAttribute('data-route');
            if (linkRota === rota) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        // Renderizar conteúdo da view
        config.render();

        // Scroll topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function aoMudarHash() {
        const rota = obterRotaAtual();
        exibirView(rota);
    }

    function inicializar() {
        // Verificar disponibilidade do LocalStorage
        if (!StorageCore.verificarDisponibilidade()) {
            ErrorHandler.exibirAviso('Armazenamento local não disponível. Os dados não serão persistidos.');
        }

        // Inicializar chaves de storage
        StorageCore.inicializarChaveComArrayVazio(APP_CONSTANTS.CHAVES_STORAGE.CAFES);
        StorageCore.inicializarChaveComArrayVazio(APP_CONSTANTS.CHAVES_STORAGE.METODOS);
        StorageCore.inicializarChaveComArrayVazio(APP_CONSTANTS.CHAVES_STORAGE.PREPARACOES);

        // Evento de hash
        window.addEventListener('hashchange', aoMudarHash);

        // Exibir rota inicial
        const rotaInicial = obterRotaAtual();
        exibirView(rotaInicial);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }
})();