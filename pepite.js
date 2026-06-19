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
if(document.readyState!=="loading"){filters()}else{document.addEventListener("DOMContentLoaded",filters)}
})();
