(function(){
var PALETTES=[
 {id:"petrol",name:"Petrol & Coral",swatch:["#DD4B39","#C99A33","#105E58"],blurb:"Near-white · coral · sand gold · petrol teal",vars:{paper:"#F6F4EC","paper-2":"#ECEADF","paper-3":"#E2DFD1",card:"#FCFBF6",ink:"#19211F","ink-2":"#38423E","ink-3":"#6B746E","ink-4":"#98A09A",line:"#DEDBCF","rust-400":"#DD4B39","rust-500":"#B6321F","rust-600":"#8C2114","rust-100":"#F6D9D2","gold-100":"#F2E6C6","gold-200":"#E6CC8C","gold-300":"#D6B257","gold-400":"#C99A33","gold-500":"#A07818","gold-600":"#79590C","teal-100":"#CFE2DE","teal-400":"#105E58",hn:"#BD5A14","hn-100":"#F0DFC8"}},
 {id:"rust",name:"Rust Press",swatch:["#C8472B","#D99A2B","#1C5C54"],blurb:"Near-white · rust · mustard · petrol teal",vars:{paper:"#F7F3EA","paper-2":"#EDE8DB","paper-3":"#E2DBCA",card:"#FCFAF4",ink:"#201B14","ink-2":"#443C2E","ink-3":"#786B52","ink-4":"#A2937A",line:"#E0D9C9","rust-400":"#C8472B","rust-500":"#A8371F","rust-600":"#832712","rust-100":"#F4DCCD","gold-100":"#F6E8C4","gold-200":"#ECD08A","gold-300":"#DFB44E","gold-400":"#D99A2B","gold-500":"#B07814","gold-600":"#855809","teal-100":"#D2E3DD","teal-400":"#1C5C54",hn:"#C8500F","hn-100":"#F6E0CE"}},
 {id:"avocado",name:"Avocado '70s",swatch:["#C2541E","#6E7E2F","#9A6A1E"],blurb:"Near-white · olive · burnt orange · harvest gold",vars:{paper:"#F6F3E6","paper-2":"#ECE7D5","paper-3":"#E0DAC4",card:"#FBF8EE",ink:"#262316","ink-2":"#4A4528","ink-3":"#7C7450","ink-4":"#A49B6F",line:"#DED7C2","rust-400":"#C2541E","rust-500":"#9E3F12","rust-600":"#7A2F0C","rust-100":"#F3DDC6","gold-100":"#E6E8C9","gold-200":"#C8CE8E","gold-300":"#97A24A","gold-400":"#6E7E2F","gold-500":"#566625","gold-600":"#3E4A19","teal-100":"#E4D9C5","teal-400":"#5A3A1E",hn:"#9A6A1E","hn-100":"#ECE0C6"}},
 {id:"tomato",name:"Ink & Tomato",swatch:["#E23B22","#BE9836","#2E3E48"],blurb:"Stark near-white · loud tomato red · slate links",vars:{paper:"#F7F4EB","paper-2":"#ECE8DB","paper-3":"#E0DBCB",card:"#FCFAF2",ink:"#16140F","ink-2":"#38352B","ink-3":"#6E6757","ink-4":"#9B9483",line:"#E0DACA","rust-400":"#E23B22","rust-500":"#BC2A14","rust-600":"#8F1D0C","rust-100":"#F7D7CF","gold-100":"#F1E7CC","gold-200":"#E2CF98","gold-300":"#CFB266","gold-400":"#BE9836","gold-500":"#94701A","gold-600":"#6E520C","teal-100":"#D8DCDF","teal-400":"#2E3E48",hn:"#B5500F","hn-100":"#EADFC8"}}
];
function apply(id){var p=PALETTES.find(function(x){return x.id===id});if(!p)return;var r=document.documentElement;Object.keys(p.vars).forEach(function(k){r.style.setProperty("--"+k,p.vars[k])});try{localStorage.setItem("pepite-palette",id)}catch(e){}}
var saved;try{saved=localStorage.getItem("pepite-palette")}catch(e){}
var active=saved||"petrol";apply(active);
function sw(arr,w,h){return '<span class="pal-swatch">'+arr.map(function(c){return '<span style="width:'+w+'px;height:'+h+'px;background:'+c+'"></span>'}).join('')+'</span>'}
function render(){
 var fab=document.getElementById("palfab");if(!fab)return;
 var cur=PALETTES.find(function(x){return x.id===active})||PALETTES[0];
 var opts=PALETTES.map(function(p){return '<button class="pal-opt'+(p.id===active?' on':'')+'" data-p="'+p.id+'"><span class="sw">'+p.swatch.map(function(c){return '<span style="background:'+c+'"></span>'}).join('')+'</span><span><span class="nm">'+p.name+'</span><span class="bl">'+p.blurb+'</span></span></button>'}).join('');
 fab.innerHTML='<div class="pal-panel" id="palpanel" hidden><div class="pal-panel-h">Palette</div>'+opts+'</div><button class="pal-btn" id="palbtn">'+sw(cur.swatch,12,14)+'Palette</button>';
 document.getElementById("palbtn").onclick=function(){var pn=document.getElementById("palpanel");pn.hidden=!pn.hidden};
 fab.querySelectorAll(".pal-opt").forEach(function(b){b.onclick=function(){active=b.getAttribute("data-p");apply(active);render()}});
}
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
if(document.readyState!=="loading"){render();filters()}else{document.addEventListener("DOMContentLoaded",function(){render();filters()})}
})();
