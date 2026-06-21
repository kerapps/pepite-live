(function(){
// The palette is locked to Petrol & Coral (the :root default in style.css);
// the on-page palette switcher was removed.
function filters(){
 var btns=document.querySelectorAll(".filter-btn");if(!btns.length)return;
 // the hero band (top 3) + the tip banner belong to the "All" view; a topic
 // filter hides them so only the matching wire items show (no duplicates).
 var hero=[document.querySelector(".top3"),document.querySelector(".tipbox.wide")];
 function show(c,on){if(c)c.style.display=on?"":"none";return on?1:0}
 btns.forEach(function(b){b.onclick=function(){
   btns.forEach(function(x){x.classList.remove("on")});b.classList.add("on");
   var f=b.getAttribute("data-f"),cells=document.querySelectorAll(".masonry .cell"),shown=0;
   if(f==="all"){
     hero.forEach(function(h){show(h,true)});
     cells.forEach(function(c){shown+=show(c,!c.hasAttribute("data-top"))});
   }else{
     hero.forEach(function(h){show(h,false)});
     cells.forEach(function(c){shown+=show(c,c.getAttribute("data-topic")===f)});
   }
   var nr=document.getElementById("noresults");if(nr)nr.hidden=shown>0;
 }});
 // initial "All" view: the newspaper carries lead/wire, so hide their grid twins
 document.querySelectorAll(".masonry .cell[data-top]").forEach(function(c){c.style.display="none"});
}
function linkedin(){
 var fab=document.getElementById("liFab"),modal=document.getElementById("liModal"),
     dataEl=document.getElementById("liData");
 if(!fab||!modal||!dataEl)return;
 var D;try{D=JSON.parse(dataEl.textContent)}catch(e){return}
 var slots=(D.main||[]).slice(0,3).map(function(p){return {t:p.t,u:p.u}});
 var ptr=0;
 function used(u){return slots.some(function(s){return s.u===u})}
 function nextAlt(){
  for(var k=0;k<D.alts.length;k++){ptr=(ptr+1)%D.alts.length;
   if(!used(D.alts[ptr].u))return D.alts[ptr]}
  return null;
 }
 function buildPost(){
  var b=slots.map(function(s){return "→ "+s.t}).join("\n"),parts=[];
  if(D.pre)parts.push(D.pre);parts.push(b);if(D.tail)parts.push(D.tail);
  return parts.join("\n");
 }
 function buildSrc(){
  var out="Sources:\n";
  slots.forEach(function(s){var t=s.t;if(t.length>62)t=t.slice(0,62).replace(/\s\S*$/,"")+"…";out+="\n→ "+t+": "+s.u});
  return out;
 }
 function rows(){
  var wrap=document.getElementById("liRollWrap"),rc=document.getElementById("liRows");
  if(!D.reroll){if(wrap)wrap.hidden=true;return}
  wrap.hidden=false;rc.innerHTML="";
  slots.forEach(function(s,i){
   var d=document.createElement("div");d.className="li-row";
   d.innerHTML='<span class="li-rn">'+(i+1)+'</span><span class="li-rt"></span>'
     +'<button class="li-re" type="button" title="Reroll this story">↻</button>';
   d.querySelector(".li-rt").textContent=s.t;
   d.querySelector(".li-re").onclick=function(){var a=nextAlt();if(a){slots[i]=a;render()}};
   rc.appendChild(d);
  });
 }
 function render(){rows();
  document.getElementById("liPost").value=buildPost();
  document.getElementById("liSrc").value=buildSrc();}
 var x=document.getElementById("liX");
 fab.onclick=function(){modal.hidden=false};
 if(x)x.onclick=function(){modal.hidden=true};
 modal.onclick=function(e){if(e.target===modal)modal.hidden=true};
 document.querySelectorAll(".li-copy").forEach(function(b){b.onclick=function(){
  var ta=document.getElementById(b.getAttribute("data-t"));if(!ta)return;ta.select();
  var done=function(){var o=b.textContent;b.textContent="Copied ✓";b.classList.add("done");setTimeout(function(){b.textContent=o;b.classList.remove("done")},1600)};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(ta.value).then(done,function(){try{document.execCommand("copy");done()}catch(e){}})}
  else{try{document.execCommand("copy");done()}catch(e){}}
 }});
 render();
}
function analytics(){
 // click-through: every outbound article click → a GoatCounter event keyed by
 // destination host (so you see WHICH sources get read). No-op until the
 // GoatCounter script is configured (config.analytics.goatcounter).
 document.addEventListener("click",function(e){
  if(!window.goatcounter||!window.goatcounter.count)return;
  var a=e.target&&e.target.closest?e.target.closest("a[href^='http']"):null;
  if(!a)return;
  try{var h=new URL(a.href).host;if(h===location.host)return;
   window.goatcounter.count({path:(window.GCPFX||"")+"out:"+h,
    title:(a.textContent||"").replace(/\s+/g," ").trim().slice(0,100),event:true});
  }catch(err){}
 });
}
function init(){filters();linkedin();analytics()}
if(document.readyState!=="loading"){init()}else{document.addEventListener("DOMContentLoaded",init)}
})();
