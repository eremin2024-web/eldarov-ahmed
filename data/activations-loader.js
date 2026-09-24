window.loadExtendedActivations=async function(){
  const jsonFiles=[
    'data/activations_may_jul_1.json',
    'data/activations_may_jul_2.json',
    'data/activations_may_jul_3.json',
    'data/activations_may_jul_4.json'
  ];
  const b64Files=[
    'data/activations_may_jul_5a.b64',
    'data/activations_may_jul_5b.b64',
    'data/activations_may_jul_6a.b64',
    'data/activations_may_jul_6b.b64',
    'data/activations_may_jul_7a.b64',
    'data/activations_may_jul_7b.b64'
  ];
  const decode=function(text){
    const binary=atob(String(text||'').trim());
    const bytes=Uint8Array.from(binary,function(c){return c.charCodeAt(0)});
    return JSON.parse(new TextDecoder('utf-8').decode(bytes));
  };
  const normalize=function(row){
    if(Array.isArray(row)){
      return {number:String(row[0]||''),operator:String(row[1]||''),date:String(row[2]||''),tariff:String(row[3]||''),moved:String(row[4]||'')};
    }
    return {number:String(row.number||''),operator:String(row.operator||''),date:String(row.date||''),tariff:String(row.tariff||''),moved:String(row.moved||'')};
  };
  const [rawParts,b64Parts,oldData]=await Promise.all([
    Promise.all(jsonFiles.map(function(f){return fetch(f).then(function(r){if(!r.ok)throw new Error(f);return r.json()})})),
    Promise.all(b64Files.map(function(f){return fetch(f).then(function(r){if(!r.ok)throw new Error(f);return r.text()})})),
    fetch('data/activations.json').then(function(r){if(!r.ok)throw new Error('data/activations.json');return r.json()})
  ]);
  const rows=[].concat.apply([],rawParts).concat([].concat.apply([],b64Parts.map(decode))).concat(oldData).map(normalize);
  const seen=new Set();
  return rows.filter(function(x){
    const k=x.number+'|'+x.date;
    if(!x.number||!x.date||seen.has(k))return false;
    seen.add(k);
    return true;
  });
};