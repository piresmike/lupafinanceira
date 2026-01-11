import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NEWSAPI_KEY = Deno.env.get('NEWSAPI_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const CACHE_TTL = 7200; // 2 horas em segundos

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category') || 'general';
    const language = url.searchParams.get('language') || 'pt';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    const q = url.searchParams.get('q') || '';

    console.log('📰 Fetching news:', { category, language, page, pageSize, q });

    // Criar chave única para cache
    const cacheKey = `${category}_${language}_${q || 'none'}_page${page}`;
    console.log('🔍 Cache key:', cacheKey);

    // Criar cliente Supabase com service role
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // 1. VERIFICAR CACHE VÁLIDO
    const cachedNews = await getCachedNews(supabase, cacheKey);
    
    if (cachedNews) {
      console.log('✅ Cache HIT:', cacheKey);
      return new Response(JSON.stringify({
        success: true,
        fromCache: true,
        cachedAt: cachedNews.cached_at,
        articles: cachedNews.data,
        totalResults: cachedNews.total_results,
        page: page,
        pageSize: pageSize,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('❌ Cache MISS - Buscando da API');

    // 2. BUSCAR DA NEWSAPI
    const newsData = await fetchFromNewsAPI({ category, language, page, pageSize, q });

    if (!newsData.success) {
      console.log('⚠️ Erro na API, tentando fallback...');
      
      // Tentar cache expirado como fallback
      const fallbackCache = await getFallbackCache(supabase, cacheKey);
      
      if (fallbackCache) {
        const timeAgo = getTimeAgo(fallbackCache.cached_at);
        console.log(`✅ Usando cache expirado (${timeAgo})`);
        
        return new Response(JSON.stringify({
          success: true,
          fromCache: true,
          isFallback: true,
          cachedAt: fallbackCache.cached_at,
          message: `Exibindo versão arquivada de ${timeAgo} devido a instabilidades na rede`,
          articles: fallbackCache.data,
          totalResults: fallbackCache.total_results,
          page: page,
          pageSize: pageSize,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Sem cache disponível
      return new Response(JSON.stringify({
        success: false,
        error: newsData.error,
        message: 'Não foi possível carregar as notícias. Tente novamente em alguns minutos.',
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. SALVAR NO CACHE
    await saveToCache(supabase, cacheKey, {
      category,
      language,
      page,
      data: newsData.articles,
      total_results: newsData.totalResults,
    });

    // 4. RETORNAR DADOS FRESCOS
    console.log('✅ Dados frescos da API');
    return new Response(JSON.stringify({
      success: true,
      fromCache: false,
      articles: newsData.articles,
      totalResults: newsData.totalResults,
      page: page,
      pageSize: pageSize,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('❌ Erro geral:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      message: 'Erro interno do servidor',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// ============================================
// FUNÇÃO: BUSCAR DA NEWSAPI
// ============================================
async function fetchFromNewsAPI({ category, language, page, pageSize, q }: {
  category: string;
  language: string;
  page: number;
  pageSize: number;
  q: string;
}) {
  try {
    let baseUrl = 'https://newsapi.org/v2/';
    const params = new URLSearchParams({
      apiKey: NEWSAPI_KEY!,
      language: language,
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    // Se tiver busca, usar endpoint "everything"
    if (q && q.trim() !== '') {
      baseUrl += 'everything';
      params.set('q', `${q} AND (finanças OR economia OR investimentos OR bolsa OR ações OR mercado)`);
      params.set('sortBy', 'publishedAt');
    } else {
      // Senão, usar "top-headlines" com país Brasil
      baseUrl += 'top-headlines';
      params.set('country', 'br');
      
      // Categoria só funciona em top-headlines
      if (category !== 'general') {
        params.set('category', category);
      }
    }

    console.log('🌐 Fetching:', baseUrl + '?' + params.toString().replace(NEWSAPI_KEY!, '[REDACTED]'));

    const response = await fetch(baseUrl + '?' + params.toString(), {
      headers: {
        'User-Agent': 'LupaFinanceira/1.0',
      },
    });

    const data = await response.json();

    if (data.status === 'error') {
      console.error('NewsAPI Error:', data);
      throw new Error(data.message || 'Erro ao buscar notícias');
    }

    console.log(`✅ NewsAPI retornou ${data.articles?.length || 0} artigos`);

    return {
      success: true,
      articles: data.articles || [],
      totalResults: data.totalResults || 0,
    };

  } catch (error: unknown) {
    console.error('❌ Erro ao buscar da NewsAPI:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ============================================
// FUNÇÃO: BUSCAR CACHE VÁLIDO
// ============================================
async function getCachedNews(supabase: any, cacheKey: string) {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('news_cache')
      .select('*')
      .eq('cache_key', cacheKey)
      .gt('expires_at', now)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar cache:', error);
    return null;
  }
}

// ============================================
// FUNÇÃO: BUSCAR CACHE EXPIRADO (FALLBACK)
// ============================================
async function getFallbackCache(supabase: any, cacheKey: string) {
  try {
    const { data, error } = await supabase
      .from('news_cache')
      .select('*')
      .eq('cache_key', cacheKey)
      .order('cached_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar fallback:', error);
    return null;
  }
}

// ============================================
// FUNÇÃO: SALVAR NO CACHE
// ============================================
async function saveToCache(supabase: any, cacheKey: string, newsData: {
  category: string;
  language: string;
  page: number;
  data: any[];
  total_results: number;
}) {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_TTL * 1000);

    const { error } = await supabase
      .from('news_cache')
      .upsert(
        {
          cache_key: cacheKey,
          category: newsData.category,
          language: newsData.language,
          page: newsData.page,
          data: newsData.data,
          total_results: newsData.total_results,
          cached_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        },
        {
          onConflict: 'cache_key',
        }
      );

    if (error) {
      console.error('❌ Erro ao salvar cache:', error);
    } else {
      console.log('💾 Cache salvo com sucesso');
    }
  } catch (error) {
    console.error('❌ Erro ao salvar cache:', error);
  }
}

// ============================================
// FUNÇÃO: CALCULAR TEMPO ATRÁS
// ============================================
function getTimeAgo(timestamp: string) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
  }
  if (diffHours > 0) {
    return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
  }
  return `${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''} atrás`;
}
