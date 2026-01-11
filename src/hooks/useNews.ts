import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsResponse {
  success: boolean;
  fromCache: boolean;
  isFallback?: boolean;
  cachedAt?: string;
  message?: string;
  articles: Article[];
  totalResults: number;
  page: number;
  pageSize: number;
  error?: string;
}

interface UseNewsOptions {
  category?: string;
  language?: string;
  page?: number;
  pageSize?: number;
  q?: string;
}

export function useNews(options: UseNewsOptions = {}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [fromCache, setFromCache] = useState(false);
  const [cacheMessage, setCacheMessage] = useState('');

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        category: options.category || 'general',
        language: options.language || 'pt',
        page: String(options.page || 1),
        pageSize: String(options.pageSize || 20),
      });

      if (options.q && options.q.trim() !== '') {
        params.set('q', options.q);
      }

      const { data, error: fnError } = await supabase.functions.invoke<NewsResponse>('fetch-news', {
        body: null,
        method: 'GET',
      });

      // Since invoke doesn't support query params well, let's use fetch directly
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-news?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result: NewsResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || result.error || 'Erro ao carregar notícias');
      }

      setArticles(result.articles);
      setTotalResults(result.totalResults);
      setFromCache(result.fromCache);
      
      if (result.isFallback && result.message) {
        setCacheMessage(result.message);
      } else {
        setCacheMessage('');
      }

    } catch (err: any) {
      console.error('Erro:', err);
      setError(err.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [options.category, options.language, options.page, options.pageSize, options.q]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    articles,
    loading,
    error,
    totalResults,
    fromCache,
    cacheMessage,
    refetch: fetchNews,
  };
}

export function formatNewsDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `Há ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
  }
  if (diffHours < 24) {
    return `Há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
  }
  if (diffDays < 7) {
    return `Há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
  }
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
