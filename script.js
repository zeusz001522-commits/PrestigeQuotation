function generateQuotationNumber() {
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const generatedID = `COK00012/26-27-${random}`;
    document.getElementById('qtnNo').value = generatedID;
}

function setDates() {
    const today = new Date();
    
    // Set Issue Date
    document.getElementById('qtnDate').valueAsDate = today;
    
    // Format "06-April-2026" for the print date string
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const dateString = today.toLocaleDateString('en-GB', options).replace(/ /g, '-');
    document.getElementById('printDateString').value = dateString;

    // Set Valid Till (e.g., +24 days like the document)
    const validDate = new Date(today);
    validDate.setDate(validDate.getDate() + 24);
    document.getElementById('validTill').valueAsDate = validDate;
}

window.onload = function() {
    generateQuotationNumber();
    setDates();
    loadFromDisk();
    calculate();

    document.getElementById('rateLKR').addEventListener('input', saveToDisk);
    document.getElementById('rateEUR').addEventListener('input', saveToDisk);
};

function addRow() {
    const tbody = document.getElementById('tableBody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><input type="text" value="Cochin"></td>
        <td><input type="text" placeholder="Description"></td>
        <td><input type="text" placeholder="Remarks"></td>
        <td><input type="number" class="qty" value="1" oninput="calculate()"></td>
        <td>
            <select class="unit-select">
                <option value="CBM">CBM</option>
                <option value="SHIPMENT">SHIPMENT</option>
                <option value="BILLS OF LADING">BILLS OF LADING</option>
                <option value="VEHICLE">VEHICLE</option>
                <option value="Cont">Container</option>
                <option value="Kgs">Kgs</option>
            </select>
        </td>
        <td>
            <select class="curr-select">
                <option value="USD">USD</option>
                <option value="LKR">LKR</option>
                <option value="EUR">EUR</option>
            </select>
        </td>
        <td><input type="number" class="rate" value="0.00" oninput="calculate()"></td>
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
    const usdToEur = parseFloat(document.getElementById('rateEUR').value) || 0.92;
    const targetCurrency = document.getElementById('finalCurrencySelector').value;

    const rows = document.querySelectorAll('#tableBody tr');
    
    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        const rate = parseFloat(row.querySelector('.rate').value) || 0;
        const rowCurr = row.querySelector('.curr-select').value;
        
        const rowAmount = qty * rate;
        row.querySelector('.amount').innerText = rowAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

        let amountInUSD = 0;
        if (rowCurr === "USD") amountInUSD = rowAmount;
        else if (rowCurr === "LKR") amountInUSD = rowAmount / usdToLkr;
        else if (rowCurr === "EUR") amountInUSD = rowAmount / usdToEur;

        let amountInTarget = 0;
        if (targetCurrency === "USD") amountInTarget = amountInUSD;
        else if (targetCurrency === "LKR") amountInTarget = amountInUSD * usdToLkr;
        else if (targetCurrency === "EUR") amountInTarget = amountInUSD * usdToEur;

        grandTotalInTarget += amountInTarget;
    });

    const totalDisplay = document.getElementById('mergedGrandTotal');
    totalDisplay.innerHTML = `TOTAL: ${grandTotalInTarget.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${targetCurrency}`;
}

function saveToDisk() {
    localStorage.setItem('rateLKR', document.getElementById('rateLKR').value);
    localStorage.setItem('rateEUR', document.getElementById('rateEUR').value);
}

function loadFromDisk() {
    if(localStorage.getItem('rateLKR')) {
        document.getElementById('rateLKR').value = localStorage.getItem('rateLKR');
        document.getElementById('rateEUR').value = localStorage.getItem('rateEUR');
    }
}

// Security features
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.ctrlKey && (e.key === 't' || e.key === 'n' || e.key === 'u')) {
        e.preventDefault();
        alert("New tabs and source viewing are disabled in App Mode.");
    }
});

function printQuotation() {
    alert("IMPORTANT:\n\nPlease uncheck 'Headers and Footers' in your browser's print settings for a clean PDF generation.");
    window.print();
}

// Auto-adjust textarea heights for content like addresses
document.addEventListener('input', function (event) {
    if (event.target.tagName.toLowerCase() !== 'textarea') return;
    event.target.style.height = 'auto';
    event.target.style.height = (event.target.scrollHeight) + 'px';
}, false);
