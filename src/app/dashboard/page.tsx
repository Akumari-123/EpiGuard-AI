
"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Activity, 
  Users, 
  Search,
  Download,
  Loader2,
  Zap,
  TrendingUp,
  SlidersHorizontal,
  Biohazard,
  ShieldAlert,
  Target,
  BrainCircuit,
  Binary,
  Cpu,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { StatCard } from "@/components/dashboard/StatCard";
import { CaseTrendChart } from "@/components/dashboard/CaseTrendChart";
import { ComparisonCharts } from "@/components/dashboard/ComparisonCharts";
import { RiskMap } from "@/components/map/RiskMap";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { REGIONS, DISEASES, generateMockHistory, generateMockPredictions, type DataPoint } from "@/app/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AIDataScienceAgent } from "@/components/dashboard/AIDataScienceAgent";

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState("world");
  const [selectedDisease, setSelectedDisease] = useState("covid19");
  const [forecastHorizon, setForecastHorizon] = useState("30");
  const [mobilityPolicy, setMobilityPolicy] = useState(100);
  const [history, setHistory] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const data = generateMockHistory(selectedRegion, selectedDisease, 60);
      setHistory(data);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedRegion, selectedDisease]);

  const predictions = useMemo(() => {
    if (history.length === 0) return [];
    return generateMockPredictions(history, selectedDisease, parseInt(forecastHorizon), mobilityPolicy);
  }, [history, selectedDisease, forecastHorizon, mobilityPolicy]);

  const combinedData = useMemo(() => [...history, ...predictions], [history, predictions]);

  const regionalPathogenMatrix = useMemo(() => {
    return DISEASES.map(d => {
      const data = generateMockHistory(selectedRegion, d.id, 1);
      const latest = data[data.length - 1];
      return {
        ...d,
        cases: latest.cases,
        rt: latest.rtValue,
        risk: latest.riskScore
      };
    });
  }, [selectedRegion]);

  const stats = useMemo(() => {
    if (history.length === 0) return null;
    const last = history[history.length - 1];
    const prev = history[history.length - 8] || history[0];
    const lastPredicted = predictions[predictions.length - 1]?.predictedCases || 0;
    
    const calculateTrend = (curr: number, old: number) => {
      const diff = ((curr - old) / old) * 100;
      return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
    };

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (last.rtValue > 1.2 || last.riskScore > 70) riskLevel = 'HIGH';
    else if (last.rtValue > 0.9 || last.riskScore > 40) riskLevel = 'MEDIUM';

    return {
      totalCases: last.cases,
      predictedCases: lastPredicted,
      riskLevel,
      caseTrend: calculateTrend(last.cases, prev.cases),
      rtValue: last.rtValue,
      modelAccuracy: 88.4,
      rSquared: 0.92
    };
  }, [history, predictions]);

  const regionName = REGIONS.find(r => r.id === selectedRegion)?.name || 'Global';
  const diseaseName = DISEASES.find(d => d.id === selectedDisease)?.name || 'Unknown Virus';

  const handlePredictNow = () => {
    setIsRefreshing(true);
    toast({
      title: "Recalculating Models",
      description: `Analyzing transmission vectors for ${diseaseName} in ${regionName}.`,
    });
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Cases,PredictedCases,RtValue\n"
      + combinedData.map(d => `${d.date},${d.cases},${d.predictedCases || 0},${d.rtValue}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `epiguard_${selectedRegion}_${selectedDisease}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="container mx-auto p-6 lg:p-12 max-w-[1600px] w-full">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-4">
            Sentinel Dashboard
            <Badge className="bg-primary/5 text-primary border-primary/10 px-3 py-1 text-[10px]">v4.2.0-PRO</Badge>
          </h1>
          <p className="text-muted-foreground text-lg font-medium">Monitoring <span className="text-primary font-bold">{diseaseName}</span> spread in <span className="text-primary font-bold">{regionName}</span>.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input placeholder="Query sector..." className="pl-12 w-[280px] h-12 rounded-2xl bg-card border-border focus:border-primary/50 focus:ring-primary/5 transition-all" />
          </div>
        </div>
      </header>

      {/* System Controls */}
      <div className="flex flex-col xl:flex-row items-stretch gap-8 mb-12 glass-card p-8 rounded-[2rem]">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Outbreak Agent</label>
              <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                <SelectTrigger className="w-full rounded-2xl h-11 bg-muted/30 border-border">
                  <SelectValue placeholder="Select Virus" />
                </SelectTrigger>
                <SelectContent>
                  {DISEASES.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>
           
           <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Biosphere Domain</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full rounded-2xl h-11 bg-muted/30 border-border">
                  <SelectValue placeholder="Select Domain" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Temporal Projection</label>
              <Select value={forecastHorizon} onValueChange={setForecastHorizon}>
                <SelectTrigger className="w-full rounded-2xl h-11 bg-muted/30 border-border">
                  <SelectValue placeholder="Horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Cycles</SelectItem>
                  <SelectItem value="14">14 Cycles</SelectItem>
                  <SelectItem value="30">30 Cycles</SelectItem>
                  <SelectItem value="90">90 Cycles</SelectItem>
                </SelectContent>
              </Select>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
           <Button 
              onClick={handlePredictNow} 
              disabled={isRefreshing}
              className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-white rounded-2xl h-11 px-8 font-bold shadow-md transition-all"
           >
              {isRefreshing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
              RUN SIMULATION
           </Button>
           <Button 
              variant="outline" 
              onClick={handleExport}
              className="w-full sm:w-auto gap-2 rounded-2xl h-11 px-5 border-border hover:bg-muted transition-all"
           >
              <Download className="h-4 w-4" />
              EXPORT CSV
           </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-48 gap-8">
           <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-primary/20" />
              <Biohazard className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
           </div>
           <p className="text-foreground text-2xl font-bold tracking-tight">Synthesizing {diseaseName} Models...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            <StatCard 
              title={`${diseaseName} Active Vectors`} 
              value={stats?.totalCases?.toLocaleString() || "..."} 
              change={stats?.caseTrend || "..."} 
              trend={parseFloat(stats?.caseTrend || '0') > 0 ? 'up' : 'down'} 
              icon={Users}
              variant="primary"
            />
            <StatCard 
              title="Reproduction Rate (R_t)" 
              value={stats?.rtValue?.toFixed(2) || "..."} 
              change={stats?.rtValue && stats.rtValue > 1 ? "Expansionary" : "Contracting"} 
              trend={stats?.rtValue && stats.rtValue > 1 ? 'up' : 'down'}
              icon={TrendingUp}
              variant="secondary"
            />
            <StatCard 
              title="Model Accuracy (mAP)" 
              value={`${stats?.modelAccuracy}%` || "..."} 
              change={`R²: ${stats?.rSquared}`} 
              trend="neutral"
              icon={Binary}
              variant="primary"
            />
            <StatCard 
              title="Biosphere Integrity" 
              value={stats?.riskLevel || "..."} 
              change="Transmission Velocity" 
              trend="neutral"
              icon={ShieldAlert}
              variant="risk"
              riskLevel={stats?.riskLevel}
            />
          </div>

          <div className="grid grid-cols-12 gap-8 mb-12">
            <div id="analytics" className="col-span-12 xl:col-span-8 space-y-8">
              <AIDataScienceAgent region={regionName} data={history} />
              
              <div id="map">
                <RiskMap 
                  selectedRegion={selectedRegion} 
                  onRegionSelect={setSelectedRegion} 
                />
              </div>

              <Card className="glass-card rounded-[2rem] overflow-hidden border-primary/5">
                <CardHeader className="p-8">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-3">
                      <Target className="h-6 w-6 text-primary" />
                      Regional Pathogen Matrix: {regionName}
                    </CardTitle>
                    <Badge variant="outline" className="font-bold border-primary/20 text-primary">Sector Sync: Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest">Agent</TableHead>
                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Active Load</TableHead>
                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Transmission ($R_t$)</TableHead>
                        <TableHead className="px-8 text-right font-black uppercase text-[10px] tracking-widest">Integrity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regionalPathogenMatrix.map((d) => (
                        <TableRow key={d.id} className="hover:bg-muted/20 transition-colors">
                          <TableCell className="px-8 py-5 font-bold">{d.name}</TableCell>
                          <TableCell className="font-medium">{d.cases.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={d.rt > 1 ? "destructive" : "secondary"} className="rounded-lg font-bold">
                              {d.rt.toFixed(2)}
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

              <CaseTrendChart data={combinedData} />
              
              <div className="mb-12 glass-card p-8 rounded-[2rem] border-primary/10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <SlidersHorizontal className="h-5 w-5 text-primary" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-primary">Mobility Flow Policy Simulator</h3>
                    </div>
                    <Badge variant="secondary" className="font-bold text-xs px-4 py-1">{mobilityPolicy}% Mobility Allowed</Badge>
                </div>
                <Slider 
                    value={[mobilityPolicy]} 
                    onValueChange={(val) => setMobilityPolicy(val[0])} 
                    max={150} 
                    min={10} 
                    step={5}
                    className="py-2"
                  />
                  <div className="flex justify-between mt-3 px-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Full Lockdown (10%)</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Unrestricted (150%)</span>
                  </div>
              </div>

              <ComparisonCharts data={history} />
            </div>

            <div className="col-span-12 xl:col-span-4 space-y-8">
              <InsightsPanel 
                key={`${selectedRegion}-${selectedDisease}-${forecastHorizon}-${mobilityPolicy}-${isRefreshing}`}
                region={regionName} 
                historicalData={history} 
                predictedData={predictions} 
              />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
