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
const requestDateInput = document.getElementById("requestDate");
const deliveryDateInput = document.getElementById("deliveryDate");
const shipmentModeInput = document.getElementById("shipmentMode");
const incotermsInput = document.getElementById("incoterms");
const currencyInput = document.getElementById("currency");
const shipmentTypeInput = document.getElementById("shipmentType");
const polInput = document.getElementById("pol");
const podInput = document.getElementById("pod");
const viaInput = document.getElementById("via");
const transitTimeInput = document.getElementById("transitTime");
const carrierInput = document.getElementById("carrier");
const destinationFreeTimeInput = document.getElementById("destinationFreeTime");
const remarksInput = document.getElementById("remarks");
const termsInput = document.getElementById("terms");
const exRateUsdInput = document.getElementById("exRateUSD");
const exRateLkrInput = document.getElementById("exRateLKR");
const exRateEurInput = document.getElementById("exRateEUR");
const exToCurrencyEls = Array.from(document.querySelectorAll(".ex-to-currency"));
const UNIT_OPTIONS = ["BL", "M3", "W/M", "KG", "20GP", "40HC", '20"RF', '40"RF', "SHIPMENT"];
const CHARGE_TYPES = {
  FREIGHT: "Freight Rate",
  LOCAL: "Local Charges",
};
const CURRENCY_LOCALES = { USD: "en-US", LKR: "en-LK", EUR: "de-DE" };

// The real logo is loaded from logo-data.js (window.FIXED_LOGO_DATA_URL).
const FIXED_LOGO_DATA_URL = "";

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

function serviceInformationLines(data) {
  const mode = String(data.shipmentMode || "").toUpperCase();
  const st = String(data.shipmentType || "").toUpperCase();
  const dateStr = formatQuotationDate(data.requestDate);
  const validStr = formatQuotationDate(data.deliveryDate);
  const line1 = `SERVICE INFORMATION - ${mode} ${st} Quote No #: ${data.ref}`;
  const line2 = `Date : ${dateStr} Valid Till : ${validStr}`;
  return [line1, line2];
}

async function loadImageAsPngDataUrl(src) {
  return await new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = src;
    } catch {
      resolve(null);
    }
  });
}

async function loadImageAsDataUrlViaFetch(src) {
  try {
    const res = await fetch(src, { cache: "no-cache" });
    if (!res.ok) {
      return null;
    }
    const blob = await res.blob();
    return await new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      } catch {
        resolve(null);
      }
    });
  } catch {
    return null;
  }
}

function resolveFixedLogoDataUrl() {
  try {
    if (typeof document !== "undefined") {
      const domImg = document.querySelector(".app-header img, img.app-logo, img.quot-top-logo-img, img.pdf-logo-img");
      const domSrc = domImg?.getAttribute("src") || "";
      if (domSrc && /^data:image\//i.test(domSrc)) {
        return domSrc;
      }
    }
  } catch {
    /* ignore */
  }
  try {
    const w = typeof window !== "undefined" ? window : undefined;
    const fromWindow = w && typeof w.FIXED_LOGO_DATA_URL === "string" ? w.FIXED_LOGO_DATA_URL : "";
    if (fromWindow && /^data:image\//i.test(fromWindow)) {
      return fromWindow;
    }
  } catch {
    /* ignore */
  }
  return typeof FIXED_LOGO_DATA_URL === "string" ? FIXED_LOGO_DATA_URL : "";
}

function applyFixedLogoToDom(root = document) {
  const logo = resolveFixedLogoDataUrl();
  if (!logo) {
    return;
  }
  const imgs = Array.from(
    root.querySelectorAll(
      '.app-header img, img.app-logo, img.quot-top-logo-img, img.pdf-logo-img, img[src="logo.png"], img[src="./logo.png"], img[src^="data:image/"]',
    ),
  );
  imgs.forEach((img) => {
    img.setAttribute("src", logo);
  });
}

function guessImageFormatFromDataUrl(dataUrl) {
  const m = /^data:([^;]+);base64,/i.exec(String(dataUrl || ""));
  const mime = m?.[1]?.toLowerCase() || "";
  if (mime.includes("png")) return "PNG";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "JPEG";
  if (mime.includes("webp")) return "WEBP";
  return "PNG";
}

function getEmbeddedLogoDataUrl() {
  try {
    if (typeof document !== "undefined") {
      const domImg = document.querySelector(".app-header img, img.app-logo, img.quot-top-logo-img, img.pdf-logo-img");
      const domSrc = domImg?.getAttribute("src") || "";
      if (domSrc && domSrc.startsWith("data:image/")) {
        return domSrc;
      }
    }
  } catch {
    return null;
  }
  try {
    const val = typeof window !== "undefined" ? window.FIXED_LOGO_DATA_URL : null;
    if (typeof val === "string" && val.startsWith("data:image/")) {
      return val;
    }
    return null;
  } catch {
    return null;
  }
}

function applyEmbeddedLogoToDom() {
  const dataUrl = getEmbeddedLogoDataUrl();
  if (!dataUrl || typeof document === "undefined") {
    return;
  }
  const logos = document.querySelectorAll(".app-header img, img.app-logo, img.quot-top-logo-img, img.pdf-logo-img");
  logos.forEach((img) => {
    try {
      img.src = dataUrl;
      img.setAttribute("src", dataUrl);
    } catch {
      /* ignore */
    }
  });
  try {
    applyFixedLogoToDom(document);
  } catch {
    /* ignore */
  }
}

let CACHED_PDF_LOGO_DATA_URL = null;
let CACHED_PDF_LOGO_SOURCE = null;

async function getLogoDataUrlForPdf() {
  const currentSrc = getEmbeddedLogoDataUrl();
  if (CACHED_PDF_LOGO_DATA_URL && CACHED_PDF_LOGO_SOURCE && currentSrc && CACHED_PDF_LOGO_SOURCE === currentSrc) {
    return CACHED_PDF_LOGO_DATA_URL;
  }

  const src = currentSrc;
  if (!src) {
    return null;
  }

  // jsPDF can fail silently with very large PNGs. Normalize + downscale to a safe size.
  const normalized = await new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        try {
          const w = img.naturalWidth || img.width || 0;
          const h = img.naturalHeight || img.height || 0;
          if (!w || !h) {
            resolve(src);
            return;
          }
          const maxW = 900;
          const scale = Math.min(1, maxW / w);
          const outW = Math.max(1, Math.round(w * scale));
          const outH = Math.max(1, Math.round(h * scale));
          const canvas = document.createElement("canvas");
          canvas.width = outW;
          canvas.height = outH;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(src);
            return;
          }
          ctx.clearRect(0, 0, outW, outH);
          ctx.drawImage(img, 0, 0, outW, outH);
          resolve(canvas.toDataURL("image/png"));
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    } catch {
      resolve(src);
    }
  });

  CACHED_PDF_LOGO_DATA_URL = normalized;
  CACHED_PDF_LOGO_SOURCE = src;
  return normalized;
}

function createReferenceId() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PR-${year}-${random}`;
}

function getTodayDate() {
  // Local date (toISOString() is UTC, which is a day behind early in the morning in Sri Lanka).
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function sanitizeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDays(value) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return "";
  }
  // If user typed "7 days" keep it as-is; if it's just a number, append "days".
  if (/[a-z]/i.test(raw)) {
    return raw;
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    return raw;
  }
  return `${raw} days`;
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
  document.querySelectorAll("[data-rate-for]").forEach((wrap) => {
    wrap.hidden = wrap.dataset.rateFor === shipmentCurrency;
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
    const qty = Math.max(0.000001, Number(it.qty) || 1);
    const amount =
      typeof it.amount !== "undefined" && it.amount !== null
        ? Number(it.amount) || 0
        : (Number(it.rate) || 0) * qty;
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

let chargeRowUid = 0;

function typeToKey(type) {
  if (type === CHARGE_TYPES.FREIGHT) return "freight";
  if (type === CHARGE_TYPES.LOCAL) return "local";
  return "none";
}

function addItemRow(item = {}) {
  const row = document.createElement("div");
  row.className = "charge-row";
  const uid = `ch${++chargeRowUid}`;
  const existingRowCount = itemsBody.querySelectorAll(".charge-row").length;
  const defaultType = existingRowCount === 0 ? CHARGE_TYPES.FREIGHT : CHARGE_TYPES.LOCAL;
  const itemType = item.type || defaultType;
  const qty = Number(item.qty ?? item.quantity ?? 1) || 1;
  row.dataset.type = typeToKey(itemType);

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
    <div class="charge-head">
      <div class="field charge-type">
        <select class="control item-type" aria-label="Charge type" required>
          <option value="">Select type</option>
          ${typeOptionsHtml}
        </select>
        <div class="invalid-feedback">Please select a charge type.</div>
      </div>
      <div class="charge-total item-total" aria-live="off">0.00</div>
      <button type="button" class="icon-btn remove-item" aria-label="Remove this charge" title="Remove this charge">
        <svg class="i"><use href="#i-x"/></svg>
      </button>
    </div>
    <div class="charge-grid">
      <div class="field c-desc">
        <label for="${uid}-desc">Description</label>
        <input type="text" id="${uid}-desc" class="control item-desc" placeholder="e.g. Ocean freight, Colombo to Jebel Ali" value="${sanitizeHtml(item.desc || "")}" required />
        <div class="invalid-feedback">Description is required.</div>
      </div>
      <div class="field c-unit">
        <label for="${uid}-unit">Unit</label>
        <select id="${uid}-unit" class="control item-unit" required>
          <option value="">Select</option>
          ${unitOptionsHtml}
        </select>
        <div class="invalid-feedback">Select a unit.</div>
      </div>
      <div class="field c-qty">
        <label for="${uid}-qty">Qty</label>
        <input type="number" id="${uid}-qty" class="control item-qty text-end" min="0" step="any" value="${qty}" inputmode="decimal" required />
        <div class="invalid-feedback">Must be above 0.</div>
      </div>
      <div class="field c-cur">
        <label for="${uid}-cur">Currency</label>
        <select id="${uid}-cur" class="control item-currency" required>
          <option value="">Select</option>
          ${currencyOptionsHtml}
        </select>
        <div class="invalid-feedback">Select a currency.</div>
      </div>
      <div class="field c-price">
        <label for="${uid}-rate">Unit price</label>
        <input type="number" id="${uid}-rate" class="control item-rate text-end" min="0" step="0.01" value="${item.rate ?? 0}" inputmode="decimal" required />
        <div class="invalid-feedback">Can't be negative.</div>
      </div>
      <div class="field c-rem">
        <label for="${uid}-rem">Remarks</label>
        <input type="text" id="${uid}-rem" class="control item-remarks" placeholder="Optional" value="${sanitizeHtml(item.remarks || "")}" />
      </div>
    </div>
  `;
  itemsBody.appendChild(row);
  recalculateTotals();
}

function recalculateTotals() {
  const rows = Array.from(itemsBody.querySelectorAll(".charge-row"));
  const shipmentCurrency = currencyInput?.value || "USD";
  const exchangeRates = getExchangeRatesFromForm(shipmentCurrency);
  const items = [];

  rows.forEach((row) => {
    const rowCurrencyEl = row.querySelector(".item-currency");
    const rateInput = row.querySelector(".item-rate");
    const qtyInput = row.querySelector(".item-qty");
    const totalCell = row.querySelector(".item-total");
    const typeValue = row.querySelector(".item-type")?.value || "";

    const rowCurrency = rowCurrencyEl.value || "USD";
    const rate = Number(rateInput.value) || 0;
    const qtyParsed = Number.parseFloat(String(qtyInput?.value ?? ""));
    const qty = Number.isFinite(qtyParsed) ? qtyParsed : 0;
    const lineTotal = rate * qty;

    row.dataset.type = typeToKey(typeValue);
    totalCell.textContent = formatAmount(lineTotal, rowCurrency);
    const removeBtn = row.querySelector(".remove-item");
    if (removeBtn) removeBtn.disabled = rows.length <= 1;
    items.push({ currency: rowCurrency, amount: lineTotal, type: typeValue });
  });

  const grandTotalValue = computeGrandTotalInShipmentCurrency(items, shipmentCurrency, exchangeRates);
  const grandTotalText = formatAmount(grandTotalValue, shipmentCurrency);
  if (grandTotalEl) {
    grandTotalEl.textContent = grandTotalText;
  }
  updateSummary(items, shipmentCurrency, exchangeRates, grandTotalText);
}

function getItemsData() {
  return Array.from(itemsBody.querySelectorAll(".charge-row")).map((row) => ({
    desc: row.querySelector(".item-desc").value.trim(),
    type: row.querySelector(".item-type")?.value || CHARGE_TYPES.LOCAL,
    unit: row.querySelector(".item-unit").value,
    remarks: row.querySelector(".item-remarks")?.value.trim() || "",
    qty: Math.max(0.000001, Number.parseFloat(String(row.querySelector(".item-qty")?.value ?? "")) || 1),
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
    requestDate: requestDateInput.value,
    deliveryDate: deliveryDateInput.value,
    shipmentMode: shipmentModeInput.value,
    incoterms: incotermsInput.value,
    currency: shipmentCurrency,
    exchangeRates: getExchangeRatesFromForm(shipmentCurrency),
    shipmentType: shipmentTypeInput.value,
    pol: polInput?.value?.trim() || "",
    pod: podInput?.value?.trim() || "",
    via: viaInput?.value?.trim() || "",
    transitTime: transitTimeInput?.value || "",
    carrier: carrierInput?.value?.trim() || "",
    destinationFreeTime: destinationFreeTimeInput?.value?.trim() || "",
    remarks: remarksInput?.value?.trim() || "",
    terms: termsInput.value.trim(),
    items: getItemsData(),
  };
}

function validateForm(showFeedback = true) {
  const rows = Array.from(itemsBody.querySelectorAll(".charge-row"));

  let isValid = form.checkValidity();

  if (rows.length === 0) {
    isValid = false;
    addItemRow();
  }

  rows.forEach((row) => {
    const descInput = row.querySelector(".item-desc");
    const typeInput = row.querySelector(".item-type");
    const unitInput = row.querySelector(".item-unit");
    const qtyInput = row.querySelector(".item-qty");
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

    if ((Number(qtyInput?.value) || 0) <= 0) {
      qtyInput?.classList.add("is-invalid");
      isValid = false;
    } else {
      qtyInput?.classList.remove("is-invalid");
    }
  });

  if (showFeedback) {
    form.classList.add("was-validated");
    if (!isValid) {
      showToast("Some required fields need attention.", true);
      focusFirstInvalid();
    }
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
          const qty = Math.max(0.000001, Number(item.qty) || 1);
          const unitPrice = Number(item.rate) || 0;
          const lineTotal = unitPrice * qty;
          return `
        <tr>
          <td>${sl}</td>
          <td>${sanitizeHtml(item.desc || "-")}</td>
          <td>${sanitizeHtml(item.unit || "-")}</td>
          <td>${sanitizeHtml(item.remarks || "-")}</td>
          <td class="pdf-right">${qty}</td>
          <td>${sanitizeHtml(rc)}</td>
          <td class="pdf-right">${formatAmount(unitPrice, rc)}</td>
          <td class="pdf-right">${formatAmount(lineTotal, rc)}</td>
        </tr>
      `;
        })
        .join("")
    : "";

  const localRows = localItems.length
    ? localItems
        .map((item, i) => {
          const sl = i + 1;
          const rc = rowCur(item);
          const qty = Math.max(0.000001, Number(item.qty) || 1);
          const unitPrice = Number(item.rate) || 0;
          const lineTotal = unitPrice * qty;
          return `
      <tr>
        <td>${sl}</td>
        <td>${sanitizeHtml(item.desc || "-")}</td>
        <td>${sanitizeHtml(item.unit || "-")}</td>
        <td>${sanitizeHtml(item.remarks || "-")}</td>
        <td class="pdf-right">${qty}</td>
        <td>${sanitizeHtml(rc)}</td>
        <td class="pdf-right">${formatAmount(unitPrice, rc)}</td>
        <td class="pdf-right">${formatAmount(lineTotal, rc)}</td>
      </tr>
    `;
        })
        .join("")
    : "";

  const contactLines = [];
  if (data.name) {
    contactLines.push(`<p class="quot-line"><span class="quot-label">Attn :</span> ${sanitizeHtml(data.name)}</p>`);
  }

  const shipmentDetailLines = [
    data.shipmentType ? ["Container Type", data.shipmentType] : null,
    data.incoterms ? ["Incoterms", data.incoterms] : null,
    data.pol ? ["POL", data.pol] : null,
    data.pod ? ["POD", data.pod] : null,
    data.via ? ["VIA", data.via] : null,
    data.transitTime ? ["Transit Time", formatDays(data.transitTime)] : null,
    data.carrier ? ["Carrier", data.carrier] : null,
    data.destinationFreeTime ? ["Destination Free Time", formatDays(data.destinationFreeTime)] : null,
  ].filter(Boolean);

  const shipmentDetailHtml = shipmentDetailLines.length
    ? `
      <div class="quot-ship-details">
        <div class="quot-ship-grid">
          ${shipmentDetailLines
            .map(
              ([label, value]) =>
                `<div class="quot-ship-cell"><span class="quot-ship-label">${sanitizeHtml(label)}:</span> ${sanitizeHtml(value)}</div>`,
            )
            .join("")}
        </div>
      </div>
    `
    : "";

  const [svc1, svc2] = serviceInformationLines(data);
  const logoSrc = getEmbeddedLogoDataUrl() || "logo.png";

  const freightSectionHtml = freightItems.length
    ? `
      <h3 class="quot-section-title">Freight Rate</h3>
      <table class="pdf-table quot-table-basic">
        <thead>
          <tr>
            <th class="w-sl">Sl.</th>
            <th>Description</th>
            <th class="w-uom">UOM</th>
            <th class="w-rem">Remarks</th>
            <th class="pdf-right w-qty">Qty</th>
            <th class="w-curr">Curr</th>
            <th class="pdf-right w-rate">Unit Price</th>
            <th class="pdf-right w-rate">Total</th>
          </tr>
        </thead>
        <tbody>${freightRows}</tbody>
      </table>
    `
    : "";

  const localSectionHtml = localItems.length
    ? `
      <h3 class="quot-section-title">Local Charges</h3>
      <table class="pdf-table quot-table-local">
        <thead>
          <tr>
            <th class="w-sl">Sl.</th>
            <th>Description</th>
            <th class="w-uom">UOM</th>
            <th class="w-rem">Remarks</th>
            <th class="pdf-right w-qty">Qty</th>
            <th class="w-curr">Curr</th>
            <th class="pdf-right w-rate">Unit Price</th>
            <th class="pdf-right w-rate">Total</th>
          </tr>
        </thead>
        <tbody>${localRows}</tbody>
      </table>
    `
    : "";

  return `
    <div class="pdf-sheet pdf-a4 quotation-preview">
      <div class="quot-top-header">
        <div class="quot-company-top">
          <p class="quot-company-name">${sanitizeHtml(COMPANY_FOOTER_LINES[0] || "")}</p>
          ${COMPANY_FOOTER_LINES.slice(1).map((line) => `<p class="quot-company-line">${sanitizeHtml(line)}</p>`).join("")}
        </div>
        <div class="quot-top-logo">
          <img src="${sanitizeHtml(logoSrc)}" alt="Company logo" class="quot-top-logo-img" />
        </div>
      </div>
      <div class="quot-head-row">
        <div class="quot-to-block">
          <p class="quot-to"><span class="quot-label">To :</span> <strong>${sanitizeHtml(data.company || "-")}</strong></p>
          ${contactLines.join("")}
        </div>
        <div class="quot-title-wrap">
          <div class="quot-title-block">QUOTATION</div>
          <div class="quot-subline">Shipment Mode: <strong>${sanitizeHtml(data.shipmentMode || "-")}</strong></div>
        </div>
      </div>

      <p class="service-info-line">${sanitizeHtml(svc1)}<br />${sanitizeHtml(svc2)}</p>
      ${shipmentDetailHtml}

      ${freightSectionHtml}

      ${localSectionHtml}

      <div class="pdf-total quot-grand">
        <span class="quot-label">Grand Total:</span> <strong>${sanitizeHtml(grandTotalDisplay)}</strong>
      </div>

      <div class="quot-remarks">
        <p class="remarks-cap">Remarks :</p>
        <div class="remarks-box">${sanitizeHtml(data.remarks || "").replace(/\n/g, "<br>")}</div>
      </div>

      <div class="pdf-terms quot-terms">
        <p class="terms-cap">Terms &amp; Conditions :</p>
        <div class="terms-body">${sanitizeHtml(data.terms || DEFAULT_TERMS).replace(/\n/g, "<br>")}</div>
      </div>

    </div>
  `;
}

function renderPreview() {
  openPreview();
}

function saveToLocalStorage() {
  try {
    const data = getFormData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    markSaved();
  } catch {
    /* storage can be unavailable (private mode / file://); the form still works */
  }
}

function loadFromLocalStorage() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("prestige_form_data_v1");
  } catch {
    raw = null;
  }
  if (!raw) {
    return false;
  }

  try {
    const data = JSON.parse(raw);
    formRefEl.textContent = data.ref || createReferenceId();
    nameInput.value = data.name || "";
    companyInput.value = data.company || "";
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
    shipmentTypeInput.value = data.shipmentType || "";
    if (polInput) polInput.value = data.pol || "";
    if (podInput) podInput.value = data.pod || "";
    if (viaInput) viaInput.value = data.via || "";
    if (transitTimeInput) transitTimeInput.value = data.transitTime || "";
    if (carrierInput) carrierInput.value = data.carrier || "";
    if (destinationFreeTimeInput) destinationFreeTimeInput.value = data.destinationFreeTime || "";
    if (remarksInput) remarksInput.value = data.remarks || "";
    termsInput.value = data.terms || DEFAULT_TERMS;

    itemsBody.innerHTML = "";
    if (Array.isArray(data.items) && data.items.length) {
      data.items.forEach((item) => addItemRow(item));
    } else {
      addItemRow();
    }

    syncSegments();
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
  if (remarksInput) remarksInput.value = "";
  termsInput.value = DEFAULT_TERMS;
  itemsBody.innerHTML = "";
  addItemRow();
  syncSegments();
  recalculateTotals();
  closePreview();
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  const saveStateEl = document.getElementById("saveState");
  if (saveStateEl) saveStateEl.textContent = "Draft saves automatically";
}

/* ==========================================================================
   Live summary ticket, segmented choices, toast, preview overlay
   ========================================================================== */

const MODE_ICONS = {
  "Air Freight": "i-plane",
  "Sea Freight": "i-ship",
  "Road Freight": "i-truck",
  "Express Courier": "i-box",
};
let lastModeIcon = null;

function setTicketText(el, value, emptyText) {
  if (!el) return;
  const has = String(value ?? "").trim() !== "";
  el.textContent = has ? value : emptyText;
  el.classList.toggle("is-empty", !has);
}

function updateSummary(items, shipCur, rates, totalText) {
  const $ = (id) => document.getElementById(id);
  const company = companyInput.value.trim();
  const attn = nameInput.value.trim();

  // Page title follows the customer
  const pageTitleEl = $("pageTitle");
  if (pageTitleEl) {
    pageTitleEl.textContent = company ? `Quotation for ${company}` : "New quotation";
  }
  document.title = company
    ? `Quotation for ${company} | Prestige International Logistics`
    : "Quotation Desk | Prestige International Logistics";

  setTicketText($("tkCompany"), company, "Add a customer");
  const attnEl = $("tkAttn");
  if (attnEl) attnEl.textContent = attn ? `Attn: ${attn}` : "";

  setTicketText($("tkPol"), polInput.value.trim(), "Origin");
  setTicketText($("tkPod"), podInput.value.trim(), "Destination");

  const noteParts = [];
  if (viaInput.value.trim()) noteParts.push(`Via ${viaInput.value.trim()}`);
  if (transitTimeInput.value.toString().trim()) noteParts.push(`${formatDays(transitTimeInput.value)} transit`);
  const noteEl = $("tkNote");
  if (noteEl) noteEl.textContent = noteParts.join(", ");

  setTicketText($("tkMode"), shipmentModeInput.value, "Not set");
  setTicketText($("tkType"), shipmentTypeInput.value, "Not set");
  setTicketText($("tkInco"), incotermsInput.value, "Not set");
  setTicketText($("tkCarrier"), carrierInput.value.trim(), "Not set");
  setTicketText($("tkFree"), destinationFreeTimeInput.value.toString().trim() ? formatDays(destinationFreeTimeInput.value) : "", "Not set");
  setTicketText($("tkValid"), deliveryDateInput.value ? formatQuotationDate(deliveryDateInput.value) : "", "Not set");

  // Route marker follows the shipment mode
  const iconId = MODE_ICONS[shipmentModeInput.value] || "i-box";
  if (iconId !== lastModeIcon) {
    const useEl = $("tkModeIcon");
    if (useEl) useEl.setAttribute("href", `#${iconId}`);
    const veh = $("tkVeh");
    if (veh && lastModeIcon !== null) {
      veh.classList.remove("pop");
      void veh.offsetWidth;
      veh.classList.add("pop");
    }
    lastModeIcon = iconId;
  }

  // Totals
  const subtotal = (type) =>
    formatAmount(computeGrandTotalInShipmentCurrency(items.filter((it) => it.type === type), shipCur, rates), shipCur);
  const totalEl = $("tkTotal");
  if (totalEl) {
    totalEl.textContent = totalText;
    totalEl.classList.toggle("is-long", totalText.length > 13);
  }
  const mb = $("mbTotal");
  if (mb) mb.textContent = totalText;
  const freightEl = $("tkFreight");
  if (freightEl) freightEl.textContent = subtotal(CHARGE_TYPES.FREIGHT);
  const localEl = $("tkLocal");
  if (localEl) localEl.textContent = subtotal(CHARGE_TYPES.LOCAL);

  // Warn when a foreign-currency line is still using the default 1:1 rate
  const suspect = [];
  items.forEach((it) => {
    if (it.currency && it.currency !== shipCur && it.amount > 0) {
      const r = Number(rates[it.currency]) || 0;
      if ((r <= 0 || r === 1) && !suspect.includes(it.currency)) suspect.push(it.currency);
    }
  });
  const warn = $("fxWarn");
  if (warn) {
    warn.classList.toggle("d-none", suspect.length === 0);
    const span = warn.querySelector("span");
    if (span && suspect.length) {
      span.textContent = `Set the ${suspect.join(" and ")} exchange rate so the total converts into ${shipCur} correctly.`;
    }
  }
}

function syncSegments() {
  document.querySelectorAll(".seg").forEach((seg) => {
    const select = document.getElementById(seg.dataset.for);
    const value = select ? select.value : "";
    const buttons = Array.from(seg.querySelectorAll("button[data-value]"));
    const anyOn = buttons.some((b) => b.dataset.value === value);
    buttons.forEach((btn, index) => {
      const on = btn.dataset.value === value;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-checked", on ? "true" : "false");
      btn.tabIndex = on || (!anyOn && index === 0) ? 0 : -1;
    });
  });
}

function chooseSegment(seg, value) {
  const select = document.getElementById(seg.dataset.for);
  if (!select) return;
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  syncSegments();
}

function attachSegmentListeners() {
  document.querySelectorAll(".seg").forEach((seg) => {
    seg.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-value]");
      if (btn) chooseSegment(seg, btn.dataset.value);
    });
    seg.addEventListener("keydown", (event) => {
      const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
      if (!keys.includes(event.key)) return;
      const buttons = Array.from(seg.querySelectorAll("button[data-value]"));
      const current = buttons.findIndex((b) => b === document.activeElement);
      if (current < 0) return;
      event.preventDefault();
      const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      const next = buttons[(current + step + buttons.length) % buttons.length];
      chooseSegment(seg, next.dataset.value);
      next.focus();
    });
  });
}

let toastTimer = null;
function showToast(message, isError = false) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("is-error", Boolean(isError));
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
}

function markSaved() {
  const el = document.getElementById("saveState");
  if (!el) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  el.textContent = `Draft saved at ${hh}:${mm}`;
}

function focusFirstInvalid() {
  const el = form.querySelector(".is-invalid, .control:invalid, select.visually-hidden:invalid");
  if (!el) return;
  let target = el;
  if (el.classList.contains("visually-hidden")) {
    target = el.parentElement.querySelector(".seg button") || el;
  }
  target.scrollIntoView({ block: "center", behavior: "smooth" });
  target.focus({ preventScroll: true });
}

function addDaysIso(iso, days) {
  const [y, m, d] = (iso || getTodayDate()).split("-").map(Number);
  const dt = new Date(y, m - 1, d + days);
  const pad = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

let previewReturnFocus = null;

function fitPreviewToScreen() {
  const sheetPx = 794;
  const available = window.innerWidth - 28;
  pdfContent.style.zoom = available < sheetPx ? String(Math.max(0.3, available / sheetPx)) : "";
}

function openPreview() {
  previewReturnFocus = document.activeElement;
  pdfContent.innerHTML = buildPreviewHtml(getFormData());
  applyFixedLogoToDom(pdfContent);
  fitPreviewToScreen();
  previewSection.classList.remove("d-none");
  document.body.classList.add("modal-open");
  previewSection.scrollTop = 0;
  hidePreviewBtn.focus({ preventScroll: true });
}

function closePreview() {
  if (previewSection.classList.contains("d-none")) return;
  previewSection.classList.add("d-none");
  document.body.classList.remove("modal-open");
  if (previewReturnFocus && typeof previewReturnFocus.focus === "function") {
    previewReturnFocus.focus({ preventScroll: true });
  }
}

/* ==========================================================================
   PDF (jsPDF + AutoTable)
   ========================================================================== */

const PDF_COLORS = {
  blue: [50, 84, 161],
  navy: [12, 27, 63],
  ink: [20, 33, 61],
  muted: [93, 104, 121],
  line: [221, 227, 236],
  tint: [238, 242, 250],
  zebra: [247, 249, 252],
  onNavy: [185, 197, 226],
};

async function downloadPdfViaJsPdf(data, filename) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    throw new Error("jsPDF is not loaded. Please refresh and try again.");
  }
  if (!window.jspdf.jsPDF.API || typeof window.jspdf.jsPDF.API.autoTable !== "function") {
    throw new Error("jsPDF AutoTable is not loaded. Please refresh and try again.");
  }

  const { jsPDF } = window.jspdf;
  const C = PDF_COLORS;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  doc.setProperties({
    title: `Quotation ${data.ref || ""}`.trim(),
    author: "Prestige International Logistics (Pvt) Ltd",
    subject: `Quotation for ${data.company || ""}`.trim(),
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const footerReserve = 17;
  const bottomLimit = pageHeight - footerReserve;
  let y = margin;

  const ensureSpace = (needed) => {
    if (y + needed > bottomLimit) {
      doc.addPage();
      y = margin;
    }
  };

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

  // ---- Header: company block (left), logo (right), brand rule ----
  let logoBottom = y;
  let logoLeftEdge = pageWidth - margin;
  try {
    const logoDataUrl =
      (await getLogoDataUrlForPdf()) || (await loadImageAsDataUrlViaFetch("logo.png")) || (await loadImageAsPngDataUrl("logo.png"));
    if (logoDataUrl) {
      const probe = new Image();
      const ratio = await new Promise((resolve) => {
        probe.onload = () => resolve(probe.naturalHeight && probe.naturalWidth ? probe.naturalHeight / probe.naturalWidth : 1);
        probe.onerror = () => resolve(1);
        probe.src = logoDataUrl;
      });
      const fmt = guessImageFormatFromDataUrl(logoDataUrl);
      let w = 50;
      let h = w * ratio;
      const maxH = 17;
      if (h > maxH) {
        h = maxH;
        w = h / ratio;
      }
      const x = pageWidth - margin - w;
      doc.addImage(logoDataUrl, fmt, x, y, w, h);
      logoBottom = y + h;
      logoLeftEdge = x;
    }
  } catch {
    /* logo is optional */
  }

  const leftWidth = Math.max(60, logoLeftEdge - margin - 6);
  let headerY = y + 3.2;
  COMPANY_FOOTER_LINES.forEach((line, idx) => {
    if (idx === 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12.5);
      doc.setTextColor(...C.blue);
    } else if (idx === 1) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.4);
      doc.setTextColor(...C.muted);
    }
    doc.splitTextToSize(line, leftWidth).forEach((wrapped) => {
      doc.text(wrapped, margin, headerY);
      headerY += idx === 0 ? 4.4 : 3.5;
    });
  });

  y = Math.max(headerY, logoBottom) + 1;
  doc.setDrawColor(...C.blue);
  doc.setLineWidth(0.7);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // ---- To / Attn (left) and title (right) ----
  const blockTop = y;
  let ly = blockTop;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...C.muted);
  ly += 3;
  doc.text("To", margin, ly);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(...C.ink);
  doc.splitTextToSize(data.company || "-", contentWidth * 0.58).forEach((line) => {
    ly += 5;
    doc.text(line, margin, ly);
  });
  if (data.name) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...C.muted);
    ly += 5;
    doc.text(`Attn: ${data.name}`, margin, ly);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...C.blue);
  doc.text("QUOTATION", pageWidth - margin, blockTop + 7, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...C.ink);
  doc.text(`Shipment mode: ${data.shipmentMode || "-"}`, pageWidth - margin, blockTop + 13, { align: "right" });
  y = Math.max(ly, blockTop + 14) + 5;

  // ---- Service information band ----
  const svcWrapped = [];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.6);
  serviceInformationLines(data).forEach((line) => svcWrapped.push(...doc.splitTextToSize(line, contentWidth - 6)));
  const bandH = svcWrapped.length * 4.6 + 3.6;
  ensureSpace(bandH + 6);
  doc.setFillColor(...C.tint);
  doc.roundedRect(margin, y, contentWidth, bandH, 1.5, 1.5, "F");
  doc.setTextColor(...C.ink);
  svcWrapped.forEach((line, i) => doc.text(line, margin + 3, y + 5.2 + i * 4.6));
  y += bandH + 4;

  // ---- Shipment details (optional) ----
  const shipmentPairs = [
    data.shipmentType ? ["Container Type", data.shipmentType] : null,
    data.incoterms ? ["Incoterms", data.incoterms] : null,
    data.pol ? ["POL", data.pol] : null,
    data.pod ? ["POD", data.pod] : null,
    data.via ? ["VIA", data.via] : null,
    data.transitTime ? ["Transit Time", formatDays(data.transitTime)] : null,
    data.carrier ? ["Carrier", data.carrier] : null,
    data.destinationFreeTime ? ["Destination Free Time", formatDays(data.destinationFreeTime)] : null,
  ].filter(Boolean);

  if (shipmentPairs.length) {
    const colGap = 6;
    const colW = (contentWidth - colGap) / 2;
    const lineH = 4;
    const padX = 3;
    const padY = 2.8;
    doc.setFontSize(8.8);

    const cells = shipmentPairs.map(([label, value]) => {
      doc.setFont("helvetica", "bold");
      const labelW = doc.getTextWidth(`${label}: `);
      doc.setFont("helvetica", "normal");
      const valueLines = doc.splitTextToSize(String(value), Math.max(20, colW - padX * 2 - labelW)).slice(0, 2);
      return { label, labelW, valueLines };
    });
    const rowCount = Math.ceil(cells.length / 2);
    const rowHeights = Array.from({ length: rowCount }, (_, r) =>
      Math.max(lineH, ...[cells[r * 2], cells[r * 2 + 1]].filter(Boolean).map((c) => c.valueLines.length * lineH)),
    );
    const boxH = rowHeights.reduce((a, b) => a + b, 0) + padY * 2;
    ensureSpace(boxH + 6);
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.25);
    doc.roundedRect(margin, y, contentWidth, boxH, 1.5, 1.5, "S");

    let rowTop = y + padY;
    for (let r = 0; r < rowCount; r += 1) {
      [cells[r * 2], cells[r * 2 + 1]].forEach((cell, side) => {
        if (!cell) return;
        const x = margin + padX + side * (colW + colGap);
        const baseY = rowTop + 3;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...C.ink);
        doc.text(`${cell.label}:`, x, baseY);
        doc.setFont("helvetica", "normal");
        cell.valueLines.forEach((line, li) => doc.text(line, x + cell.labelW, baseY + li * lineH));
      });
      rowTop += rowHeights[r];
    }
    y += boxH + 5;
  } else {
    y += 1;
  }

  // ---- Charge tables ----
  const drawChargeTable = (title, list) => {
    if (!list.length) return;
    ensureSpace(26);
    doc.setFillColor(...C.blue);
    doc.rect(margin, y - 0.2, 1.3, 4.6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...C.blue);
    doc.text(title, margin + 3.4, y + 3.4);
    y += 6.8;

    const body = list.map((item, i) => {
      const rc = rowCur(item);
      const qty = Math.max(0.000001, Number(item.qty) || 1);
      const unitPrice = Number(item.rate) || 0;
      return [String(i + 1), item.desc || "-", item.unit || "-", item.remarks || "-", String(qty), rc, formatAmount(unitPrice, rc), formatAmount(unitPrice * qty, rc)];
    });
    const alignByColumn = { 0: "center", 2: "center", 4: "right", 5: "center", 6: "right", 7: "right" };

    doc.autoTable({
      startY: y,
      tableWidth: contentWidth,
      theme: "grid",
      head: [["Sl.", "Description", "UOM", "Remarks", "Qty", "Curr", "Unit Price", "Total"]],
      body,
      styles: {
        font: "helvetica",
        fontSize: 8.2,
        cellPadding: 1.8,
        valign: "middle",
        lineWidth: 0.15,
        lineColor: C.line,
        textColor: C.ink,
        overflow: "linebreak",
      },
      headStyles: { fillColor: C.blue, textColor: [255, 255, 255], fontStyle: "bold", lineColor: C.blue },
      alternateRowStyles: { fillColor: C.zebra },
      margin: { left: margin, right: margin, bottom: footerReserve },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        2: { cellWidth: 16, halign: "center" },
        3: { cellWidth: 28 },
        4: { cellWidth: 14, halign: "right" },
        5: { cellWidth: 14, halign: "center" },
        6: { cellWidth: 24, halign: "right" },
        7: { cellWidth: 26, halign: "right", fontStyle: "bold" },
      },
      didParseCell: (hook) => {
        if (hook.section === "head") {
          hook.cell.styles.halign = alignByColumn[hook.column.index] || "left";
        }
      },
    });
    y = doc.lastAutoTable.finalY + 7;
  };
  drawChargeTable("Freight Rate", freightItems);
  drawChargeTable("Local Charges", localItems);

  // ---- Grand total ----
  ensureSpace(20);
  const gtW = 86;
  const gtH = 11.5;
  const gtX = pageWidth - margin - gtW;
  doc.setFillColor(...C.navy);
  doc.roundedRect(gtX, y, gtW, gtH, 1.8, 1.8, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.6);
  doc.setTextColor(...C.onNavy);
  doc.text("Grand total", gtX + 4, y + 7.2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(255, 255, 255);
  doc.text(grandTotalDisplay, gtX + gtW - 4, y + 7.5, { align: "right" });
  y += gtH + 9;

  // ---- Remarks (can continue onto further pages) ----
  const remarksRaw = String(data.remarks || "").trim().replace(/\r\n/g, "\n");
  ensureSpace(28);
  const remarksCaption = (text) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...C.blue);
    doc.text(text, margin, y);
    y += 3.8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(...C.ink);
  };
  remarksCaption("Remarks");
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.25);
  const remLinesAll = remarksRaw ? doc.splitTextToSize(remarksRaw, contentWidth - 6) : [];
  const remLineH = 3.5;

  let startIdx = 0;
  while (startIdx < remLinesAll.length || startIdx === 0) {
    if (bottomLimit - y < 14) {
      doc.addPage();
      y = margin;
      remarksCaption("Remarks (continued)");
    }
    const remaining = remLinesAll.slice(startIdx);
    const desiredH = Math.max(18, remaining.length * remLineH + 5);
    const boxH = Math.min(desiredH, bottomLimit - y);
    doc.roundedRect(margin, y, contentWidth, boxH, 1.5, 1.5, "S");
    const maxLinesThisBox = Math.max(0, Math.floor((boxH - 5) / remLineH));
    const linesThisBox = remaining.slice(0, maxLinesThisBox);
    let ry = y + 4.8;
    linesThisBox.forEach((line) => {
      doc.text(line, margin + 3, ry);
      ry += remLineH;
    });
    startIdx += linesThisBox.length;
    y += boxH + 8;
    if (linesThisBox.length === 0) break;
  }

  // ---- Terms ----
  const termsText = (data.terms || DEFAULT_TERMS).trim().replace(/\r\n/g, "\n").toUpperCase();
  ensureSpace(18);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.blue);
  doc.text("Terms & Conditions", margin, y);
  y += 4.4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(55, 65, 81);
  const termLineH = 2.7;
  termsText.split("\n").forEach((para) => {
    const p = para.trim();
    if (!p) return;
    doc.splitTextToSize(p, contentWidth).forEach((line) => {
      if (y + termLineH > bottomLimit) {
        doc.addPage();
        y = margin;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.8);
        doc.setTextColor(55, 65, 81);
      }
      doc.text(line, margin, y);
      y += termLineH;
    });
  });

  // ---- Footer on every page ----
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p += 1) {
    doc.setPage(p);
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.25);
    doc.line(margin, pageHeight - 11.5, pageWidth - margin, pageHeight - 11.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...C.muted);
    doc.text("Prestige International Logistics (Pvt) Ltd   |   www.pilcmb.com", margin, pageHeight - 7.5);
    doc.text(`Quote ${data.ref || ""}   |   Page ${p} of ${pageCount}`, pageWidth - margin, pageHeight - 7.5, { align: "right" });
  }

  doc.save(filename);
}

async function downloadPdf() {
  if (!validateForm(true)) {
    return;
  }
  const data = getFormData();
  const safeRef = String(data.ref || "").replace(/[^\w-]+/g, "");
  const filename = `Quotation_${safeRef || getTodayDate()}.pdf`;
  try {
    await downloadPdfViaJsPdf(data, filename);
    showToast("PDF downloaded");
  } catch (err) {
    console.error(err);
    const detail = err && err.message ? ` ${err.message}` : "";
    showToast(`Couldn't create the PDF.${detail}`, true);
  }
}

/* ==========================================================================
   Wiring
   ========================================================================== */

function attachEventListeners() {
  addItemBtn.addEventListener("click", () => {
    addItemRow();
    saveToLocalStorage();
    const last = itemsBody.lastElementChild;
    const desc = last && last.querySelector(".item-desc");
    if (desc) {
      last.scrollIntoView({ block: "nearest", behavior: "smooth" });
      desc.focus({ preventScroll: true });
    }
  });

  itemsBody.addEventListener("click", (event) => {
    const removeBtn = event.target.closest(".remove-item");
    if (!removeBtn) {
      return;
    }
    const rows = itemsBody.querySelectorAll(".charge-row");
    if (rows.length <= 1) {
      return;
    }
    removeBtn.closest(".charge-row").remove();
    recalculateTotals();
    saveToLocalStorage();
  });

  form.addEventListener("input", () => {
    recalculateTotals();
    saveToLocalStorage();
  });

  form.addEventListener("change", (event) => {
    if (event.target.id === "currency") {
      setExchangeRateCurrencyLabels(currencyInput.value || "USD");
      applyShipmentCurrencyToItems();
    }
    recalculateTotals();
    saveToLocalStorage();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  document.querySelectorAll("[data-valid-days]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const days = Number(chip.dataset.validDays) || 0;
      deliveryDateInput.value = addDaysIso(requestDateInput.value, days);
      deliveryDateInput.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });

  document.getElementById("resetTermsBtn")?.addEventListener("click", () => {
    termsInput.value = DEFAULT_TERMS;
    saveToLocalStorage();
    showToast("Standard terms restored");
  });

  document.querySelectorAll('[data-action="preview"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!validateForm(true)) {
        return;
      }
      openPreview();
    });
  });

  document.querySelectorAll('[data-action="download"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      await downloadPdf();
    });
  });

  hidePreviewBtn.addEventListener("click", closePreview);
  previewSection.addEventListener("click", (event) => {
    if (event.target === previewSection) closePreview();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePreview();
  });
  window.addEventListener("resize", () => {
    if (!previewSection.classList.contains("d-none")) fitPreviewToScreen();
  });

  resetBtn.addEventListener("click", () => {
    if (window.confirm("Clear this quotation and start again?")) {
      resetFormData();
      showToast("Form cleared");
    }
  });

  attachSegmentListeners();
}

function init() {
  formRefEl.textContent = createReferenceId();
  applyEmbeddedLogoToDom();
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
    applyShipmentCurrencyToItems();
  }
  syncSegments();
  recalculateTotals();
  attachEventListeners();
}

init();
