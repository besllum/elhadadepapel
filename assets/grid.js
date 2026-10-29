/* Control de tamaño de las fotos en las cuadrículas de entradas (cuadrado pequeño = más columnas, grande = menos) */
(function(){
  var KEY='hada-cols', mobile=window.matchMedia('(max-width:600px)').matches;
  var min=1, max=mobile?3:6, def=mobile?1:4, saved=null;
  try{saved=parseInt(localStorage.getItem(KEY+(mobile?'-m':'')),10);}catch(e){}
  var cols=(saved>=min&&saved<=max)?saved:def;
  var grids=[].slice.call(document.querySelectorAll('.masonry')).filter(function(g){return !g.closest('.related');});
  if(!grids.length)return;
  var lang=(document.documentElement.lang||'es').slice(0,2), L={es:['Fotos más pequeñas','Fotos más grandes','Tamaño de las fotos'],en:['Smaller photos','Bigger photos','Photo size'],de:['Kleinere Fotos','Größere Fotos','Fotogröße']}[lang]||['-','+','size'];
  function apply(){grids.forEach(function(g){g.style.setProperty('--cols',cols);g.classList.add('sized');});}
  var ctrls=[];
  grids.forEach(function(g){
    var c=document.createElement('div'); c.className='size-ctrl';
    c.innerHTML='<button type="button" class="sz sz-s" aria-label="'+L[0]+'"></button><input type="range" min="0" max="'+(max-min)+'" step="1" aria-label="'+L[2]+'"><button type="button" class="sz sz-l" aria-label="'+L[1]+'"></button>';
    g.parentNode.insertBefore(c,g); ctrls.push(c);
    var r=c.querySelector('input');
    function set(n){cols=Math.max(min,Math.min(max,n));try{localStorage.setItem(KEY+(mobile?'-m':''),cols);}catch(e){}sync();apply();}
    r.addEventListener('input',function(){set(max-parseInt(r.value,10));});
    c.querySelector('.sz-s').addEventListener('click',function(){set(cols+1);});
    c.querySelector('.sz-l').addEventListener('click',function(){set(cols-1);});
  });
  function sync(){ctrls.forEach(function(c){var r=c.querySelector('input');r.value=max-cols;r.style.setProperty('--p',((max-cols)/(max-min)*100)+'%');});}
  sync(); apply();
})();
