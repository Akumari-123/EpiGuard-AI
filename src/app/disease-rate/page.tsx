"use client";

import { useState, useMemo } from "react";
import { DISEASES, REGIONS, generateMockHistory } from "@/app/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function DiseaseRatePage() {
  const [selectedRegion, setSelectedRegion] = useState("world");

  // Generate comparison data for all diseases based on selected region
  const comparisonData = useMemo(() => {
    return DISEASES.map(d => {
      const history = generateMockHistory(selectedRegion, d.id, 1);
      const latest = history[history.length - 1];
      return {
        ...d,
        latestCases: latest.cases,
        latestRt: latest.rtValue,
        risk: latest.riskScore
      };
    });
  }, [selectedRegion]);

  const regionName = REGIONS.find(r => r.id === selectedRegion)?.name || 'Global';

  return (
    <main className="container mx-auto p-6 lg:p-12 max-w-[1200px]">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-4 mb-4">
            <TrendingUp className="h-10 w-10 text-primary" />
            Transmission Rates
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Comparative analysis of transmission velocity ($R_t$) for <span className="text-primary font-bold">{regionName}</span>.
          </p>
        </div>

        <div className="w-full md:w-64 space-y-2">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
            <Globe className="h-3 w-3" /> Filter Region
          </label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full rounded-xl h-11 bg-muted/30 border-border">
              <SelectValue placeholder="Select Domain" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map(r => (
                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="grid gap-8">
        <Card className="glass-card rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-bold">Pathogen Delta Matrix: {regionName}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest">Disease Agent</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Current Active</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Reproduction ($R_t$)</TableHead>
                  <TableHead className="px-8 text-right font-black uppercase text-[10px] tracking-widest">Risk Integrity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((d) => (
                  <TableRow key={d.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="px-8 py-6 font-bold">{d.name}</TableCell>
                    <TableCell className="font-medium">{d.latestCases.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={d.latestRt > 1 ? "destructive" : "secondary"} className="rounded-lg font-bold">
                        {d.latestRt.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <Badge className={cn(
                        "rounded-lg font-bold px-4",
                        d.risk > 70 ? "bg-destructive" : d.risk > 40 ? "bg-yellow-500" : "bg-low-risk"
                      )}>
                        {d.risk > 70 ? "CRITICAL" : d.risk > 40 ? "MODERATE" : "STABLE"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
