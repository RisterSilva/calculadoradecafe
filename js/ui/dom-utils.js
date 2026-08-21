/**
 * Helpers de manipulação de DOM.
 */
const DOMUtils = (function() {
    function criarElemento(tag, classes = [], atributos = {}, texto = '') {
        const el = document.createElement(tag);
        classes.forEach(c => el.classList.add(c));
        Object.entries(atributos).forEach(([chave, valor]) => {
            if (chave === 'innerHTML') {
                el.innerHTML = valor;
            } else {
                el.setAttribute(chave, valor);
            }
        });
        if (texto) el.textContent = texto;
        return el;
    }

    function limparContainer(id) {
        const container = document.getElementById(id);
        if (container) container.innerHTML = '';
        return container;
    }

    function escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    function abrirModal(conteudoHTML) {
        const container = document.getElementById('modal-container');
        container.innerHTML = '';
        const template = document.getElementById('template-modal');
        const modalElement = template.content.firstElementChild.cloneNode(true);
        modalElement.querySelector('.modal__conteudo').innerHTML = conteudoHTML;
        modalElement.querySelector('.modal__fechar').addEventListener('click', () => {
            container.innerHTML = '';
        });
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                container.innerHTML = '';
            }
        });
        container.appendChild(modalElement);
    }

    function fecharModal() {
        const container = document.getElementById('modal-container');
        container.innerHTML = '';
    }

    return {
        criarElemento,
        limparContainer,
        escaparHTML,
        abrirModal,
        fecharModal
    };
})();

window.DOMUtils = DOMUtils;