import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Mic, Mail, MessageCircle, Send, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const themes = {
  classicos: [
    "Inflação e Taxa Selic",
    "Bolsa de Valores (Ibovespa)",
    "Dólar e Câmbio",
    "Fundos Imobiliários",
    "Renda Fixa",
    "Previdência Privada",
    "Tesouro Direto",
  ],
  emAlta: [
    "Criptomoedas e Blockchain",
    "ESG e Investimentos Sustentáveis",
    "Startups e Venture Capital",
    "Inteligência Artificial no Mercado Financeiro",
    "DeFi (Finanças Descentralizadas)",
    "Tokenização de Ativos",
    "Open Banking",
  ],
};

export default function Relatorios() {
  const [step, setStep] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [reportType, setReportType] = useState("resumido");
  const [formats, setFormats] = useState<string[]>(["pdf"]);
  const [channels, setChannels] = useState<string[]>(["email"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleFormatToggle = (format: string) => {
    setFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  const handleChannelToggle = (channel: string) => {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  const handleGenerate = () => {
    if (!selectedTheme) {
      toast({
        title: "Selecione um tema",
        description: "Por favor, escolha um tema para seu relatório.",
        variant: "destructive",
      });
      return;
    }

    if (formats.length === 0) {
      toast({
        title: "Selecione um formato",
        description: "Por favor, escolha pelo menos um formato.",
        variant: "destructive",
      });
      return;
    }

    if (channels.length === 0) {
      toast({
        title: "Selecione um canal",
        description: "Por favor, escolha pelo menos um canal de entrega.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      toast({
        title: "Relatório gerado com sucesso!",
        description: "Seu relatório será enviado em até 5 minutos.",
      });
    }, 2000);
  };

  const resetForm = () => {
    setSelectedTheme("");
    setReportType("resumido");
    setFormats(["pdf"]);
    setChannels(["email"]);
    setStep(1);
    setIsGenerated(false);
  };

  if (isGenerated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-12"
      >
        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-accent" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-4">
          Relatório Solicitado!
        </h2>
        <p className="text-muted-foreground mb-8">
          Seu relatório sobre <strong>{selectedTheme}</strong> está sendo gerado 
          e será enviado em até 5 minutos pelos canais selecionados.
        </p>
        <Button variant="hero" onClick={resetForm}>
          Gerar Novo Relatório
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
          Relatórios Personalizados
        </h1>
        <p className="text-muted-foreground">
          Escolha um tema e receba análises detalhadas diretamente no seu canal preferido.
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2"
      >
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`w-12 h-1 mx-1 rounded-full transition-colors ${
                  step > s ? "bg-primary" : "bg-secondary"
                }`}
              />
            )}
          </div>
        ))}
      </motion.div>

      {/* Step 1: Theme Selection */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h2 className="font-heading font-semibold text-lg text-foreground mb-4">
              Passo 1: Escolha o Tema
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Temas Clássicos
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {themes.classicos.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSelectedTheme(theme)}
                      className={`p-3 rounded-xl text-sm text-left transition-all ${
                        selectedTheme === theme
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80 text-foreground"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Temas em Alta
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {themes.emAlta.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSelectedTheme(theme)}
                      className={`p-3 rounded-xl text-sm text-left transition-all ${
                        selectedTheme === theme
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80 text-foreground"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="hero"
            onClick={() => setStep(2)}
            disabled={!selectedTheme}
          >
            Próximo Passo
          </Button>
        </motion.div>
      )}

      {/* Step 2: Report Type */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h2 className="font-heading font-semibold text-lg text-foreground mb-4">
              Passo 2: Tipo de Relatório
            </h2>

            <RadioGroup value={reportType} onValueChange={setReportType}>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50">
                  <RadioGroupItem value="resumido" id="resumido" />
                  <Label htmlFor="resumido" className="cursor-pointer">
                    <span className="font-medium text-foreground">Resumido</span>
                    <p className="text-sm text-muted-foreground">
                      2-3 páginas, leitura rápida e objetiva
                    </p>
                  </Label>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50">
                  <RadioGroupItem value="detalhado" id="detalhado" />
                  <Label htmlFor="detalhado" className="cursor-pointer">
                    <span className="font-medium text-foreground">Detalhado</span>
                    <p className="text-sm text-muted-foreground">
                      10+ páginas, análise profunda com gráficos
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button variant="hero" onClick={() => setStep(3)}>
              Próximo Passo
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Format */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h2 className="font-heading font-semibold text-lg text-foreground mb-4">
              Passo 3: Formato
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                <Checkbox
                  id="pdf"
                  checked={formats.includes("pdf")}
                  onCheckedChange={() => handleFormatToggle("pdf")}
                />
                <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">PDF</span>
                </Label>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                <Checkbox
                  id="audio"
                  checked={formats.includes("audio")}
                  onCheckedChange={() => handleFormatToggle("audio")}
                />
                <Label htmlFor="audio" className="flex items-center gap-2 cursor-pointer">
                  <Mic className="w-5 h-5 text-accent" />
                  <span className="font-medium text-foreground">Áudio (narração profissional)</span>
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)}>
              Voltar
            </Button>
            <Button variant="hero" onClick={() => setStep(4)}>
              Próximo Passo
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Delivery Channel */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h2 className="font-heading font-semibold text-lg text-foreground mb-4">
              Passo 4: Canal de Entrega
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                <Checkbox
                  id="email"
                  checked={channels.includes("email")}
                  onCheckedChange={() => handleChannelToggle("email")}
                />
                <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">E-mail</span>
                </Label>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                <Checkbox
                  id="whatsapp"
                  checked={channels.includes("whatsapp")}
                  onCheckedChange={() => handleChannelToggle("whatsapp")}
                />
                <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer">
                  <MessageCircle className="w-5 h-5 text-accent" />
                  <span className="font-medium text-foreground">WhatsApp</span>
                </Label>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                <Checkbox
                  id="telegram"
                  checked={channels.includes("telegram")}
                  onCheckedChange={() => handleChannelToggle("telegram")}
                />
                <Label htmlFor="telegram" className="flex items-center gap-2 cursor-pointer">
                  <Send className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Telegram</span>
                </Label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <h3 className="font-medium text-foreground mb-2">Resumo</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Tema: <strong>{selectedTheme}</strong></li>
              <li>• Tipo: <strong>{reportType === "resumido" ? "Resumido" : "Detalhado"}</strong></li>
              <li>• Formatos: <strong>{formats.join(", ").toUpperCase()}</strong></li>
              <li>• Canais: <strong>{channels.join(", ")}</strong></li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(3)}>
              Voltar
            </Button>
            <Button variant="hero" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  Gerar Relatório Agora
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
