-- Tabela de cache de notícias
CREATE TABLE IF NOT EXISTS public.news_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  category TEXT,
  language TEXT DEFAULT 'pt',
  page INTEGER DEFAULT 1,
  data JSONB NOT NULL,
  total_results INTEGER,
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_news_cache_key ON public.news_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_news_cache_expires ON public.news_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_news_cache_category ON public.news_cache(category);

-- Habilitar RLS
ALTER TABLE public.news_cache ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (cache é público)
CREATE POLICY "News cache is publicly readable"
ON public.news_cache
FOR SELECT
USING (true);

-- Função para limpar cache expirado
CREATE OR REPLACE FUNCTION public.clean_expired_news_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.news_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SET search_path = public;