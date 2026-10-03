const API_URL = "https://jarvis-ai.ddbtom.workers.dev/api/chat";

const input = document.getElementById("input");
const send = document.getElementById("send");
const mic = document.getElementById("mic");
const conversation = document.getElementById("conversation");
const orb = document.getElementById("orb");

const history = [];

function addMessage(text, who = "jarvis", speakIt = true) {
  const article = document.createElement("article");
  article.className = `message ${who}`;

  article.innerHTML = who === "jarvis"
    ? `<div class="avatar">J</div><div><div class="label">JARVIS</div><div class="bubble"></div></div>`
    : `<div><div class="bubble"></div></div>`;

  article.querySelector(".bubble").textContent = text;
  conversation.appendChild(article);
  conversation.scrollTop = conversation.scrollHeight;

  if (who === "jarvis" && speakIt) speak(text);
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT";
  u.rate = 0.96;
  u.pitch = 0.92;

  speechSynthesis.speak(u);
}

function setBusy(busy) {
  send.disabled = busy;
  mic.disabled = busy;
  input.disabled = busy;

  if (busy) {
    orb.classList.add("thinking");
  } else {
    orb.classList.remove("thinking");
  }
}

async function askJarvis(text) {
  history.push({
    role: "user",
    content: text
  });

  const messages = history.slice(-12);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: messages
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!data.answer || typeof data.answer !== "string") {
    throw new Error("Invalid AI response");
  }

  history.push({
    role: "assistant",
    content: data.answer
  });

  return data.answer;
}

async function submit() {
  const text = input.value.trim();

  if (!text || send.disabled) return;

  addMessage(text, "user", false);

  input.value = "";
  input.style.height = "auto";

  setBusy(true);

  addMessage("Un momento…", "jarvis", false);

  const thinkingBubble =
    conversation.lastElementChild.querySelector(".bubble");

  try {
    const answer = await askJarvis(text);

    thinkingBubble.textContent = answer;
    speak(answer);

  } catch (error) {
    console.error("JARVIS connection error:", error);

    const fallback =
      "Mi dispiace, al momento non riesco a raggiungere il mio motore AI. Riprova tra poco.";

    thinkingBubble.textContent = fallback;
    speak(fallback);

    history.pop();

  } finally {
    setBusy(false);
    input.focus();
  }
}

send.addEventListener("click", submit);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    submit();
  }
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height =
    Math.min(input.scrollHeight, 100) + "px";
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.prompt || "";
    submit();
  });
});

let recognition = null;

if (
  "SpeechRecognition" in window ||
  "webkitSpeechRecognition" in window
) {
  const SR =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  recognition = new SR();

  recognition.lang = "it-IT";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = () => {
    mic.style.boxShadow =
      "0 0 25px rgba(111,231,255,.7)";

    orb.classList.add("listening");
  };

  recognition.onend = () => {
    mic.style.boxShadow = "";
    orb.classList.remove("listening");
  };

  recognition.onerror = () => {
    mic.style.boxShadow = "";
    orb.classList.remove("listening");
  };

  recognition.onresult = (e) => {
    input.value =
      e.results[0][0].transcript;

    submit();
  };
}

mic.addEventListener("click", () => {
  if (!recognition) {
    addMessage(
      "La dettatura vocale non è disponibile in questo browser. Prova ad aprire JARVIS in Safari."
    );
    return;
  }

  try {
    recognition.start();
  } catch (_) {}
});
