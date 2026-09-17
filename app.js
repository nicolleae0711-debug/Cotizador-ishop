// Lógica del Cotizador iShop
// Los precios y tablas se encuentran en datos.js.
"use strict";













const $ = id => document.getElementById(id);
const money = n => Number(n||0).toLocaleString("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0});


function populate(select, values, formatter=x=>x){
  select.innerHTML = "";
  values.forEach(v=>{
    const o=document.createElement("option");
    o.value=String(v);
    o.textContent=formatter(v);
    select.appendChild(o);
  });
}

function program(){
  return document.querySelector('input[name="program"]:checked')?.value || "msi";
}

function careType(){
  if($("careLoss").checked) return "loss";
  if($("careAcc").checked) return "acc";
  return "none";
}


function tradeModelKey(model){
    const map=TRADE_MODEL_MAP;
  return map[model] || model;
}

function tradeValue(){
  if(!$("tradeInEnabled").checked) return 0;
  const model=$("tradeModel").value;
  const cap=$("tradeCapacity").value;
  const key=tradeModelKey(model);
  return Number((TRADE_IN[key]||{})[cap]||0);
}

function tradeModelChange(){
  const model=$("tradeModel").value;
  const data=TRADE_IN[tradeModelKey(model)]||{};
  populate($("tradeCapacity"), Object.keys(data));
  updateTradeValue();
}

function updateTradeValue(){
  const enabled=$("tradeInEnabled").checked;
  $("tradeInFields").hidden=!enabled;
  if(!enabled){
    $("tradeValueBox").textContent="";
    return;
  }
  const model=$("tradeModel").value;
  const cap=$("tradeCapacity").value;
  const value=tradeValue();
  $("tradeValueBox").innerHTML="<b>Valor de Trade In: "+money(value)+"</b><br>Se aplicará como descuento al precio del equipo.";
}

function init(){
  populate($("model"), MODEL_ORDER);
  populate($("tradeModel"), Object.keys(TRADE_MODELS));
  tradeModelChange();
  populate($("bank"), Object.keys(EMSI));
  populate($("careBank"), ["CONTADO",...Object.keys(ACMSI)]);
  $("model").selectedIndex=0;
  $("bank").selectedIndex=0;
  $("careBank").selectedIndex=0;
  modelChange();
  bankChange();
  careBankChange();
  careChange();
  update();
}

function modelChange(){
  const m=$("model").value;
  populate($("capacity"), Object.keys(P[m]));
  $("capacity").selectedIndex=0;

  const available=!!SPECIAL[m];
  ["ifl","get"].forEach(v=>{
    const el=document.querySelector('input[name="program"][value="'+v+'"]');
    const wrapper=el.closest(".program");
    wrapper.classList.toggle("off",!available);
    el.disabled=!available;
  });

  if(!available && (program()==="ifl" || program()==="get")){
    document.querySelector('input[name="program"][value="msi"]').checked=true;
  }
  careChange();
  update();
}

function bankChange(){
  const b=$("bank").value;
  const vals=EMSI[b]||[];
  populate($("term"), vals, v=>v+" MSI");
  $("bankNote").textContent=vals.length
    ? "Plazos disponibles: "+vals.join(", ")+" MSI · máximo "+Math.max(...vals)+" MSI"
    : "";
  update();
}

function careBankChange(){
  const b=$("careBank").value;
  if(b==="CONTADO"){
    $("careTermWrap").style.display="none";
    $("careTerm").innerHTML="";
    $("careNote").textContent="AppleCare+ se paga de contado.";
  }else{
    $("careTermWrap").style.display="block";
    const vals=ACMSI[b]||[];
    populate($("careTerm"), vals, v=>v+" MSI");
    $("careNote").textContent=vals.length
      ? "Plazos disponibles: "+vals.join(", ")+" MSI · máximo "+Math.max(...vals)+" MSI"
      : "";
  }
  update();
}

function careChange(){
  const m=$("model").value;
  let ct=careType();

  if($("switchup").checked && ct==="none"){
    $("careAcc").checked=true;
    $("careLoss").checked=false;
    ct="acc";
  }

  const available=ct!=="none" && AC[m] && AC[m][ct]!=null;
  $("careCard").hidden=!available;

  if(available){
    $("careNote").textContent="Selecciona forma de pago para AppleCare+.";
  }
  update();
}

function update(){
  const m=$("model").value;
  const c=$("capacity").value;
  const price=Number(P[m][c]||0);
  const sw=$("switchup").checked;
  const prog=program();
  const tradeCredit=tradeValue();
  const netPrice=Math.max(0, price-tradeCredit);
  const switchAmount=sw?399:0;
  const financed=netPrice+switchAmount;

  let equipMonthly=0,last=0;

  if(prog==="cash"){
    equipMonthly=financed;
  }else if(prog==="msi"){
    const t=Number($("term").value||0);
    equipMonthly=t?financed/t:0;
    const vals=EMSI[$("bank").value]||[];
    $("bankNote").textContent=vals.length
      ? "Plazos disponibles: "+vals.join(", ")+" MSI · máximo "+Math.max(...vals)+" MSI"
      : "";
  }else if(SPECIAL[m] && SPECIAL[m][prog]){
    const baseMonthly=SPECIAL[m][prog][0];
    const programMonths=(prog==="ifl"?24:20);

    // Trade In reduces the amount financed in the program's MSI.
    equipMonthly=Math.max(0, baseMonthly-(tradeCredit/programMonths));
    last=SPECIAL[m][prog][1];
  }

  $("normal").hidden=prog!=="msi";
  $("special").hidden=!(prog==="ifl"||prog==="get");

  if(prog==="cash"){
    $("bankNote").textContent="Pago de contado · sin financiamiento.";
  }else if(prog==="ifl"){
    $("special").innerHTML="<b>iPhone for Life · Banamex · 24 MSI</b><br>Plazo exclusivo del programa.";
  }else if(prog==="get"){
    $("special").innerHTML="<b>GET · BBVA · 20 MSI</b><br>Plazo exclusivo del programa.";
  }

  const ct=careType();
  const carePrice=(ct!=="none" && AC[m] && AC[m][ct]!=null)?Number(AC[m][ct]):0;
  const careBank=$("careBank").value;
  const careTerm=Number($("careTerm").value||0);
  const careMonthly=carePrice
    ? (careBank==="CONTADO" ? carePrice : (careTerm ? carePrice/careTerm : 0))
    : 0;

  const total=netPrice+switchAmount+carePrice;
  const combined=equipMonthly+careMonthly;

  let rows = '';

  if(tradeCredit>0){
    rows += '<div class="line"><span><strong>iPhone '+m+'</strong></span><b>'+money(price)+'</b></div>';
    rows += '<div class="line"><span><strong>Trade In · '+$("tradeModel").value+' '+$("tradeCapacity").value+'</strong></span><b>-'+money(tradeCredit)+'</b></div>';

    if(prog==="ifl"){
      const financingAmount = Math.max(0, price-tradeCredit);
      rows += '<div class="line"><span><strong>Equipo financiado · iPhone for Life · Banamex 24 MSI</strong></span><b>'+money(financingAmount)+'</b></div>';
      rows += '<div class="line"><span><strong>Cargo demorado</strong></span><b>'+money(last)+'</b></div>';
    }else if(prog==="get"){
      const financingAmount = Math.max(0, price-tradeCredit);
      rows += '<div class="line"><span><strong>Equipo financiado · GET · BBVA 20 MSI</strong></span><b>'+money(financingAmount)+'</b></div>';
      rows += '<div class="line"><span><strong>Cargo demorado</strong></span><b>'+money(last)+'</b></div>';
    }else if(prog==="msi"){
      rows += '<div class="line"><span><strong>Equipo financiado · '+$("term").value+' MSI de '+$("bank").value+'</strong></span><b>'+money(financed)+'</b></div>';
    }else{
      rows += '<div class="line"><span><strong>Equipo financiado · Contado</strong></span><b>'+money(financed)+'</b></div>';
    }
  }else{
    rows += '<div class="line"><span><strong>iPhone '+m+'</strong></span><b>'+money(price)+'</b></div>';

    if(sw){
      rows += '<div class="line"><span>Switch Up!</span><b>'+money(399)+'</b></div>';
    }

    if(prog==="cash"){
      rows += '<div class="line"><span>Equipo financiado · Contado</span><b>'+money(financed)+'</b></div>';
    }else if(prog==="msi"){
      rows += '<div class="line"><span>Equipo financiado · '+$("term").value+' MSI de '+$("bank").value+'</span><b>'+money(financed)+'</b></div>';
    }else if(prog==="ifl"){
      rows += '<div class="line"><span>Equipo financiado · iPhone for Life · Banamex 24 MSI</span><b>'+money(financed)+'</b></div>';
    }else if(prog==="get"){
      rows += '<div class="line"><span>Equipo financiado · GET · BBVA 20 MSI</span><b>'+money(financed)+'</b></div>';
    }
  }

  if(carePrice>0){
    if(careBank==="CONTADO"){
      rows += '<div class="line"><span>AppleCare+ · Contado</span><b>'+money(carePrice)+'</b></div>';
    }else{
      rows += '<div class="line"><span>AppleCare+ · '+$("careTerm").value+' MSI de '+careBank+'</span><b>'+money(carePrice)+'</b></div>';
    }
  }

  rows += '<div class="line total"><span>Total de venta</span><b>'+money(total)+'</b></div>';
  $("summaryRows").innerHTML=rows;

  let equipLabel="Mensualidad del equipo";
  if(prog==="cash"){
    equipLabel="Mensualidad del equipo · Contado";
  }else if(prog==="msi"){
    equipLabel="Mensualidad del equipo · "+$("term").value+" MSI de "+$("bank").value;
  }else if(prog==="ifl"){
    equipLabel="Mensualidad del equipo · iPhone for Life · Banamex 24 MSI";
  }else if(prog==="get"){
    equipLabel="Mensualidad del equipo · GET · BBVA 20 MSI";
  }
  $("equipMonthlyLabel").textContent=equipLabel;

  let careLabel="Mensualidad AppleCare+";
  if(carePrice>0){
    if(careBank==="CONTADO"){
      careLabel="Mensualidad AppleCare+ · Contado";
    }else{
      careLabel="Mensualidad AppleCare+ · "+$("careTerm").value+" MSI de "+careBank;
    }
  }
  $("careMonthlyLabel").textContent=careLabel;

  $("outEquipMonthly").textContent=money(Math.round(equipMonthly));
  $("outCareMonthly").textContent=money(Math.round(careMonthly));
  $("outCombined").textContent=money(Math.round(combined));
  $("outLast").textContent=last ? "Último pago del programa: "+money(last) : "";

  updateComparisonVisibility();
  if(prog!=="cash") renderComparison();
}

function updateComparisonVisibility(){
  $("comparisonMenu").style.display=program()==="cash" ? "none" : "block";
}

function renderComparison(){
  const model=$("model").value;
  const capacity=$("capacity").value;
  const price=Number(P[model][capacity]||0);
  const tradeCredit=tradeValue();
  const comparisonPrice=Math.max(0,price-tradeCredit);
  const term=Number($("term").value||0);

  // Normal MSI uses the bank selected for the equipment.
  // For Life and GET use their own program bank.
  let comparisonBank=$("bank").value;
  if(program()==="ifl") comparisonBank="BANAMEX";
  if(program()==="get") comparisonBank="BBVA";

  const careTerms=ACMSI[comparisonBank]||[];
  const comparisonCareTerm=careTerms.length?Math.max(...careTerms):0;

  const accPrice=(AC[model]&&AC[model].acc!=null)?Number(AC[model].acc):0;
  const lossPrice=(AC[model]&&AC[model].loss!=null)?Number(AC[model].loss):0;

  const accMonthly=(accPrice&&comparisonCareTerm)?accPrice/comparisonCareTerm:0;
  const lossMonthly=(lossPrice&&comparisonCareTerm)?lossPrice/comparisonCareTerm:0;

  const ifl=SPECIAL[model]?SPECIAL[model].ifl:null;
  const get=SPECIAL[model]?SPECIAL[model].get:null;

  // Trade In is distributed over the program's MSI installments.
  const iflMonthly=ifl?Math.max(0,ifl[0]-(tradeCredit/24)):0;
  const getMonthly=get?Math.max(0,get[0]-(tradeCredit/20)):0;

  let html="";

  if(term){
    html+='<div class="compare-item"><div class="name">1. Equipo a MSI</div><div class="amount">'
      +money(Math.round(comparisonPrice/term))
      +' / mes</div><div class="small">'
      +term+' MSI · '+comparisonBank
      +(tradeCredit?' · Trade In -'+money(tradeCredit):'')
      +'</div></div>';

    html+='<div class="compare-item"><div class="name">2. Equipo + AppleCare+</div><div class="amount">'
      +money(Math.round(comparisonPrice/term+accMonthly))
      +' / mes</div><div class="small">'
      +term+' MSI · AppleCare+ daño accidental a '
      +comparisonCareTerm+' MSI de '+comparisonBank
      +(tradeCredit?' · Trade In aplicado':'')
      +'</div></div>';

    html+='<div class="compare-item"><div class="name">3. Equipo + AppleCare+ Robo y extravío</div><div class="amount">'
      +money(Math.round(comparisonPrice/term+lossMonthly))
      +' / mes</div><div class="small">'
      +term+' MSI · AppleCare+ Robo y extravío a '
      +comparisonCareTerm+' MSI de '+comparisonBank
      +(tradeCredit?' · Trade In aplicado':'')
      +'</div></div>';

    html+='<div class="compare-item"><div class="name">4. Equipo + Switch Up!</div><div class="amount">'
      +money(Math.round((comparisonPrice+399)/term+accMonthly))
      +' / mes</div><div class="small">'
      +term+' MSI · Switch Up! $399 + AppleCare+ daño accidental a '
      +comparisonCareTerm+' MSI de '+comparisonBank
      +(tradeCredit?' · Trade In aplicado':'')
      +'</div></div>';
  }else{
    html+='<div class="compare-item"><div class="name">1. Equipo a MSI</div><div class="small">Selecciona plazo para calcular.</div></div>';
    html+='<div class="compare-item"><div class="name">2. Equipo + AppleCare+</div><div class="small">Selecciona plazo para calcular.</div></div>';
    html+='<div class="compare-item"><div class="name">3. Equipo + AppleCare+ Robo y extravío</div><div class="small">Selecciona plazo para calcular.</div></div>';
    html+='<div class="compare-item"><div class="name">4. Equipo + Switch Up!</div><div class="small">Selecciona plazo para calcular.</div></div>';
  }

  $("comparisonGrid").innerHTML=html;

  let programs="";

  if(ifl){
    programs+='<div class="compare-item"><div class="name">iPhone for Life</div><div class="amount">'
      +money(Math.round(iflMonthly+accMonthly))
      +' / mes</div><div class="small">Banamex · 24 MSI · último pago '
      +money(ifl[1])+' · AppleCare+ daño accidental a '
      +comparisonCareTerm+' MSI de BANAMEX'
      +(tradeCredit?' · Trade In de '+money(tradeCredit)+' aplicado al MSI':'')
      +'</div></div>';
  }else{
    programs+='<div class="compare-item"><div class="name">iPhone for Life</div><div class="small">No disponible para este modelo.</div></div>';
  }

  if(get){
    programs+='<div class="compare-item"><div class="name">GET</div><div class="amount">'
      +money(Math.round(getMonthly+accMonthly))
      +' / mes</div><div class="small">BBVA · 20 MSI · último pago '
      +money(get[1])+' · AppleCare+ daño accidental a '
      +comparisonCareTerm+' MSI de BBVA'
      +(tradeCredit?' · Trade In de '+money(tradeCredit)+' aplicado al MSI':'')
      +'</div></div>';
  }else{
    programs+='<div class="compare-item"><div class="name">GET</div><div class="small">No disponible para este modelo.</div></div>';
  }

  $("programComparisonGrid").innerHTML=programs;
}

function resetCalculator(){
  $("model").selectedIndex=0;
  $("careAcc").checked=false;
  $("careLoss").checked=false;
  $("switchup").checked=false;
  $("tradeInEnabled").checked=false;
  $("tradeModel").selectedIndex=0;
  tradeModelChange();
  $("switchNote").textContent="Al seleccionar Switch Up!, se incluye AppleCare+.";

  document.querySelectorAll('input[name="program"]').forEach(x=>x.checked=x.value==="msi");

  $("bank").selectedIndex=0;
  $("careBank").selectedIndex=0;

  modelChange();
  bankChange();
  careBankChange();

  $("comparisonMenu").open=false;
  document.querySelectorAll(".program-toggle").forEach(d=>d.open=false);

  update();
}

$("model").addEventListener("change",modelChange);
$("capacity").addEventListener("change",update);

$("careAcc").addEventListener("change",()=>{
  if($("careAcc").checked) $("careLoss").checked=false;
  careChange();
});
$("careLoss").addEventListener("change",()=>{
  if($("careLoss").checked) $("careAcc").checked=false;
  careChange();
});

$("tradeInEnabled").addEventListener("change",()=>{
  updateTradeValue();
  update();
});
$("tradeModel").addEventListener("change",()=>{
  tradeModelChange();
  update();
});
$("tradeCapacity").addEventListener("change",()=>{
  updateTradeValue();
  update();
});

$("switchup").addEventListener("change",()=>{
  if($("switchup").checked){
    $("careAcc").checked=true;
    $("careLoss").checked=false;
    $("switchNote").textContent="Switch Up! incluye AppleCare+ por daño accidental. Puedes cambiar a Robo y Pérdida si lo deseas.";
  }else{
    $("switchNote").textContent="Al seleccionar Switch Up!, se incluye AppleCare+.";
  }
  careChange();
  update();
});

$("bank").addEventListener("change",bankChange);
$("term").addEventListener("change",update);
$("careBank").addEventListener("change",careBankChange);
$("careTerm").addEventListener("change",update);
document.querySelectorAll('input[name="program"]').forEach(x=>x.addEventListener("change",update));
$("reset").addEventListener("click",resetCalculator);

init();
