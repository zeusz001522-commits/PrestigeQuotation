const STORAGE_KEY = "prestige_form_data_v2";
const form = document.getElementById("businessForm");
const itemsBody = document.getElementById("itemsBody");
const previewSection = document.getElementById("previewSection");
const pdfContent = document.getElementById("pdfContent");
const grandTotalEl = document.getElementById("grandTotal");

const addItemBtn = document.getElementById("addItemBtn");
const previewBtn = document.getElementById("previewBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const resetBtn = document.getElementById("resetBtn");
const hidePreviewBtn = document.getElementById("hidePreviewBtn");
const formRefEl = document.getElementById("formRef");
const nameInput = document.getElementById("name");
const companyInput = document.getElementById("company");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const faxInput = document.getElementById("fax");
const requestDateInput = document.getElementById("requestDate");
const deliveryDateInput = document.getElementById("deliveryDate");
const shipmentModeInput = document.getElementById("shipmentMode");
const incotermsInput = document.getElementById("incoterms");
const currencyInput = document.getElementById("currency");
const priorityInput = document.getElementById("priority");
const shipmentTypeInput = document.getElementById("shipmentType");
const termsInput = document.getElementById("terms");
const exRateUsdInput = document.getElementById("exRateUSD");
const exRateLkrInput = document.getElementById("exRateLKR");
const exRateEurInput = document.getElementById("exRateEUR");
const exToCurrencyEls = Array.from(document.querySelectorAll(".ex-to-currency"));
const UNIT_OPTIONS = ["BL", "M3", "W/M", "KG", "20HC", "40HC", '20"RF', '40"RF', "SHIPMENT"];
const CHARGE_TYPES = {
  FREIGHT: "Freight Rate",
  LOCAL: "Local Charges",
};
const CURRENCY_LOCALES = { USD: "en-US", LKR: "en-LK", EUR: "de-DE" };

const COMPANY_FOOTER_LINES = [
  "PRESTIGE INTERNATIONAL LOGISTICS (PVT) LTD",
  "HEAD OFFICE : 70 3/1, 3RD FLOOR, JETHAWANA ROAD, COLOMBO 14, SRI LANKA",
  "BRANCH OFFICE : 187, COLOMBO ROAD, KATUNAYAKE",
  "AIRPORT OFFICE : TERMINAL 1-1-12, CARGO VILLAGE, BIA, KATUNAYAKE",
  "T : +94 112 470 099",
  "E-mail : csd4.prestige@pilcmb.com",
  "www.pilcmb.com",
];

const DEFAULT_TERMS = `1. THE FREIGHT RATES QUOTED ARE FOB PORT TO PORT IN CURRENCY MENTIONED ABOVE. IN ADDITION OTHER CHARGES AT ORIGIN & DESTINATION SHALL APPLY.
2. THE QUOTED RATES ARE BASED ON THE CURRENT APPLICABLE TARIFF AND PREVAILING SURCHARGES.
3. ADDITIONAL LEVIES & SURCHARGES EFFECTED AFTER ACCEPTANCE OF THE QUOTED RATES SHALL BE INFORMED TO YOU WITH ADVANCE NOTICE & SHALL BE BILLED TO YOU ACCORDINGLY.
4. ALL THE ORIGIN AND DESTINATION CHARGES WOULD BE CHARGED EITHER TO THE SHIPPER OR CONSIGNEE AS SPECIFIED & INSTRUCTED IN WRITING.
5. THE QUOTED RATES ARE EXCLUSIVE OF ORIGIN AND DESTINATION THC, PSS, GRI, BAF, CAF AND ANY OTHER PORT CHARGES UNLESS OTHERWISE SPECIFIED.
6. INCASE OF ANY FREIGHT RATE INCREASE, DURING THE AGREED PERIOD, THE RATES WILL BE APPLIED WITH MUTUAL AGREEMET.
7. THE QUOTED RATES ARE APPLICABLE ONLY FOR GENERAL,NON-HAZARDOUS CARGO, IN GAUGE CARGO.
8. THE QUOTED RATES FOR SPECIAL CONTAINERS LIKE - HIGH CUBE, OPEN TOP, FLAT RACK, REEFER CONTAINERS- ARE SUBJECT TO AVAILABILITY OF CONTAINERS.
9. WHEN THE HBL/HAWB IS " TO ORDER", ORIGINAL HBL/HAWB DULY ENDORSED BY SHIPPER, CONSIGNEE'S BANK (IF INVOLVED),CHA (IF INVOLVED) BEHIND THE HBL/HAWB SHALL BE REQUIRED TO BE SUBMITTED TO CLAIM DELIVERY.
10. CLAIMS IF ANY, AGAINST A SHIPMENT SHOULD BE REGISTERED WITH US IN WRITING WITHIN 3 WORKING DAYS FROM TAKING DELIVERY.
11. CLAIMS IF ANY, SHALL BE TREATED INDEPENDENT OF OUR BILLS & SHALL BE EVALUATED APPROPRIATELY & SUITABLE ACTION WILL BE TAKEN.
12. ALL OUR BILLS NEEDS TO BE PAID IN FULL WITHOUT ANY DEDUCTION AS PER THE AGREED CREDIT TERMS. CLAIMS IF ANY, SHOULD NOT BE ADJUSTED AGAINST OUR BILLS.
13. WE SHALL NOT BE RESPONSIBLE & LIABLE FOR ANY DELAY CAUSED BY PORT CONGESTION ( INFRASTRUCTURAL PROBLEMS OF AIRPORT SEA PORT CONCOR ETC ) & SHALL NOT ENTERTAIN ANY CLAIM CAUSED DUE TO AN EVENT BEYOND OUR CONTROL.
14. RECEIVABLES BEYOND 15 DAYS FROM THE APPROVED CREDIT PERIOD SHALL ATTRACT INTEREST @18% P A ON THE OUTSTANDING AMOUNT.
15. THE ABOVE TERMS & CONDITIONS SHOULD BE READ IN CONJUNCTION WITH THE STANDARD CONDITIONS ON THE REVERSE OF THE BILLING OF LADING/ AIRWAY BILL .`;

function formatQuotationDate(iso) {
  if (!iso) {
    return "";
  }
  const [y, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d}-${months[parseInt(m, 10) - 1]}-${y}`;
}

function serviceInformationLine(data) {
  const mode = String(data.shipmentMode || "").toUpperCase();
  const st = String(data.shipmentType || "").toUpperCase();
  const dateStr = formatQuotationDate(data.requestDate);
  const validStr = formatQuotationDate(data.deliveryDate);
  return `SERVICE INFORMATION - ${mode} ${st} Quote No #: ${data.ref} Date : ${dateStr} Valid Till : ${validStr}`;
}

function createReferenceId() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PR-${year}-${random}`;
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function sanitizeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatAmount(amount, currencyCode) {
  const code = currencyCode || "USD";
  const locale = CURRENCY_LOCALES[code] || "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function setExchangeRateCurrencyLabels(shipmentCurrency) {
  const label = shipmentCurrency || "—";
  exToCurrencyEls.forEach((el) => {
    el.textContent = label;
  });
}

function getExchangeRatesFromForm(shipmentCurrency) {
  const cur = shipmentCurrency || currencyInput?.value || "USD";
  const rates = {
    USD: Number(exRateUsdInput?.value) || 0,
    LKR: Number(exRateLkrInput?.value) || 0,
    EUR: Number(exRateEurInput?.value) || 0,
  };
  // Ensure the selected shipment currency converts to itself.
  rates[cur] = 1;
  return rates;
}

function computeGrandTotals(items) {
  const totalsByCurrency = new Map();
  (items || []).forEach((it) => {
    const currency = it.currency || "USD";
    const value = Number(it.rate) || 0;
    totalsByCurrency.set(currency, (totalsByCurrency.get(currency) || 0) + value);
  });
  return totalsByCurrency;
}

function formatGrandTotalDisplay(totalsByCurrency) {
  if (!totalsByCurrency || totalsByCurrency.size === 0) {
    return "—";
  }
  if (totalsByCurrency.size === 1) {
    const [currency, total] = Array.from(totalsByCurrency.entries())[0];
    return formatAmount(total, currency);
  }
  return Array.from(totalsByCurrency.entries())
    .map(([currency, total]) => `${currency} ${formatAmount(total, currency).replace(/[^\d.,\-]+/g, "").trim()}`)
    .join(" + ");
}

function computeGrandTotalValue(items) {
  return (items || []).reduce((sum, it) => sum + (Number(it.rate) || 0), 0);
}

function computeGrandTotalInShipmentCurrency(items, shipmentCurrency, exchangeRates) {
  const shipCur = shipmentCurrency || "USD";
  const rates = exchangeRates || {};
  return (items || []).reduce((sum, it) => {
    const fromCur = it.currency || shipCur;
    const amount = Number(it.rate) || 0;
    if (fromCur === shipCur) {
      return sum + amount;
    }
    const rate = Number(rates[fromCur]) || 0;
    if (rate <= 0) {
      // If user hasn't provided a usable exchange rate, fall back to raw amount.
      return sum + amount;
    }
    return sum + amount * rate;
  }, 0);
}

function applyShipmentCurrencyToItems() {
  const selectedCurrency = currencyInput?.value || "USD";
  itemsBody.querySelectorAll(".item-currency").forEach((currencySelect) => {
    currencySelect.value = selectedCurrency;
  });
}

function addItemRow(item = {}) {
  const row = document.createElement("tr");
  const existingRowCount = itemsBody.querySelectorAll("tr").length;
  const defaultType = existingRowCount === 0 ? CHARGE_TYPES.FREIGHT : CHARGE_TYPES.LOCAL;
  const itemType = item.type || defaultType;

  const unitOptionsHtml = UNIT_OPTIONS.map((unit) => {
    const safeUnit = sanitizeHtml(unit);
    return `<option value="${safeUnit}" ${item.unit === unit ? "selected" : ""}>${safeUnit}</option>`;
  }).join("");
  const itemCurrency = item.currency || currencyInput?.value || "USD";
  const currencyOptionsHtml = ["USD", "LKR", "EUR"]
    .map((currency) => `<option value="${currency}" ${itemCurrency === currency ? "selected" : ""}>${currency}</option>`)
    .join("");

  const typeOptionsHtml = [CHARGE_TYPES.FREIGHT, CHARGE_TYPES.LOCAL]
    .map((type) => `<option value="${type}" ${itemType === type ? "selected" : ""}>${type}</option>`)
    .join("");

  row.innerHTML = `
    <td class="row-index fw-semibold text-secondary"></td>
    <td>
      <input type="text" class="form-control item-desc" placeholder="Item / Shipment description" value="${sanitizeHtml(item.desc || "")}" required />
      <div class="invalid-feedback">Description is required.</div>
    </td>
    <td>
      <select class="form-select item-type" required>
        <option value="">Select type</option>
        ${typeOptionsHtml}
      </select>
      <div class="invalid-feedback">Please select a charge type.</div>
    </td>
    <td>
      <select class="form-select item-unit" required>
        <option value="">Select unit</option>
        ${unitOptionsHtml}
      </select>
      <div class="invalid-feedback">Please select a unit.</div>
    </td>
    <td>
      <select class="form-select item-currency" required>
        <option value="">Currency</option>
        ${currencyOptionsHtml}
      </select>
      <div class="invalid-feedback">Please select currency.</div>
    </td>
    <td>
      <input type="number" class="form-control item-rate text-end" min="0" step="0.01" value="${item.rate ?? 0}" required />
      <div class="invalid-feedback">Rate cannot be negative.</div>
    </td>
    <td class="item-total fw-semibold text-end">0.00</td>
    <td class="text-center no-print">
      <button type="button" class="btn btn-outline-danger btn-sm remove-item">Remove</button>
    </td>
  `;
  itemsBody.appendChild(row);
  recalculateTotals();
}

function recalculateTotals() {
  const rows = Array.from(itemsBody.querySelectorAll("tr"));
  const shipmentCurrency = currencyInput?.value || "USD";
  const exchangeRates = getExchangeRatesFromForm(shipmentCurrency);
  const items = [];

  rows.forEach((row, index) => {
    const currencyInput = row.querySelector(".item-currency");
    const rateInput = row.querySelector(".item-rate");
    const totalCell = row.querySelector(".item-total");
    const indexCell = row.querySelector(".row-index");

    const rowCurrency = currencyInput.value || "USD";
    const rate = Number(rateInput.value) || 0;
    const lineTotal = rate;

    indexCell.textContent = String(index + 1);
    totalCell.textContent = formatAmount(lineTotal, rowCurrency);
    items.push({ currency: rowCurrency, rate: lineTotal });
  });

  if (grandTotalEl) {
    const grandTotalValue = computeGrandTotalInShipmentCurrency(items, shipmentCurrency, exchangeRates);
    grandTotalEl.textContent = formatAmount(grandTotalValue, shipmentCurrency);
  }
}

function getItemsData() {
  return Array.from(itemsBody.querySelectorAll("tr")).map((row) => ({
    desc: row.querySelector(".item-desc").value.trim(),
    type: row.querySelector(".item-type")?.value || CHARGE_TYPES.LOCAL,
    unit: row.querySelector(".item-unit").value,
    currency: row.querySelector(".item-currency").value || "USD",
    rate: Number(row.querySelector(".item-rate").value) || 0,
  }));
}

function getFormData() {
  const shipmentCurrency = currencyInput.value;
  return {
    ref: formRefEl.textContent,
    name: nameInput.value.trim(),
    company: companyInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    fax: faxInput?.value?.trim() || "",
    requestDate: requestDateInput.value,
    deliveryDate: deliveryDateInput.value,
    shipmentMode: shipmentModeInput.value,
    incoterms: incotermsInput.value,
    currency: shipmentCurrency,
    exchangeRates: getExchangeRatesFromForm(shipmentCurrency),
    priority: priorityInput.value,
    shipmentType: shipmentTypeInput.value,
    terms: termsInput.value.trim(),
    items: getItemsData(),
  };
}

function isPhoneValid(value) {
  return /^[0-9+\-()\s]{7,20}$/.test(value.trim());
}

function validateForm(showFeedback = true) {
  const emailValue = emailInput.value.trim();
  const phoneValue = phoneInput.value.trim();
  const rows = Array.from(itemsBody.querySelectorAll("tr"));

  let isValid = form.checkValidity();

  // Email/Phone are optional. Validate format only if user entered a value.
  if (emailValue && !/\S+@\S+\.\S+/.test(emailValue)) {
    emailInput.setCustomValidity("Invalid");
    isValid = false;
  } else {
    emailInput.setCustomValidity("");
  }

  if (phoneValue && !isPhoneValid(phoneValue)) {
    phoneInput.setCustomValidity("Invalid");
    isValid = false;
  } else {
    phoneInput.setCustomValidity("");
  }

  if (rows.length === 0) {
    isValid = false;
    addItemRow();
  }

  rows.forEach((row) => {
    const descInput = row.querySelector(".item-desc");
    const typeInput = row.querySelector(".item-type");
    const unitInput = row.querySelector(".item-unit");
    const currencyInput = row.querySelector(".item-currency");
    const rateInput = row.querySelector(".item-rate");

    if (!descInput.value.trim()) {
      descInput.classList.add("is-invalid");
      isValid = false;
    } else {
      descInput.classList.remove("is-invalid");
    }

    if (!typeInput?.value) {
      typeInput?.classList.add("is-invalid");
      isValid = false;
    } else {
      typeInput?.classList.remove("is-invalid");
    }

    if (!unitInput.value) {
      unitInput.classList.add("is-invalid");
      isValid = false;
    } else {
      unitInput.classList.remove("is-invalid");
    }

    if (!currencyInput.value) {
      currencyInput.classList.add("is-invalid");
      isValid = false;
    } else {
      currencyInput.classList.remove("is-invalid");
    }

    if ((Number(rateInput.value) || 0) < 0) {
      rateInput.classList.add("is-invalid");
      isValid = false;
    } else {
      rateInput.classList.remove("is-invalid");
    }
  });

  if (showFeedback) {
    form.classList.add("was-validated");
  }

  return isValid;
}

function buildPreviewHtml(data) {
  const items = (data.items || []).map((it, idx) => ({
    ...it,
    // Backward-compatible: old saved data had no `type`.
    type: it.type || (idx === 0 ? CHARGE_TYPES.FREIGHT : CHARGE_TYPES.LOCAL),
  }));

  const shipCur = data.currency || "USD";
  const grandTotalValue = computeGrandTotalInShipmentCurrency(items, shipCur, data.exchangeRates || {});
  const grandTotalDisplay = formatAmount(grandTotalValue, shipCur);

  const freightItems = items.filter((it) => it.type === CHARGE_TYPES.FREIGHT);
  const localItems = items.filter((it) => it.type === CHARGE_TYPES.LOCAL);
  const rowCur = (item) => item.currency || data.currency || "USD";

  const freightRows = freightItems.length
    ? freightItems
        .map((item, i) => {
          const sl = i + 1;
          const rc = rowCur(item);
          return `
        <tr>
          <td>${sl}</td>
          <td>${sanitizeHtml(item.desc || "-")}</td>
          <td>${sanitizeHtml(item.unit || "-")}</td>
          <td>${sanitizeHtml(rc)}</td>
          <td class="pdf-right">${formatAmount(item.rate, rc)}</td>
        </tr>
      `;
        })
        .join("")
    : `<tr><td colspan="5" class="text-center text-muted">—</td></tr>`;

  const localRows = localItems.length
    ? localItems
        .map((item, i) => {
          const sl = i + 1;
          const rc = rowCur(item);
          return `
      <tr>
        <td>${sl}</td>
        <td>${sanitizeHtml(item.desc || "-")}</td>
        <td>${sanitizeHtml(item.unit || "-")}</td>
        <td>—</td>
        <td>${sanitizeHtml(rc)}</td>
        <td class="pdf-right">${formatAmount(item.rate, rc)}</td>
      </tr>
    `;
        })
        .join("")
    : `<tr><td colspan="6" class="text-center text-muted">—</td></tr>`;

  const contactLines = [];
  if (data.name) {
    contactLines.push(`<p class="quot-line"><span class="quot-label">Attn :</span> ${sanitizeHtml(data.name)}</p>`);
  }
  if (data.phone) {
    contactLines.push(`<p class="quot-line">PH : ${sanitizeHtml(data.phone)}</p>`);
  }
  if (data.fax) {
    contactLines.push(`<p class="quot-line">Fax : ${sanitizeHtml(data.fax)}</p>`);
  }
  if (data.email) {
    contactLines.push(`<p class="quot-line">E-mail : ${sanitizeHtml(data.email)}</p>`);
  }

  return `
    <div class="pdf-sheet pdf-a4 quotation-preview">
      <div class="quot-top-header">
        <div class="quot-company-top">
          <p class="quot-company-name">${sanitizeHtml(COMPANY_FOOTER_LINES[0] || "")}</p>
          ${COMPANY_FOOTER_LINES.slice(1).map((line) => `<p class="quot-company-line">${sanitizeHtml(line)}</p>`).join("")}
        </div>
        <div class="quot-top-logo">
          <img src="logo.png" alt="Company logo" class="quot-top-logo-img" />
        </div>
      </div>
      <div class="quot-head-row">
        <div class="quot-to-block">
          <p class="quot-to"><span class="quot-label">To :</span> <strong>${sanitizeHtml(data.company || "-")}</strong></p>
          ${contactLines.join("")}
        </div>
        <div class="quot-title-block">QUOTATION</div>
      </div>

      <p class="service-info-line">${sanitizeHtml(serviceInformationLine(data))}</p>

      <h3 class="quot-section-title">Freight Rate</h3>
      <table class="pdf-table quot-table-basic">
        <thead>
          <tr>
            <th class="w-sl">Sl.</th>
            <th>Description</th>
            <th class="w-uom">UOM</th>
            <th class="w-curr">Curr</th>
            <th class="pdf-right w-rate">Rate</th>
          </tr>
        </thead>
        <tbody>${freightRows}</tbody>
      </table>

      <h3 class="quot-section-title">Local Charges</h3>
      <table class="pdf-table quot-table-local">
        <thead>
          <tr>
            <th class="w-sl">Sl.</th>
            <th>Description</th>
            <th class="w-uom">UOM</th>
            <th class="w-rem">Remarks</th>
            <th class="w-curr">Curr</th>
            <th class="pdf-right w-rate">Rate</th>
          </tr>
        </thead>
        <tbody>${localRows}</tbody>
      </table>

      <div class="pdf-total quot-grand">
        <span class="quot-label">Grand Total:</span> <strong>${sanitizeHtml(grandTotalDisplay)}</strong>
        <br />
        <span class="pdf-muted quot-gen">Incoterms: ${sanitizeHtml(data.incoterms)} | Priority: ${sanitizeHtml(data.priority)}</span>
      </div>

      <div class="pdf-terms quot-terms">
        <p class="terms-cap">Terms &amp; Conditions :</p>
        <div class="terms-body">${sanitizeHtml(data.terms || DEFAULT_TERMS).replace(/\n/g, "<br>")}</div>
      </div>

    </div>
  `;
}

function renderPreview() {
  const data = getFormData();
  pdfContent.innerHTML = buildPreviewHtml(data);
  previewSection.classList.remove("d-none");
}

function saveToLocalStorage() {
  const data = getFormData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFromLocalStorage() {
  const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("prestige_form_data_v1");
  if (!raw) {
    return false;
  }

  try {
    const data = JSON.parse(raw);
    formRefEl.textContent = data.ref || createReferenceId();
    nameInput.value = data.name || "";
    companyInput.value = data.company || "";
    emailInput.value = data.email || "";
    phoneInput.value = data.phone || "";
    faxInput.value = data.fax || "";
    requestDateInput.value = data.requestDate || getTodayDate();
    deliveryDateInput.value = data.deliveryDate || "";
    shipmentModeInput.value = data.shipmentMode || "";
    incotermsInput.value = data.incoterms || "";
    currencyInput.value = data.currency || "USD";
    setExchangeRateCurrencyLabels(currencyInput.value || "USD");
    const ex = data.exchangeRates || {};
    if (exRateUsdInput) exRateUsdInput.value = ex.USD ?? 1;
    if (exRateLkrInput) exRateLkrInput.value = ex.LKR ?? 1;
    if (exRateEurInput) exRateEurInput.value = ex.EUR ?? 1;
    priorityInput.value = data.priority || "Normal";
    shipmentTypeInput.value = data.shipmentType || "";
    termsInput.value = data.terms || DEFAULT_TERMS;

    itemsBody.innerHTML = "";
    if (Array.isArray(data.items) && data.items.length) {
      data.items.forEach((item) => addItemRow(item));
    } else {
      addItemRow();
    }

    recalculateTotals();
    return true;
  } catch {
    return false;
  }
}

function resetFormData() {
  form.reset();
  form.classList.remove("was-validated");
  formRefEl.textContent = createReferenceId();
  requestDateInput.value = getTodayDate();
  currencyInput.value = "USD";
  setExchangeRateCurrencyLabels("USD");
  if (exRateUsdInput) exRateUsdInput.value = 1;
  if (exRateLkrInput) exRateLkrInput.value = 1;
  if (exRateEurInput) exRateEurInput.value = 1;
  termsInput.value = DEFAULT_TERMS;
  itemsBody.innerHTML = "";
  addItemRow();
  recalculateTotals();
  previewSection.classList.add("d-none");
  localStorage.removeItem(STORAGE_KEY);
}

async function downloadPdf() {
  if (!validateForm(true)) {
    return;
  }
  if (!window.jspdf || !window.jspdf.jsPDF || !window.jspdf.jsPDF.API || typeof window.jspdf.jsPDF.API.autoTable !== "function") {
    alert("PDF libraries are not loaded. Please refresh and try again.");
    return;
  }

  const data = getFormData();
  const previewHtml = buildPreviewHtml(data);
  pdfContent.innerHTML = previewHtml;
  previewSection.classList.remove("d-none");

  const datePart = getTodayDate();
  const filename = `Form_${datePart}.pdf`;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Charge rows are tagged as either "Freight Rate" or "Local Charges".
  // Backward-compatible with older saved data that had no `type`.
  const items = (data.items || []).map((it, idx) => ({
    ...it,
    type: it.type || (idx === 0 ? CHARGE_TYPES.FREIGHT : CHARGE_TYPES.LOCAL),
  }));
  const freightItems = items.filter((it) => it.type === CHARGE_TYPES.FREIGHT);
  const localItems = items.filter((it) => it.type === CHARGE_TYPES.LOCAL);
  const shipCur = data.currency || "USD";
  const grandTotalValue = computeGrandTotalInShipmentCurrency(items, shipCur, data.exchangeRates || {});
  const grandTotalDisplay = formatAmount(grandTotalValue, shipCur);

  const rowCur = (item) => item.currency || data.currency || "USD";

  async function loadLogo() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Logo could not be loaded"));
      img.src = "logo.png";
    });
  }

  const logoW = 37;
  let logoX = pageWidth - margin - logoW;
  let logoH = 0;
  try {
    const logo = await loadLogo();
    const ratio =
      logo.naturalHeight && logo.naturalWidth
        ? logo.naturalHeight / logo.naturalWidth
        : logo.height && logo.width
          ? logo.height / logo.width
          : 1;
    logoH = logoW * ratio;
    doc.addImage(logo, "PNG", logoX, y, logoW, logoH);
  } catch {
    /* no logo */
  }

  // Company address block on the top-left; logo stays top-right.
  const leftWidth = Math.max(60, logoX - margin - 2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.2);
  doc.setTextColor(19, 58, 102);

  let headerY = y;
  const headerLineHeight = 3.0;
  COMPANY_FOOTER_LINES.forEach((line, idx) => {
    if (idx === 1) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.6);
      doc.setTextColor(51, 65, 85);
    }
    const wrapped = doc.splitTextToSize(line, leftWidth);
    wrapped.forEach((wLine) => {
      doc.text(wLine, margin, headerY);
      headerY += headerLineHeight;
    });
  });

  y = headerY + 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("QUOTATION", pageWidth - margin, y, { align: "right" });
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(0, 0, 0);
  doc.text(`To : ${data.company || "-"}`, margin, y);
  y += 4.5;
  if (data.name) {
    doc.text(`Attn : ${data.name}`, margin, y);
    y += 4.5;
  }
  if (data.phone) {
    doc.text(`PH : ${data.phone}`, margin, y);
    y += 4.5;
  }
  if (data.fax) {
    doc.text(`Fax : ${data.fax}`, margin, y);
    y += 4.5;
  }
  if (data.email) {
    doc.text(`E-mail : ${data.email}`, margin, y);
    y += 4.5;
  }
  y += 2.5;

  const svcLine = serviceInformationLine(data);
  const svcWrapped = doc.splitTextToSize(svcLine, contentWidth);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(svcWrapped, margin, y);
  y += svcWrapped.length * 3.8 + 4;

  y += 3;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Freight Rate", margin, y);
  y += 4;

  const basicBody = freightItems.length
    ? freightItems.map((item, i) => [
        String(i + 1),
        item.desc || "-",
        item.unit || "-",
        rowCur(item),
        formatAmount(item.rate, rowCur(item)),
      ])
    : [["—", "—", "—", "—", "—"]];

  doc.autoTable({
    startY: y,
    head: [["Sl.", "Description", "UOM", "Curr", "Rate"]],
    body: basicBody,
    margin: { left: margin, right: margin },
    tableWidth: contentWidth,
    theme: "grid",
    styles: { font: "helvetica", fontSize: 8, cellPadding: 1.6, overflow: "linebreak", textColor: [0, 0, 0] },
    headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: "bold", fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: 90 },
      2: { cellWidth: 24 },
      3: { cellWidth: 20 },
      4: { cellWidth: 40, halign: "right" },
    },
  });

  y = doc.lastAutoTable.finalY + 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Local Charges", margin, y);
  y += 4;

  const localBody = localItems.length
    ? localItems.map((item, i) => {
        const rc = rowCur(item);
        return [
          String(i + 1),
          item.desc || "-",
          item.unit || "-",
          "—",
          rc,
          formatAmount(item.rate, rc),
        ];
      })
    : [["—", "—", "—", "—", "—", "—"]];

  doc.autoTable({
    startY: y,
    head: [["Sl.", "Item", "UOM", "Remarks", "Curr", "Rate"]],
    body: localBody,
    margin: { left: margin, right: margin },
    tableWidth: contentWidth,
    theme: "grid",
    styles: { font: "helvetica", fontSize: 8, cellPadding: 1.6, overflow: "linebreak", textColor: [0, 0, 0] },
    headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: "bold", fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 80 },
      2: { cellWidth: 20 },
      3: { cellWidth: 36 },
      4: { cellWidth: 16 },
      5: { cellWidth: 24, halign: "right" },
    },
  });

  y = doc.lastAutoTable.finalY + 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Grand Total: ${grandTotalDisplay}`, pageWidth - margin, y, { align: "right" });
  y += 5;
  doc.text(`Incoterms: ${data.incoterms} | Priority: ${data.priority}`, pageWidth - margin, y, { align: "right" });
  y += 8;

  const termsRaw = (data.terms || DEFAULT_TERMS).trim().replace(/\r\n/g, "\n");
  const termsText = termsRaw.toUpperCase();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Terms & Conditions :", margin, y);
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  let termLines = [];
  termsText.split("\n").forEach((para) => {
    const p = para.trim();
    if (!p) {
      return;
    }
    const wrapped = doc.splitTextToSize(p, contentWidth);
    termLines = termLines.concat(wrapped);
  });
  let ty = y;
  const lineHeight = 2.6;
  const maxY = pageHeight - 42;

  termLines.forEach((line) => {
    if (ty + lineHeight > maxY) {
      doc.addPage();
      ty = margin;
    }
    doc.text(line, margin, ty);
    ty += lineHeight;
  });

  ty += 6;
  if (ty + 28 > pageHeight) {
    doc.addPage();
    ty = margin + 4;
  }

  doc.save(filename);
}

function attachEventListeners() {
  addItemBtn.addEventListener("click", () => {
    addItemRow();
    saveToLocalStorage();
  });

  itemsBody.addEventListener("click", (event) => {
    if (!event.target.classList.contains("remove-item")) {
      return;
    }
    const rows = itemsBody.querySelectorAll("tr");
    if (rows.length <= 1) {
      return;
    }
    event.target.closest("tr").remove();
    recalculateTotals();
    saveToLocalStorage();
  });

  form.addEventListener("input", (event) => {
    if (
      ["item-desc", "item-unit", "item-currency", "item-rate"].some((cls) => event.target.classList.contains(cls)) ||
      ["exRateUSD", "exRateLKR", "exRateEUR"].includes(event.target.id)
    ) {
      recalculateTotals();
    }
    saveToLocalStorage();
  });

  form.addEventListener("change", (event) => {
    if (event.target.id === "currency") {
      setExchangeRateCurrencyLabels(currencyInput.value || "USD");
      applyShipmentCurrencyToItems();
      recalculateTotals();
    } else if (event.target.classList.contains("item-currency")) {
      recalculateTotals();
    }
    saveToLocalStorage();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  previewBtn.addEventListener("click", () => {
    if (!validateForm(true)) {
      return;
    }
    renderPreview();
  });

  hidePreviewBtn.addEventListener("click", () => {
    previewSection.classList.add("d-none");
  });

  downloadPdfBtn.addEventListener("click", () => {
    downloadPdf();
  });

  resetBtn.addEventListener("click", () => {
    resetFormData();
  });
}

function init() {
  formRefEl.textContent = createReferenceId();
  const restored = loadFromLocalStorage();
  if (!restored) {
    requestDateInput.value = getTodayDate();
    currencyInput.value = "USD";
    setExchangeRateCurrencyLabels("USD");
    if (exRateUsdInput) exRateUsdInput.value = 1;
    if (exRateLkrInput) exRateLkrInput.value = 1;
    if (exRateEurInput) exRateEurInput.value = 1;
    termsInput.value = DEFAULT_TERMS;
    addItemRow();
  }
  applyShipmentCurrencyToItems();
  recalculateTotals();
  attachEventListeners();
}

init();
