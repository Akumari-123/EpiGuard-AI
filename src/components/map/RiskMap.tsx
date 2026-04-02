"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Radio, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { REGIONS } from "@/app/lib/mock-data";

interface RiskMapProps {
  selectedRegion?: string;
  onRegionSelect?: (regionId: string) => void;
}

interface SensorPing {
  id: number;
  x: number;
  y: number;
  type: 'mutation' | 'transmission';
  intensity: number;
}

export function RiskMap({ selectedRegion, onRegionSelect }: RiskMapProps) {
  const [sensors, setSensors] = useState<SensorPing[]>([]);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSensor: SensorPing = {
        id: Date.now(),
        x: Math.random() * 800 + 100,
        y: Math.random() * 300 + 50,
        type: Math.random() > 0.7 ? 'mutation' : 'transmission',
        intensity: Math.random(),
      };

      setSensors(prev => [...prev.slice(-15), newSensor]);
      
      const messages = [
        `Vector detected at coord [${Math.floor(newSensor.x)}, ${Math.floor(newSensor.y)}]`,
        `Mutation signature delta: +${(Math.random() * 0.05).toFixed(3)}`,
        `Sector ${selectedRegion?.toUpperCase()} node synchronized`,
        `Transmission normalized in sub-quadrant ${Math.floor(Math.random() * 9)}`,
      ];
      setLog(prev => [messages[Math.floor(Math.random() * messages.length)], ...prev.slice(0, 4)]);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedRegion]);

  const getHighlightClass = (id: string) => {
    const isSelected = selectedRegion === id || (id === 'europe' && ['fr', 'de', 'it', 'uk'].includes(selectedRegion || ''));
    return isSelected 
      ? "opacity-100 stroke-primary stroke-[3] scale-[1.02] filter drop-shadow-[0_0_8px_rgba(30,58,138,0.4)]" 
      : "opacity-40 hover:opacity-70 grayscale-[0.3] transition-all cursor-pointer";
  };

  const handleSectorClick = (id: string) => {
    if (onRegionSelect) {
      const mapping: Record<string, string> = {
        'us': 'us',
        'br': 'br',
        'in': 'in',
        'europe': 'uk'
      };
      onRegionSelect(mapping[id] || 'world');
    }
  };

  return (
    <Card className="rounded-[2rem] border-border bg-card overflow-hidden shadow-xl transition-all duration-500">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between p-8 pb-6 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest px-3">System Online</Badge>
            <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20 text-[10px] font-black uppercase tracking-widest px-3">Interactive Sector Map</Badge>
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
            <Radio className="h-7 w-7 text-primary" />
            Neural Mutation Mapping
          </CardTitle>
          <CardDescription className="text-lg font-medium text-muted-foreground">Analyze transmission vectors across global sectors.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-4 bg-muted/30 p-4 rounded-2xl border border-border">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-highRisk shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hotspot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(30,58,138,0.4)]" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Sensor</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 pt-0">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-9">
            <div className="relative aspect-[21/9] bg-muted/10 rounded-[2rem] border border-border flex items-center justify-center overflow-hidden shadow-inner group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              
              <svg viewBox="0 0 1000 450" className="w-full h-full p-8 relative z-10">
                <g className="transition-all duration-700">
                  <path 
                    d="M100,50 L250,50 L300,150 L200,200 L50,150 Z" 
                    fill="hsl(var(--primary))" 
                    className={getHighlightClass('us')}
                    onClick={() => handleSectorClick('us')}
                  />
                  <path 
                    d="M250,250 L350,250 L350,400 L250,400 Z" 
                    fill="hsl(var(--secondary))" 
                    className={getHighlightClass('br')}
                    onClick={() => handleSectorClick('br')}
                  />
                  <path 
                    d="M480,50 L580,50 L580,130 L480,130 Z" 
                    fill="hsl(var(--primary))" 
                    className={getHighlightClass('europe')}
                    onClick={() => handleSectorClick('europe')}
                  />
                  <path 
                    d="M600,50 L900,50 L950,300 L700,400 L600,300 Z" 
                    fill="hsl(var(--secondary))" 
                    className={getHighlightClass('in')}
                    onClick={() => handleSectorClick('in')}
                  />
                </g>

                {sensors.map(ping => (
                  <g key={ping.id} className="animate-in fade-in zoom-in duration-500">
                    <circle 
                      cx={ping.x} 
                      cy={ping.y} 
                      r={ping.intensity * 12} 
                      fill={ping.type === 'mutation' ? 'hsl(var(--high-risk))' : 'hsl(var(--primary))'} 
                      className="opacity-40 animate-ping"
                    />
                    <circle 
                      cx={ping.x} 
                      cy={ping.y} 
                      r={4} 
                      fill={ping.type === 'mutation' ? 'hsl(var(--high-risk))' : 'hsl(var(--primary))'} 
                    />
                  </g>
                ))}
              </svg>
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-3 bg-background/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-border shadow-xl text-xs font-black text-primary tracking-widest uppercase">
                  <Target className="h-4 w-4 text-primary" />
                  {selectedRegion !== 'world' ? `Tracking Sector: ${REGIONS.find(r => r.id === selectedRegion)?.name}` : 'Global Grid Active'}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 xl:col-span-3 space-y-6">
            <div className="bg-muted/30 rounded-[2rem] p-6 border border-border h-full flex flex-col">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Diagnostic Stream
              </h4>
              <div className="flex-1 space-y-4">
                {log.map((entry, i) => (
                  <div key={i} className="animate-in slide-in-from-right-4 fade-in duration-500 flex gap-3 group">
                    <div className="w-1 h-auto bg-primary/20 rounded-full group-first:bg-primary transition-colors" />
                    <p className="text-[11px] font-medium leading-tight text-muted-foreground group-first:text-foreground">
                      {entry}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
