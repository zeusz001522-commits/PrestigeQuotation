const chargeBody = document.getElementById("chargeBody");
const totalEl = document.getElementById("grandTotal");

function generateQuoteNo(){
  const d = new Date();
  return `QTN-${d.getFullYear()}-${Math.floor(Math.random()*1000)}`;
}

function addRow(){
  const row = document.createElement("tr");

  row.innerHTML = `
    <td></td>
    <td><input class="desc"></td>
    <td><input type="number" class="qty" value="1"></td>
    <td><input type="number" class="rate" value="0"></td>
    <td class="amount">0.00</td>
    <td class="no-print"><button class="remove">X</button></td>
  `;

  chargeBody.appendChild(row);
  update();
}

function update(){
  let total = 0;

  document.querySelectorAll("#chargeBody tr").forEach((row,i)=>{
    row.children[0].textContent = i+1;

    const qty = parseFloat(row.querySelector(".qty").value) || 0;
    const rate = parseFloat(row.querySelector(".rate").value) || 0;
    const amount = qty * rate;

    row.querySelector(".amount").textContent = amount.toFixed(2);
    total += amount;
  });

  totalEl.textContent = `Total: ${total.toFixed(2)} USD`;
}

function resetForm(){
  chargeBody.innerHTML = "";
  addRow();
  document.getElementById("quoteNo").textContent = generateQuoteNo();
}

document.addEventListener("input", update);

document.addEventListener("click", e=>{
  if(e.target.id==="addRowBtn") addRow();
  if(e.target.classList.contains("remove")){
    e.target.closest("tr").remove();
    update();
  }
  if(e.target.id==="newQuote") resetForm();
  if(e.target.id==="printBtn") window.print();
});

resetForm();
