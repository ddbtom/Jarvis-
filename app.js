const input=document.getElementById("input"),send=document.getElementById("sendBtn"),voice=document.getElementById("voiceBtn"),messages=document.getElementById("messages"),statusText=document.getElementById("statusText");
function add(text,who){const d=document.createElement("div");d.className=`msg ${who}`;d.textContent=text;messages.appendChild(d);messages.scrollTop=messages.scrollHeight}
function speak(text){if("speechSynthesis" in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="it-IT";u.rate=.94;u.pitch=.9;speechSynthesis.speak(u)}}
function localReply(q){
 const s=q.toLowerCase();
 if(s.includes("cosa puoi fare")) return "Sono JARVIS 1.0. In questa prima versione posso conversare con te, rispondere a messaggi e parlare ad alta voce. Il prossimo modulo aggiungerà il vero motore AI, la memoria condivisa e gli strumenti.";
 if(s.includes("ricordami")) return "La memoria persistente è il prossimo modulo. Per ora questa versione è una base sicura dell'interfaccia.";
 if(s.includes("ciao")||s.includes("buonasera")) return "Buonasera. Sono JARVIS. Come posso assisterti?";
 return "Ho ricevuto la tua richiesta. Il collegamento al motore AI verrà aggiunto nel prossimo modulo.";
}
function sendMsg(){const q=input.value.trim();if(!q)return;add(q,"user");input.value="";statusText.textContent="Elaborazione…";setTimeout(()=>{const r=localReply(q);add(r,"jarvis");statusText.textContent="Come posso assisterti?";speak(r)},250)}
send.onclick=sendMsg;input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg()}});
document.querySelectorAll("[data-prompt]").forEach(b=>b.onclick=()=>{input.value=b.dataset.prompt;input.focus()});
voice.onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){statusText.textContent="Il riconoscimento vocale diretto non è disponibile in questo browser. Usa la dettatura della tastiera oppure il prossimo modulo vocale.";return}const r=new SR();r.lang="it-IT";r.interimResults=false;r.maxAlternatives=1;statusText.textContent="Ti ascolto…";r.onresult=e=>{input.value=e.results[0][0].transcript;sendMsg()};r.onerror=()=>statusText.textContent="Non sono riuscito a sentire la richiesta.";r.onend=()=>{if(statusText.textContent==="Ti ascolto…")statusText.textContent="Come posso assisterti?"};r.start()};
add("Buonasera. Sono JARVIS 1.0. Il sistema è pronto.","jarvis");
