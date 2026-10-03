/*
 JARVIS NEXUS backend — Cloudflare Worker
 Required secret:
   OPENAI_API_KEY

 Optional environment variables:
   OPENAI_MODEL = gpt-6-luna
   ALLOWED_ORIGIN = https://ddbtom.github.io

 This worker intentionally does NOT contain any API key.
*/
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {status:204, headers:cors(env)});
    }

    if (url.pathname === "/api/health") {
      return json({ok:true, service:"JARVIS NEXUS CORE"}, env);
    }

    if (url.pathname !== "/api/chat" || request.method !== "POST") {
      return json({error:"Not found"}, env, 404);
    }

    try {
      const body = await request.json();
      const messages = Array.isArray(body.messages) ? body.messages.slice(-16) : [];
      if (!messages.length) return json({error:"messages required"}, env, 400);

      const system = `
You are JARVIS NEXUS, a personal AI assistant.
Speak naturally in Italian unless the user asks for another language.
Be concise by default, but detailed for study/work planning.
You can help with schedules, study plans, work plans, files and everyday tasks.
Never claim to have accessed a calendar or file unless the application actually supplied that data.
When calendar/file tools are connected later, use only the supplied information.
Your style is calm, precise, slightly futuristic, never theatrical or childish.
`;

      const input = [
        {role:"system", content:system},
        ...messages.map(m=>({role:m.role, content:String(m.content)}))
      ];

      const r = await fetch("https://api.openai.com/v1/responses", {
        method:"POST",
        headers:{
          "Authorization":`Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-6-luna",
          input
        })
      });

      const data = await r.json();
      if(!r.ok){
        return json({error:data?.error?.message || "OpenAI error"}, env, r.status);
      }

      const answer = data.output_text || extractOutput(data) || "Non ho ricevuto una risposta.";
      return json({answer}, env);
    } catch (e) {
      return json({error:e.message || "Server error"}, env, 500);
    }
  }
};

function extractOutput(data){
  try{
    return data.output?.flatMap(x=>x.content||[])
      .filter(x=>x.type==="output_text")
      .map(x=>x.text).join("\n") || "";
  }catch(_){ return ""; }
}
function cors(env){
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Headers":"Content-Type, Authorization",
    "Access-Control-Allow-Methods":"POST, OPTIONS, GET"
  };
}
function json(value,env,status=200){
  return new Response(JSON.stringify(value),{
    status,
    headers:{"Content-Type":"application/json",...cors(env)}
  });
}
