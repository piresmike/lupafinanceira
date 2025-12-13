import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">
              Oferta por tempo limitado
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Não Fique Para Trás.{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient">Transforme Suas Finanças Hoje</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de investidores que já estão tomando decisões mais 
            inteligentes com a Lupa Financeira. Comece agora e ganhe acesso a recursos exclusivos.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/assinatura">
                Garanta Seu Acesso Exclusivo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/assinatura">Ver Planos e Preços</Link>
            </Button>
          </div>

          {/* Trust note */}
          <p className="text-sm text-muted-foreground mt-8">
            ✓ Cancele quando quiser &nbsp;&nbsp; ✓ Sem taxa de adesão &nbsp;&nbsp; ✓ Suporte 24/7
          </p>
        </motion.div>
      </div>
    </section>
  );
}
