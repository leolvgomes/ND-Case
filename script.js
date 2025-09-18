const novaTransacaoBtn = document.getElementById("novaTransacaoBtn");
const modal = document.getElementById("modal");
const fecharModal = document.getElementById("fecharModal");
const cadastrarBtn = document.getElementById("cadastrarBtn");

const tabela = document.querySelector("#tabela tbody");
const entradasEl = document.getElementById("entradas");
const saidasEl = document.getElementById("saidas");
const totalEl = document.getElementById("total");

const buscaInput = document.getElementById("busca");
const buscarBtn = document.getElementById("buscarBtn");

let transacoes = [];
let tipoSelecionado = "entrada";

novaTransacaoBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

fecharModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  limparFormulario();
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    limparFormulario();
  }
});

document.querySelectorAll(".type button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".type button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    tipoSelecionado = btn.dataset.tipo;
  });
});

cadastrarBtn.addEventListener("click", () => {
  const descricao = document.getElementById("descricao").value.trim();
  const preco = parseFloat(document.getElementById("preco").value);
  const categoria = document.getElementById("categoria").value.trim();
  const data = new Date().toLocaleDateString("pt-BR");

  if (!descricao || isNaN(preco) || !categoria || preco <= 0) {
    alert("Preencha todos os campos corretamente! O preço deve ser maior que zero.");
    return;
  }

  transacoes.push({ 
    id: Date.now(),
    descricao, 
    preco, 
    categoria, 
    tipo: tipoSelecionado, 
    data 
  });
  
  atualizarTabela();
  atualizarResumo();
  modal.classList.add("hidden");
  limparFormulario();
});

function limparFormulario() {
  document.getElementById("descricao").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("categoria").value = "";
  
  document.querySelectorAll(".type button").forEach(b => b.classList.remove("active"));
  document.querySelector('.btn-income').classList.add("active");
  tipoSelecionado = "entrada";
}

function atualizarTabela(transacoesFiltradas = transacoes) {
  tabela.innerHTML = "";
  
  if (transacoesFiltradas.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4" style="text-align: center; color: #8d8d99;">Nenhuma transação encontrada</td>`;
    tabela.appendChild(tr);
    return;
  }

  transacoesFiltradas.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.descricao}</td>
      <td class="${t.tipo === "entrada" ? "income" : "expense"}">
        ${t.tipo === "saida" ? "- " : ""}R$ ${t.preco.toFixed(2).replace(".", ",")}
      </td>
      <td>${t.categoria}</td>
      <td>${t.data}</td>
    `;
    tabela.appendChild(tr);
  });
}

function atualizarResumo() {
  let entradas = 0, saidas = 0;
  transacoes.forEach(t => {
    if (t.tipo === "entrada") entradas += t.preco;
    else saidas += t.preco;
  });

  const total = entradas - saidas;

  entradasEl.textContent = `R$ ${entradas.toFixed(2).replace(".", ",")}`;
  saidasEl.textContent = `R$ ${saidas.toFixed(2).replace(".", ",")}`;
  totalEl.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

function filtrarTabela() {
  const termo = buscaInput.value.toLowerCase().trim();
  
  if (termo === "") {
    atualizarTabela();
    return;
  }

  const transacoesFiltradas = transacoes.filter(t => 
    t.descricao.toLowerCase().includes(termo) ||
    t.categoria.toLowerCase().includes(termo) ||
    t.preco.toString().includes(termo) ||
    t.data.includes(termo)
  );
  
  atualizarTabela(transacoesFiltradas);
}

buscaInput.addEventListener("input", filtrarTabela);
buscaInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") filtrarTabela();
});
buscarBtn.addEventListener("click", filtrarTabela);

atualizarTabela();
atualizarResumo();
