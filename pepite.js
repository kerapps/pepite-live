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
 var fab=document.getElementById("liFab"),modal=document.getElementById("liModal");
 if(!fab||!modal)return;
 var x=document.getElementById("liX");
 fab.onclick=function(){modal.hidden=false};
 if(x)x.onclick=function(){modal.hidden=true};
 modal.onclick=function(e){if(e.target===modal)modal.hidden=true};
 document.querySelectorAll(".li-copy").forEach(function(b){b.onclick=function(){
  var ta=document.getElementById(b.getAttribute("data-t"));if(!ta)return;
  ta.select();
  var done=function(){var o=b.textContent;b.textContent="Copied ✓";b.classList.add("done");setTimeout(function(){b.textContent=o;b.classList.remove("done")},1600)};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(ta.value).then(done,function(){try{document.execCommand("copy");done()}catch(e){}})}
  else{try{document.execCommand("copy");done()}catch(e){}}
 }});
}
function init(){filters();linkedin()}
if(document.readyState!=="loading"){init()}else{document.addEventListener("DOMContentLoaded",init)}
})();
