const CafeView = (function() {
    // Mapeamento entre nome do campo (da validação) e ID do input
    const MAPA_IDS = {
        nome: 'cafe-nome',
        valorPago: 'cafe-valor',
        gramatura: 'cafe-gramatura',
        dataCompra: 'cafe-data',
        status: 'cafe-status',
        emEstoque: 'cafe-estoque'
    };

    function renderizar() {
        const container = DOMUtils.limparContainer('content-cafes');
        const cafes = CafesStorage.listarCafes();

        const filtrosHTML = `
            <div class="filtros">
                <div class="filtros__grupo">
                    <label class="filtros__label" for="filtro-cafe-nome">Nome</label>
                    <input class="filtros__input" type="text" id="filtro-cafe-nome" placeholder="Buscar...">
                </div>
                <div class="filtros__grupo">
                    <label class="filtros__label" for="filtro-cafe-status">Status</label>
                    <select class="filtros__select" id="filtro-cafe-status">
                        <option value="">Todos</option>
                        <option value="tenho">Tenho</option>
                        <option value="tive">Tive</option>
                        <option value="lista_desejo">Lista de desejo</option>
                    </select>
                </div>
                <div class="filtros__grupo">
                    <label class="filtros__label" for="filtro-cafe-estoque">Estoque</label>
                    <select class="filtros__select" id="filtro-cafe-estoque">
                        <option value="">Todos</option>
                        <option value="true">Em estoque</option>
                        <option value="false">Sem estoque</option>
                    </select>
                </div>
                <button class="btn btn--primario" id="btn-novo-cafe">+ Novo Café</button>
            </div>
        `;

        const listaHTML = `<div class="cards-grid" id="lista-cafes"></div>`;

        container.innerHTML = filtrosHTML + listaHTML;
        atualizarListaCafes();

        document.getElementById('btn-novo-cafe').addEventListener('click', () => abrirFormCafe());
        document.getElementById('filtro-cafe-nome').addEventListener('input', atualizarListaCafes);
        document.getElementById('filtro-cafe-status').addEventListener('change', atualizarListaCafes);
        document.getElementById('filtro-cafe-estoque').addEventListener('change', atualizarListaCafes);
    }

    function atualizarListaCafes() {
        const nome = document.getElementById('filtro-cafe-nome')?.value || '';
        const status = document.getElementById('filtro-cafe-status')?.value || '';
        const estoque = document.getElementById('filtro-cafe-estoque')?.value || '';
        const cafes = CafesStorage.listarCafes();
        const filtrados = CafesModule.filtrarCafes(cafes, {
            nome,
            status,
            emEstoque: estoque === '' ? undefined : estoque === 'true'
        });

        const listaContainer = document.getElementById('lista-cafes');
        if (!listaContainer) return;
        listaContainer.innerHTML = filtrados.map(cafe => UIComponents.cardCafe(cafe)).join('') || '<p>Nenhum café encontrado.</p>';

        document.querySelectorAll('.btn-editar-cafe').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const cafe = CafesStorage.buscarCafePorId(id);
                if (cafe) abrirFormCafe(cafe);
            });
        });
        document.querySelectorAll('.btn-excluir-cafe').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este café?')) {
                    CafesStorage.removerCafe(id);
                    ErrorHandler.exibirSucesso('Café excluído.');
                    renderizar();
                }
            });
        });
    }

    function abrirFormCafe(cafe = null) {
        const isEdicao = cafe !== null;
        DOMUtils.abrirModal(`
            <h3>${isEdicao ? 'Editar café' : 'Novo café'}</h3>
            ${UIComponents.formCafe(cafe)}
        `);
        const form = document.getElementById('form-cafe');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const dados = {
                id: cafe ? cafe.id : null,
                nome: document.getElementById('cafe-nome').value.trim(),
                valorPago: Number(document.getElementById('cafe-valor').value),
                gramatura: Number(document.getElementById('cafe-gramatura').value),
                dataCompra: document.getElementById('cafe-data').value || null,
                torra: document.getElementById('cafe-torra').value.trim(),
                sensorial: document.getElementById('cafe-sensorial').value.trim(),
                notas: document.getElementById('cafe-notas').value.trim(),
                corpo: document.getElementById('cafe-corpo').value.trim(),
                finalizacao: document.getElementById('cafe-finalizacao').value.trim(),
                variedade: document.getElementById('cafe-variedade').value.trim(),
                processo: document.getElementById('cafe-processo').value.trim(),
                propriedade: document.getElementById('cafe-propriedade').value.trim(),
                cidade: document.getElementById('cafe-cidade').value.trim(),
                regiao: document.getElementById('cafe-regiao').value.trim(),
                altitude: document.getElementById('cafe-altitude').value.trim(),
                status: document.getElementById('cafe-status').value,
                emEstoque: document.getElementById('cafe-estoque').value === 'true'
            };

            const erros = CafesModule.validarCafe(dados);
            if (erros.length > 0) {
                // Limpar erros anteriores
                document.querySelectorAll('#form-cafe .form-group').forEach(g => {
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

            const salvo = CafesStorage.salvarCafe(dados);
            if (salvo) {
                ErrorHandler.exibirSucesso(isEdicao ? 'Café atualizado.' : 'Café cadastrado.');
                DOMUtils.fecharModal();
                renderizar();
            } else {
                ErrorHandler.exibirErro('Erro ao salvar café.');
            }
        });
        form.querySelector('.btn-cancelar').addEventListener('click', () => DOMUtils.fecharModal());
    }

    return { renderizar };
})();

window.CafeView = CafeView;