"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ExternalLink, Globe, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResourcesPage() {
  const resources = [
    {
      title: "World Health Organization (WHO)",
      description: "Global news, statistics, and health guidelines for international disease monitoring.",
      url: "https://www.who.int",
      icon: Globe
    },
    {
      title: "CDC Outbreak Guidelines",
      description: "Technical protocols and response frameworks for public health emergencies.",
      url: "https://www.cdc.gov",
      icon: ShieldCheck
    },
    {
      title: "Johns Hopkins Data Repository",
      description: "Source code and raw epidemiological datasets used for EPOF modeling.",
      url: "https://github.com/CSSEGISandData/COVID-19",
      icon: FileText
    }
  ];

  return (
    <main className="container mx-auto p-6 lg:p-12 max-w-[1200px]">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-4 mb-4">
          <BookOpen className="h-10 w-10 text-primary" />
          Epidemiological Resources
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          Access verified datasets and global health directives for outbreak management.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resources.map((item, i) => (
          <Card key={i} className="glass-card rounded-[2rem] overflow-hidden group hover:translate-y-[-4px] transition-all">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <p className="text-muted-foreground leading-relaxed mb-6">
                {item.description}
              </p>
              <Button asChild className="w-full rounded-2xl gap-2 font-bold h-12">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  Access Resource
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
