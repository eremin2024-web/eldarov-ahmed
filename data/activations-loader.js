window.loadExtendedActivations=async function(){
  const files=[
    'data/activations_2026-05.json',
    'data/activations_2026-06.json',
    'data/activations_2026-07.json',
    'data/activations.json'
  ];
  const parts=await Promise.all(files.map(function(f){
    return fetch(f).then(function(r){
      if(!r.ok)throw new Error(f);
      return r.json();
    });
  }));
  const rows=[].concat.apply([],parts).map(function(row){
    return {
      number:String(row.number||''),
      operator:String(row.operator||''),
      date:String(row.date||''),
      tariff:String(row.tariff||'')
    };
  });
  const seen=new Set();
  return rows.filter(function(x){
    const k=x.number+'|'+x.operator+'|'+x.date+'|'+x.tariff;
    if(!x.number||!x.date||seen.has(k))return false;
    seen.add(k);
    return true;
  });
};