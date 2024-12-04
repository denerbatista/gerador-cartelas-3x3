function generateBingoCards() {
    const quantity = parseInt(document.getElementById("quantity").value, 10);
    const container = document.getElementById("bingo-cards");
    const downloadBtn = document.getElementById("download-btn");
  
    container.innerHTML = ""; // Limpa as cartelas anteriores
    downloadBtn.disabled = true; // Desabilita o botão de download
  
    for (let i = 0; i < quantity; i++) {
      const card = createBingoCard();
      const cardDiv = document.createElement("div");
      cardDiv.className = "bingo-card";
      cardDiv.appendChild(card);
      container.appendChild(cardDiv);
    }
  
    downloadBtn.disabled = false; // Habilita o botão de download
  }
  
  function createBingoCard() {
    const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
    const shuffled = numbers.sort(() => 0.5 - Math.random()).slice(0, 9);
  
    const table = document.createElement("table");
    table.className = "bingo-table";
  
    for (let i = 0; i < 3; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 3; j++) {
        const cell = document.createElement("td");
        cell.textContent = shuffled[i * 3 + j];
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
  
    return table;
  }
  
  function downloadPDF() {
    const cards = document.querySelectorAll(".bingo-card");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const progressBarContainer = document.getElementById("progress-bar-container");
    const progressBar = document.getElementById("progress-bar");
  
    progressBarContainer.style.display = "block";
    progressBar.style.width = "0%";
  
    let positionY = 10; // Posição inicial no PDF
    let completed = 0;
  
    cards.forEach((card, index) => {
      html2canvas(card).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 190; // Largura da imagem no PDF
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        if (positionY + imgHeight > 280) {
          // Se ultrapassar o limite da página
          pdf.addPage();
          positionY = 10; // Resetar a posição Y
        }
  
        pdf.addImage(imgData, "PNG", 10, positionY, imgWidth, imgHeight);
        positionY += imgHeight + 10; // Ajustar posição para a próxima imagem
  
        completed++;
        progressBar.style.width = `${(completed / cards.length) * 100}%`;
  
        if (index === cards.length - 1) {
          pdf.save("bingo_cards.pdf");
          progressBarContainer.style.display = "none";
        }
      });
    });
  }
  