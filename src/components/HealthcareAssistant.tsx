
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  X, 
  Send, 
  Stethoscope, 
  ShieldCheck, 
  Loader2,
  ChevronRight,
  Activity,
  AlertCircle,
  Info,
  MapPin,
  HeartPulse,
  Microscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { healthcareAssistantResponse, type HealthcareAssistantOutput } from "@/ai/flows/healthcare-assistant-flow";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function HealthcareAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string | HealthcareAssistantOutput }>>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatHistory, isLoading]);

  const handleSend = async (customQuery?: string) => {
    const activeQuery = customQuery || query;
    if (!activeQuery.trim()) return;

    setChatHistory(prev => [...prev, { role: 'user', content: activeQuery }]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await healthcareAssistantResponse({ query: activeQuery });
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "I am having trouble connecting to the Epidemiology Neural Link. Please consult a local healthcare professional for immediate concerns." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQueries = [
    { label: "Dengue Analysis", query: "Explain the transmission and risk factors of Dengue fever in urban areas." },
    { label: "Predict Outbreak", query: "How do population density and mobility index affect epidemic spread?" },
    { label: "Symptom Check", query: "I have high fever, joint pain, and a rash. What are the possibilities?" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 flex items-center justify-center group transition-all duration-300 hover:scale-110 border-4 border-white/20"
        >
          <Stethoscope className="h-8 w-8 text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[8px] text-white flex items-center justify-center font-bold">AI</span>
          </span>
        </Button>
      ) : (
        <Card className="w-[450px] h-[700px] shadow-2xl border-primary/20 flex flex-col glass-card rounded-[2.5rem] animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden">
          <CardHeader className="p-6 bg-primary text-white flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/20">
                <Microscope className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg font-black tracking-tight">EPI-Intelligence AI</CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-low-risk animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Advanced Health Node Active</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 flex flex-col min-h-0 bg-background/50">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
              <div className="space-y-6">
                {chatHistory.length === 0 && (
                  <div className="space-y-8 py-4">
                    <div className="text-center space-y-4">
                      <div className="p-4 rounded-full bg-primary/5 w-fit mx-auto">
                        <Activity className="h-10 w-10 text-primary/40" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-black text-foreground uppercase tracking-tight">Epidemiology Terminal</h4>
                        <p className="text-xs font-medium text-muted-foreground px-8 leading-relaxed">
                          Ask about disease patterns, symptoms, or epidemic predictions. I provide structured scientific risk analysis.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Suggested Queries</p>
                      <div className="grid gap-2">
                        {quickQueries.map((q, i) => (
                          <Button 
                            key={i} 
                            variant="outline" 
                            onClick={() => handleSend(q.query)}
                            className="h-auto py-3 px-4 text-left flex items-center justify-between rounded-xl border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                          >
                            <span className="text-[11px] font-bold text-foreground/80">{q.label}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {chatHistory.map((chat, i) => (
                  <div key={i} className={cn("flex flex-col", chat.role === 'user' ? "items-end" : "items-start")}>
                    <div className={cn(
                      "max-w-[90%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                      chat.role === 'user' 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-card border border-border rounded-tl-none"
                    )}>
                      {typeof chat.content === 'string' ? (
                        chat.content
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between border-b border-border pb-3">
                            <div className="flex items-center gap-2">
                              <HeartPulse className="h-4 w-4 text-primary" />
                              <span className="font-black text-base tracking-tight">{chat.content.diseaseName}</span>
                            </div>
                            <Badge className={cn(
                              "text-[9px] font-black tracking-widest px-3 py-1",
                              chat.content.riskLevel === 'HIGH' ? "bg-destructive" : 
                              chat.content.riskLevel === 'MEDIUM' ? "bg-yellow-500" : "bg-low-risk"
                            )}>
                              {chat.content.riskLevel} RISK
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Overview</p>
                            <p className="text-sm leading-relaxed">{chat.content.overview}</p>
                          </div>

                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="details" className="border-none">
                              <AccordionTrigger className="py-2 hover:no-underline">
                                <span className="text-[11px] font-black uppercase text-primary tracking-widest">Analysis Details</span>
                              </AccordionTrigger>
                              <AccordionContent className="space-y-4 pt-4">
                                <section>
                                  <h5 className="text-[10px] font-black uppercase mb-1">Causes</h5>
                                  <p className="text-xs text-muted-foreground">{chat.content.causes}</p>
                                </section>
                                <section>
                                  <h5 className="text-[10px] font-black uppercase mb-1">Transmission</h5>
                                  <p className="text-xs text-muted-foreground">{chat.content.transmission}</p>
                                </section>
                                <section>
                                  <h5 className="text-[10px] font-black uppercase mb-1">Symptoms</h5>
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {chat.content.symptoms.map((s, idx) => (
                                      <Badge key={idx} variant="outline" className="text-[9px] border-primary/20">{s}</Badge>
                                    ))}
                                  </div>
                                </section>
                                <section>
                                  <h5 className="text-[10px] font-black uppercase mb-1">Consequences</h5>
                                  <div className="grid gap-2 bg-muted/30 p-3 rounded-lg border border-border">
                                    <div>
                                      <span className="text-[9px] font-bold text-primary uppercase">Short-term</span>
                                      <p className="text-[10px] leading-tight">{chat.content.consequences.shortTerm}</p>
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-bold text-secondary uppercase">Long-term</span>
                                      <p className="text-[10px] leading-tight">{chat.content.consequences.longTerm}</p>
                                    </div>
                                  </div>
                                </section>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>

                          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-3">
                            <h5 className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                              <ShieldCheck className="h-3 w-3" /> Prevention & Protocol
                            </h5>
                            <ul className="space-y-1.5">
                              {chat.content.prevention.map((step, si) => (
                                <li key={si} className="flex gap-2 text-[11px] font-medium">
                                  <div className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-4 pt-2">
                            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                              <p className="text-[10px] font-black text-destructive uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                <AlertCircle className="h-3 w-3" /> Next Best Action
                              </p>
                              <p className="text-xs font-bold text-foreground">{chat.content.nextStep}</p>
                            </div>

                            <p className="text-[9px] text-muted-foreground italic text-center px-4 leading-tight">
                              {chat.content.disclaimer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Processing Epidemiological Data...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-4 border-t border-border bg-card">
            <div className="flex w-full items-center gap-2">
              <Input 
                placeholder="Ask about a disease or spread pattern..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="rounded-xl h-12 bg-muted/30 border-border focus:ring-primary/20"
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                onClick={() => handleSend()} 
                disabled={isLoading || !query.trim()} 
                className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
