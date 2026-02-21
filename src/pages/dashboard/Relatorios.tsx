import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Mic, Download, Search, TrendingUp, Flame, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { jsPDF } from "jspdf";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const temasEmAlta = [
  "Criptomoedas e Blockchain",
  "ESG e Investimentos Sustentáveis",
  "Inteligência Artificial no Mercado Financeiro",
  "DeFi (Finanças Descentralizadas)",
  "Tokenização de Ativos",
  "Open Banking",
];

const temasB3 = [
  "Ibovespa",
  "Small Caps",
  "Dividendos",
  "BDRs",
  "ETFs",
  "IPOs e Follow-ons",
  "Fundos Imobiliários (FIIs)",
  "Commodities",
  "Ações de Tecnologia",
  "Mercado de Opções",
];

type Periodo = "semana" | "mes" | "trimestre" | "ano";
type TipoRelatorio = "simples" | "completo" | "aprofundado";

const periodoLabels: Record<Periodo, string> = {
  semana: "Última Semana",
  mes: "Último Mês",
  trimestre: "Último Trimestre",
  ano: "Último Ano",
};

const tipoLabels: Record<TipoRelatorio, string> = {
  simples: "Simples",
  completo: "Completo",
  aprofundado: "Aprofundado",
};

const tipoDescriptions: Record<TipoRelatorio, string> = {
  simples: "2-3 páginas, leitura rápida",
  completo: "8-10 páginas com gráficos",
  aprofundado: "15+ páginas, análise profunda",
};

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/^[-*]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n");
}

function generatePDF(content: string, keywords: string[]) {
  const doc = new jsPDF();
  const plain = stripMarkdown(content);
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Relatório Financeiro", margin, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Tema: ${keywords.join(", ")}`, margin, 33);
  doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, margin, 39);

  doc.setDrawColor(200);
  doc.line(margin, 43, pageWidth - margin, 43);

  // Body
  doc.setFontSize(11);
  doc.setTextColor(30);
  const lines = doc.splitTextToSize(plain, maxWidth);
  let y = 52;

  for (const line of lines) {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, margin, y);
    y += 6;
  }

  doc.save(`relatorio-${keywords[0]?.replace(/\s+/g, "-").toLowerCase() || "financeiro"}.pdf`);
}

function downloadAudio(content: string, keywords: string[]) {
  const plain = stripMarkdown(content);
  const utterance = new SpeechSynthesisUtterance(plain);
  utterance.lang = "pt-BR";
  utterance.rate = 0.95;

  // Try to find a Portuguese voice
  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find((v) => v.lang.startsWith("pt"));
  if (ptVoice) utterance.voice = ptVoice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);

  toast({
    title: "Reproduzindo áudio",
    description: "O relatório está sendo narrado. Use os controles do navegador para pausar.",
  });
}

export default function Relatorios() {
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>("completo");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);

  const addKeyword = (word: string) => {
    const trimmed = word.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords((prev) => [...prev, trimmed]);
    }
    setKeyword("");
  };

  const removeKeyword = (word: string) => {
    setKeywords((prev) => prev.filter((k) => k !== word));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && keyword.trim()) {
      e.preventDefault();
      addKeyword(keyword);
    }
  };

  const handleGenerate = async () => {
    if (keywords.length === 0) {
      toast({
        title: "Adicione palavras-chave",
        description: "Digite ou selecione pelo menos uma palavra-chave.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setReportContent(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-report", {
        body: { keywords, periodo, tipo: tipoRelatorio },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setReportContent(data.content);
      toast({
        title: "Relatório gerado!",
        description: "Seus arquivos estão prontos para download.",
      });
    } catch (err: any) {
      console.error("Report generation error:", err);
      toast({
        title: "Erro ao gerar relatório",
        description: err.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
          Relatórios Personalizados
        </h1>
        <p className="text-muted-foreground">
          Pesquise por palavras-chave ou escolha um tema sugerido para gerar relatórios em PDF e áudio.
        </p>
      </motion.div>

      {/* Keyword Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-card border border-border"
      >
        <h2 className="font-heading font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Palavras-Chave
        </h2>

        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Digite uma palavra-chave e pressione Enter..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button variant="outline" onClick={() => addKeyword(keyword)} disabled={!keyword.trim()}>
            Adicionar
          </Button>
        </div>

        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-secondary text-foreground"
              >
                {kw}
                <button onClick={() => removeKeyword(kw)} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Theme Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-2xl bg-card border border-border"
        >
          <h3 className="font-heading font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-accent" />
            Temas em Alta
          </h3>
          <div className="flex flex-wrap gap-2">
            {temasEmAlta.map((tema) => (
              <button
                key={tema}
                onClick={() => addKeyword(tema)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  keywords.includes(tema)
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                {tema}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-card border border-border"
        >
          <h3 className="font-heading font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Mais Buscados na B3
          </h3>
          <div className="flex flex-wrap gap-2">
            {temasB3.map((tema) => (
              <button
                key={tema}
                onClick={() => addKeyword(tema)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  keywords.includes(tema)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                {tema}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="p-6 rounded-2xl bg-card border border-border"
      >
        <h2 className="font-heading font-semibold text-lg text-foreground mb-4">Filtros</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Período</label>
            <Select value={periodo} onValueChange={(v) => setPeriodo(v as Periodo)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(periodoLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Tipo de Relatório</label>
            <Select value={tipoRelatorio} onValueChange={(v) => setTipoRelatorio(v as TipoRelatorio)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(tipoLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    <div>
                      <span className="font-medium">{label}</span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        — {tipoDescriptions[key as TipoRelatorio]}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Generate Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="hero"
          onClick={handleGenerate}
          disabled={isGenerating || keywords.length === 0}
          className="w-full sm:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gerando Relatório...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Gerar Relatório
            </>
          )}
        </Button>
      </motion.div>

      {/* Generated Report */}
      {reportContent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-card border border-primary/20 space-y-4"
        >
          <h2 className="font-heading font-semibold text-lg text-foreground">
            Relatório Gerado
          </h2>
          <p className="text-sm text-muted-foreground">
            <strong>Tema:</strong> {keywords.join(", ")} · <strong>Período:</strong>{" "}
            {periodoLabels[periodo]} · <strong>Tipo:</strong> {tipoLabels[tipoRelatorio]}
          </p>

          {/* Preview */}
          <div className="max-h-64 overflow-y-auto p-4 rounded-xl bg-secondary/50 text-sm text-foreground whitespace-pre-wrap">
            {stripMarkdown(reportContent).slice(0, 1000)}
            {reportContent.length > 1000 && "..."}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => generatePDF(reportContent, keywords)}
            >
              <FileText className="w-4 h-4 text-primary" />
              <Download className="w-4 h-4" />
              Baixar PDF
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => downloadAudio(reportContent, keywords)}
            >
              <Mic className="w-4 h-4 text-accent" />
              Ouvir Áudio
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
