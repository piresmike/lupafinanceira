import { motion } from "framer-motion";
import { Download, Play, FileText, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

const reports = [
  { id: 1, date: "10/12/2024", theme: "Criptomoedas", type: "Detalhado", format: "PDF + Áudio", status: "Entregue" },
  { id: 2, date: "05/12/2024", theme: "Inflação e Taxa Selic", type: "Resumido", format: "PDF", status: "Entregue" },
  { id: 3, date: "01/12/2024", theme: "Fundos Imobiliários", type: "Detalhado", format: "PDF", status: "Entregue" },
  { id: 4, date: "28/11/2024", theme: "Dólar e Câmbio", type: "Resumido", format: "PDF + Áudio", status: "Entregue" },
];

export default function Historico() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl text-foreground mb-2">Histórico de Relatórios</h1>
        <p className="text-muted-foreground">Acesse todos os seus relatórios anteriores.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Data</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Tema</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Tipo</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Formato</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="p-4 text-foreground">{report.date}</td>
                  <td className="p-4 text-foreground font-medium">{report.theme}</td>
                  <td className="p-4 text-muted-foreground">{report.type}</td>
                  <td className="p-4 text-muted-foreground">{report.format}</td>
                  <td className="p-4"><span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">{report.status}</span></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><FileText className="w-4 h-4" /></Button>
                      {report.format.includes("Áudio") && <Button variant="ghost" size="sm"><Play className="w-4 h-4" /></Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}