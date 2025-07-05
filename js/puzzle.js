let segundos = 0;
let intervalo;
window.onload = function () {
  if (intervalo) return;

  intervalo = setInterval(() => {
    segundos++;
    let mins = Math.floor(segundos / 60);
    let secs = segundos % 60;

    let m = String(mins).padStart(2, "0");
    let s = String(secs).padStart(2, "0");

    document.getElementById("cronometro").innerText = m + ":" + s;
  }, 1000);
};

let parte = [];
const divs = Array.from(document.querySelectorAll(".parte"));
for (let i = 1; i <= divs.length; i++) {
  parte.push(`parte${i}`);
}
for (let i = parte.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [parte[i], parte[j]] = [parte[j], parte[i]];
}

divs.forEach((peca, indice) => {
  peca.className = "";
  peca.className = "parte";
  peca.classList.add(parte[indice]);
});

document.getElementById("bt-recarregar").onclick = function () {
  location.reload();
};

let contador = 0;
function arraste(div, encaixediv, posCorreta) {
  let arrastando = false;
  let offsetX, offsetY;
  let animando = false;
  let destinoX, destinoY;

  div.addEventListener("mousedown", (e) => {
    if (div.dataset.fixado === "true") return;
    arrastando = true;
    offsetX = e.clientX - div.offsetLeft;
    offsetY = e.clientY - div.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (arrastando) {
      let pecaLeft = e.clientX - offsetX;
      let pecaTop = e.clientY - offsetY;

      const larguraTela = window.innerWidth;
      const alturaTela = window.innerHeight;

      const larguraPeca = div.offsetWidth;
      const alturaPeca = div.offsetHeight;

      posicaoX = Math.max(0, Math.min(pecaLeft, larguraTela - larguraPeca));
      posicaoY = Math.max(0, Math.min(pecaTop, alturaTela - alturaPeca));

      if (!animando) {
        animando = true;
        requestAnimationFrame(atualizarPosicao);
      }
    }
  });

  function atualizarPosicao() {
    div.style.left = posicaoX + "px";
    div.style.top = posicaoY + "px";
    animando = false;
  }

  document.addEventListener("mouseup", () => {
    arrastando = false;
    const pos = document.getElementById(encaixediv);
    const encaixe = pos.getBoundingClientRect();
    const quad = div.getBoundingClientRect();

    const posicaoCorreta = document
      .getElementById(posCorreta)
      .getBoundingClientRect();

    const contar = Array.from(document.querySelectorAll(".parte"));

    if (
      quad.top >= encaixe.top &&
      quad.bottom <= encaixe.bottom &&
      quad.left >= encaixe.left &&
      quad.right <= encaixe.right
    ) {
      div.style.top = posicaoCorreta.top + "px";
      div.style.left = posicaoCorreta.left + "px";
      div.style.cursor = "default";
      div.style.zIndex = 1;

      if (div.dataset.fixado !== "true") {
        contador += 1;
        div.dataset.fixado = "true";
        if (contador == contar.length) {
          clearInterval(intervalo);
          intervalo = null;
          setTimeout(() => {
            let mins = Math.floor(segundos / 60);
            let secs = segundos % 60;
            let tempoFinal = mins + ":" + secs;

            const fundo = document.createElement("div");
            fundo.id = "fundo";

            const caixa = document.createElement("div");
            caixa.id = "caixa";

            const parab = document.createElement("p");
            parab.id = "parabens";
            parab.textContent =
              "Parabéns! Você conseguiu completar o quebra-cabeça! 🎉";
            caixa.appendChild(parab);

            const cont = document.createElement("p");
            cont.id = "contagem";
            cont.textContent = "Você terminou em:" + tempoFinal;
            caixa.appendChild(cont);

            const p = document.createElement("p");
            p.id = "pergunta";
            p.textContent = "Você quer tentar de novo?";
            caixa.appendChild(p);

            const botao = document.createElement("button");
            botao.id = "botao-recarregar";
            botao.textContent = "Tentar novamente";
            botao.onclick = function () {
              location.reload();
            };
            caixa.appendChild(botao);

            document.body.appendChild(caixa);
            document.body.appendChild(fundo);
          }, 1500);
        }
      }
    }
  });
}

for (let i = 1; i <= divs.length; i++) {
  let parte = `.parte${i}`;
  let encaixe = `encaixe${i}`;
  let posCorreta = `div${i}`;
  arraste(document.querySelector(parte), encaixe, posCorreta);
}
