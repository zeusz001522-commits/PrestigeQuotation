function generateQuotationNumber() {
    const random = Math.floor(Math.random() * 900) + 100;
    document.getElementById('qtnNo').value = `COK/QTN/2026/${random}`;
}

window.onload = function() {
    generateQuotationNumber();
    document.getElementById('qtnDate').valueAsDate = new Date();
    
    let validDate = new Date();
    validDate.setDate(validDate.getDate() + 30);
    document.getElementById('validTill').valueAsDate = validDate;

    loadFromDisk();
    calculate();
};

function addRow() {
    const tbody = document.getElementById('tableBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" value="Cochin"></td>
        <td><input type="text" placeholder="Description"></td>
        <td><input type="text" placeholder="Remarks"></td>
        <td><input type="number" class="qty" value="1" oninput="calculate()"></td>
        <td><select class="unit-select"><option>CBM</option><option>Cont</option><option>BL</option></select></td>
        <td><select class="curr-select" onchange="calculate()"><option value="USD">USD</option><option value="LKR">LKR</option></select></td>
        <td><input type="number" class="rate" value="0" oninput="calculate()"></td>
        <td class="amount">0.00</td>
        <td class="no-print"><button onclick="removeRow(this)">✖</button></td>
    `;
    tbody.appendChild(row);
}

function removeRow(btn) {
    btn.parentElement.parentElement.remove();
    calculate();
}

function calculate() {
    let grandTotalInTarget = 0;
    const usdToLkr = parseFloat(document.getElementById('rateLKR').value) || 300;
    const targetCurrency = document.getElementById('finalCurrencySelector').value;
    const rows = document.querySelectorAll('#tableBody tr');
    
    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        const rate = parseFloat(row.querySelector('.rate').value) || 0;
        const rowCurr = row.querySelector('.curr-select').value;
        const rowAmount = qty * rate;
        
        row.querySelector('.amount').innerText = rowAmount.toLocaleString(undefined, {minimumFractionDigits: 2});

        let amountInUSD = (rowCurr === "USD") ? rowAmount : rowAmount / usdToLkr;
        let amountInTarget = (targetCurrency === "USD") ? amountInUSD : amountInUSD * usdToLkr;

        grandTotalInTarget += amountInTarget;
    });

    document.getElementById('mergedGrandTotal').innerHTML = `TOTAL (${targetCurrency}): ${grandTotalInTarget.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}

function saveToDisk() {
    localStorage.setItem('rateLKR', document.getElementById('rateLKR').value);
}
function loadFromDisk() {
    if(localStorage.getItem('rateLKR')) document.getElementById('rateLKR').value = localStorage.getItem('rateLKR');
}
function printQuotation() { window.print(); }
