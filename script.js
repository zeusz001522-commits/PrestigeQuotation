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
const UNIT_OPTIONS = ["BL", "M3", "W/M", "KG", "20HC", "40HC", '20"RF', '40"RF', "SHIPMENT"];
const CHARGE_TYPES = {
  FREIGHT: "Freight Rate",
  LOCAL: "Local Charges",
};
const CURRENCY_LOCALES = { USD: "en-US", LKR: "en-LK", EUR: "de-DE" };

const FIXED_LOGO_DATA_URL =
  "data:image/png;base64,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";

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
      img.crossOrigin = "anonymous";
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

function addItemRow(item = {}) {
  const row = document.createElement("tr");
  const existingRowCount = itemsBody.querySelectorAll("tr").length;
  const defaultType = existingRowCount === 0 ? CHARGE_TYPES.FREIGHT : CHARGE_TYPES.LOCAL;
  const itemType = item.type || defaultType;
  const qty = Number(item.qty ?? item.quantity ?? 1) || 1;

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
      <input type="number" class="form-control item-qty text-end" min="0" step="any" value="${qty}" required />
      <div class="invalid-feedback">Qty must be greater than 0.</div>
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
    const qtyInput = row.querySelector(".item-qty");
    const totalCell = row.querySelector(".item-total");
    const indexCell = row.querySelector(".row-index");

    const rowCurrency = currencyInput.value || "USD";
    const rate = Number(rateInput.value) || 0;
    const qtyRaw = String(qtyInput?.value ?? "");
    const qtyParsed = Number.parseFloat(qtyRaw);
    const qty = Number.isFinite(qtyParsed) ? qtyParsed : 0;
    const lineTotal = rate * qty;

    indexCell.textContent = String(index + 1);
    totalCell.textContent = formatAmount(lineTotal, rowCurrency);
    items.push({ currency: rowCurrency, amount: lineTotal });
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
  const rows = Array.from(itemsBody.querySelectorAll("tr"));

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
        <td>—</td>
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
  const data = getFormData();
  pdfContent.innerHTML = buildPreviewHtml(data);
  applyFixedLogoToDom(pdfContent);
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
  recalculateTotals();
  previewSection.classList.add("d-none");
  localStorage.removeItem(STORAGE_KEY);
}

async function downloadPdfViaJsPdf(data, filename) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("jsPDF is not loaded. Please refresh and try again.");
    return;
  }
  if (!window.jspdf.jsPDF.API || typeof window.jspdf.jsPDF.API.autoTable !== "function") {
    alert("jsPDF AutoTable is not loaded. Please refresh and try again.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

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

  // Header: company block
  const logoW = 37;
  const logoX = pageWidth - margin - logoW;
  try {
    const logoDataUrl = (await getLogoDataUrlForPdf()) || (await loadImageAsDataUrlViaFetch("logo.png")) || (await loadImageAsPngDataUrl("logo.png"));
    if (logoDataUrl) {
      const probe = new Image();
      const ratio = await new Promise((resolve) => {
        probe.onload = () => {
          const r = probe.naturalHeight && probe.naturalWidth ? probe.naturalHeight / probe.naturalWidth : 1;
          resolve(r || 1);
        };
        probe.onerror = () => resolve(1);
        probe.src = logoDataUrl;
      });
      const fmt = guessImageFormatFromDataUrl(logoDataUrl);
      const logoHMax = 18;
      const rawH = logoW * ratio;
      const logoH = Math.min(rawH, logoHMax);
      const logoWAdj = ratio > 0 ? logoH / ratio : logoW;
      const logoXAdj = pageWidth - margin - logoWAdj;
      doc.addImage(logoDataUrl, fmt, logoXAdj, y, logoWAdj, logoH);
    }
  } catch {
    /* ignore */
  }

  const leftWidth = Math.max(60, logoX - margin - 2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(19, 58, 102);
  let headerY = y;
  const headerLineHeight = 3.2;
  COMPANY_FOOTER_LINES.forEach((line, idx) => {
    if (idx === 1) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.4);
      doc.setTextColor(51, 65, 85);
    }
    const wrapped = doc.splitTextToSize(line, leftWidth);
    wrapped.forEach((wLine) => {
      doc.text(wLine, margin, headerY);
      headerY += idx === 0 ? 3.6 : headerLineHeight;
    });
  });
  y = headerY + 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("QUOTATION", pageWidth - margin, y, { align: "right" });
  y += 5.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.8);
  doc.text(`Shipment Mode: ${data.shipmentMode || "-"}`, pageWidth - margin, y, { align: "right" });
  y += 5.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text(`To : ${data.company || "-"}`, margin, y);
  y += 4.5;
  if (data.name) {
    doc.text(`Attn : ${data.name}`, margin, y);
    y += 4.5;
  }
  y += 2.5;

  const svcLines = serviceInformationLines(data);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.6);
  doc.text(svcLines, margin, y);
  y += svcLines.length * 4.0 + 3.5;

  // Shipment details (optional)
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
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    const colGap = 6;
    const colW = (contentWidth - colGap) / 2;
    const detailLineHeight = 3.8;
    const padY = 2.6;
    const padX = 2.0;
    const rows = Math.ceil(shipmentPairs.length / 2);
    const rowHeights = Array.from({ length: rows }, () => detailLineHeight);

    const cellLines = shipmentPairs.map(([label, value], idx) => {
      const text = `${label}: ${value}`;
      const wrapped = doc.splitTextToSize(text, colW - padX * 2);
      const lines = wrapped.slice(0, 2);
      const row = Math.floor(idx / 2);
      rowHeights[row] = Math.max(rowHeights[row], lines.length * detailLineHeight);
      return lines;
    });

    const boxH = rowHeights.reduce((a, b) => a + b, 0) + padY * 2;
    doc.setDrawColor(219, 226, 234);
    doc.setFillColor(249, 251, 255);
    doc.rect(margin, y, contentWidth, boxH, "FD");

    let rowTopY = y + padY;
    for (let r = 0; r < rows; r += 1) {
      const leftIdx = r * 2;
      const rightIdx = leftIdx + 1;
      const baseY = rowTopY + detailLineHeight;
      const leftX = margin;
      const rightX = margin + colW + colGap;

      (cellLines[leftIdx] || []).forEach((line, li) => {
        doc.text(line, leftX + padX, baseY + li * detailLineHeight);
      });
      (cellLines[rightIdx] || []).forEach((line, li) => {
        doc.text(line, rightX + padX, baseY + li * detailLineHeight);
      });
      rowTopY += rowHeights[r];
    }

    y = y + boxH + 4.5;
  } else {
    y += 2;
  }

  // Freight table
  if (freightItems.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Freight Rate", margin, y);
    y += 4;

    const freightBody = freightItems.map((item, i) => {
      const rc = rowCur(item);
      const qty = Math.max(0.000001, Number(item.qty) || 1);
      const unitPrice = Number(item.rate) || 0;
      const lineTotal = unitPrice * qty;
      return [String(i + 1), item.desc || "-", item.unit || "-", String(qty), rc, formatAmount(unitPrice, rc), formatAmount(lineTotal, rc)];
    });

    doc.autoTable({
      startY: y,
      tableWidth: contentWidth,
      theme: "grid",
      head: [["Sl.", "Description", "UOM", "Qty", "Curr", "Unit Price", "Total"]],
      body: freightBody,
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 1.6,
        valign: "middle",
        lineWidth: 0.15,
        lineColor: [219, 226, 234],
        textColor: [31, 42, 55],
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [245, 248, 252],
        textColor: [51, 65, 85],
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
      },
      alternateRowStyles: { fillColor: [250, 252, 255] },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        2: { cellWidth: 16, halign: "center" },
        3: { cellWidth: 14, halign: "right" },
        4: { cellWidth: 14, halign: "center" },
        5: { cellWidth: 24, halign: "right" },
        6: { cellWidth: 28, halign: "right" },
      },
    });

    y = doc.lastAutoTable.finalY + 6;
  }

  // Local charges table
  if (localItems.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Local Charges", margin, y);
    y += 4;

    const localBody = localItems.map((item, i) => {
      const rc = rowCur(item);
      const qty = Math.max(0.000001, Number(item.qty) || 1);
      const unitPrice = Number(item.rate) || 0;
      const lineTotal = unitPrice * qty;
      return [String(i + 1), item.desc || "-", item.unit || "-", "—", String(qty), rc, formatAmount(unitPrice, rc), formatAmount(lineTotal, rc)];
    });

    doc.autoTable({
      startY: y,
      tableWidth: contentWidth,
      theme: "grid",
      head: [["Sl.", "Item", "UOM", "Remarks", "Qty", "Curr", "Unit Price", "Total"]],
      body: localBody,
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 1.6,
        valign: "middle",
        lineWidth: 0.15,
        lineColor: [219, 226, 234],
        textColor: [31, 42, 55],
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [245, 248, 252],
        textColor: [51, 65, 85],
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
      },
      alternateRowStyles: { fillColor: [250, 252, 255] },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        2: { cellWidth: 14, halign: "center" },
        4: { cellWidth: 14, halign: "right" },
        5: { cellWidth: 14, halign: "center" },
        6: { cellWidth: 24, halign: "right" },
        7: { cellWidth: 28, halign: "right" },
      },
    });

    y = doc.lastAutoTable.finalY + 6;
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Grand Total: ${grandTotalDisplay}`, pageWidth - margin, y, { align: "right" });
  y += 7;

  // Remarks box
  const remarksRaw = String(data.remarks || "").trim().replace(/\r\n/g, "\n");
  doc.setDrawColor(180);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Remarks :", margin, y);
  y += 3.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  const remLinesAll = remarksRaw ? doc.splitTextToSize(remarksRaw, contentWidth - 4) : [];
  const remLineH = 3.2;

  let startIdx = 0;
  while (startIdx < remLinesAll.length || startIdx === 0) {
    const availableH = pageHeight - y - 18;
    if (availableH < 12) {
      doc.addPage();
      y = margin;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("Remarks (cont.) :", margin, y);
      y += 3.2;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.8);
    }

    const remaining = remLinesAll.slice(startIdx);
    const desiredH = Math.max(18, remaining.length * remLineH + 4);
    const boxH = Math.min(desiredH, pageHeight - y - 18);

    doc.rect(margin, y, contentWidth, boxH);
    const maxLinesThisBox = Math.max(0, Math.floor((boxH - 4) / remLineH));
    const linesThisBox = remaining.slice(0, maxLinesThisBox);

    let ry = y + 4;
    linesThisBox.forEach((line) => {
      doc.text(line, margin + 2, ry);
      ry += remLineH;
    });

    startIdx += linesThisBox.length;
    y += boxH + 7;

    if (linesThisBox.length === 0) {
      break;
    }
  }

  // Terms
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
    if (!p) return;
    termLines = termLines.concat(doc.splitTextToSize(p, contentWidth));
  });
  const lineHeight = 2.6;
  let ty = y;
  const maxY = pageHeight - 12;
  termLines.forEach((line) => {
    if (ty + lineHeight > maxY) {
      doc.addPage();
      ty = margin;
    }
    doc.text(line, margin, ty);
    ty += lineHeight;
  });

  doc.save(filename);
}

async function downloadPdf() {
  try {
    if (!validateForm(true)) {
      return;
    }
    const data = getFormData();
    pdfContent.innerHTML = buildPreviewHtml(data);
    applyEmbeddedLogoToDom();
    previewSection.classList.remove("d-none");

    // Export must capture a *visible* node. We'll clone the rendered sheet into an off-screen
    // host to avoid html2canvas picking up display:none / zero-size containers.
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const datePart = getTodayDate();
    const filename = `Form_${datePart}.pdf`;

    // Use jsPDF in all browsers for consistent output.
    await downloadPdfViaJsPdf(data, filename);
    return;
  } catch (err) {
    const msg = err && typeof err === "object" && "message" in err ? String(err.message) : String(err);
    alert(
      `PDF download failed.\n\n${msg}\n\nWe will now try compatibility mode (jsPDF). If you opened index.html directly (file://), using a local server (http://localhost) is still recommended.`,
    );
    try {
      const data = getFormData();
      const datePart = getTodayDate();
      const filename = `Form_${datePart}.pdf`;
      await downloadPdfViaJsPdf(data, filename);
      return;
    } catch {
      /* ignore */
    }
    throw err;
  }
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
      ["item-desc", "item-unit", "item-qty", "item-currency", "item-rate"].some((cls) => event.target.classList.contains(cls)) ||
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

  downloadPdfBtn.addEventListener("click", async () => {
    await downloadPdf();
  });

  resetBtn.addEventListener("click", () => {
    resetFormData();
  });
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
  }
  applyShipmentCurrencyToItems();
  recalculateTotals();
  attachEventListeners();
}

init();
