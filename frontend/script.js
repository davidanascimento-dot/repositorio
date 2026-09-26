
const API = '/equipamentos';

const form = document.getElementById('form-equipamento');
const campoId = document.getElementById('id');
const campoNome = document.getElementById('nome');
const campoTipo = document.getElementById('tipo');
const campoMarca = document.getElementById('marca');
const campoProblema = document.getElementById('problema');
const campoStatus = document.getElementById('status');
const formularioTitulo = document.getElementById('form-titulo');
const btnEnviar = document.getElementById('btn-enviar');
const btnCancelar = document.getElementById('btn-cancelar');
const mensagem = document.getElementById('mensagem');
const corpoTabela = document.getElementById('lista-equipamentos');
const listaVazia = document.getElementById('lista-vazia');

function mostrarMensagem(texto, tipo = 'sucesso') {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

async function requisicao(metodo, caminho, corpo) {
  const resposta = await fetch(caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro ao acessar a API.');
  }

  return dados;
}

async function carregarEquipamentos() {
  try {
    const equipamentos = await requisicao('GET', API);
    corpoTabela.innerHTML = '';

    listaVazia.hidden = equipamentos.length > 0;

    for (const equipamento of equipamentos) {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${equipamento.id}</td>
        <td>${equipamento.nome}</td>
        <td>${equipamento.tipo}</td>
        <td>${equipamento.marca}</td>
        <td>${equipamento.problema || ''}</td>
        <td>${equipamento.status}</td>
        <td>
          <button data-acao="editar" data-id="${equipamento.id}">Editar</button>
          <button data-acao="excluir" data-id="${equipamento.id}" class="perigo">Excluir</button>
        </td>
      `;
      corpoTabela.appendChild(linha);
    }
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
}


form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = campoId.value;
  const dados = {
    nome: campoNome.value,
    tipo: campoTipo.value,
    marca: campoMarca.value,
    problema: campoProblema.value,
    status: campoStatus.value,
  };

  try {
    if (id) {
      await requisicao('PUT', `${API}/${id}`, dados);
      mostrarMensagem('Equipamento alterado com sucesso.');
    } else {
      await requisicao('POST', API, dados);
      mostrarMensagem('Equipamento cadastrado com sucesso.');
    }

    form.reset();
    limparEdicao();
    carregarEquipamentos();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
});



corpoTabela.addEventListener('click', async (evento) => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  const { acao, id } = botao.dataset;

  if (acao === 'editar') {
    try {
      const equipamento = await requisicao('GET', `${API}/${id}`);

      campoId.value = equipamento.id;
      campoNome.value = equipamento.nome;
      campoTipo.value = equipamento.tipo;
      campoMarca.value = equipamento.marca;
      campoProblema.value = equipamento.problema || '';
      campoStatus.value = equipamento.status;

      formularioTitulo.textContent = `Alterando equipamento #${equipamento.id}`;
      btnEnviar.textContent = 'Salvar alterações';
      btnCancelar.hidden = false;
      mostrarMensagem('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (erro) {
      mostrarMensagem(erro.message, 'erro');
    }
  }

  if (acao === 'excluir') {
    if (!confirm('Deseja realmente excluir este equipamento?')) return;

    try {
      await requisicao('DELETE', `${API}/${id}`);
      mostrarMensagem('Equipamento excluído com sucesso.');
      carregarEquipamentos();
    } catch (erro) {
      mostrarMensagem(erro.message, 'erro');
    }
  }
});

btnCancelar.addEventListener('click', () => {
  form.reset();
  limparEdicao();
  mostrarMensagem('');
});

function limparEdicao() {
  campoId.value = '';
  formularioTitulo.textContent = 'Cadastrar equipamento';
  btnEnviar.textContent = 'Cadastrar';
  btnCancelar.hidden = true;
}

carregarEquipamentos();
