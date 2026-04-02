
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  X, 
  Send, 
  LifeBuoy, 
  AlertTriangle, 
  ShieldCheck, 
  Loader2,
  ChevronRight,
  Stethoscope,
  Wind,
  Droplets,
  Flame,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { disasterAssistantResponse, type DisasterAssistantOutput } from "@/ai/flows/disaster-assistant-flow";
import { cn } from "@/lib/utils";

export function DisasterAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string | DisasterAssistantOutput }>>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "Outbreak Protocol", icon: Stethoscope, query: "What are the immediate protocols for a localized disease outbreak?" },
    { label: "Emergency Contacts", icon: AlertCircle, query: "List global and local emergency contact numbers." },
    { label: "Flood Safety", icon: Droplets, query: "What are the health safety measures during a flood?" },
    { label: "Air Quality Alert", icon: Wind, query: "What to do if there is a hazardous air quality alert?" }
  ];

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
      const response = await disasterAssistantResponse({ query: activeQuery });
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm currently unable to access the satellite node. Please contact 112 or local emergency services immediately if this is a crisis." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full shadow-2xl bg-destructive hover:bg-destructive/90 flex items-center justify-center group transition-all duration-300 hover:scale-110 border-4 border-white/20"
        >
          <LifeBuoy className="h-8 w-8 text-white group-hover:rotate-45 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-white text-[10px] text-destructive font-black flex items-center justify-center">SOS</span>
          </span>
        </Button>
      ) : (
        <Card className="w-[420px] h-[650px] shadow-2xl border-destructive/20 flex flex-col glass-card rounded-[2.5rem] animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden">
          <CardHeader className="p-6 bg-destructive text-white flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/20">
                <LifeBuoy className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg font-black tracking-tight">EPI-Response AI</CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Sector Security Node Active</p>
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
                      <div className="p-4 rounded-full bg-destructive/5 w-fit mx-auto">
                        <AlertTriangle className="h-10 w-10 text-destructive/40" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-black text-foreground uppercase tracking-tight">Crisis Assistance Terminal</h4>
                        <p className="text-xs font-medium text-muted-foreground px-8 leading-relaxed">
                          Enter an emergency situation or select a protocol below. This node provides scientifically verified safety data.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {quickActions.map((action, i) => (
                        <Button 
                          key={i} 
                          variant="outline" 
                          onClick={() => handleSend(action.query)}
                          className="h-auto py-4 px-3 flex flex-col gap-2 rounded-2xl border-border hover:border-destructive/30 hover:bg-destructive/5 transition-all group"
                        >
                          <action.icon className="h-5 w-5 text-destructive group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-tight">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {chatHistory.map((chat, i) => (
                  <div key={i} className={cn("flex flex-col", chat.role === 'user' ? "items-end" : "items-start")}>
                    <div className={cn(
                      "max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                      chat.role === 'user' 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-card border border-border rounded-tl-none"
                    )}>
                      {typeof chat.content === 'string' ? (
                        chat.content
                      ) : (
                        <div className="space-y-5">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={cn(
                              "text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 border-none",
                              chat.content.priority === 'CRITICAL' ? "bg-destructive text-white animate-pulse" : 
                              chat.content.priority === 'HIGH' ? "bg-orange-500 text-white" : "bg-primary text-white"
                            )}>
                              {chat.content.priority} ALERT
                            </Badge>
                          </div>
                          
                          <p className="font-bold text-foreground text-sm leading-snug">{chat.content.message}</p>
                          
                          {chat.content.actionSteps.length > 0 && (
                            <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                              <h5 className="text-[10px] font-black uppercase text-destructive tracking-[0.15em] flex items-center gap-2">
                                <ShieldCheck className="h-3 w-3" /> Mandatory Protocol
                              </h5>
                              <ul className="space-y-2">
                                {chat.content.actionSteps.map((step, si) => (
                                  <li key={si} className="flex gap-2 text-[11px] leading-tight text-foreground/90 font-bold">
                                    <div className="h-4 w-4 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-[8px] shrink-0 mt-0.5">{si + 1}</div>
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {chat.content.resources.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Verified Channels</h5>
                              <div className="flex flex-col gap-1.5">
                                {chat.content.resources.map((res, ri) => (
                                  <div key={ri} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border/30">
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-bold">{res.name}</span>
                                      <span className="text-[8px] text-muted-foreground uppercase">{res.description}</span>
                                    </div>
                                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                      <div className="relative">
                        <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                      </div>
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Analyzing Disaster Data...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-4 border-t border-border bg-card">
            <div className="flex w-full items-center gap-2">
              <Input 
                placeholder="Describe situation (e.g., local flood, outbreak)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="rounded-xl h-12 bg-muted/30 border-border focus:ring-destructive/20"
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                onClick={() => handleSend()} 
                disabled={isLoading || !query.trim()} 
                className="h-12 w-12 rounded-xl bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20"
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
