"use client";

import Link from "next/link";
import { 
  Activity, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Globe2, 
  BrainCircuit,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden border-b border-border">
        {/* Background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/30 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-6 border-primary/20 text-primary font-bold px-4 py-1.5 rounded-full bg-primary/5 tracking-widest uppercase text-[10px]">
            The Future of Public Health Intelligence
          </Badge>
          
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-foreground mb-8 leading-[1.1]">
            Predict. Prevent. <span className="text-primary">Protect.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg lg:text-xl font-medium mb-12 leading-relaxed">
            EpiGuard AI leverages advanced neural forecasting and population mobility vectors to detect outbreaks before they overwhelm healthcare systems.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-2xl h-14 px-10 gap-2 font-bold text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
              <Link href="/dashboard">
                ENTER SYSTEM
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-2xl h-14 px-10 font-bold text-lg border-border hover:bg-muted">
              <Link href="/resources">VIEW DOCUMENTATION</Link>
            </Button>
          </div>

          <div className="mt-20 relative max-w-[1000px] mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative glass-card rounded-[2.5rem] overflow-hidden border-border shadow-2xl">
              <img 
                src="https://picsum.photos/seed/epiguard-dashboard/1200/600" 
                alt="EpiGuard AI Interface" 
                className="w-full h-auto opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-4">Core Surveillance Engines</h2>
          <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto">Equipping decision-makers with high-fidelity epidemiological data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Neural Transmission Modeling",
              desc: "Hybrid SIR-inspired AI models that calculate R_t vectors based on population density and travel flows.",
              icon: BrainCircuit,
              color: "text-primary"
            },
            {
              title: "Spatial Outbreak Mapping",
              desc: "Deep-sector visualization of mutation hotspots and transmission clusters using neural coordinate sensors.",
              icon: Globe2,
              color: "text-secondary"
            },
            {
              title: "Policy Flow Simulation",
              desc: "Test 'what-if' scenarios by adjusting mobility restrictions and vaccination vectors to see future projections.",
              icon: Zap,
              color: "text-accent"
            },
            {
              title: "Risk Integrity Scoring",
              desc: "Dynamic risk assessments ranging from STABLE to CRITICAL based on transmission velocity.",
              icon: ShieldCheck,
              color: "text-high-risk"
            },
            {
              title: "Compliance & Security",
              desc: "Multi-layered role-based access control (RBAC) ensuring only verified health officials can update data.",
              icon: Lock,
              color: "text-muted-foreground"
            },
            {
              title: "Predictive Intelligence",
              desc: "Advanced neural networks that identify patterns in historical datasets to forecast future case growth.",
              icon: Activity,
              color: "text-low-risk"
            }
          ].map((feature, i) => (
            <div key={i} className="glass-card rounded-[2rem] p-8 border border-border/50 hover:border-primary/20 hover:translate-y-[-4px] transition-all duration-300">
              <div className={`p-4 rounded-2xl bg-muted/30 w-fit mb-6 ${feature.color}`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-6">Ready to secure your sector?</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto font-medium">
            Join public health teams globally in deploying EpiGuard AI for proactive epidemic surveillance.
          </p>
          <Button asChild size="lg" className="rounded-2xl h-14 px-12 font-bold text-lg">
            <Link href="/dashboard">LAUNCH DASHBOARD</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-black text-xl text-primary tracking-tighter">
            <Activity className="h-6 w-6" />
            EpiGuard AI
          </div>
          <div className="flex items-center gap-8 text-sm font-bold text-muted-foreground uppercase tracking-widest">
            <Link href="/resources" className="hover:text-primary transition-colors">Documentation</Link>
            <Link href="/disease-rate" className="hover:text-primary transition-colors">Global Metrics</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            © 2024 EpiGuard Global Intelligence Systems
          </div>
        </div>
      </footer>
    </div>
  );
}
