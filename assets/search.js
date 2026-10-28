(function(){
  var S=window.SEARCH, box=document.getElementById('q'), out=document.getElementById('results'), cnt=document.getElementById('count'), data=[], active=[];
  var chips=[].slice.call(document.querySelectorAll('.filter-bar .chip'));
  function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function sync(){
    chips.forEach(function(c){c.classList.toggle('on',active.indexOf(c.getAttribute('data-f'))>-1);});
    var p=new URLSearchParams(); if(box.value.trim())p.set('q',box.value.trim()); if(active.length)p.set('f',active.join(','));
    history.replaceState(null,'',location.pathname+(p.toString()?'?'+p:''));
  }
  function render(){
    sync();
    var v=norm(box.value.trim());
    if(!v && !active.length){out.innerHTML='';cnt.textContent='';return;}
    var words=v?v.split(/\s+/):[];
    var res=data.filter(function(d){
      return words.every(function(w){return d._h.indexOf(w)>-1;}) && active.every(function(f){return d.f.indexOf(f)>-1;});
    });
    cnt.innerHTML=res.length+' '+S.results+(active.length?' · <a href="#" id="clr">'+S.clear+'</a>':'');
    var c=document.getElementById('clr'); if(c)c.onclick=function(e){e.preventDefault();active=[];render();};
    out.innerHTML=res.slice(0,300).map(function(d){var h=S.root+d.u+'index.html';
      return '<article class="post-item"><div class="entry-details"><span class="entry-cat">'+esc(d.y)+'</span><h2 class="entry-title"><a href="'+h+'">'+esc(d.t)+'</a></h2></div>'+
      (d.i?'<a class="entry-image" href="'+h+'"><img loading="lazy" src="'+S.root+esc(d.i)+'" alt=""></a>':'')+'</article>';}).join('');
  }
  chips.forEach(function(c){c.addEventListener('click',function(e){
    e.preventDefault(); var f=c.getAttribute('data-f'), i=active.indexOf(f);
    if(i>-1)active.splice(i,1); else active.push(f); render();
  });});
  fetch('index.json').then(function(r){return r.json();}).then(function(j){
    data=j.map(function(d){d._h=norm(d.t+' '+d.c+' '+(d.x||''));d.f=d.f||[];return d;});
    var p=new URLSearchParams(location.search);
    if(p.get('q'))box.value=p.get('q');
    if(p.get('f'))active=p.get('f').split(',').filter(Boolean);
    render();
  }).catch(function(){cnt.textContent='La búsqueda necesita abrirse desde la web publicada.';});
  box.addEventListener('input',render);
})();
