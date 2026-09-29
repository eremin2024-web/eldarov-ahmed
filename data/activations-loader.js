window.loadExtendedActivations=async function(){
  const historyFiles=[
    'data/activations_2026-05.json',
    'data/activations_2026-06.json',
    'data/activations_2026-07.json'
  ];
  const septemberFiles=[
    'data/activations_2026-09_a.json',
    'data/activations_2026-09_b.json',
    'data/activations_2026-09_c.json'
  ];
  const [historyParts,augSep,septemberParts]=await Promise.all([
    Promise.all(historyFiles.map(function(f){return fetch(f).then(function(r){if(!r.ok)throw new Error(f);return r.json();});})),
    fetch('data/activations.json').then(function(r){if(!r.ok)throw new Error('data/activations.json');return r.json();}),
    Promise.all(septemberFiles.map(function(f){return fetch(f).then(function(r){if(!r.ok)throw new Error(f);return r.json();});}))
  ]);
  const august=augSep.filter(function(row){return String(row.date||'').includes('.08.2026');});
  const rows=[].concat.apply([],historyParts).concat(august).concat([].concat.apply([],septemberParts)).map(function(row){
    return {
      number:String(row.number||''),
      operator:String(row.operator||''),
      date:String(row.date||''),
      tariff:String(row.tariff||''),
      moved:String(row.moved||'')
    };
  });
  const seen=new Set();
  return rows.filter(function(x){
    const k=x.number+'|'+x.operator+'|'+x.date+'|'+x.tariff+'|'+x.moved;
    if(!x.number||!x.date||seen.has(k))return false;
    seen.add(k);
    return true;
  });
};