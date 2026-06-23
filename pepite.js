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
 var items=(D.items||[]).map(function(it){return {h:it.h,t:it.t,u:it.u,on:!!it.on}});
 function chosen(){return items.filter(function(it){return it.on})}
 function buildPost(){
  var b=chosen().map(function(it){return "→ "+it.t}).join("\n"),parts=[];
  if(D.pre)parts.push(D.pre);if(b)parts.push(b);if(D.tail)parts.push(D.tail);
  return parts.join("\n");
 }
 function buildSrc(){
  var c=chosen();if(!c.length)return "Sources:";
  var out="Sources:\n";
  c.forEach(function(it){var t=it.h;if(t.length>62)t=t.slice(0,62).replace(/\s\S*$/,"")+"…";out+="\n→ "+t+": "+it.u});
  return out;
 }
 function update(){
  document.getElementById("liPost").value=buildPost();
  document.getElementById("liSrc").value=buildSrc();
 }
 function renderItems(){
  var rc=document.getElementById("liItems");if(!rc)return;rc.innerHTML="";
  items.forEach(function(it){
   var d=document.createElement("label");d.className="li-ck";
   d.innerHTML='<input type="checkbox"'+(it.on?" checked":"")+'><span class="li-ckt"></span>';
   d.querySelector(".li-ckt").textContent=it.h;
   d.querySelector("input").onchange=function(){it.on=this.checked;update()};
   rc.appendChild(d);
  });
 }
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
 renderItems();update();
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
