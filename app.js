const input = document.getElementById("input");
const send = document.getElementById("send");
const mic = document.getElementById("mic");
const conversation = document.getElementById("conversation");
const orb = document.getElementById("orb");

function addMessage(text, who="jarvis"){
  const article=document.createElement("article");
  article.className=`message ${who}`;
  article.innerHTML=who==="jarvis"
    ? `<div class="avatar">J</div><div><div class="label">JARVIS</div><div class="bubble"></div></div>`
    : `<div><div class="bubble"></div></div>`;
  article.querySelector(".bubble").textContent=text;
  conversation.appendChild(article);
  conversation.scrollTop=conversation.scrollHeight;
  if(who==="jarvis") speak(text);
}

function speak(text){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang="it-IT"; u.rate=.96; u.pitch=.92;
  speechSynthesis.speak(u);
}

function localReply(text){
  const t=text.toLowerCase();
  if(t.includes("cosa puoi fare")) return "Posso diventare il tuo assistente personale: conversazione, voce, memoria, web, promemoria e automazioni. Il prossimo modulo collegherà il mio cervello AI e i Comandi Rapidi di iPhone.";
  if(t.includes("memoria") || t.includes("ricordi")) return "Il modulo memoria è in preparazione. Quando sarà collegato, potrò conservare solo le informazioni che deciderai di affidarmi.";
  if(t.includes("aiut")) return "Certamente. Dimmi cosa vuoi ottenere e penserò io ai passaggi necessari.";
  return "Ricevuto. Il mio motore AI non è ancora collegato a questa interfaccia: questa versione è pronta per il collegamento del backend.";
}

function submit(){
  const text=input.value.trim();
  if(!text) return;
  addMessage(text,"user");
  input.value="";
  input.style.height="auto";
  setTimeout(()=>addMessage(localReply(text)),420);
}

send.addEventListener("click",submit);
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit()}});
input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,100)+"px"});

document.querySelectorAll("[data-prompt]").forEach(b=>b.addEventListener("click",()=>{input.value=b.dataset.prompt;submit()}));

let recognition=null;
if("SpeechRecognition" in window || "webkitSpeechRecognition" in window){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  recognition=new SR();
  recognition.lang="it-IT"; recognition.interimResults=false; recognition.continuous=false;
  recognition.onstart=()=>{mic.style.boxShadow="0 0 25px rgba(111,231,255,.7)";orb.classList.add("listening")};
  recognition.onend=()=>{mic.style.boxShadow="";orb.classList.remove("listening")};
  recognition.onresult=e=>{input.value=e.results[0][0].transcript;submit()};
}
mic.addEventListener("click",()=>{
  if(!recognition){addMessage("La dettatura vocale non è disponibile in questo browser. Prova ad aprire JARVIS in Safari.");return}
  try{recognition.start()}catch(_){}
});
