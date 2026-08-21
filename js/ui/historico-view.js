/**
 * View de Histórico.
 */
const HistoricoView = (function() {
    function renderizar() {
        const container = DOMUtils.limparContainer('content-historico');
        const preparacoes = HistoricoModule.listarPreparacoesOrdenadas();

        const filtrosHTML = `
            <div class="filtros">
                <div class="filtros__grupo">
                    <label class="filtros__label" for="filtro-hist-cafe">Café</label>
                    <input class="filtros__input" type="text" id="filtro-hist-cafe" placeholder="Buscar...">
                </div>
                <div class="filtros__grupo">
                    <label class="filtros__label" for="filtro-hist-metodo">Método</label>
                    <input class="filtros__input" type="text" id="filtro-hist-metodo" placeholder="Buscar...">
                </div>
                <div class="filtros__grupo">
                    <label class="filtros__label" for="filtro-hist-nota">Nota mínima</label>
                    <select class="filtros__select" id="filtro-hist-nota">
                        <option value="">Todas</option>
                        <option value="1">≥ 1</option>
                        <option value="2">≥ 2</option>
                        <option value="3">≥ 3</option>
                        <option value="4">≥ 4</option>
                        <option value="5">5</option>
                    </select>
                </div>
            </div>
        `;

        container.innerHTML = filtrosHTML + `<div class="lista" id="lista-historico"></div>`;
        atualizarLista();

        document.getElementById('filtro-hist-cafe').addEventListener('input', atualizarLista);
        document.getElementById('filtro-hist-metodo').addEventListener('input', atualizarLista);
        document.getElementById('filtro-hist-nota').addEventListener('change', atualizarLista);
    }

    function atualizarLista() {
        const nomeCafe = document.getElementById('filtro-hist-cafe')?.value || '';
        const nomeMetodo = document.getElementById('filtro-hist-metodo')?.value || '';
        const notaMinima = document.getElementById('filtro-hist-nota')?.value || '';
        const preparacoes = HistoricoModule.listarPreparacoesOrdenadas();
        const filtradas = HistoricoModule.filtrarPreparacoes(preparacoes, {
            nomeCafe,
            nomeMetodo,
            notaMinima: notaMinima !== '' ? Number(notaMinima) : undefined
        });

        const listaContainer = document.getElementById('lista-historico');
        if (!listaContainer) return;

        if (filtradas.length === 0) {
            listaContainer.innerHTML = '<p>Nenhuma preparação encontrada.</p>';
            return;
        }

        listaContainer.innerHTML = filtradas.map(prep => cardPreparacao(prep)).join('');

        // Eventos de expandir detalhes
        document.querySelectorAll('.btn-expandir-preparacao').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const detalhesEl = document.getElementById(`detalhes-${id}`);
                if (detalhesEl.style.display === 'none') {
                    detalhesEl.style.display = 'block';
                    btn.textContent = 'Ocultar detalhes';
                } else {
                    detalhesEl.style.display = 'none';
                    btn.textContent = 'Ver detalhes';
                }
            });
        });

        // Eventos de avaliar (se não tiver avaliação)
        document.querySelectorAll('.btn-avaliar').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                abrirFormularioAvaliacao(id);
            });
        });
    }

    function cardPreparacao(prep) {
        const data = new Date(prep.dataFinalizacao).toLocaleString('pt-BR');
        const avaliacao = prep.avaliacao
            ? `<span class="badge badge--avaliada">Avaliada</span>`
            : `<span class="badge badge--em-andamento">Sem avaliação</span>`;
        const notaMedia = prep.avaliacao
            ? ((prep.avaliacao.olfato + prep.avaliacao.paladar + prep.avaliacao.tato + prep.avaliacao.finalizacao) / 4).toFixed(1)
            : null;

        let detalhesHTML = `
            <p><strong>Data:</strong> ${data}</p>
            <p><strong>Café:</strong> ${DOMUtils.escaparHTML(prep.cafe.nome)}</p>
            <p><strong>Método:</strong> ${prep.metodo ? DOMUtils.escaparHTML(prep.metodo.nome) : 'N/A'}</p>
            <p><strong>Quantidade de café:</strong> ${prep.quantidadeCafe}g</p>
            <p><strong>Proporção:</strong> 1:${prep.proporcao}</p>
            <p><strong>Água total:</strong> ${prep.aguaTotal}ml</p>
            <p><strong>Jorradas:</strong> ${prep.quantidadeJorradas}</p>
            ${notaMedia ? `<p><strong>Nota média:</strong> ${notaMedia}</p>` : ''}
        `;

        detalhesHTML += `<div class="detalhes" id="detalhes-${prep.id}" style="display:none;">
            <div class="detalhes__titulo">Jorradas</div>
            <table class="tabela-jorradas">
                <thead><tr><th>Nº</th><th>Planejado</th><th>Realizado</th><th>Cumulativo</th></tr></thead>
                <tbody>
                    ${prep.jorradas.map(j => `
                        <tr>
                            <td>${j.numero}</td>
                            <td>${j.volumePlanejado.toFixed(1)}ml</td>
                            <td>${j.volumeRealizado !== null ? j.volumeRealizado + 'ml' : '—'}</td>
                            <td>${j.cumulativoPlanejado.toFixed(1)}ml</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${prep.avaliacao ? `
                <div class="detalhes__titulo">Avaliação</div>
                <p>Olfato: ${prep.avaliacao.olfato} | Paladar: ${prep.avaliacao.paladar} | Tato: ${prep.avaliacao.tato} | Finalização: ${prep.avaliacao.finalizacao}</p>
                ${prep.avaliacao.comentario ? `<p><em>${DOMUtils.escaparHTML(prep.avaliacao.comentario)}</em></p>` : ''}
            ` : ''}
        </div>`;

        return `
            <div class="card">
                <div class="card__titulo">${DOMUtils.escaparHTML(prep.cafe.nome)}</div>
                <div class="card__subtitulo">
                    ${avaliacao}
                    ${notaMedia ? `<span>Média: ${notaMedia}</span>` : ''}
                    <div><small>${data}</small></div>
                </div>
                ${detalhesHTML}
                <div class="card__acoes">
                    <button class="btn btn--secundario btn--pequeno btn-expandir-preparacao" data-id="${prep.id}">Ver detalhes</button>
                    ${!prep.avaliacao ? `<button class="btn btn--primario btn--pequeno btn-avaliar" data-id="${prep.id}">Avaliar</button>` : ''}
                </div>
            </div>
        `;
    }

    function abrirFormularioAvaliacao(preparacaoId) {
        const prep = PreparacoesStorage.buscarPreparacaoPorId(preparacaoId);
        if (!prep) return;
        DOMUtils.abrirModal(`
            <h3>Avaliar preparação</h3>
            ${UIComponents.formularioAvaliacao()}
        `);
        const form = document.getElementById('form-avaliacao');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const dados = {
                olfato: document.getElementById('av-olfato').value,
                paladar: document.getElementById('av-paladar').value,
                tato: document.getElementById('av-tato').value,
                finalizacao: document.getElementById('av-finalizacao').value,
                comentario: document.getElementById('av-comentario').value.trim()
            };
            const erros = AvaliacaoModule.validarAvaliacao(dados);
            if (erros.length > 0) {
                ErrorHandler.exibirAviso(erros.map(e => e.mensagem).join(' '));
                return;
            }
            const avaliacao = AvaliacaoModule.criarAvaliacao(dados);
            prep.avaliacao = avaliacao;
            prep.dataAtualizacao = new Date().toISOString();
            PreparacoesStorage.salvarPreparacao(prep);
            ErrorHandler.exibirSucesso('Avaliação salva.');
            DOMUtils.fecharModal();
            renderizar();
        });
        form.querySelector('.btn-cancelar-avaliacao').addEventListener('click', () => DOMUtils.fecharModal());
    }

    return { renderizar };
})();

window.HistoricoView = HistoricoView;