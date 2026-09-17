// DATOS DEL COTIZADOR iSHOP
// Este archivo contiene precios, MSI, Trade In y programas.
// V51: los selectores de MSI muestran primero el plazo más largo.
// Puedes actualizar estos datos sin modificar la lógica de app.js.

const MODEL_ORDER = ["Duo","18 Pro Max","18 Pro","17 Pro Max","17 Pro","17","Air","17e","16","15"];

const P = {
  "Duo":{"256 GB":47999,"512 GB":52999,"1 TB":62999,"2 TB":77999},
  "18 Pro Max":{"256 GB":31999,"512 GB":36999,"1 TB":46999,"2 TB":61999},
  "18 Pro":{"256 GB":29999,"512 GB":34999,"1 TB":44999,"2 TB":59999},
  "17 Pro Max":{"256 GB":30999,"512 GB":35999,"1 TB":40999},
  "17 Pro":{"256 GB":28499,"512 GB":33499},
  "17":{"256 GB":21999},
  "Air":{"256 GB":22499},
  "17e":{"256 GB":16999},
  "16":{"128 GB":18999},
  "15":{"128 GB":16999}
};

const AC = {
  "Duo":{acc:6999,loss:8599},
  "18 Pro Max":{acc:4799,loss:6399},
  "18 Pro":{acc:4799,loss:6399},
  "17 Pro Max":{acc:4799,loss:6399},
  "17 Pro":{acc:4799,loss:6399},
  "17":{acc:3699,loss:5299},
  "Air":{acc:4799,loss:6399},
  "17e":{acc:2999,loss:4599},
  "16":{acc:3699,loss:5299},
  "15":{acc:3699,loss:5299}
};

const EMSI = {
  "BANAMEX":[15,12,10,6,3],
  "BBVA":[13,12,6,3],
  "AMERICAN EXPRESS":[12,9,6,3],
  "INBURSA":[12,6,3],
  "SANTANDER":[12,9,6,3],
  "HSBC":[15,12,9,6,3],
  "SCOTIABANK":[18,15,12,9,6,3],
  "BANORTE":[15,12,10,9,6,3],
  "INVEX":[15,12,9,6,3],
  "RAPPI CARD":[12,9,6,3],
  "PLATA CARD":[12,9,6,3],
  "DIDI CARD":[12,9,6],
  "MERCADO PAGO":[12,9,6,3],
  "STORI CARD":[12,9,6,3],
  "MIFEL":[12,6,3]
};

const ACMSI = {
  "BANAMEX":[10,6,3],
  "BBVA":[13,12,6,3],
  "AMERICAN EXPRESS":[12,9,6,3],
  "INBURSA":[12,6,3],
  "SANTANDER":[12,9,6,3],
  "HSBC":[12,9,6,3],
  "SCOTIABANK":[12,9,6,3],
  "BANORTE":[12,10,9,6,3],
  "INVEX":[12,9,6,3],
  "RAPPI CARD":[12,9,6,3],
  "PLATA CARD":[12,9,6,3],
  "DIDI CARD":[12,9,6],
  "MERCADO PAGO":[12,9,6,3],
  "STORI CARD":[12,9,6,3]
};

const TRADE_IN = {
  "IPHONe SE3":{"64":2000,"128":2000,"256":3000},
  "IPHONE 12 MINI":{"64":3000,"128":4000,"256":4000},
  "IPHONE 12":{"64":3000,"128":4000,"256":4000},
  "IPHONE 12 PRO":{"128":5000,"256":5000,"512":6000},
  "IPHONE 12 PRO MAX":{"128":5000,"256":6000,"512":7000},
  "IPHONE 13 MINI":{"128":5000,"256":6000,"512":8000},
  "IPHONE 13":{"128":5000,"256":6000,"512":7000},
  "IPHONE 13 PRO":{"128":7000,"256":8000,"512":8000,"1TB":10000},
  "IPHONE 13 PRO MAX":{"128":7000,"256":8000,"512":9000,"1TB":10000},
  "IPHONE 14":{"128":6000,"256":7000,"512":8000},
  "IPHONE 14 PLUS":{"128":6000,"256":7000,"512":8000},
  "IPHONE 14 PRO":{"128":9000,"256":10000,"1TB":11000},
  "IPHONE 14 PRO MAX":{"128":9000,"256":10000,"512":10000,"1TB":12000},
  "IPHONE 15":{"128":7000,"256":8000,"512":10000},
  "IPHONE 15 PLUS":{"128":8000,"256":10000,"512":12000},
  "IPHONE 15 PRO":{"128":9000,"256":10000,"512":11000,"1TB":12000},
  "IPHONE 15 PRO MAX":{"256":10000,"512":11000,"1TB":13000},
  "IPHONE 16E":{"128":8000,"256":10000,"512":10000},
  "IPHONE 16":{"128":10000,"256":12000,"512":14000},
  "IPHONE 16 PLUS":{"128":11000,"256":12000,"512":14000},
  "IPHONE 16 PRO":{"128":11000,"256":12000,"512":13000,"1TB":15000},
  "IPHONE 16 PRO MAX":{"256":13000,"512":15000,"1TB":18000},
  "IPHONE 17E":{"256GB":11000,"512GB":13000},
  "IPHONE 17":{"256":13000,"512":16000},
  "IPHONE 17 PRO":{"256":16000,"512":18000,"1TB":20000},
  "IPHONE 17 PRO MAX":{"256":16000,"512":18000,"1TB":20000,"2TB":23000},
  "IPHONE AIR":{"256":14000,"512":15000,"1TB":17000}
};

const TRADE_MODELS={
    "iPhone Air":1,
    "iPhone 17 Pro Max":1,"iPhone 17 Pro":1,"iPhone 17":1,"iPhone 17e":1,
    "iPhone 16 Pro Max":1,"iPhone 16 Pro":1,"iPhone 16 Plus":1,"iPhone 16":1,"iPhone 16e":1,
    "iPhone 15 Pro Max":1,"iPhone 15 Pro":1,"iPhone 15 Plus":1,"iPhone 15":1,
    "iPhone 14 Pro Max":1,"iPhone 14 Pro":1,"iPhone 14 Plus":1,"iPhone 14":1,
    "iPhone 13 Pro Max":1,"iPhone 13 Pro":1,"iPhone 13":1,"iPhone 13 mini":1,
    "iPhone 12 Pro Max":1,"iPhone 12 Pro":1,"iPhone 12":1,"iPhone 12 mini":1,
    "iPhone SE3":1
  };

const TRADE_MODEL_MAP={
    "iPhone SE3":"IPHONe SE3",
    "iPhone 12 mini":"IPHONE 12 MINI",
    "iPhone 12":"IPHONE 12",
    "iPhone 12 Pro":"IPHONE 12 PRO",
    "iPhone 12 Pro Max":"IPHONE 12 PRO MAX",
    "iPhone 13 mini":"IPHONE 13 MINI",
    "iPhone 13":"IPHONE 13",
    "iPhone 13 Pro":"IPHONE 13 PRO",
    "iPhone 13 Pro Max":"IPHONE 13 PRO MAX",
    "iPhone 14":"IPHONE 14",
    "iPhone 14 Plus":"IPHONE 14 PLUS",
    "iPhone 14 Pro":"IPHONE 14 PRO",
    "iPhone 14 Pro Max":"IPHONE 14 PRO MAX",
    "iPhone 15":"IPHONE 15",
    "iPhone 15 Plus":"IPHONE 15 PLUS",
    "iPhone 15 Pro":"IPHONE 15 PRO",
    "iPhone 15 Pro Max":"IPHONE 15 PRO MAX",
    "iPhone 16e":"IPHONE 16E",
    "iPhone 16":"IPHONE 16",
    "iPhone 16 Plus":"IPHONE 16 PLUS",
    "iPhone 16 Pro":"IPHONE 16 PRO",
    "iPhone 16 Pro Max":"IPHONE 16 PRO MAX",
    "iPhone 17e":"IPHONE 17E",
    "iPhone 17":"IPHONE 17",
    "iPhone 17 Pro":"IPHONE 17 PRO",
    "iPhone 17 Pro Max":"IPHONE 17 PRO MAX",
    "iPhone Air":"IPHONE AIR"
  };

const SPECIAL = {
  "18 Pro Max":{ifl:[939,9463],get:[1089,10219]},
  "18 Pro":{ifl:[879,8903],get:[1029,9419]},
  "17 Pro Max":{ifl:[1039,6063],get:[1199,7019]},
  "17 Pro":{ifl:[959,5483],get:[1099,6519]},
  "Air":{ifl:[659,6683],get:[769,7119]},
  "17":{ifl:[649,6423],get:[749,7019]},
  "17e":{ifl:[499,5023],get:[579,5419]},
  "16":{ifl:[639,3663],get:[739,4219]}
};