
"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Line, LineChart, Legend, ComposedChart, Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ComparisonChartsProps {
  data: any[];
}

export function ComparisonCharts({ data }: ComparisonChartsProps) {
  const chartConfig = {
    cases: { label: "Cases", color: "hsl(var(--primary))" },
    vaccinationRate: { label: "Vaccination Rate %", color: "hsl(var(--chart-3))" },
    mobilityIndex: { label: "Mobility Index", color: "hsl(var(--accent))" },
    pathogen: { label: "Pathogen distribution", color: "hsl(var(--primary))" }
  };

  const pathogenData = [
    { name: "COVID-19", value: 400, color: "hsl(var(--primary))" },
    { name: "Influenza", value: 300, color: "hsl(var(--secondary))" },
    { name: "Dengue", value: 200, color: "hsl(var(--accent))" },
    { name: "Measles", value: 100, color: "hsl(var(--high-risk))" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="glass-card rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-base font-headline">Vaccination vs Case Growth</CardTitle>
          <CardDescription>Correlation between coverage and transmission rates.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ComposedChart data={data.slice(-30)}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(v) => v.split('-')[2]} 
                fontSize={10}
              />
              <YAxis yAxisId="left" fontSize={10} tickFormatter={(v) => `${(v/1000)}k`} />
              <YAxis yAxisId="right" orientation="right" fontSize={10} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar yAxisId="left" dataKey="cases" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Line yAxisId="right" type="monotone" dataKey="vaccinationRate" stroke="hsl(var(--chart-3))" strokeWidth={3} dot={false} />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="glass-card rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-base font-headline">Pathogen Burden Distribution</CardTitle>
          <CardDescription>Statistical breakdown of active transmission agents.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <PieChart>
              <Pie
                data={pathogenData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pathogenData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="glass-card rounded-[2rem] col-span-full">
        <CardHeader>
          <CardTitle className="text-base font-headline">Mobility Impact on Transmission (Seaborn-style Analysis)</CardTitle>
          <CardDescription>Analyzing the high-resolution sensitivity of the $R_t$ vector to population movement.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ComposedChart data={data.slice(-30)}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(v) => v.split('-')[2]} 
                fontSize={10}
              />
              <YAxis yAxisId="left" fontSize={10} tickFormatter={(v) => `${(v/1000)}k`} />
              <YAxis yAxisId="right" orientation="right" fontSize={10} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar yAxisId="left" dataKey="cases" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Line yAxisId="right" type="monotone" dataKey="mobilityIndex" stroke="hsl(var(--accent))" strokeWidth={3} dot={false} />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
