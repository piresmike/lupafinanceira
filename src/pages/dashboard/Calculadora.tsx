import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator as CalcIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function Calculadora() {
  const [initialValue, setInitialValue] = useState(1000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(500);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState([10]);

  const result = useMemo(() => {
    const months = years[0] * 12;
    const monthlyRate = annualRate / 100 / 12;
    let total = initialValue;
    let totalInvested = initialValue;

    for (let i = 0; i < months; i++) {
      total = total * (1 + monthlyRate) + monthlyDeposit;
      totalInvested += monthlyDeposit;
    }

    return {
      total: total,
      invested: totalInvested,
      interest: total - totalInvested,
    };
  }, [initialValue, monthlyDeposit, annualRate, years]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl text-foreground mb-2">Calculadora de Juros Compostos</h1>
        <p className="text-muted-foreground">Simule o crescimento do seu patrimônio ao longo do tempo.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border space-y-6">
          <div className="space-y-2">
            <Label>Valor Inicial (R$)</Label>
            <Input type="number" value={initialValue} onChange={(e) => setInitialValue(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Aporte Mensal (R$)</Label>
            <Input type="number" value={monthlyDeposit} onChange={(e) => setMonthlyDeposit(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Taxa de Juros (% ao ano)</Label>
            <Input type="number" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Período: {years[0]} anos</Label>
            </div>
            <Slider value={years} onValueChange={setYears} min={1} max={50} step={1} />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-primary text-primary-foreground">
          <CalcIcon className="w-10 h-10 mb-4 opacity-80" />
          <h3 className="font-heading font-semibold text-lg mb-6">Resultado da Simulação</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary-foreground/10">
              <p className="text-sm opacity-80">Valor Total Acumulado</p>
              <p className="font-heading font-bold text-3xl">{formatCurrency(result.total)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary-foreground/10">
                <p className="text-sm opacity-80">Total Investido</p>
                <p className="font-heading font-bold text-xl">{formatCurrency(result.invested)}</p>
              </div>
              <div className="p-4 rounded-xl bg-primary-foreground/10">
                <p className="text-sm opacity-80">Rendimento (Juros)</p>
                <p className="font-heading font-bold text-xl">{formatCurrency(result.interest)}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}