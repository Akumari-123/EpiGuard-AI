import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { HealthcareAssistant } from '@/components/HealthcareAssistant';

export const metadata: Metadata = {
  title: 'EpiGuard AI | Epidemic Prediction & Monitoring',
  description: 'AI-powered epidemic surveillance, outbreak prediction, and public health intelligence platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20">
        <ThemeProvider>
          <Navbar />
          {children}
          <HealthcareAssistant />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
