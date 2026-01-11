import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink, Clock, RefreshCw, AlertCircle, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatNewsDate } from "@/hooks/useNews";

const CATEGORIES = [
  { id: "general", label: "Todas", icon: "📰" },
  { id: "business", label: "Negócios", icon: "💼" },
  { id: "technology", label: "Tecnologia", icon: "💻" },
  { id: "science", label: "Ciência", icon: "🔬" },
  { id: "health", label: "Saúde", icon: "🏥" },
  { id: "sports", label: "Esportes", icon: "⚽" },
  { id: "entertainment", label: "Entretenimento", icon: "🎬" },
];

const PAGE_SIZE = 20;

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

export default function Noticias() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [fromCache, setFromCache] = useState(false);
  const [cacheMessage, setCacheMessage] = useState("");

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        language: "pt",
        page: String(currentPage),
        pageSize: String(PAGE_SIZE),
      });

      if (searchQuery.trim() !== "") {
        params.set("q", searchQuery);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-news?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || result.error || "Erro ao carregar notícias");
      }

      setArticles(result.articles);
      setTotalResults(result.totalResults);
      setFromCache(result.fromCache);

      if (result.isFallback && result.message) {
        setCacheMessage(result.message);
      } else {
        setCacheMessage("");
      }
    } catch (err: any) {
      console.error("Erro:", err);
      setError(err.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentPage, searchQuery]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    setSearchQuery("");
    setSearchInput("");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalResults / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
            📰 Notícias do Mercado Financeiro
          </h1>
          <p className="text-muted-foreground">
            Fique por dentro das últimas notícias de finanças e economia do Brasil
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchNews}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </motion.div>

      {/* Cache Message */}
      {cacheMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-200">{cacheMessage}</p>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {/* Search */}
        <form onSubmit={handleSearch} className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar notícias..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 pr-24"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            disabled={loading}
          >
            Buscar
          </Button>
        </form>

        {searchQuery && (
          <button
            onClick={clearSearch}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            ✕ Limpar busca: "{searchQuery}"
          </button>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(cat.id)}
              disabled={loading}
              className="gap-1"
            >
              <span>{cat.icon}</span>
              {cat.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Cache Badge */}
      {fromCache && !cacheMessage && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Carregado do cache (atualizado recentemente)
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Erro ao Carregar Notícias</h3>
          <p className="text-muted-foreground mb-4 max-w-md">{error}</p>
          <Button onClick={fetchNews} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && articles.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Newspaper className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Nenhuma notícia encontrada</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? `Não encontramos resultados para "${searchQuery}"`
              : "Tente selecionar outra categoria"}
          </p>
        </motion.div>
      )}

      {/* News Grid */}
      {!loading && !error && articles.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {articles.map((article, index) => (
              <NewsCard key={`${article.url}-${index}`} article={article} index={index} />
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    if (pageNum < 1 || pageNum > totalPages) return null;

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      className={
                        currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <p className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * PAGE_SIZE + 1} -{" "}
                {Math.min(currentPage * PAGE_SIZE, totalResults)} de{" "}
                {totalResults.toLocaleString("pt-BR")} resultados
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE: CARD DE NOTÍCIA
// ============================================
function NewsCard({ article, index }: { article: Article; index: number }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-large transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        {article.urlToImage && !imageError ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="w-12 h-12 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            {article.source?.name || "Fonte"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Clock className="w-3 h-3" />
          {formatNewsDate(article.publishedAt)}
        </div>

        <h2 className="font-heading font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h2>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {article.description || article.content?.substring(0, 150) || "Sem descrição disponível."}
        </p>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition-all group-hover:gap-3"
        >
          Ler notícia completa
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.article>
  );
}
