function todayISO(){return new Date().toISOString().split('T')[0]}
function addMonths(n){const d=new Date();d.setMonth(d.getMonth()+n);return d.toISOString().split('T')[0]}

function generateQuotationNumber(){
  const d=new Date();
  const yy=String(d.getFullYear()).slice(-2);
  const mm=String(d.getMonth()+1).padStart(2,'0');
  const rnd=String(Math.floor(Math.random()*1000)).padStart(3,'0');
  document.getElementById('quoteNo').value=`QTN-${yy}${mm}-${rnd}`
}

function setInitialValues(){
  document.getElementById('quoteDate').value=todayISO();
  document.getElementById('validTill').value=addMonths(1);
  document.getElementById('clientName').value='';
  document.getElementById('clientCompany').value='';
  document.getElementById('clientAddress').value='';
  document.getElementById('clientContact').value='';
  document.getElementById('accountManager').value='';
}

function getRates(){
  return{
    lkr:parseFloat(document.getElementById('rateLKR').value)||300,
    eur:parseFloat(document.getElementById('rateEUR').value)||0.92,
    gbp:parseFloat(document.getElementById('rateGBP').value)||0.79,
    aed:parseFloat(document.getElementById('rateAED').value)||3.67,
    target:document.getElementById('targetCurrency').value
  }
}

function toUSD(amount,curr,r){
  if(curr==='USD')return amount;
  if(curr==='LKR')return amount/r.lkr;
  if(curr==='EUR')return amount/r.eur;
  if(curr==='GBP')return amount/r.gbp;
  if(curr==='AED')return amount/r.aed;
  return amount
}

function fromUSD(amount,curr,r){
  if(curr==='USD')return amount;
  if(curr==='LKR')return amount*r.lkr;
  if(curr==='EUR')return amount*r.eur;
  if(curr==='GBP')return amount*r.gbp;
  if(curr==='AED')return amount*r.aed;
  return amount
}

function calculate(){
  const r=getRates();
  let totalUSD=0;

  document.querySelectorAll('#chargeBody tr').forEach(row=>{
    const qty=parseFloat(row.querySelector('.qty')?.value)||1;
    const rate=parseFloat(row.querySelector('.rate')?.value)||0;
    const curr=row.querySelector('.curr')?.value||'USD';
    const amount=qty*rate;
    const amountCell=row.querySelector('.amount');
    if(amountCell)amountCell.textContent=amount.toFixed(2);
    totalUSD+=toUSD(amount,curr,r)
  });

  const totalTarget=fromUSD(totalUSD,r.target,r);
  document.getElementById('grandTotal').textContent=
    `TOTAL: ${totalTarget.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} ${r.target}`;
  document.getElementById('breakdown').textContent=`USD Total: ${totalUSD.toFixed(2)}`
}

function renumber(){
  document.querySelectorAll('#chargeBody tr').forEach((row,i)=>{
    row.querySelector('.row-no').textContent=i+1
  })
}

function addRow(){
  const tbody=document.getElementById('chargeBody');
  const tr=document.createElement('tr');
  tr.innerHTML=`
    <td class="row-no">0</td>
    <td><input type="text" placeholder="Description"></td>
    <td><input class="qty" type="number" min="0" value="1" oninput="calculate()"></td>
    <td><input type="text" placeholder="Unit"></td>
    <td>
      <select class="curr" onchange="calculate()">
        <option>USD</option><option>LKR</option><option>EUR</option><option>GBP</option><option>AED</option>
      </select>
    </td>
    <td><input class="rate" type="number" min="0" value="0" oninput="calculate()"></td>
    <td class="amount">0.00</td>
    <td class="no-print"><button class="btn-del" type="button" onclick="removeRow(this)">Remove</button></td>
  `;
  tbody.appendChild(tr);
  renumber();
  calculate()
}

function removeRow(btn){
  btn.closest('tr').remove();
  renumber();
  calculate()
}

function saveRates(){
  localStorage.setItem('rateLKR',document.getElementById('rateLKR').value);
  localStorage.setItem('rateEUR',document.getElementById('rateEUR').value);
  localStorage.setItem('rateGBP',document.getElementById('rateGBP').value);
  localStorage.setItem('rateAED',document.getElementById('rateAED').value)
}

function loadRates(){
  ['LKR','EUR','GBP','AED'].forEach(c=>{
    const v=localStorage.getItem('rate'+c);
    if(v)document.getElementById('rate'+c).value=v
  })
}

function resetForm(){
  location.reload()
}

function printQuotation(){
  window.print()
}

document.addEventListener('DOMContentLoaded',()=>{
  generateQuotationNumber();
  setInitialValues();
  loadRates();
  calculate();
  ['rateLKR','rateEUR','rateGBP','rateAED'].forEach(id=>
    document.getElementById(id).addEventListener('input',()=>{
      saveRates();
      calculate()
    })
  )
});
