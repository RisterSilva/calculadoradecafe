const MetodoView = (function() {
    // Mapeamento entre nome do campo (da validação) e ID do input
    const MAPA_IDS = {
        nome: 'metodo-nome',
        tempo: 'metodo-tempo',
        proporcao: 'metodo-proporcao'
    };

    function renderizar() {
        const container = DOMUtils.limparContainer('content-metodos');
        const metodos = MetodosStorage.listarMetodos();

        const filtrosHTML = `
            <div class="filtros">
                <div class="filtros__grupo">
                    <label class="filtros__label" for="filtro-metodo-nome">Nome</label>
                    <input class="filtros__input" type="text" id="filtro-metodo-nome" placeholder="Buscar...">
                </div>
                <button class="btn btn--primario" id="btn-novo-metodo">+ Novo Método</button>
            </div>
        `;

        const listaHTML = `<div class="cards-grid" id="lista-metodos"></div>`;
        container.innerHTML = filtrosHTML + listaHTML;
        atualizarListaMetodos();

        document.getElementById('btn-novo-metodo').addEventListener('click', () => abrirFormMetodo());
        document.getElementById('filtro-metodo-nome').addEventListener('input', atualizarListaMetodos);
    }

    function atualizarListaMetodos() {
        const nome = document.getElementById('filtro-metodo-nome')?.value || '';
        const metodos = MetodosStorage.listarMetodos();
        const filtrados = metodos.filter(m => m.nome.toLowerCase().includes(nome.toLowerCase()));

        const listaContainer = document.getElementById('lista-metodos');
        if (!listaContainer) return;
        listaContainer.innerHTML = filtrados.map(m => UIComponents.cardMetodo(m)).join('') || '<p>Nenhum método cadastrado.</p>';

        document.querySelectorAll('.btn-editar-metodo').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const metodo = MetodosStorage.buscarMetodoPorId(id);
                if (metodo) abrirFormMetodo(metodo);
            });
        });
        document.querySelectorAll('.btn-excluir-metodo').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este método?')) {
                    MetodosStorage.removerMetodo(id);
                    ErrorHandler.exibirSucesso('Método excluído.');
                    renderizar();
                }
            });
        });
    }

    function abrirFormMetodo(metodo = null) {
        const isEdicao = metodo !== null;
        DOMUtils.abrirModal(`
            <h3>${isEdicao ? 'Editar método' : 'Novo método'}</h3>
            ${UIComponents.formMetodo(metodo)}
        `);
        const form = document.getElementById('form-metodo');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const dados = {
                id: metodo ? metodo.id : null,
                nome: document.getElementById('metodo-nome').value.trim(),
                tempo: document.getElementById('metodo-tempo').value.trim(),
                extracao: document.getElementById('metodo-extracao').value.trim(),
                moagem: document.getElementById('metodo-moagem').value.trim(),
                proporcao: document.getElementById('metodo-proporcao').value ? Number(document.getElementById('metodo-proporcao').value) : null,
                resultadoXicara: document.getElementById('metodo-resultado').value.trim()
            };

            const erros = MetodosModule.validarMetodo(dados);
            if (erros.length > 0) {
                document.querySelectorAll('#form-metodo .form-group').forEach(g => {
                    g.classList.remove('form-group--erro');
                    const erroEl = g.querySelector('.form-erro');
                    if (erroEl) erroEl.textContent = '';
                });
                erros.forEach(erro => {
                    const inputId = MAPA_IDS[erro.campo];
                    const input = document.getElementById(inputId);
                    if (input) {
                        const formGroup = input.closest('.form-group');
                        if (formGroup) {
                            formGroup.classList.add('form-group--erro');
                            const erroEl = formGroup.querySelector('.form-erro');
                            if (erroEl) erroEl.textContent = erro.mensagem;
                        }
                    }
                });
                return;
            }

            const salvo = MetodosStorage.salvarMetodo(dados);
            if (salvo) {
                ErrorHandler.exibirSucesso(isEdicao ? 'Método atualizado.' : 'Método cadastrado.');
                DOMUtils.fecharModal();
                renderizar();
            } else {
                ErrorHandler.exibirErro('Erro ao salvar método.');
            }
        });
        form.querySelector('.btn-cancelar').addEventListener('click', () => DOMUtils.fecharModal());
    }

    return { renderizar };
})();

window.MetodoView = MetodoView;