import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  className?: string;
  variant?: 'primary' | 'secondary' | 'risk';
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export function StatCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  className,
  variant = 'primary',
  riskLevel
}: StatCardProps) {
  
  const getTrendColor = () => {
    if (variant === 'risk') {
      if (riskLevel === 'HIGH') return 'text-destructive';
      if (riskLevel === 'MEDIUM') return 'text-medium-risk';
      return 'text-low-risk';
    }
    return trend === 'up' ? 'text-destructive' : trend === 'down' ? 'text-low-risk' : 'text-muted-foreground';
  };

  const getIconBg = () => {
    if (variant === 'primary') return 'bg-primary/5 text-primary border border-primary/10';
    if (variant === 'secondary') return 'bg-secondary/5 text-secondary border border-secondary/10';
    if (variant === 'risk') {
      if (riskLevel === 'HIGH') return 'bg-destructive/10 text-destructive border border-destructive/10';
      if (riskLevel === 'MEDIUM') return 'bg-medium-risk/10 text-medium-risk border border-medium-risk/10';
      return 'bg-low-risk/10 text-low-risk border border-low-risk/10';
    }
    return 'bg-muted text-muted-foreground';
  };

  const getValueColor = () => {
    if (variant === 'primary') return "text-primary";
    if (variant === 'secondary') return "text-secondary";
    if (variant === 'risk') {
      if (riskLevel === 'HIGH') return "text-destructive";
      if (riskLevel === 'MEDIUM') return "text-medium-risk";
      return "text-low-risk";
    }
    return "text-foreground";
  };

  return (
    <Card className={cn(
      "overflow-hidden rounded-[2rem] border-border bg-card group hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300", 
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-8 pb-4">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className={cn("p-3 rounded-2xl transition-all duration-300 group-hover:scale-110", getIconBg())}>
          <Icon className="h-6 w-6" />
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <div className="flex items-baseline gap-4">
          <div className={cn(
            "text-4xl font-black tracking-tighter transition-all duration-300",
            getValueColor()
          )}>
            {value}
          </div>
          {variant === 'risk' && (
             <Badge className={cn(
               "font-black px-4 py-1.5 rounded-xl border-none shadow-sm",
               riskLevel === 'HIGH' ? "bg-destructive text-white" : riskLevel === 'MEDIUM' ? "bg-medium-risk text-white" : "bg-low-risk text-white"
             )}>
               {riskLevel}
             </Badge>
          )}
        </div>
        <div className="flex items-center justify-between mt-6">
          <p className={cn("text-sm font-bold flex items-center gap-2", getTrendColor())}>
            {change}
            {trend !== 'neutral' && <span className="text-[10px] font-black uppercase opacity-60">Variance</span>}
          </p>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn("w-2 h-2 rounded-full", i <= (trend === 'up' ? 3 : 1) ? getTrendColor().replace('text-', 'bg-') : 'bg-muted')} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}