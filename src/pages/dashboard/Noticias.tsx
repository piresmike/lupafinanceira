import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink, Clock, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = [
  "Todas",
  "Brasil",
  "Mundo",
  "Ações",
  "Renda Fixa",
  "Criptomoedas",
  "Commodities",
  "Economia",
];

const newsData = [
  {
    id: 1,
    title: "Ibovespa fecha em alta com expectativa de corte de juros nos EUA",
    summary: "O principal índice da bolsa brasileira avançou 1,24% nesta sexta-feira, impulsionado por dados econômicos positivos.",
    source: "InfoMoney",
    time: "2 horas atrás",
    category: "Ações",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Dólar recua e fecha abaixo de R$ 5,00 pela primeira vez em 3 meses",
    summary: "A moeda americana perdeu força após dados de inflação nos EUA virem abaixo das expectativas do mercado.",
    source: "Valor Econômico",
    time: "3 horas atrás",
    category: "Economia",
    image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Bitcoin supera US$ 43 mil e renova máxima de 2024",
    summary: "A maior criptomoeda do mundo acumula alta de 150% no ano, impulsionada pela aprovação de ETFs nos EUA.",
    source: "CoinDesk",
    time: "4 horas atrás",
    category: "Criptomoedas",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    title: "Petrobras anuncia dividendos recordes para acionistas",
    summary: "Estatal distribuirá R$ 72 bilhões em dividendos referentes ao terceiro trimestre de 2024.",
    source: "Reuters",
    time: "5 horas atrás",
    category: "Ações",
    image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=400&h=250&fit=crop",
  },
  {
    id: 5,
    title: "Copom mantém Selic em 11,75% e sinaliza novos cortes em 2025",
    summary: "Banco Central indica continuidade do ciclo de afrouxamento monetário nos próximos meses.",
    source: "Banco Central",
    time: "6 horas atrás",
    category: "Economia",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
  },
  {
    id: 6,
    title: "Fundos imobiliários: FIIs de papel lideram rendimentos em 2024",
    summary: "Fundos de recebíveis imobiliários apresentam os melhores retornos do ano, superando a média do IFIX.",
    source: "FIIs.com.br",
    time: "7 horas atrás",
    category: "Renda Fixa",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
  },
];

export default function Noticias() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNews = newsData.filter((news) => {
    const matchesCategory = selectedCategory === "Todas" || news.category === selectedCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
          Notícias do Mercado
        </h1>
        <p className="text-muted-foreground">
          Acompanhe as principais notícias do mercado financeiro em tempo real.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar notícias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* News Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredNews.map((news, index) => (
          <motion.article
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-large transition-all duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {news.category}
                </span>
              </div>
            </div>

            <div className="p-5">
              <h2 className="font-heading font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {news.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {news.summary}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">{news.source}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {news.time}
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="gap-1">
                  Ler
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhuma notícia encontrada para os filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
}
