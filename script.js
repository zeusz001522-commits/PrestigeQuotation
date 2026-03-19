
// Function to generate a unique QTN number
function generateQuotationNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // Result looks like: QTN-202603-123
    const generatedID = `QTN-${year}${month}-${random}`;
    document.getElementById('qtnNo').value = generatedID;
}

// Run this as soon as the page loads
window.onload = function() {
    generateQuotationNumber();
    document.getElementById('qtnDate').valueAsDate = new Date(); // Sets today's date
};
// Set today's date automatically
document.getElementById('qtnDate').valueAsDate = new Date();

function addRow() {
    const tbody = document.getElementById('tableBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" placeholder="e.g. Documentation"></td>
        <td><input type="number" class="qty" value="1" oninput="calculate()"></td>
        <td>
            <select class="unit-select">
                <option value="Cont">Container</option>
                <option value="Kgs">Kgs</option>
                <option value="CBM">CBM</option>
                <option value="BL">B/L</option>
                <option value="Doc">Doc</option>
                <option value="Shipment">Shipment</option>
				<option value="20GP">20GP</option>
				<option value="40GP">40GP</option>
                <option value="Hour">Hour</option>
            </select>
        </td>
        <td>
            <select class="curr-select">
                <option value="USD">USD</option>
                <option value="LKR">LKR</option>
                <option value="EUR">EUR</option>
            </select>
        </td>
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
    let breakdownParts = [];
    
    // 1. Get current exchange rates
    const usdToLkr = parseFloat(document.getElementById('rateLKR').value) || 300;
    const usdToEur = parseFloat(document.getElementById('rateEUR').value) || 0.92;
    const targetCurrency = document.getElementById('finalCurrencySelector').value;

    const rows = document.querySelectorAll('#tableBody tr');
    
    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        const rate = parseFloat(row.querySelector('.rate').value) || 0;
        const rowCurr = row.querySelector('.curr-select').value;
        
        const rowAmount = qty * rate;
        row.querySelector('.amount').innerText = rowAmount.toLocaleString(undefined, {minimumFractionDigits: 2});

        // 2. Convert Row Amount to USD (The middle-man currency)
        let amountInUSD = 0;
        if (rowCurr === "USD") amountInUSD = rowAmount;
        else if (rowCurr === "LKR") amountInUSD = rowAmount / usdToLkr;
        else if (rowCurr === "EUR") amountInUSD = rowAmount / usdToEur;

        // 3. Convert USD to the Final Target Currency
        let amountInTarget = 0;
        if (targetCurrency === "USD") amountInTarget = amountInUSD;
        else if (targetCurrency === "LKR") amountInTarget = amountInUSD * usdToLkr;
        else if (targetCurrency === "EUR") amountInTarget = amountInUSD * usdToEur;

        grandTotalInTarget += amountInTarget;
    });

    // 4. Update the Display
    const totalDisplay = document.getElementById('mergedGrandTotal');
    totalDisplay.innerHTML = `TOTAL (${targetCurrency}): ${grandTotalInTarget.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}
// Block the Right-Click Menu (Context Menu)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Optional: Block Ctrl+T, Ctrl+N, and Ctrl+U (View Source)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 't' || e.key === 'n' || e.key === 'u')) {
        e.preventDefault();
        alert("New tabs are disabled in App Mode.");
    }
});
// --- SOFTWARE PERSISTENCE ---
// Saves your exchange rates so they are still there even after you close the app
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

// Update your existing window.onload
const originalLoad = window.onload;
window.onload = function() {
    if (originalLoad) originalLoad();
    loadFromDisk();
    
    // Add event listeners to save rates whenever they change
    document.getElementById('rateLKR').addEventListener('input', saveToDisk);
    document.getElementById('rateEUR').addEventListener('input', saveToDisk);
};

// --- SECURITY & UI ---
// Prevents right-click and standard browser shortcuts to keep it feeling like software
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.ctrlKey && (e.key === 'r' || e.key === 'l' || e.key === 'p')) {
        // Allow Print (Ctrl+P) but block others if you want
    }
});
function printQuotation() {
    window.print();
}
function printQuotation() {
    alert("IMPORTANT:\n\nPlease uncheck 'Headers and Footers' in print settings for a clean quotation PDF.");
    window.print();
}