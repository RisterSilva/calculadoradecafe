const ErrorHandler = (function() {
    function exibirAlerta(mensagem, tipo = 'info', duracao = 5000) {
        const container = document.getElementById('alert-container');
        if (!container) return;

        const template = document.getElementById('template-alerta');
        const alertaElement = template.content.firstElementChild.cloneNode(true);
        alertaElement.classList.add(`alerta--${tipo}`);
        alertaElement.querySelector('.alerta__mensagem').textContent = mensagem;

        const btnFechar = alertaElement.querySelector('.alerta__fechar');
        btnFechar.addEventListener('click', () => {
            alertaElement.remove();
        });

        container.appendChild(alertaElement);

        if (duracao > 0) {
            setTimeout(() => {
                if (alertaElement.parentNode) alertaElement.remove();
            }, duracao);
        }
    }

    function handleError(error, contexto = '') {
        console.error(`[Erro ${contexto}]`, error);
        exibirAlerta(error.message || 'Ocorreu um erro inesperado.', 'erro');
    }

    function exibirSucesso(mensagem) {
        exibirAlerta(mensagem, 'sucesso');
    }

    function exibirAviso(mensagem) {
        exibirAlerta(mensagem, 'aviso');
    }

    function exibirErro(mensagem) {
        exibirAlerta(mensagem, 'erro');
    }

    return {
        exibirAlerta,
        handleError,
        exibirSucesso,
        exibirAviso,
        exibirErro
    };
})();

window.ErrorHandler = ErrorHandler;