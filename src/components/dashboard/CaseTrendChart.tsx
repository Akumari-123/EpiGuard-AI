"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface CaseTrendChartProps {
  data: any[];
}

export function CaseTrendChart({ data }: CaseTrendChartProps) {
  return (
    <Card className="rounded-[2rem] border-white/5 glass-card overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
          Neural Vector Analysis
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse neon-glow-primary" />
        </CardTitle>
        <CardDescription className="text-lg font-medium text-muted-foreground">Synthesizing surveillance logs and AI-projected spread patterns.</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <ChartContainer
          config={{
            cases: { label: "SURVEILLANCE LOGS", color: "hsl(var(--primary))" },
            predictedCases: { label: "AI NEURAL FORECAST", color: "hsl(var(--secondary))" },
          }}
          className="h-[450px] w-full"
        >
          <LineChart data={data}>
            <defs>
              <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.4)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.4)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<ChartTooltipContent className="glass-card" />} />
            <Legend verticalAlign="top" height={40} wrapperStyle={{ paddingBottom: '20px', fontWeight: 'bold', letterSpacing: '0.1em' }} />
            <Line
              type="monotone"
              dataKey="cases"
              strokeWidth={4}
              stroke="hsl(var(--primary))"
              dot={false}
              activeDot={{ r: 8, strokeWidth: 0, fill: "hsl(var(--primary))" }}
              className="neon-glow-primary"
            />
            <Line
              type="monotone"
              dataKey="predictedCases"
              strokeWidth={4}
              stroke="hsl(var(--secondary))"
              strokeDasharray="10 10"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--secondary))" }}
              className="neon-glow-secondary"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}