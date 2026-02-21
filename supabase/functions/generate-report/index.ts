const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keywords, periodo, tipo } = await req.json();

    if (!keywords || keywords.length === 0) {
      return new Response(
        JSON.stringify({ error: "Palavras-chave são obrigatórias" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    const prompt = `Você é um analista financeiro especializado no mercado brasileiro. Escreva ${tipoDesc[tipo] || tipoDesc.completo} sobre o(s) tema(s): ${keywords.join(", ")}.

Foque no período ${periodoDesc[periodo] || periodoDesc.mes}.

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
        JSON.stringify({ error: "Erro ao gerar relatório" }),
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
