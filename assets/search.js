(function(){
  var S=window.SEARCH, box=document.getElementById('q'), out=document.getElementById('results'), cnt=document.getElementById('count'), data=[];
  function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function render(){
    var v=norm(box.value.trim()); if(!v){out.innerHTML='';cnt.textContent='';return;}
    var words=v.split(/\s+/), res=data.filter(function(d){var h=d._h;return words.every(function(w){return h.indexOf(w)>-1;});}).slice(0,120);
    cnt.textContent=res.length+(res.length===120?'+':'')+' '+S.results;
    out.innerHTML=res.map(function(d){var h=S.root+d.u+'index.html';
      return '<article class="post-item">'+(d.i?'<a class="entry-image" href="'+h+'"><img loading="lazy" src="'+S.root+esc(d.i)+'" alt=""></a>':'')+
      '<div class="entry-details"><span class="entry-cat">'+esc(d.y)+'</span><h2 class="entry-title"><a href="'+h+'">'+esc(d.t)+'</a></h2><a class="read-more" href="'+h+'">'+S.more+' →</a></div></article>';}).join('');
  }
  fetch('index.json').then(function(r){return r.json();}).then(function(j){data=j.map(function(d){d._h=norm(d.t+' '+d.c);return d;});
    var p=new URLSearchParams(location.search).get('q'); if(p){box.value=p;} render();})
  .catch(function(){cnt.textContent='La búsqueda necesita abrirse desde la web publicada (no funciona abriendo el archivo directamente).';});
  box.addEventListener('input',render);
})();
