"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Activity, ShieldCheck, AlertTriangle, Lightbulb, Loader2, Info } from "lucide-react";
import { generateAIPoweredInsights, type GenerateInsightsOutput } from "@/ai/flows/ai-powered-insights-generation";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface InsightsPanelProps {
  region: string;
  historicalData: any[];
  predictedData: any[];
}

export function InsightsPanel({ region, historicalData, predictedData }: InsightsPanelProps) {
  const [insights, setInsights] = useState<GenerateInsightsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      setError(null);
      try {
        const input = {
          region,
          historicalCases: historicalData.slice(-30).map(d => ({ 
            date: d.date, 
            cases: d.cases,
            rtValue: d.rtValue 
          })),
          predictedCases: predictedData.map(d => ({ 
            date: d.date, 
            cases: d.predictedCases,
            rtValue: d.rtValue 
          })),
          vaccinationData: historicalData.slice(-30).map(d => ({ date: d.date, vaccinationRate: d.vaccinationRate })),
          mobilityData: historicalData.slice(-30).map(d => ({ date: d.date, mobilityIndex: d.mobilityIndex }))
        };
        const res = await generateAIPoweredInsights(input);
        setInsights(res);
      } catch (err: any) {
        console.error("Failed to generate insights", err);
        setError(err.message || "The AI analysis engine encountered an error. Please check your API configuration.");
      } finally {
        setLoading(false);
      }
    }

    if (historicalData.length > 0) {
      fetchInsights();
    }
  }, [region, historicalData, predictedData]);

  if (loading) {
    return (
      <Card className="rounded-[2rem] border-white/5 glass-card h-full min-h-[400px]">
        <CardContent className="flex flex-col items-center justify-center h-full py-32 space-y-6">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
            <Sparkles className="h-7 w-7 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-lg text-primary font-black tracking-widest animate-pulse uppercase">EPOF Analysis Engine Active...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full rounded-[2rem] border-white/5 glass-card overflow-hidden">
        <CardHeader className="p-8">
          <CardTitle className="flex items-center gap-3 text-white font-black text-2xl tracking-tight">
            <AlertTriangle className="h-7 w-7 text-destructive" />
            Intelligence Offline
          </CardTitle>
          <CardDescription className="text-muted-foreground">The AI forecasting engine is temporarily unavailable.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground rounded-2xl">
            <Info className="h-4 w-4" />
            <AlertTitle className="font-bold">System Configuration Error</AlertTitle>
            <AlertDescription className="text-sm opacity-90">
              {error}. Please ensure a valid <strong>GOOGLE_GENAI_API_KEY</strong> is set in your environment variables.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!insights) return null;

  return (
    <Card className="h-full rounded-[2rem] border-white/5 glass-card relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x" />
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-white font-black text-2xl tracking-tight">
            <Sparkles className="h-7 w-7 text-secondary" />
            EpiGuard Intelligence
          </CardTitle>
          <Badge className="bg-secondary/20 text-secondary border-none px-4 py-1 font-black text-[10px] tracking-widest uppercase">EPOF CORE v2</Badge>
        </div>
        <CardDescription className="text-lg font-medium text-muted-foreground">Predictive transmission modeling & spatial hotspot detection.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-10">
        <div className="space-y-4">
          <h4 className="flex items-center gap-3 text-xs font-black text-primary uppercase tracking-[0.2em]">
            <Activity className="h-5 w-5" />
            Epidemic Trajectory (R_t Vector)
          </h4>
          <p className="text-base text-white/80 leading-relaxed font-medium">
            {insights.diseaseTrendSummary}
          </p>
        </div>

        {insights.mobilityImpactAnalysis && (
          <div className="space-y-4">
            <h4 className="flex items-center gap-3 text-xs font-black text-secondary uppercase tracking-[0.2em]">
              <ShieldCheck className="h-5 w-5" />
              Transmission Factors
            </h4>
            <div className="space-y-6">
              <p className="text-base text-white/80 leading-relaxed font-medium">
                {insights.mobilityImpactAnalysis}
              </p>
              {insights.vaccinationImpactAnalysis && (
                <div className="bg-white/5 p-6 rounded-[1.5rem] border border-white/5 shadow-inner">
                  <p className="text-base text-white/70 leading-relaxed italic">
                    {insights.vaccinationImpactAnalysis}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="flex items-center gap-3 text-xs font-black text-highRisk uppercase tracking-[0.2em]">
            <AlertTriangle className="h-5 w-5" />
            Hotspot & Anomaly Detection
          </h4>
          <p className="text-base text-highRisk/90 leading-relaxed font-bold">
            {insights.anomalyDetection}
          </p>
        </div>

        <div className="space-y-4 p-8 rounded-[2rem] bg-secondary/10 border border-secondary/20 shadow-lg neon-glow-secondary">
          <h4 className="flex items-center gap-3 text-xs font-black text-secondary uppercase tracking-[0.3em]">
            <Lightbulb className="h-5 w-5" />
            PROACTIVE RECOMMENDATIONS
          </h4>
          <p className="text-base text-white font-bold leading-relaxed whitespace-pre-line">
            {insights.overallRecommendations}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
