/* Ordena los filtros según la época del año: la próxima fiesta y la estación actual van primero */
(function(){
  var now=new Date(), y=now.getFullYear(), DAY=864e5;
  function easter(Y){var a=Y%19,b=Math.floor(Y/100),c=Y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return new Date(Y,mo-1,da);}
  function firstSundayMay(Y){var d=new Date(Y,4,1);d.setDate(1+(7-d.getDay())%7);return d;}
  var FEST={navidad:function(Y){return new Date(Y,11,25);},pascua:easter,halloween:function(Y){return new Date(Y,9,31);},
    carnaval:function(Y){return new Date(easter(Y).getTime()-47*DAY);},valentin:function(Y){return new Date(Y,1,14);},
    madre:firstSundayMay,cole:function(Y){return new Date(Y,8,8);}};
  function daysTo(f){var d=FEST[f](y);if((d-now)/DAY<(f==="navidad"?-13:-2))d=FEST[f](y+1);return (d-now)/DAY;}
  var m=now.getMonth(), seasons=['invierno','primavera','verano','otono'], cur;
  cur=[0,0,1,1,1,2,2,2,3,3,3,0][m];
  function rank(f){
    if(FEST[f])return daysTo(f);
    var i=seasons.indexOf(f); if(i>-1)return (i-cur+4)%4;
    return null;
  }
  document.querySelectorAll('.filter-bar .chips').forEach(function(box){
    var chips=[].slice.call(box.querySelectorAll('.chip')), ranked=chips.filter(function(c){return rank(c.getAttribute('data-f'))!==null;});
    if(!ranked.length)return;
    var rest=chips.filter(function(c){return ranked.indexOf(c)<0;});
    ranked.sort(function(a,b){return rank(a.getAttribute('data-f'))-rank(b.getAttribute('data-f'));});
    ranked.concat(rest).forEach(function(c){box.appendChild(c);});
  });
})();
