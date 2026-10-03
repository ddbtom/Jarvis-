/*
 JARVIS NEXUS — browser client
 IMPORTANT: never put an OpenAI API key in this file.
 Set API_URL to your HTTPS backend.
*/
const API_URL = "https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/api/chat";
const input = document.getElementById("input");
const send = document.getElementById("send");
const mic = document.getElementById("mic");
const conversation = document.getElementById("conversation");
const reactor = document.getElementById("reactor");
const stateLabel = document.getElementById("stateLabel");
const statusText = document.getElementById("statusText");

const history = [];
let recognition = null;
let selectedVoice = null;

function setState(state){
  reactor.classList.remove("thinking","listening","speaking");
  if(state !== "STANDBY") reactor.classList.add(state.toLowerCase());
  stateLabel.textContent = state;
}

function addMessage(text, who="jarvis", speakIt=false){
  const article = document.createElement("article");
  article.className = `message ${who}`;
  article.innerHTML = who === "jarvis"
    ? `<div class="avatar">J</div><div><div class="label">JARVIS</div><div class="bubble"></div></div>`
    : `<div><div class="bubble"></div></div>`;
  article.querySelector(".bubble").textContent = text;
  conversation.appendChild(article);
  conversation.scrollTop = conversation.scrollHeight;
  if(who === "jarvis" && speakIt) speak(text);
  return article.querySelector(".bubble");
}

function pickVoice(){
  if(!("speechSynthesis" in window)) return null;
  const voices = speechSynthesis.getVoices();
  const it = voices.filter(v => /^it(-|_)/i.test(v.lang));
  const preferred = [...it,...voices].find(v =>
    /male|masch|luca|diego|giorgio|federico|marco|alfonso|paolo|andrea/i.test(v.name)
  );
  return preferred || it[0] || voices[0] || null;
}
if("speechSynthesis" in window){
  selectedVoice = pickVoice();
  speechSynthesis.onvoiceschanged = () => selectedVoice = pickVoice();
}

function speak(text){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT";
  u.rate = .94;
  u.pitch = .72; // lower pitch; actual voice gender depends on installed system voice
  if(selectedVoice) u.voice = selectedVoice;
  u.onstart = () => setState("SPEAKING");
  u.onend = () => setState("STANDBY");
  u.onerror = () => setState("STANDBY");
  speechSynthesis.speak(u);
}

function setBusy(busy){
  send.disabled = busy;
  input.disabled = busy;
  if(busy) setState("THINKING"); else setState("STANDBY");
}

async function askJarvis(text){
  history.push({role:"user",content:text});
  const response = await fetch(API_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({messages:history.slice(-16)})
  });
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if(!data.answer) throw new Error("Invalid AI response");
  history.push({role:"assistant",content:data.answer});
  return data.answer;
}

async function submit(){
  const text = input.value.trim();
  if(!text || send.disabled) return;
  addMessage(text,"user",false);
  input.value = "";
  input.style.height = "auto";
  setBusy(true);
  const bubble = addMessage("Elaborazione in corso…","jarvis",false);
  try{
    const answer = await askJarvis(text);
    bubble.textContent = answer;
    speak(answer);
  }catch(err){
    console.error(err);
    bubble.textContent = "Non riesco a raggiungere il mio motore AI. Controlla il backend e riprova.";
    speak(bubble.textContent);
  }finally{
    setBusy(false);
    input.focus();
  }
}

send.addEventListener("click",submit);
input.addEventListener("keydown",e=>{
  if(e.key==="Enter" && !e.shiftKey){e.preventDefault();submit();}
});
input.addEventListener("input",()=>{
  input.style.height="auto";
  input.style.height=Math.min(input.scrollHeight,120)+"px";
});
document.querySelectorAll("[data-prompt]").forEach(b=>{
  b.addEventListener("click",()=>{input.value=b.dataset.prompt;submit();});
});

/* Browser voice input. This is NOT an always-on Hey Jarvis listener.
   iOS/browser security requires a user gesture. */
if("SpeechRecognition" in window || "webkitSpeechRecognition" in window){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = "it-IT";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.onstart = ()=>{
    mic.classList.add("active");
    setState("LISTENING");
    statusText.textContent = "LISTENING";
  };
  recognition.onend = ()=>{
    mic.classList.remove("active");
    statusText.textContent = "ONLINE";
    if(!send.disabled) setState("STANDBY");
  };
  recognition.onerror = ()=>{
    mic.classList.remove("active");
    statusText.textContent = "ONLINE";
    setState("STANDBY");
  };
  recognition.onresult = e=>{
    input.value = e.results[0][0].transcript;
    submit();
  };
}
mic.addEventListener("click",()=>{
  if(!recognition){
    addMessage("Il riconoscimento vocale del browser non è disponibile. Usa Safari oppure la futura app nativa JARVIS.");
    return;
  }
  try{ recognition.start(); }catch(_){}
});

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error));
}
