const PreparacaoView = (function() {
    let preparacaoAtual = null;

    function renderizar() {
        const container = DOMUtils.limparContainer('content-preparar');
        preparacaoAtual = PreparacoesStorage.getPreparacaoAtual();

        if (!preparacaoAtual) {
            container.innerHTML = `
                <div class="preparacao-inicial">
                    <p>Nenhuma preparação em andamento.</p>
                    <button class="btn btn--primario" id="btn-iniciar-preparacao">Iniciar preparação</button>
                </div>
            `;
            document.getElementById('btn-iniciar-preparacao').addEventListener('click', iniciarNovaPreparacao);
        } else if (preparacaoAtual.status === APP_CONSTANTS.STATUS_PREPARACAO.FINALIZADA) {
            renderizarAposFinalizacao(container);
        } else {
            renderizarFluxoPreparacao(container);
        }
    }

    function iniciarNovaPreparacao() {
        preparacaoAtual = PreparacaoModule.criarNovaPreparacao();
        PreparacoesStorage.setPreparacaoAtual(preparacaoAtual);
        renderizar();
    }

    function renderizarFluxoPreparacao(container) {
        const cafesEmEstoque = CafesStorage.listarCafesEmEstoque();
        let opcoesCafe = cafesEmEstoque.map(cafe => `<option value="${cafe.id}" ${preparacaoAtual.cafe?.id === cafe.id ? 'selected' : ''}>${DOMUtils.escaparHTML(cafe.nome)}</option>`).join('');
        opcoesCafe = opcoesCafe || '<option value="">Nenhum café em estoque</option>';

        const metodos = MetodosStorage.listarMetodos();
        let opcoesMetodo = metodos.map(m => `<option value="${m.id}" ${preparacaoAtual.metodo?.id === m.id ? 'selected' : ''}>${DOMUtils.escaparHTML(m.nome)}</option>`).join('');
        opcoesMetodo = opcoesMetodo || '<option value="">Nenhum método cadastrado</option>';

        const sugestaoProporcao = preparacaoAtual.metodo && preparacaoAtual.metodo.proporcaoSugerida
            ? `<p><strong>Sugestão do método: 1:${preparacaoAtual.metodo.proporcaoSugerida}</strong></p>`
            : '';

        const html = `
            <div class="preparacao-form">
                <h3>1. Selecione o café</h3>
                <div class="form-group">
                    <select class="form-select" id="prep-cafe">
                        <option value="">-- Selecione --</option>
                        ${opcoesCafe}
                    </select>
                    ${preparacaoAtual.cafe ? `<div class="detalhes">${detalhesCafe(preparacaoAtual.cafe)}</div>` : ''}
                </div>

                <h3>2. Selecione o método</h3>
                <div class="form-group">
                    <select class="form-select" id="prep-metodo">
                        <option value="">-- Selecione --</option>
                        ${opcoesMetodo}
                        <option value="manual" ${preparacaoAtual.metodo && preparacaoAtual.metodo.id === null ? 'selected' : ''}>Método não cadastrado</option>
                    </select>
                    ${sugestaoProporcao}
                </div>

                <div id="metodo-manual" style="display: ${preparacaoAtual.metodo && preparacaoAtual.metodo.id === null ? 'block' : 'none'};">
                    <h3>Informe os dados do método</h3>
                    <div class="form-group">
                        <label class="form-label" for="prep-metodo-nome">Nome do método</label>
                        <input class="form-input" type="text" id="prep-metodo-nome" value="${preparacaoAtual.metodo ? preparacaoAtual.metodo.nome : ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="prep-metodo-tempo">Tempo</label>
                        <input class="form-input" type="text" id="prep-metodo-tempo" value="${preparacaoAtual.metodo ? preparacaoAtual.metodo.tempo || '' : ''}">
                    </div>
                </div>

                <h3>3. Parâmetros</h3>
                <div class="form-group">
                    <label class="form-label" for="prep-qtd-cafe">Quantidade de café (g)</label>
                    <input class="form-input" type="number" step="0.1" min="0.1" id="prep-qtd-cafe" value="${preparacaoAtual.quantidadeCafe || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="prep-proporcao">Proporção (ex: 16)</label>
                    <input class="form-input" type="number" step="0.1" min="0.1" id="prep-proporcao" value="${preparacaoAtual.proporcao || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="prep-jorradas">Quantidade de jorradas</label>
                    <input class="form-input" type="number" step="1" min="1" id="prep-jorradas" value="${preparacaoAtual.quantidadeJorradas || ''}">
                </div>
                <div class="form-group" id="grupo-multiplicador" style="display: ${preparacaoAtual.quantidadeJorradas > 1 ? 'block' : 'none'};">
                    <label class="form-label" for="prep-multiplicador">Multiplicador da primeira jorrada</label>
                    <input class="form-input" type="number" step="0.1" min="0.1" id="prep-multiplicador" value="${preparacaoAtual.multiplicadorPrimeira || ''}">
                </div>

                <div class="form-acoes">
                    <button class="btn btn--secundario" id="btn-descartar-preparacao">Descartar</button>
                    <button class="btn btn--primario" id="btn-gerar-jorradas">Calcular jorradas</button>
                </div>

                <div id="area-jorradas">
                    ${preparacaoAtual.jorradas.length > 0 ? UIComponents.tabelaJorradas(preparacaoAtual.jorradas, preparacaoAtual.aguaTotal) + `
                        <div class="form-acoes">
                            <button class="btn btn--primario" id="btn-finalizar-preparacao">Finalizar preparo</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        container.innerHTML = html;
        configurarEventos();
    }

    function detalhesCafe(cafe) {
        const campos = [];
        if (cafe.torra) campos.push(`<strong>Torra:</strong> ${DOMUtils.escaparHTML(cafe.torra)}`);
        if (cafe.sensorial) campos.push(`<strong>Sensorial:</strong> ${DOMUtils.escaparHTML(cafe.sensorial)}`);
        if (cafe.notas) campos.push(`<strong>Notas:</strong> ${DOMUtils.escaparHTML(cafe.notas)}`);
        if (cafe.corpo) campos.push(`<strong>Corpo:</strong> ${DOMUtils.escaparHTML(cafe.corpo)}`);
        if (cafe.finalizacao) campos.push(`<strong>Finalização:</strong> ${DOMUtils.escaparHTML(cafe.finalizacao)}`);
        if (cafe.variedade) campos.push(`<strong>Variedade:</strong> ${DOMUtils.escaparHTML(cafe.variedade)}`);
        if (cafe.processo) campos.push(`<strong>Processo:</strong> ${DOMUtils.escaparHTML(cafe.processo)}`);
        if (cafe.regiao) campos.push(`<strong>Região:</strong> ${DOMUtils.escaparHTML(cafe.regiao)}`);
        return campos.length ? campos.join('<br>') : 'Sem detalhes.';
    }

    function configurarEventos() {
        document.getElementById('prep-cafe').addEventListener('change', (e) => {
            const cafeId = e.target.value;
            const cafe = CafesStorage.buscarCafePorId(cafeId);
            preparacaoAtual.cafe = cafe ? CafesModule.criarSnapshotCafe(cafe) : null;
            PreparacoesStorage.setPreparacaoAtual(preparacaoAtual);
            renderizar();
        });

        document.getElementById('prep-metodo').addEventListener('change', (e) => {
            const metodoId = e.target.value;
            if (metodoId === 'manual') {
                preparacaoAtual.metodo = {
                    id: null,
                    nome: '',
                    tempo: '',
                    extracao: '',
                    moagem: '',
                    proporcaoSugerida: null,
                    resultadoXicara: ''
                };
                document.getElementById('metodo-manual').style.display = 'block';
            } else if (metodoId === '') {
                preparacaoAtual.metodo = null;
                document.getElementById('metodo-manual').style.display = 'none';
            } else {
                const metodo = MetodosStorage.buscarMetodoPorId(metodoId);
                preparacaoAtual.metodo = metodo ? MetodosModule.criarSnapshotMetodo(metodo) : null;
                document.getElementById('metodo-manual').style.display = 'none';
                if (preparacaoAtual.metodo && preparacaoAtual.metodo.proporcaoSugerida) {
                    const sugestaoEl = document.createElement('p');
                    sugestaoEl.innerHTML = `<strong>Sugestão do método: 1:${preparacaoAtual.metodo.proporcaoSugerida}</strong>`;
                    const selectMetodo = document.getElementById('prep-metodo');
                    selectMetodo.parentNode.insertBefore(sugestaoEl, selectMetodo.nextSibling);
                }
            }
            PreparacoesStorage.setPreparacaoAtual(preparacaoAtual);
        });

        document.getElementById('prep-jorradas').addEventListener('change', (e) => {
            const qtd = Number(e.target.value);
            preparacaoAtual.quantidadeJorradas = qtd;
            document.getElementById('grupo-multiplicador').style.display = qtd > 1 ? 'block' : 'none';
            PreparacoesStorage.setPreparacaoAtual(preparacaoAtual);
        });

        document.getElementById('btn-descartar-preparacao').addEventListener('click', () => {
            if (confirm('Descartar preparação atual?')) {
                PreparacaoModule.descartarPreparacaoAtual();
                preparacaoAtual = null;
                renderizar();
            }
        });

        document.getElementById('btn-gerar-jorradas').addEventListener('click', () => {
            // Ler dados manuais do método se for manual
            if (preparacaoAtual.metodo && preparacaoAtual.metodo.id === null) {
                preparacaoAtual.metodo.nome = document.getElementById('prep-metodo-nome').value.trim();
                preparacaoAtual.metodo.tempo = document.getElementById('prep-metodo-tempo').value.trim();
            }

            preparacaoAtual.quantidadeCafe = Number(document.getElementById('prep-qtd-cafe').value);
            preparacaoAtual.proporcao = Number(document.getElementById('prep-proporcao').value);
            preparacaoAtual.quantidadeJorradas = Number(document.getElementById('prep-jorradas').value);
            preparacaoAtual.multiplicadorPrimeira = preparacaoAtual.quantidadeJorradas > 1 ? Number(document.getElementById('prep-multiplicador').value) : 0;

            const erros = PreparacaoModule.validarPreparacao(preparacaoAtual);
            if (erros.length > 0) {
                ErrorHandler.exibirAviso(erros.map(e => e.mensagem).join(' '));
                return;
            }

            PreparacaoModule.gerarJorradasPlanejadas(preparacaoAtual);
            PreparacoesStorage.setPreparacaoAtual(preparacaoAtual);
            renderizar();
        });

        // Eventos de jorradas realizadas
        document.querySelectorAll('.input-realizado').forEach(input => {
            input.addEventListener('change', (e) => {
                const numero = Number(e.target.getAttribute('data-numero'));
                const valor = e.target.value;
                try {
                    PreparacaoModule.registrarValorRealizado(preparacaoAtual, numero, valor);
                    PreparacoesStorage.setPreparacaoAtual(preparacaoAtual);
                    renderizar();
                } catch (erro) {
                    ErrorHandler.exibirErro(erro.message);
                }
            });
        });

        // Botão finalizar
        const btnFinalizar = document.getElementById('btn-finalizar-preparacao');
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', () => {
                const erros = PreparacaoModule.validarPreparacao(preparacaoAtual);
                if (erros.length > 0) {
                    ErrorHandler.exibirAviso(erros.map(e => e.mensagem).join(' '));
                    return;
                }
                if (confirm('Finalizar preparação?')) {
                    const preparacaoSalva = PreparacaoModule.finalizarPreparacao(preparacaoAtual);
                    if (preparacaoSalva) {
                        ErrorHandler.exibirSucesso('Preparação finalizada e salva no histórico.');
                        // Manter em memória para avaliar, mas remover do storage de atual
                        preparacaoAtual = preparacaoSalva;
                        PreparacoesStorage.clearPreparacaoAtual();
                        renderizar();
                    } else {
                        ErrorHandler.exibirErro('Erro ao finalizar.');
                    }
                }
            });
        }
    }

    function renderizarAposFinalizacao(container) {
        if (!preparacaoAtual.avaliacao) {
            container.innerHTML = `
                <div class="card">
                    <h3>Preparação finalizada!</h3>
                    <p>Avalie esta preparação:</p>
                    ${UIComponents.formularioAvaliacao()}
                    <div class="form-acoes">
                        <button class="btn btn--secundario" id="btn-pular-avaliacao">Pular avaliação</button>
                    </div>
                </div>
            `;
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
                preparacaoAtual.avaliacao = avaliacao;
                preparacaoAtual.dataAtualizacao = new Date().toISOString();
                PreparacoesStorage.salvarPreparacao(preparacaoAtual);
                ErrorHandler.exibirSucesso('Avaliação salva.');
                renderizar();
            });
            form.querySelector('.btn-cancelar-avaliacao')?.addEventListener('click', () => DOMUtils.fecharModal());
            document.getElementById('btn-pular-avaliacao').addEventListener('click', () => {
                // Ir para histórico
                preparacaoAtual = null;
                window.location.hash = '#/historico';
            });
        } else {
            container.innerHTML = `
                <div class="card">
                    <h3>Preparação concluída e avaliada.</h3>
                    <button class="btn btn--primario" id="btn-ir-historico">Ir para histórico</button>
                </div>
            `;
            document.getElementById('btn-ir-historico').addEventListener('click', () => {
                preparacaoAtual = null;
                window.location.hash = '#/historico';
            });
        }
    }

    return { renderizar };
})();

window.PreparacaoView = PreparacaoView;