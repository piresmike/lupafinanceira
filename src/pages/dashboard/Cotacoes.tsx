import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, TrendingUp, TrendingDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const stocks = [
  { symbol: "PETR4", name: "Petrobras PN", price: 38.45, change: 2.34, changePercent: 6.48 },
  { symbol: "VALE3", name: "Vale ON", price: 67.82, change: -1.23, changePercent: -1.78 },
  { symbol: "ITUB4", name: "Itaú Unibanco PN", price: 32.15, change: 0.87, changePercent: 2.78 },
  { symbol: "BBDC4", name: "Bradesco PN", price: 14.23, change: -0.32, changePercent: -2.20 },
  { symbol: "WEGE3", name: "Weg ON", price: 35.67, change: 1.45, changePercent: 4.24 },
];

const indices = [
  { symbol: "IBOV", name: "Ibovespa", value: "127.450", change: "+1.24%" },
  { symbol: "S&P500", name: "S&P 500", value: "4.783", change: "+0.45%" },
  { symbol: "DJIA", name: "Dow Jones", value: "37.545", change: "+0.38%" },
  { symbol: "NASDAQ", name: "Nasdaq", value: "15.074", change: "+0.67%" },
];

export default function Cotacoes() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl text-foreground mb-2">Painel de Cotações</h1>
        <p className="text-muted-foreground">Acompanhe seus ativos favoritos em tempo real.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((index) => (
          <div key={index.symbol} className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">{index.name}</p>
            <p className="font-heading font-bold text-xl text-foreground">{index.value}</p>
            <p className={index.change.startsWith("+") ? "text-accent text-sm" : "text-destructive text-sm"}>{index.change}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg text-foreground">Minha Watchlist</h2>
          <Button size="sm"><Plus className="w-4 h-4 mr-1" />Adicionar</Button>
        </div>
        <div className="space-y-3">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <div>
                <p className="font-heading font-semibold text-foreground">{stock.symbol}</p>
                <p className="text-sm text-muted-foreground">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-heading font-bold text-foreground">R$ {stock.price.toFixed(2)}</p>
                <div className={`flex items-center justify-end gap-1 text-sm ${stock.change >= 0 ? "text-accent" : "text-destructive"}`}>
                  {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {stock.changePercent > 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}