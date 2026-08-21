/**
 * Componentes reutilizáveis de UI.
 */
const UIComponents = (function() {
    function badge(texto, classe) {
        return `<span class="badge ${classe}">${DOMUtils.escaparHTML(texto)}</span>`;
    }

    function cardCafe(cafe) {
        const statusBadge = {
            [APP_CONSTANTS.STATUS_CAFE.TENHO]: badge('Tenho', 'badge--tenho'),
            [APP_CONSTANTS.STATUS_CAFE.TIVE]: badge('Tive', 'badge--tive'),
            [APP_CONSTANTS.STATUS_CAFE.LISTA_DESEJO]: badge('Lista de desejo', 'badge--lista-desejo')
        }[cafe.status] || '';

        const estoqueBadge = cafe.emEstoque
            ? badge('Em estoque', 'badge--estoque')
            : badge('Sem estoque', 'badge--sem-estoque');

        const detalhes = [];
        if (cafe.torra) detalhes.push(`<strong>Torra:</strong> ${DOMUtils.escaparHTML(cafe.torra)}`);
        if (cafe.sensorial) detalhes.push(`<strong>Sensorial:</strong> ${DOMUtils.escaparHTML(cafe.sensorial)}`);
        if (cafe.notas) detalhes.push(`<strong>Notas:</strong> ${DOMUtils.escaparHTML(cafe.notas)}`);
        if (cafe.variedade) detalhes.push(`<strong>Variedade:</strong> ${DOMUtils.escaparHTML(cafe.variedade)}`);
        if (cafe.processo) detalhes.push(`<strong>Processo:</strong> ${DOMUtils.escaparHTML(cafe.processo)}`);
        if (cafe.regiao) detalhes.push(`<strong>Região:</strong> ${DOMUtils.escaparHTML(cafe.regiao)}`);

        return `
            <div class="card" data-cafe-id="${cafe.id}">
                <div class="card__titulo">${DOMUtils.escaparHTML(cafe.nome)}</div>
                <div class="card__subtitulo">
                    ${statusBadge} ${estoqueBadge}
                    ${cafe.dataCompra ? `<div><small>Compra: ${DOMUtils.escaparHTML(cafe.dataCompra)}</small></div>` : ''}
                    <div><small>Gramatura: ${cafe.gramatura}g | Valor: R$ ${cafe.valorPago}</small></div>
                </div>
                ${detalhes.length ? `<div class="detalhes"><div class="detalhes__titulo">Detalhes</div>${detalhes.join('<br>')}</div>` : ''}
                <div class="card__acoes">
                    <button class="btn btn--secundario btn--pequeno btn-editar-cafe" data-id="${cafe.id}">Editar</button>
                    <button class="btn btn--perigo btn--pequeno btn-excluir-cafe" data-id="${cafe.id}">Excluir</button>
                </div>
            </div>
        `;
    }

    function cardMetodo(metodo) {
        return `
            <div class="card" data-metodo-id="${metodo.id}">
                <div class="card__titulo">${DOMUtils.escaparHTML(metodo.nome)}</div>
                <div class="card__subtitulo">
                    <div><small>Tempo: ${DOMUtils.escaparHTML(metodo.tempo)}</small></div>
                    ${metodo.proporcao ? `<div><small>Proporção sugerida: 1:${metodo.proporcao}</small></div>` : ''}
                    ${metodo.moagem ? `<div><small>Moagem: ${DOMUtils.escaparHTML(metodo.moagem)}</small></div>` : ''}
                </div>
                <div class="card__acoes">
                    <button class="btn btn--secundario btn--pequeno btn-editar-metodo" data-id="${metodo.id}">Editar</button>
                    <button class="btn btn--perigo btn--pequeno btn-excluir-metodo" data-id="${metodo.id}">Excluir</button>
                </div>
            </div>
        `;
    }

    function formCafe(cafe = null) {
        const isEdicao = cafe !== null;
        const valores = cafe || {
            nome: '', valorPago: '', gramatura: '', dataCompra: '',
            torra: '', sensorial: '', notas: '', corpo: '', finalizacao: '',
            variedade: '', processo: '', propriedade: '', cidade: '', regiao: '',
            altitude: '', status: APP_CONSTANTS.STATUS_CAFE.TENHO, emEstoque: true
        };

        return `
            <form id="form-cafe">
                <div class="form-group">
                    <label class="form-label" for="cafe-nome">Nome *</label>
                    <input class="form-input" type="text" id="cafe-nome" value="${DOMUtils.escaparHTML(valores.nome)}" required>
                    <div class="form-erro"></div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-valor">Valor pago (R$) *</label>
                    <input class="form-input" type="number" step="0.01" min="0" id="cafe-valor" value="${valores.valorPago}">
                    <div class="form-erro"></div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-gramatura">Gramatura (g) *</label>
                    <input class="form-input" type="number" step="0.1" min="0.1" id="cafe-gramatura" value="${valores.gramatura}">
                    <div class="form-erro"></div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-data">Data de compra</label>
                    <input class="form-input" type="date" id="cafe-data" value="${valores.dataCompra || ''}">
                    <div class="form-erro"></div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-status">Status *</label>
                    <select class="form-select" id="cafe-status">
                        <option value="tenho" ${valores.status === 'tenho' ? 'selected' : ''}>Tenho</option>
                        <option value="tive" ${valores.status === 'tive' ? 'selected' : ''}>Tive</option>
                        <option value="lista_desejo" ${valores.status === 'lista_desejo' ? 'selected' : ''}>Lista de desejo</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-estoque">Em estoque?</label>
                    <select class="form-select" id="cafe-estoque">
                        <option value="true" ${valores.emEstoque ? 'selected' : ''}>Sim</option>
                        <option value="false" ${!valores.emEstoque ? 'selected' : ''}>Não</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-torra">Torra</label>
                    <input class="form-input" type="text" id="cafe-torra" value="${DOMUtils.escaparHTML(valores.torra || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-sensorial">Sensorial</label>
                    <input class="form-input" type="text" id="cafe-sensorial" value="${DOMUtils.escaparHTML(valores.sensorial || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-notas">Notas</label>
                    <input class="form-input" type="text" id="cafe-notas" value="${DOMUtils.escaparHTML(valores.notas || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-corpo">Corpo</label>
                    <input class="form-input" type="text" id="cafe-corpo" value="${DOMUtils.escaparHTML(valores.corpo || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-finalizacao">Finalização</label>
                    <input class="form-input" type="text" id="cafe-finalizacao" value="${DOMUtils.escaparHTML(valores.finalizacao || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-variedade">Variedade</label>
                    <input class="form-input" type="text" id="cafe-variedade" value="${DOMUtils.escaparHTML(valores.variedade || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-processo">Processo</label>
                    <input class="form-input" type="text" id="cafe-processo" value="${DOMUtils.escaparHTML(valores.processo || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-propriedade">Propriedade</label>
                    <input class="form-input" type="text" id="cafe-propriedade" value="${DOMUtils.escaparHTML(valores.propriedade || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-cidade">Cidade</label>
                    <input class="form-input" type="text" id="cafe-cidade" value="${DOMUtils.escaparHTML(valores.cidade || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-regiao">Região</label>
                    <input class="form-input" type="text" id="cafe-regiao" value="${DOMUtils.escaparHTML(valores.regiao || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="cafe-altitude">Altitude</label>
                    <input class="form-input" type="text" id="cafe-altitude" value="${DOMUtils.escaparHTML(valores.altitude || '')}">
                </div>
                <div class="form-acoes">
                    <button type="button" class="btn btn--secundario btn-cancelar">Cancelar</button>
                    <button type="submit" class="btn btn--primario">${isEdicao ? 'Salvar alterações' : 'Cadastrar café'}</button>
                </div>
            </form>
        `;
    }

    function formMetodo(metodo = null) {
        const isEdicao = metodo !== null;
        const valores = metodo || {
            nome: '', tempo: '', extracao: '', moagem: '', proporcao: '', resultadoXicara: ''
        };

        return `
            <form id="form-metodo">
                <div class="form-group">
                    <label class="form-label" for="metodo-nome">Nome *</label>
                    <input class="form-input" type="text" id="metodo-nome" value="${DOMUtils.escaparHTML(valores.nome)}" required>
                    <div class="form-erro"></div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="metodo-tempo">Tempo *</label>
                    <input class="form-input" type="text" id="metodo-tempo" value="${DOMUtils.escaparHTML(valores.tempo)}" placeholder="Ex: 3:00">
                    <div class="form-erro"></div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="metodo-extracao">Extração</label>
                    <input class="form-input" type="text" id="metodo-extracao" value="${DOMUtils.escaparHTML(valores.extracao || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="metodo-moagem">Moagem</label>
                    <input class="form-input" type="text" id="metodo-moagem" value="${DOMUtils.escaparHTML(valores.moagem || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="metodo-proporcao">Proporção (ex: 16)</label>
                    <input class="form-input" type="number" step="0.1" min="0.1" id="metodo-proporcao" value="${valores.proporcao || ''}">
                    <div class="form-ajuda">Opcional. Usada como sugestão na preparação.</div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="metodo-resultado">Resultado na xícara</label>
                    <input class="form-input" type="text" id="metodo-resultado" value="${DOMUtils.escaparHTML(valores.resultadoXicara || '')}">
                </div>
                <div class="form-acoes">
                    <button type="button" class="btn btn--secundario btn-cancelar">Cancelar</button>
                    <button type="submit" class="btn btn--primario">${isEdicao ? 'Salvar alterações' : 'Cadastrar método'}</button>
                </div>
            </form>
        `;
    }

    function formularioAvaliacao(avaliacaoExistente = null) {
        const valores = avaliacaoExistente || { olfato: '', paladar: '', tato: '', finalizacao: '', comentario: '' };
        return `
            <form id="form-avaliacao">
                <div class="form-group">
                    <label class="form-label" for="av-olafato">Olfato (1-5) *</label>
                    <input class="form-input" type="number" min="1" max="5" step="1" id="av-olfato" value="${valores.olfato || ''}">
                    <div class="form-erro"></div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="av-paladar">Paladar (1-5) *</label>
                    <input class="form-input" type="number" min="1" max="5" step="1" id="av-paladar" value="${valores.paladar || ''}">
                    <div class="form-erro"></div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="av-tato">Tato (1-5) *</label>
                    <input class="form-input" type="number" min="1" max="5" step="1" id="av-tato" value="${valores.tato || ''}">
                    <div class="form-erro"></div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="av-finalizacao">Finalização (1-5) *</label>
                    <input class="form-input" type="number" min="1" max="5" step="1" id="av-finalizacao" value="${valores.finalizacao || ''}">
                    <div class="form-erro"></div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="av-comentario">Comentário</label>
                    <textarea class="form-textarea" id="av-comentario">${DOMUtils.escaparHTML(valores.comentario || '')}</textarea>
                </div>
                <div class="form-acoes">
                    <button type="button" class="btn btn--secundario btn-cancelar-avaliacao">Cancelar</button>
                    <button type="submit" class="btn btn--primario">Salvar avaliação</button>
                </div>
            </form>
        `;
    }

    function tabelaJorradas(jorradas, aguaTotal) {
        let html = `<table class="tabela-jorradas">
            <thead><tr><th>Nº</th><th>Tipo</th><th>Planejado (ml)</th><th>Realizado (ml)</th><th>Cumulativo (ml)</th></tr></thead>
            <tbody>`;
        jorradas.forEach((j, index) => {
            const tipo = j.tipo === APP_CONSTANTS.TIPOS_JORRADA.INFUSAO ? 'Infusão' : 'Jorrada';
            html += `<tr data-jorrada="${j.numero}">
                <td>${j.numero}</td>
                <td>${tipo}</td>
                <td>${j.volumePlanejado.toFixed(1)}</td>
                <td><input type="number" class="input-realizado" data-numero="${j.numero}" value="${j.volumeRealizado !== null ? j.volumeRealizado : ''}" step="0.1" min="0"></td>
                <td>${j.cumulativoPlanejado.toFixed(1)}</td>
            </tr>`;
        });
        html += `</tbody></table>`;
        return html;
    }

    return {
        badge,
        cardCafe,
        cardMetodo,
        formCafe,
        formMetodo,
        formularioAvaliacao,
        tabelaJorradas
    };
})();

window.UIComponents = UIComponents;