import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return { user, supabase };
}

async function requireActiveSubscription(userId: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: sub, error } = await supabase
    .from("subscriptions")
    .select("status, expires_at")
    .eq("user_id", userId)
    .eq("status", "approved")
    .gt("expires_at", new Date().toISOString())
    .limit(1)
    .maybeSingle();

  if (error || !sub) {
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const auth = await getAuthenticatedUser(req);
    if (!auth) {
      return new Response(
        JSON.stringify({ error: "Autenticação necessária" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check active subscription
    const hasSubscription = await requireActiveSubscription(auth.user.id);
    if (!hasSubscription) {
      return new Response(
        JSON.stringify({ error: "Assinatura ativa necessária para gerar relatórios" }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { keywords, periodo, tipo } = await req.json();

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0 || keywords.length > 10) {
      return new Response(
        JSON.stringify({ error: "Palavras-chave são obrigatórias (máximo 10)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate inputs
    const validPeriodos = ["semana", "mes", "trimestre", "ano"];
    const validTipos = ["simples", "completo", "aprofundado"];
    const safePeriodo = validPeriodos.includes(periodo) ? periodo : "mes";
    const safeTipo = validTipos.includes(tipo) ? tipo : "completo";
    const safeKeywords = keywords.map((k: unknown) => String(k).slice(0, 100).replace(/[<>]/g, ""));

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Serviço temporariamente indisponível" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tipoDesc: Record<string, string> = {
      simples: "um resumo curto de 2-3 parágrafos",
      completo: "uma análise completa com 6-8 parágrafos, incluindo dados e tendências",
      aprofundado: "uma análise aprofundada e detalhada com 10+ parágrafos, incluindo dados históricos, tendências, projeções e recomendações",
    };

    const periodoDesc: Record<string, string> = {
      semana: "da última semana",
      mes: "do último mês",
      trimestre: "do último trimestre",
      ano: "do último ano",
    };

    const prompt = `Você é um analista financeiro especializado no mercado brasileiro. Escreva ${tipoDesc[safeTipo]} sobre o(s) tema(s): ${safeKeywords.join(", ")}.

Foque no período ${periodoDesc[safePeriodo]}.

O relatório deve:
- Ser escrito em português brasileiro formal
- Incluir dados e números relevantes (mesmo estimados)
- Ter um título principal claro
- Usar subtítulos para organizar as seções
- Incluir uma conclusão com perspectivas futuras
- Ser relevante para investidores brasileiros

Formato: Use markdown com títulos (##), subtítulos (###), listas e negrito onde apropriado.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Você é um analista financeiro sênior especializado no mercado brasileiro." },
          { role: "user", content: prompt },
        ],
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI Gateway error:", errText);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar relatório. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Não foi possível gerar o relatório.";

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
